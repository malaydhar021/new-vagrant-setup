<?php

namespace App\Traits;

use App\Exceptions\SubscriptionException;
use App\CancelledSubscription;

use Laravel\Cashier\Cashier;

use Stripe\Charge;
use Stripe\Stripe;
use Stripe\Token;

use Exception;

/**
 * Subscription Trait is a wrapper around the official Laravel Cashier package.
 */
trait Subscription
{
    /**
     * Stripe API Key
     *
     * @var string
     */
    private $stripeApiKey;

    /**
     * Stripe Token
     *
     * @var string
     */
    private $stripeToken;

    /**
     * Trait Constructor
     */
    public function __construct()
    {
        $this->stripeApiKey = config('services.stripe.secret');

        Stripe::setApiKey($this->stripeApiKey);

        Cashier::useCurrency(strtolower(config('pricing.currency.code', 'usd')), config('pricing.currency.symbol', '$'));
    }

    /**
     * Creates a card token in Stripe
     *
     * @param  array  $cardDetails
     * @return \Stripe\ApiResource
     */
    public function createCardToken($cardDetails)
    {
        if (! is_array($cardDetails)) {
            throw new SubscriptionException(
                "\$cardDetails is not an array. Expected 'array', Found '" . gettype($cardDetails) ."'."
            );
        }
        if (! array_key_exists('number', $cardDetails)) {
            throw new SubscriptionException("Array key 'number' does not exist on \$cardDetails.");
        }
        if (! array_key_exists('exp_month', $cardDetails)) {
            throw new SubscriptionException("Array key 'exp_month' does not exist on \$cardDetails.");
        }
        if (! array_key_exists('exp_year', $cardDetails)) {
            throw new SubscriptionException("Array key 'exp_year' does not exist on \$cardDetails.");
        }
        if (! array_key_exists('cvc', $cardDetails)) {
            throw new SubscriptionException("Array key 'cvc' does not exist on \$cardDetails.");
        }

        try {
            $stripeToken = Token::create([
                "card" => $cardDetails
            ]);
            $this->stripeToken = $stripeToken->id;

            $this->card_exp_month = $stripeToken->card->exp_month;
            $this->card_exp_year = $stripeToken->card->exp_year;
            $this->save();

            return $stripeToken;
        } catch (Exception $exception) {
            throw new SubscriptionException($exception->getMessage());
        }
    }

    /**
     * Pre-authorizes a card in Stripe for it's validity. Charges unit price without holding the amoutn for 7 days.
     * After 7 days the amount gets automatically refunded to this's bank account.
     *
     * @param  string  $stripeToken Not required if the whole card detials is provided
     * @param  array   $cardDetails Card details is not required if the stripe token is provided
     * @return \Stripe\ApiResource
     */
    public function preAuthorizeCard($stripeToken = null, $cardDetails = [])
    {
        if (!strlen($stripeToken)) {
            if (empty($cardDetails)) {
                throw new SubscriptionException("\$cardDetails is required if \$stripeToken is not provided.");
            } else {
                $this->createCardToken($cardDetails);

                $stripeToken = $this->stripeToken;
            }
        }

        try {
            return Charge::create([
                'amount' => config('pricing.pre_auth_amount', 1) * 100,             // Converts to unit price
                'currency' => strtolower(config('pricing.currency.code', 'usd')),   // Defaults to USD
                'description' => 'Pre-Authorization Charge',
                'source' => $stripeToken,                                           // Card Token
                'capture' => false,                                                 // Doesn't hold the captured amount
            ]);
        } catch (Exception $exception) {
            throw new SubscriptionException($exception->getMessage());
        }
    }

    /**
     * Subscribes an user to lowest plan and start free trial for number of days specified in configuration. Also
     * pre-authorizes if required
     *
     * @param  string   $stripeToken  Not required if the whole card detials is provided
     * @param  array    $cardDetails  Card details is not required if the card token is provided
     * @param  boolean  $preAuth      Pre-authorizes a card before starting free trail. Doesn't pre-authorize by default
     * @return null
     */
    public function subscribeToFreeTrial($stripeToken = null, $cardDetails = [], $preAuth = false)
    {
        if (!strlen($stripeToken)) {
            if (empty($cardDetails)) {
                throw new SubscriptionException("\$cardDetails is required if \$stripeToken is not provided.");
            } else {
                $this->createCardToken($cardDetails);
                $stripeToken = $this->stripeToken;

                if ($preAuth) {
                    $this->preAuthorizeCard(null, $cardDetails);
                }
            }
        }

        $this->newSubscription('main', config('pricing.plans.lowest.id'))
            ->trialDays(config('pricing.plans.lowest.trial'))
            ->create($stripeToken);

        $this->update([
            'subscription_status' => 'ACTIVE',
            'pricing_plan' => 'lowest',
        ]);
    }

    /**
     * Subscribes an user to a requested plan. Also pre-authorizes if required
     *
     * @param  string   $planType     Pricing plan type to subscribe
     * @param  string   $stripeToken  Not required if the whole card detials is provided
     * @param  array    $cardDetails  Card details is not required if the card token is provided
     * @param  boolean  $preAuth      Pre-authorizes a card before starting free trail. Doesn't pre-authorize by default
     * @return null
     */
    public function subscribeToPlan($planType, $stripeToken = null, $cardDetails = [], $preAuth = false)
    {
        if (!strlen($stripeToken)) {
            if (empty($cardDetails)) {
                throw new SubscriptionException("\$cardDetails is required if \$stripeToken is not provided.");
            } else {
                $this->createCardToken($cardDetails);
                $stripeToken = $this->stripeToken;

                if ($preAuth) {
                    $this->preAuthorizeCard(null, $cardDetails);
                }
            }
        }

        $this->newSubscription('main', config('pricing.plans.' . $planType . '.id'))->create($stripeToken);

        $this->update([
            'subscription_status' => 'ACTIVE',
            'pricing_plan' => $planType
        ]);
    }

    /**
     * Change the current subscription plan
     *
     * @param  string  $newPlanType The new pricing plan type to subscribe
     * @return void
     */
    public function changeSubscriptionPlan($newPlanType)
    {
        $newPlanId = config("pricing.plans.${newPlanType}.id");

        if ($this->onTrial()) {
            $this->subscription('main')
                ->skipTrial()
                ->swap($newPlanId);
        } else {
            $this->subscription('main')
                ->swap($newPlanId);
        }

        $this->update([
            'subscription_status' => 'ACTIVE',
            'pricing_plan' => $newPlanType
        ]);
    }

    /**
     * Cancel the subscription
     *
     * @param  string  $reason       The reason to cancel the subscription
     * @param  string  $description  Description of cancellation in details
     * @return void
     */
    public function cancelSubscription($reason, $description = null, $isTerminated = false)
    {
        $cancelledSubscription = new CancelledSubscription([
            'user_id' => $this->id,
            'subscription_id' => (!is_null($this->subscription('main'))) ? $this->subscription('main')->id : null,
            'reason' => $reason,
            'description' => $description,
        ]);
        $cancelledSubscription->save();

        \Log::info("Subscription status : " . $this->subscription_status);
        if((!is_null($this->subscription('main')))) {
            $this->subscription('main')->cancelNow();
        }

        $subscriptionStatus = $isTerminated ? 'TERMINATED' : 'CANCELLED';
        $this->update([
            'subscription_status' => $subscriptionStatus,
            'pricing_plan' => null,
            'is_active' => '1',
        ]);
        $this->delete();
    }

    /**
     * Update card info, if required make as default
     *
     * @param  string   $stripeToken  Not required if the whole card details is provided
     * @param  array    $cardDetails  Card details is not required if the card token is provided
     * @param  boolean  $preAuth      Pre-authorizes a card before starting free trail. Doesn't pre-authorize by default
     * @param  boolean  $makeDefault  Make this card as default in Stripe
     * @return null
     */
    public function updateCardInfo($stripeToken = null, $cardDetails = [], $preAuth = false, $makeDefault = false)
    {
        if (!strlen($stripeToken)) {
            if (empty($cardDetails)) {
                throw new SubscriptionException("\$cardDetails is required if \$stripeToken is not provided.");
            } else {
                $this->createCardToken($cardDetails);
                $stripeToken = $this->stripeToken;

                if ($preAuth) {
                    $this->preAuthorizeCard(null, $cardDetails);
                }
            }
        }

        $this->updateCard($stripeToken);

        if ($makeDefault) {
            $this->updateCardFromStripe();
        }
    }
}
