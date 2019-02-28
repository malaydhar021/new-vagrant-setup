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

Route::get('/test', function() {
    $allowedIps = [
        '192.168.15.1', // local
        env('TIER5_IP', '127.0.0.1')
    ];
    $visitorIp = request()->ip();

    if (in_array($visitorIp, $allowedIps)) {
        $status = "Authorized";
        $code = 200;
    } else {
        $status = "Unauthorized";
        $code = 401;
    }

    return response()->json([
        'ip' => $visitorIp,
        'status' => $status,
        'url' => config('app.redirect_url'),
        'message' => "Use Sticky Reviews, it is awesome.",
    ], $code);
})->name('test');

// Api version 1.0 routes
Route::prefix('v1')->middleware('cors')->group(function () {
    Route::post('authenticate', 'Apiv1Controller@index')->name('postAuthenticateUser');
    Route::post('/signup', 'Apiv1Controller@signup')->name('postsignup');
    Route::post('/signout', 'Apiv1Controller@signOut')->name('signOut');
    Route::post('/refresh-auth-token', 'Apiv1Controller@refreshAuthToken')->name('refreshAuthToken');
    Route::get('/authenticated-user-details', 'Apiv1Controller@show')->name('getAuthenticatedUser');
    Route::post('/add-campaign', 'Apiv1Controller@postAddCampaign')->name('postAddCampaign');
    Route::post('/get-all-campaigns', 'Apiv1Controller@getAllCampaigns')->name('getAllCampaigns');
    Route::post('/toggle-campaign-status', 'Apiv1Controller@postToggleStatus')->name('postToggleStatus');
    Route::post('/update-campaign-details', 'Apiv1Controller@postUpdateCampaign')->name('postUpdateCampaign');
    Route::post('/delete-campaign', 'Apiv1Controller@postDeleteCampaign')->name('postDeleteCampaign');
    Route::post('/save-sticky-review', 'Apiv1Controller@postSaveStickyReview')->name('postSaveStickyReview');
    Route::get('/get-all-sticky-reviews/{review_type?}', 'Apiv1Controller@getStickyReviews')->name('getStickyReviews');
    Route::post('/assign-campaign-to-sticky-review', 'Apiv1Controller@postAssignCampaignStickyReviews')->name('postAssignCampaignStickyReviews');
    Route::get('/campaign-details/{uid}', 'Apiv1Controller@getParticularCampaign')->name('getParticularCampaign');
    Route::get('/get-all-plans', 'Apiv1Controller@getStripePlans')->name('getAllStripePlans');
    Route::post('/post-add-branding', 'Apiv1Controller@postAddBranding')->name('postAddBranding');
    Route::get('/get-all-branding', 'Apiv1Controller@getAllBranding')->name('getAllBranding');
    Route::post('/delete-branding', 'Apiv1Controller@postDeleteBranding')->name('postDeleteBranding');
    Route::post('/update-branding', 'Apiv1Controller@postUpdateBranding')->name('postUpdateBranding');
    Route::get('/forget-storage-path', function () {
        return response()->json([
            'status'    => true,
            'response'  => url('/') . '/uploads/sticky-review-images/',
            // 'response'  => 'https://s3.amazonaws.com/'.config('constants.amazons3.AWS_BUCKET').'/',
        ]);
    });
    Route::post('/delete-sticky-review', 'Apiv1Controller@postDeleteStickyReview')->name('postDeleteStickyReview');
    Route::post('/update-sticky-review', 'Apiv1Controller@postUpdateStickyReview')->name('postUpdateStickyReview');
    Route::post('/assignment-pivot', 'Apiv1Controller@postAssignmentPivot')->name('postAssignmentPivot');
    Route::get('/generate-campaign-random-js-id', function () {
        return uniqid('emv_'.get_current_user()).time();
    });
    Route::post('/signup-user', 'Apiv1Controller@postSignUpUserThirdParty')->name('postSignUpUserThirdParty');
    Route::post('/delete-user', 'Apiv1Controller@postDeleteUser')->name('postDeleteUser');
    Route::post('/alter-user-state', 'Apiv1Controller@postAlterState')->name('postAlterState');
    Route::post('/change-password', 'Apiv1Controller@postChangePassword')->name('postChangePassword');
    Route::post('/create-review-link', 'Apiv1Controller@postCreateReviewLink')->name('postCreateReviewLink');
    Route::get('/get-all-review-link/{id?}', 'Apiv1Controller@getAllReviewLinks')->name('getAllCampaigns');
    Route::post('/check-duplicate-review-link', 'Apiv1Controller@postCheckDuplicateReviewLink')->name('postCheckDuplicateReviewLink');
    Route::post('/save-user-review', 'Apiv1Controller@postSaveUserReview')->name('postSaveUserReview');
    Route::post('/save-exit-pop-up', 'Apiv1Controller@postSaveExitPopUp')->name('postSaveExitPopUp');
    Route::get('/get-all-exit-pop-ups', 'Apiv1Controller@getAllExitPopUps')->name('getAllExitPopUps');
    Route::post('/delete-review-link', 'Apiv1Controller@postDeleteReviewLink')->name('postDeleteReviewLink');
    Route::post('/update-review-link', 'Apiv1Controller@postUpdateReviewLink')->name('postUpdateReviewLink');
    Route::post('/delete-exit-popup', 'Apiv1Controller@postDeleteExitPopUp')->name('postDeleteExitPopUp');
    Route::post('/update-exit-pop-up', 'Apiv1Controller@postUpdateExitPopUp')->name('postUpdateExitPopUp');
});
