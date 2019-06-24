<?php

/*
|--------------------------------------------------------------------------
| Hook Routes
|--------------------------------------------------------------------------
|
| Here is where you can register Hook routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "web" middleware group. Enjoy building your Hooks!
|
*/

Route::prefix('web')->middleware('web')->name('web.')->group(function () {
    Route::any('stripe', 'StripeWebhookController@handleWebhook')->name('stripe');

    Route::prefix('user')->name('user.')->group(function () {
        Route::post('/create', 'ThirdPartyWebhooksController@store')->name('store');
        Route::post('/delete', 'ThirdPartyWebhooksController@destroy')->name('destroy');
        Route::post('/status', 'ThirdPartyWebhooksController@alterStatus')->name('status.alter');
    });

    Route::prefix('zapier')->name('zapier.')->group(function () {
        Route::any('/send-user-data', 'ZapierWebhooksController@sendUserData')->name('send-user-data');
        Route::any('/send-user-review-links', 'ZapierWebhooksController@sendUserReviewLinkData')->name('send-user-review-links');
        Route::any('/get-review-link', 'ZapierWebhooksController@getReviewLink')->name('get-review-link');
        Route::any('/send-user-exit-popups', 'ZapierWebhooksController@sendUserExitPopupData')->name('send-user-exit-popups');
        Route::any('/get-exit-popup', 'ZapierWebhooksController@getExitPopup')->name('get-exit-popup');

    });
});
