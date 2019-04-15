<?php

use App\Helpers\Hashids;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::prefix('auth')->namespace('Auth')->name('auth.')->group(function () {
    Route::get('email-registration-status', 'AuthController@checkEmail')->name('email.check');
    Route::post('validate-email-password', 'AuthController@validateEmailPassword')->name('email.password.validate');
    Route::post('register', 'AuthController@register')->name('register');
    Route::post('login', 'AuthController@login')->name('login');
    Route::post('logout', 'AuthController@logout')->name('logout')->middleware('auth:api');

    Route::prefix('password')->name('password.')->group(function () {
        Route::prefix('token')->name('token.')->group(function () {
            Route::post('/', 'PasswordResetTokenController@store')->name('store');
            Route::get('{token}', 'PasswordResetTokenController@show')->name('show');
        });
        Route::put('/', 'PasswordResetController@update')->name('update');
    });
});

Route::prefix('user')->name('user.')->middleware('auth:api')->group(function () {

    Route::get('/', 'UserController@index')->name('index');
    Route::put('/', 'UserController@update')->name('update');
    Route::put('password', 'UserController@updatePassword')->name('password.update');

    Route::prefix('card')->name('card.')->group(function () {
        Route::get('/', 'CardController@index')->name('index');
        Route::put('/', 'CardController@update')->name('update');
    });

    Route::prefix('subscription')->name('subscription.')->group(function () {
        Route::get('/', 'SubscriptionController@index')->name('index');
        Route::post('/', 'SubscriptionController@store')->name('store');
        Route::put('/', 'SubscriptionController@update')->name('update');
        Route::delete('/', 'SubscriptionController@destroy')->name('destroy');
    });
});

Route::get('pricing-plans', 'PricingPlansController@index')->name('pricing-plans.index');

Route::middleware('auth:api')->group(function () {
    Route::bind('id', function ($value, $route) {
        return Hashids::decode($value);
    });

    // branding api routes
    Route::get('/get-all-branding', 'ApiV2Controller@getAllBranding')->name('getAllBranding');
    Route::post('/post-add-branding', 'ApiV2Controller@postAddBranding')->name('postAddBranding');
    Route::post('/update-branding', 'ApiV2Controller@postUpdateBranding')->name('postUpdateBranding');
    Route::post('/delete-branding', 'ApiV2Controller@postDeleteBranding')->name('postDeleteBranding');

    Route::prefix('campaigns')->name('campaigns.')->group(function () {
        Route::get('/styles', 'CampaignsController@styles')->name('styles.index');
        Route::get('/', 'CampaignsController@index')->name('index');
        Route::post('/', 'CampaignsController@store')->name('store');
        Route::get('/{id}', 'CampaignsController@show')->name('show');
        Route::put('/{id}', 'CampaignsController@update')->name('update');
        Route::patch('/{id}', 'CampaignsController@update')->name('update');
        Route::delete('/{id}', 'CampaignsController@destroy')->name('delete');
        Route::patch('/{id}/status', 'CampaignsController@toggleStatus')->name('status.toggle');
        Route::patch('/{id}/sticky-reviews', 'CampaignsController@syncStickyReviews')->name('sticky-reviews.sync');
    });

    // exit popup api routes
    Route::get('/get-all-exit-pop-ups', 'ApiV2Controller@getAllExitPopUps')->name('getAllExitPopUps');
    Route::post('/save-exit-pop-up', 'ApiV2Controller@postExitPopUpRequest')->name('postExitPopUpRequest');
    Route::post('/update-exit-pop-up', 'ApiV2Controller@postUpdateExitPopUp')->name('postUpdateExitPopUp');
    Route::post('/delete-exit-popup', 'ApiV2Controller@postDeleteExitPopUp')->name('postDeleteExitPopUp');

    // sticky reviews api routes
    Route::get('/get-all-sticky-reviews/{review_type?}', 'ApiV2Controller@getStickyReviews')->name('getStickyReviews');
    Route::post('/save-sticky-review', 'ApiV2Controller@postSaveStickyReview')->name('postSaveStickyReview');
    Route::post('/update-sticky-review', 'ApiV2Controller@postUpdateStickyReview')->name('postUpdateStickyReview');
    Route::post('/delete-sticky-review', 'ApiV2Controller@postDeleteStickyReview')->name('postDeleteStickyReview');
    Route::post('/assign-campaign-to-sticky-review', 'ApiV2Controller@postAssignCampaignStickyReviews')->name('postAssignCampaignStickyReviews');

    // review link api routes
    Route::get('/get-all-review-link/{id?}', 'ApiV2Controller@getAllReviewLinks')->name('getAllCampaigns');
    Route::post('/create-review-link', 'ApiV2Controller@postCreateReviewLink')->name('postCreateReviewLink');
    Route::post('/update-review-link', 'ApiV2Controller@postUpdateReviewLink')->name('postUpdateReviewLink');
    Route::post('/delete-review-link', 'ApiV2Controller@postDeleteReviewLink')->name('postDeleteReviewLink');
    Route::post('/check-duplicate-review-link', 'ApiV2Controller@postCheckDuplicateReviewLink')->name('postCheckDuplicateReviewLink');
});

Route::post('/change-password', 'ApiV2Controller@postChangePassword')->name('postChangePassword');
Route::post('/save-user-review', 'ApiV2Controller@postSaveUserReview')->name('postSaveUserReview');
Route::get('/campaign-details/{uid}', 'ApiV2Controller@getParticularCampaign')->name('getParticularCampaign');
