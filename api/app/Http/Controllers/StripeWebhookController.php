<?php

namespace App\Http\Controllers;

use App\Traits\StripeWebhook;
use Laravel\Cashier\Http\Controllers\WebhookController as CashierController;
use Illuminate\Support\Facades\Log;
use App\User;

class StripeWebhookController extends CashierController
{
    use StripeWebhook {
        StripeWebhook::__construct as stripeWebhookConstructor;
    }

    /**
     * Create new controller constructor
     */
    public function __construct()
    {
        parent::__construct();

        $this->stripeWebhookConstructor();
    }

    /**
     * Handle customer created.
     *
     * @param  array  $payload
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handleCustomerCreated($payload)
    {
        Log::debug(__METHOD__, $payload);

        $this->writeJournal($payload, ['data.object.email']);
    }

    /**
     * Handle customer deleted.
     *
     * @param  array  $payload
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handleCustomerDeleted($payload)
    {
        Log::debug(__METHOD__, $payload);

        $journal = $this->writeJournal($payload, ['data.object.email']);

        $user = User::where('stripe_id', $journal->object_id)->first();

        if ($user) {
            foreach ($user->localSubscriptions as $localSubscription) {
                $localSubscription->delete();
            }

            $user->update([
                'stripe_id' => null,
                'card_brand' => null,
                'card_last_four' => null,
                'card_exp_month' => null,
                'card_exp_year' => null,
                'subscription_status' => "TERMINATED",
                'trial_ends_at' => null,
            ]);
            
            $user->delete();
        }
    }

    /**
     * Handle customer source expriring.
     *
     * @param  array  $payload
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handleCustomerSourceExpiring($payload)
    {
        Log::debug(__METHOD__, $payload);

        $this->writeJournal($payload, [
            'data.object.owner.email',
            'data.object.currency',
            'data.object.type',
            'data.object.status',
        ]);

        $user = User::where('stripe_id', $payload['data']['object']['owner']['email'])->first();

        if ($user) $user->sendCardExpiringNotification();
    }

    /**
     * Handle customer source updated.
     *
     * @param  array  $payload
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handleCustomerSourceUpdated($payload)
    {
        Log::debug(__METHOD__, $payload);

        $this->writeJournal($payload, [
            'data.object.owner.email',
            'data.object.currency',
            'data.object.type',
            'data.object.status',
        ]);

        $user = User::where('stripe_id', $payload['data']['object']['owner']['email'])->first();

        if ($user) $user->sendCardExpiringNotification();
    }

    /**
     * Handle customer subscription created.
     *
     * @param  array  $payload
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handleCustomerSubscriptionCreated($payload)
    {
        Log::debug(__METHOD__, $payload);

        $this->writeJournal($payload, [
            'data.object.customer',
            'data.object.status',
        ]);

        $isTrialing = $payload['data']['object']['status'] === 'trialing' ? true : false;

        $user = User::where('stripe_id', $payload['data']['object']['customer'])->first();

        if ($user) $user->sendSubscriptionCreatedNotification($isTrialing);
    }

    /**
     * Handle customer subscription updated.
     *
     * @param  array  $payload
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handleCustomerSubscriptionUpdated($payload)
    {
        Log::debug(__METHOD__, $payload);

        $this->writeJournal($payload, [
            'data.object.customer',
            'data.object.status',
        ]);

        $user = User::where('stripe_id', $payload['data']['object']['customer'])->first();

        if ($user) $user->sendSubscriptionUpdatedNotification();
    }

    /**
     * Handle customer subscription deleted.
     *
     * @param  array  $payload
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handleCustomerSubscriptionDeleted($payload)
    {
        Log::debug(__METHOD__, $payload);

        $this->writeJournal($payload, [
            'data.object.customer',
            'data.object.status',
        ]);

        $user = User::where('stripe_id', $payload['data']['object']['customer'])->first();

        if ($user) $user->sendSubscriptionDeletedNotification();
    }

    /**
     * Handle customer subscription trial will end.
     *
     * @param  array  $payload
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handleCustomerSubscriptionTrialWillEnd($payload)
    {
        Log::debug(__METHOD__, $payload);

        $this->writeJournal($payload, [
            'data.object.customer',
            'data.object.status',
        ]);

        $user = User::where('stripe_id', $payload['data']['object']['customer'])->first();

        if ($user) $user->sendSubscriptionTrialWillEndNotification();
    }

    /**
     * Handle invoice payment succeeded.
     *
     * @param  array  $payload
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handleInvoicePaymentSucceeded($payload)
    {
        Log::debug(__METHOD__, $payload);

        $this->writeJournal($payload, [
            'data.object.customer',
            'data.object.subscription',
            'data.object.status',
        ]);
    }

    /**
     * Handle invoice payment failed.
     *
     * @param  array  $payload
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handleInvoicePaymentFailed($payload)
    {
        Log::debug(__METHOD__, $payload);

        $this->writeJournal($payload, [
            'data.object.customer',
            'data.object.subscription',
            'data.object.status',
        ]);

        $user = User::where('stripe_id', $payload['data']['object']['customer'])->first();

        $description = "Subscription has been forcefully terminated by the application because of payment failure on "
            . "Stripe (Reported by webhook).";
        if ($user) {
            $user->cancelSubscription(
                "Payment failed",
                $description,
                true,               // TERMINATED Flag
            );
            $user->sendSubscriptionTerminatedNotification();
        }
    }
}
