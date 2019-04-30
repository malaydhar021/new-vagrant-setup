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
});
