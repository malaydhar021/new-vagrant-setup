<?php

namespace App\Observers;

use App\SubscribedEmail;
use App\Traits\WebsocketApi;

class SubscribedEmailObserver
{
    use WebsocketApi;
    /**
     * Handle the subscribed email "created" event.
     *
     * @param  \App\SubscribedEmail  $subscribedEmail
     * @return void
     */
    public function created(SubscribedEmail $subscribedEmail)
    {
        $this->wsApiCall(config('websocket.api.emails_from_exit_popup_count'));
    }

    /**
     * Handle the subscribed email "updated" event.
     *
     * @param  \App\SubscribedEmail  $subscribedEmail
     * @return void
     */
    public function updated(SubscribedEmail $subscribedEmail)
    {
        //
    }

    /**
     * Handle the subscribed email "deleted" event.
     *
     * @param  \App\SubscribedEmail  $subscribedEmail
     * @return void
     */
    public function deleted(SubscribedEmail $subscribedEmail)
    {
        $this->wsApiCall(config('websocket.api.emails_from_exit_popup_count'));
    }

    /**
     * Handle the subscribed email "restored" event.
     *
     * @param  \App\SubscribedEmail  $subscribedEmail
     * @return void
     */
    public function restored(SubscribedEmail $subscribedEmail)
    {
        $this->wsApiCall(config('websocket.api.emails_from_exit_popup_count'));
    }

    /**
     * Handle the subscribed email "force deleted" event.
     *
     * @param  \App\SubscribedEmail  $subscribedEmail
     * @return void
     */
    public function forceDeleted(SubscribedEmail $subscribedEmail)
    {
        $this->wsApiCall(config('websocket.api.emails_from_exit_popup_count'));
    }
}
