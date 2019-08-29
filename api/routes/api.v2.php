<?php

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

    Route::prefix('subscription')->name('subscription.')->middleware('activeUser')->group(function () {
        Route::get('/', 'SubscriptionController@index')->name('index');
        Route::post('/', 'SubscriptionController@store')->name('store');
        Route::post('/validate', 'SubscriptionController@validatePlanPrivileges')->name('validate');
        Route::put('/', 'SubscriptionController@update')->name('update');
        Route::delete('/', 'SubscriptionController@destroy')->name('destroy');
    });

    Route::prefix('zapier')->name('zapier.')->group(function () {
        Route::get('/show-token', 'UserController@getUserZapierToken')->name('show-token');
        Route::post('/create-token', 'UserController@createUserZapierToken')->name('create-token');
        Route::delete('/delete-token/{id}', 'UserController@deleteUserZapierToken')->name('delete-token');
    });

});

Route::get('pricing-plans', 'PricingPlansController@index')->name('pricing-plans.index');

Route::middleware(['auth:api', 'subscription', 'activeUser'])->group(function () {
    Route::bind('id', function ($value, $route) {
        return \App\Helpers\Hashids::decode($value);
    });
    
    Route::prefix('dashboard')->name('dashboard.')->group(function () {
        Route::get('/', 'DashboardController@index')->name('index');
    });

    Route::prefix('brands')->name('brands.')->group(function () {
        Route::get('/', 'BrandsController@index')->name('index');
        Route::post('/', 'BrandsController@store')->name('store');
        Route::get('/{id}', 'BrandsController@show')->name('show');
        Route::put('/{id}', 'BrandsController@update')->name('update');
        Route::patch('/{id}', 'BrandsController@update')->name('update');
        Route::delete('/{id}', 'BrandsController@destroy')->name('delete');
    });

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
        Route::get('/sticky-review-style/{id}', 'CampaignsController@stickyReviewStyle')->name('sticky-review.style');
    });

    Route::prefix('exit-popups')->name('exit-popups.')->group(function () {
        Route::get('/styles', 'ExitPopupsController@styles')->name('styles.index');
        Route::get('/', 'ExitPopupsController@index')->name('index');
        Route::post('/', 'ExitPopupsController@store')->name('store');
        Route::get('/{id}', 'ExitPopupsController@show')->name('show');
        Route::put('/{id}', 'ExitPopupsController@update')->name('update');
        Route::patch('/{id}', 'ExitPopupsController@update')->name('update');
        Route::delete('/{id}', 'ExitPopupsController@destroy')->name('delete');
    });

    Route::prefix('sticky-reviews')->name('sticky-reviews.')->group(function () {
        Route::get('/', 'StickyReviewsController@index')->name('index');
        Route::post('/', 'StickyReviewsController@store')->name('store');
        Route::get('/{id}', 'StickyReviewsController@show')->name('show');
        Route::put('/{id}', 'StickyReviewsController@update')->name('update');
        Route::patch('/{id}', 'StickyReviewsController@update')->name('update');
        Route::delete('/{id}', 'StickyReviewsController@destroy')->name('delete');
        Route::patch('/{id}/campaigns', 'StickyReviewsController@syncCampaigns')->name('campaigns.sync');
    });

    Route::prefix('review-links')->name('review-links.')->group(function () {
        Route::get('slug-status', 'ReviewLinksController@checkSlug')->name('slug.check');
        Route::get('/', 'ReviewLinksController@index')->name('index');
        Route::post('/', 'ReviewLinksController@store')->name('store');
        Route::post('/validate/{id?}', 'ReviewLinksController@validateParams')->name('params.validate');
        Route::get('/{id}', 'ReviewLinksController@show')->name('show');
        Route::put('/{id}/auto-approve-status', 'ReviewLinksController@updateAutoApproveStatus')->name('update.auto.approve');
        Route::put('/{id}', 'ReviewLinksController@update')->name('update');
        Route::patch('/{id}', 'ReviewLinksController@update')->name('update');
        Route::delete('/{id}', 'ReviewLinksController@destroy')->name('delete');
    });

    Route::prefix('subscribed-emails')->name('subscribed-emails.')->group(function () {
        Route::get('/', 'SubscribedEmailController@index')->name('index');
        Route::delete('/{id}', 'SubscribedEmailController@destroy')->name('delete');
    });

    Route::prefix('custom-domains')->name('custom-domains.')->group(function () {
        Route::get('/', 'CustomDomainController@index')->name('index');
        Route::post('/', 'CustomDomainController@store')->name('store');
        Route::post('/validate', 'CustomDomainController@validateDomain')->name('validate');
        Route::get('/{id}', 'CustomDomainController@show')->name('show');
        Route::put('/{id}', 'CustomDomainController@update')->name('update');
        Route::patch('/{id}', 'CustomDomainController@update')->name('update');
        Route::delete('/{id}', 'CustomDomainController@destroy')->name('delete');
    });
});

Route::prefix('user-reviews')->name('user-reviews.')->group(function () {
    Route::get('{slug}', 'UserReviewsController@show')->name('show');
    Route::post('{slug}/validate', 'UserReviewsController@validateParams')->name('params.validate');
    Route::post('{slug}', 'UserReviewsController@store')->name('store');
});

Route::post('check-passkey', 'UserReviewsController@checkPasskey')->name('check-passkey');
Route::post('review-action', 'UserReviewsController@reviewAction')->name('review-action');

Route::prefix('widget')->name('widget.')->group(function () {
    Route::get('/{usid}', 'WidgetController@index')->name('index');
    Route::get('/{usid}/exit-popup', 'WidgetController@exitPopup')->name('exitpopup');
    Route::post('/{usid}/postback', 'WidgetController@postback')->name('postback');
});
