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

Route::prefix('auth')->namespace('Auth')->group(function () {
    Route::get('email-registration-status', 'AuthController@checkEmail')->name('auth.email.check');
    Route::post('validate-email-password', 'AuthController@validateEmailPassword')->name('validate.email.password');
    Route::post('register', 'AuthController@register')->name('auth.register');
    Route::post('login', 'AuthController@login')->name('auth.login');
    Route::post('logout', 'AuthController@logout')->name('auth.logout')->middleware('auth:api');

    Route::prefix('password')->group(function () {
        Route::prefix('token')->group(function () {
            Route::post('/', 'PasswordResetTokenController@store')->name('auth.password.token.store');
            Route::get('{token}', 'PasswordResetTokenController@show')->name('auth.password.token.show');
        });
        Route::put('/', 'PasswordResetController@update')->name('auth.password.update');
    });
});

Route::prefix('user')->middleware('auth:api')->group(function () {

    Route::get('/', 'UserController@index')->name('user.index');

    Route::prefix('card')->group(function () {
        Route::get('/', 'CardController@index')->name('user.card.index');
        Route::put('/', 'CardController@update')->name('user.card.update');
    });

    Route::prefix('subscription')->group(function () {
        Route::get('/', 'SubscriptionController@index')->name('user.subscription.index');
        Route::post('/', 'SubscriptionController@store')->name('user.subscription.store');
        Route::put('/', 'SubscriptionController@update')->name('user.subscription.update');
        Route::delete('/', 'SubscriptionController@destroy')->name('user.subscription.destroy');
    });
});

Route::get('pricing-plans', 'PricingPlansController@index')->name('pricing-plans.index');

Route::middleware('auth:api')->group(function () {
    Route::bind('id', function ($value, $route) {
        return Hashids::decode($value);
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
    });

    // sticky reviews api routes
    Route::get('/get-all-sticky-reviews/{review_type?}', 'ApiV2Controller@getStickyReviews')->name('getStickyReviews');
    Route::post('/save-sticky-review', 'ApiV2Controller@postSaveStickyReview')->name('postSaveStickyReview');
    Route::post('/update-sticky-review', 'ApiV2Controller@postUpdateStickyReview')->name('postUpdateStickyReview');
    Route::post('/delete-sticky-review', 'ApiV2Controller@postDeleteStickyReview')->name('postDeleteStickyReview');
    Route::post('/assign-campaign-to-sticky-review', 'ApiV2Controller@postAssignCampaignStickyReviews')->name('postAssignCampaignStickyReviews');
    // branding api routes
    Route::get('/get-all-branding', 'ApiV2Controller@getAllBranding')->name('getAllBranding');
    Route::post('/post-add-branding', 'ApiV2Controller@postAddBranding')->name('postAddBranding');
    Route::post('/update-branding', 'ApiV2Controller@postUpdateBranding')->name('postUpdateBranding');
    Route::post('/delete-branding', 'ApiV2Controller@postDeleteBranding')->name('postDeleteBranding');
    /**
     * @todo Not sure what this is for
     */
    Route::post('/assignment-pivot', 'ApiV2Controller@postAssignmentPivot')->name('postAssignmentPivot');
    // review link api routes
    Route::get('/get-all-review-link/{id?}', 'ApiV2Controller@getAllReviewLinks')->name('getAllCampaigns');
    Route::post('/create-review-link', 'ApiV2Controller@postCreateReviewLink')->name('postCreateReviewLink');
    Route::post('/update-review-link', 'ApiV2Controller@postUpdateReviewLink')->name('postUpdateReviewLink');
    Route::post('/delete-review-link', 'ApiV2Controller@postDeleteReviewLink')->name('postDeleteReviewLink');
    Route::post('/check-duplicate-review-link', 'ApiV2Controller@postCheckDuplicateReviewLink')->name('postCheckDuplicateReviewLink');
    // exit popup api routes
    Route::get('/get-all-exit-pop-ups', 'ApiV2Controller@getAllExitPopUps')->name('getAllExitPopUps');
    Route::post('/save-exit-pop-up', 'ApiV2Controller@postSaveExitPopUp')->name('postSaveExitPopUp');
    Route::post('/update-exit-pop-up', 'ApiV2Controller@postUpdateExitPopUp')->name('postUpdateExitPopUp');
    Route::post('/delete-exit-popup', 'ApiV2Controller@postDeleteExitPopUp')->name('postDeleteExitPopUp');
});

Route::post('/change-password', 'ApiV2Controller@postChangePassword')->name('postChangePassword');
Route::post('/save-user-review', 'ApiV2Controller@postSaveUserReview')->name('postSaveUserReview');
Route::get('/campaign-details/{uid}', 'ApiV2Controller@getParticularCampaign')->name('getParticularCampaign');
