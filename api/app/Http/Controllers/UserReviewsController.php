<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserReviewParamRequest;
use App\Http\Requests\UserReviewRequest;
use App\Http\Resources\ReviewLinkResource;
use App\Http\Resources\StickyReviewResource;
use App\NegativeReview;
use App\ReviewLink;
use App\StickyReview as UserReview;
use App\StickyReview;
use App\UserZapierTokens;
use Carbon\Carbon;
use Exception;
use App\Exceptions\UserReviewException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Helpers\Hashids;

class UserReviewsController extends Controller
{
    /**
     * Get the review links details to show the user review page
     *
     * @param  string  $slug
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($slug)
    {
        try {
            $reviewLink = ReviewLink::where('url_slug', $slug)->firstOrFail();
            $reviewLink->load('campaign', 'user', 'customDomain');
        } catch (Exception $exc) {
            throw new UserReviewException($exc->getMessage());
        }

        return response()->json([
            'status' => true,
            'message' => "Review link details has fetched successfully.",
            'data' => new ReviewLinkResource($reviewLink),
        ]);
    }

    /**
     * Validate the user review's parameter(s)
     *
     * @param  \App\Http\Requests\UserReviewParamRequest  $request
     * @param  string  $slug
     * @return \Illuminate\Http\JsonResponse
     */
    public function validateParams(UserReviewParamRequest $request, $slug)
    {
        return response()->json([
            'status' => true,
            'message' => "All parameters are valid, you are good to submit the review.",
        ]);
    }

    /**
     * Store the user review into storage
     *
     * @param  \App\Http\Requests\UserReviewRequest  $request
     * @param  string  $slug
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(UserReviewRequest $request, $slug)
    {
        $reviewLink = ReviewLink::where('url_slug', $slug)->firstOrFail();

        // sticky review aliased as user review
        $userReview = new UserReview();
        // sticky review name
        $userReview->review_title = $request->input('review_title');

        $tags = 'user-review, ';
        // this `type` column is to determine whether the review is a textual or audio or video review
        $userReview->type = $request->input('review_type');
        switch ($request->input('review_type')) {
            case 1:
                if ($request->has('review_text')) {
                    $userReview->review_text = $request->input('review_text');
                    $tags .= 'textual-review, ';
                }
                break;
            case 2:
                if ($request->has('review_audio')) {
                    $userReview->review_audio = $request->file('review_audio');
                    $tags .= 'audio-review, ';
                }
                break;
            case 3:
                if ($request->has('review_video')) {
                    $userReview->review_video = $request->file('review_video');
                    $tags .= 'video-review, ';
                }
                break;
            default:
                if ($request->has('description')) {
                    $userReview->description = $request->input('description');
                    $tags .= 'textual-review, ';
                }
        }

        $userReview->rating = $request->input('rating');

        $shouldAutoDisplay = false;
        if ($reviewLink->min_rating <= $userReview->rating) {
            $shouldAutoDisplay = true;
        }

        if ($request->input('recommendation')) {
            if ($request->input('grant_review_use')) {
                $reviewType = 3; //created by user through review link and also show
                $tags .= 'positive-review, publishable';
                if ($reviewLink->auto_approve) {
                    // If the review link has auto approved on then the review is sticky review & it will show on widget
                    $shouldAutoDisplay = $shouldAutoDisplay && true;
                    if ($shouldAutoDisplay) {
                        $tags .= ', sticky-review';
                    }
                } else {
                    $shouldAutoDisplay = $shouldAutoDisplay && false;
                }
            } else {
                $reviewType = 2; //created by user through review link but no permission to show in web recommend us yes
                $tags .= 'positive-review, non-publishable';
                $shouldAutoDisplay = false;
            }
        } else {
            $reviewType = 4;     //created by user through review link with recommend us no
            $tags .= 'negative-review';
            $shouldAutoDisplay = false;
        }

        $userReview->tags = $tags;
        // this `review_type` column is used for recommendation & grant_review_use
        $userReview->review_type = $reviewType;

        if ($request->has('profile_picture')) {
            $userReview->profile_picture = $request->file('profile_picture');
        }

        $userReview->review_link_id = $request->input('review_link_id');
        // since `$timestamps = false`, need to manually create the timestamp
        $datetime = Carbon::now();
        $userReview->created_at = $datetime->format('Y-m-d H:i:s');
        $userReview->updated_at = $datetime->format('Y-m-d H:i:s');

        try {
            DB::beginTransaction();

            $userReview->save();

            // If the review is negative review store email and password
            if ($userReview->review_type == 4) {
                $negativeReview = new NegativeReview();
                $negativeReview->sticky_review_id = $userReview->id;
                $negativeReview->email = $request->input('email');
                $negativeReview->phone_number = $request->input('phone_number');
                $negativeReview->save();
            }

            $userReview->load('reviewLink');
            if ($shouldAutoDisplay) {
                $userReview->campaigns()->attach([$userReview->reviewLink->campaign_id]);
            }
        } catch (Exception $exception) {
            DB::rollBack();

            Log::error("User Review Saving Error: ", $exception->getTrace());

            return response()->json([
                'status' => true,
                'message' => "Whoops! looks like something went wrong. Please try again later.",
                'errors' => [
                    'error_message' => $exception->getMessage(),
                    'error_trace' => config('app.debug') ? $exception->getTrace() : null,
                ],
            ], 500);
        } finally {
            DB::commit();
        }

        return response()->json([
            'status' => true,
            'message' => "Thank you for reviewing us.",
        ]);
    }

    /**
     * Function to check passkey and show user review
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function checkPasskey(Request $request)
    {
        $stickyId = Hashids::decode($request->stickyId);
        $reviewToken = $request->reviewToken;
//        $getEnvUrl = $_SERVER['SERVER_NAME'];
//
//        if (strpos($getEnvUrl, 'local') !== false) {
//            $linkUrl = 'api.local.usestickyreviews.com';
//        } elseif (strpos($getEnvUrl, 'beta') !== false) {
//            $linkUrl = 'api.beta.usestickyreviews.com';
//        } else {
//            $linkUrl = 'api.usestickyreviews.com';
//        }
        // review url for the audio and video files
        $linkUrl = config('filesystem.s3.url');
        // review url for the video files
        $vid_url = config('services.cloudfront_cdn_url.video_cdn_url');
        // show the review
         $stickyReviewData = StickyReview::where('id', $stickyId)->where('review_token', $reviewToken)
            ->with('reviewLink.campaign', 'brands', 'reviewLink.campaign.brandingDetails')
            ->first();

        if ($stickyReviewData) {
            $stickyReviewData['url_link'] = $linkUrl;
            $stickyReviewData['vid_link'] = $vid_url;
            return response()->json([
                'status' => true,
                'data'  =>  $stickyReviewData,
                'message' => "Sticky review found !",
            ]);
        } else {
            return response()->json([
                'status' => false,
                'data'  =>  [],
                'message' => "Sticky review not found !",
            ]);
        }
    }

    public function reviewAction(Request $request)
    {
        $stickyId = Hashids::decode($request->stickyId);
        $updateStickyReview = StickyReview::where('id', $stickyId)->first();
        if ($updateStickyReview != null) {
            $updateStickyReview->is_accept = $request->reviewAction;
            $updateStickyReview->review_token = null;
            if ($updateStickyReview->save()) {
                $noOfAttachedCampaignsThroughReviewLink = $updateStickyReview->campaigns
                    ->where('id', $updateStickyReview->reviewLink->campaign_id)->count();
                if ($request->reviewAction == 1) {
                    if ($noOfAttachedCampaignsThroughReviewLink == 0) {
                        $updateStickyReview->campaigns()->attach([$updateStickyReview->reviewLink->campaign_id]);
                    }
                    $message = 'User review accepted !';
                } else {
                    if ($noOfAttachedCampaignsThroughReviewLink > 0) {
                        $updateStickyReview->campaigns()->detach([$updateStickyReview->reviewLink->campaign_id]);
                    }
                    $message = 'User review rejected !';
                }
                return response()->json([
                    'status' => true,
                    'message' => $message,
                ]);
            } else {
                return response()->json([
                    'status' => false,
                    'message' => 'Something went wrong while saving, Please try again !',
                ]);
            }
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Sorry user review not found !',
            ]);
        }
    }
}
