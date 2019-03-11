<?php

namespace App\Traits;

use App\Exceptions\SubscriptionException;

use Illuminate\Support\Facades\Log;

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

            return $stripeToken;
        } catch (Exception $exception) {
            throw new SubscriptionException($exception->getMessage());
        }
    }

    /**
     * Pre-authorizes a card in Stripe for it's validity. Charges unit price without holding the amoutn for 7 days.
     * After 7 days the amount gets automatically refunded to user's bank account.
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
     * @return \Stripe\ApiResource
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
                    Log::debug('Pre authorized');
                }
            }
        }

        $this->newSubscription('lowest', config('pricing.plans.lowest.id'))
            ->trialDays(config('pricing.plans.lowest.trial'))
            ->create($stripeToken);
    }
}
