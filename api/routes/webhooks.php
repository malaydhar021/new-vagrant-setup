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

    Route::prefix('affiliates/')->group(function () {
        Route::post('/signup-user', 'ApiV2Controller@postSignUpUserThirdParty')->name('postSignUpUserThirdParty');
        Route::post('/delete-user', 'ApiV2Controller@postDeleteUser')->name('postDeleteUser');
        Route::post('/alter-user-state', 'ApiV2Controller@postAlterState')->name('postAlterState');
    });
});
