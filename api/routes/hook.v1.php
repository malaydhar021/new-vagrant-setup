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
        Route::post('/create', 'ApiV2Controller@postSignUpUserThirdParty')->name('store');
        Route::post('/delete', 'ApiV2Controller@postDeleteUser')->name('delete');
        Route::post('/status', 'ApiV2Controller@postAlterState')->name('status.toggle');
    });
});
