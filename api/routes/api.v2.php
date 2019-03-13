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

Route::middleware('cors')->group(function () {
    Route::prefix('auth')->namespace('Auth')->group(function () {
        Route::get('email-registration-status', 'AuthController@checkEmail')->name('auth.email.check');
        Route::post('register', 'AuthController@register')->name('auth.register');
        Route::post('login', 'AuthController@login')->name('auth.login');
        Route::middleware('auth:api')->post('logout', 'AuthController@logout')->name('auth.logout');
    });
    Route::middleware('auth:api')->prefix('user')->group(function () {
        Route::get('/', 'UserController@index')->name('user.index');
        Route::get('card', 'UserController@getCard')->name('user.card.index');
        Route::put('card', 'UserController@updateCard')->name('user.card.update');
    });
    Route::middleware('auth:api')->group(function () {
        Route::get('/authenticated-user-details', 'ApiV2Controller@show')->name('getAuthenticatedUser');
        Route::post('/add-campaign', 'ApiV2Controller@postAddCampaign')->name('postAddCampaign');
        Route::post('/get-all-campaigns', 'ApiV2Controller@getAllCampaigns')->name('getAllCampaigns');
        Route::post('/toggle-campaign-status', 'ApiV2Controller@postToggleStatus')->name('postToggleStatus');
        Route::post('/update-campaign-details', 'ApiV2Controller@postUpdateCampaign')->name('postUpdateCampaign');
        Route::post('/delete-campaign', 'ApiV2Controller@postDeleteCampaign')->name('postDeleteCampaign');
        Route::post('/save-sticky-review', 'ApiV2Controller@postSaveStickyReview')->name('postSaveStickyReview');
        Route::get('/get-all-sticky-reviews/{review_type?}', 'ApiV2Controller@getStickyReviews')->name('getStickyReviews');
        Route::post('/assign-campaign-to-sticky-review', 'ApiV2Controller@postAssignCampaignStickyReviews')->name('postAssignCampaignStickyReviews');
        Route::get('/get-all-plans', 'ApiV2Controller@getStripePlans')->name('getAllStripePlans');
        Route::post('/post-add-branding', 'ApiV2Controller@postAddBranding')->name('postAddBranding');
        Route::get('/get-all-branding', 'ApiV2Controller@getAllBranding')->name('getAllBranding');
        Route::post('/delete-branding', 'ApiV2Controller@postDeleteBranding')->name('postDeleteBranding');
        Route::post('/update-branding', 'ApiV2Controller@postUpdateBranding')->name('postUpdateBranding');
        Route::get('/forget-storage-path', function () {
            return response()->json([
                'status' => true,
                'response' => url('/') . '/uploads/sticky-review-images/',
            ]);
        });
        Route::post('/delete-sticky-review', 'ApiV2Controller@postDeleteStickyReview')->name('postDeleteStickyReview');
        Route::post('/update-sticky-review', 'ApiV2Controller@postUpdateStickyReview')->name('postUpdateStickyReview');
        Route::post('/assignment-pivot', 'ApiV2Controller@postAssignmentPivot')->name('postAssignmentPivot');
        Route::get('/generate-campaign-random-js-id', function () {
            return uniqid('emv_'.get_current_user()).time();
        });
        Route::post('/create-review-link', 'ApiV2Controller@postCreateReviewLink')->name('postCreateReviewLink');
        Route::get('/get-all-review-link/{id?}', 'ApiV2Controller@getAllReviewLinks')->name('getAllCampaigns');
        Route::post('/check-duplicate-review-link', 'ApiV2Controller@postCheckDuplicateReviewLink')->name('postCheckDuplicateReviewLink');
        Route::post('/save-exit-pop-up', 'ApiV2Controller@postSaveExitPopUp')->name('postSaveExitPopUp');
        Route::get('/get-all-exit-pop-ups', 'ApiV2Controller@getAllExitPopUps')->name('getAllExitPopUps');
        Route::post('/delete-review-link', 'ApiV2Controller@postDeleteReviewLink')->name('postDeleteReviewLink');
        Route::post('/update-review-link', 'ApiV2Controller@postUpdateReviewLink')->name('postUpdateReviewLink');
        Route::post('/delete-exit-popup', 'ApiV2Controller@postDeleteExitPopUp')->name('postDeleteExitPopUp');
        Route::post('/update-exit-pop-up', 'ApiV2Controller@postUpdateExitPopUp')->name('postUpdateExitPopUp');
    });
    Route::post('/signup-user', 'ApiV2Controller@postSignUpUserThirdParty')->name('postSignUpUserThirdParty');
    Route::post('/delete-user', 'ApiV2Controller@postDeleteUser')->name('postDeleteUser');
    Route::post('/alter-user-state', 'ApiV2Controller@postAlterState')->name('postAlterState');
    Route::post('/change-password', 'ApiV2Controller@postChangePassword')->name('postChangePassword');
    Route::post('/save-user-review', 'ApiV2Controller@postSaveUserReview')->name('postSaveUserReview');
    Route::get('/campaign-details/{uid}', 'ApiV2Controller@getParticularCampaign')->name('getParticularCampaign');
});
