<?php

/*
|--------------------------------------------------------------------------
| Webhooks Routes
|--------------------------------------------------------------------------
|
| Here is where you can register Webhook routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "web" middleware group. Enjoy building your Webhooks!
|
*/

Route::middleware('cors')->group(function () {
    Route::any('stripe', 'StripeWebhookController@handleWebhook')->name('webhooks.stripe');
});
