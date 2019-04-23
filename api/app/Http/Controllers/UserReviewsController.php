<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserReviewParamRequest;
use App\Http\Requests\UserReviewRequest;
use App\Http\Resources\ReviewLinkResource;
use App\NegativeReview;
use App\ReviewLink;
use App\StickyReview as UserReview;

use Carbon\Carbon;

use Exception;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

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
        $reviewLink = ReviewLink::where('url_slug', $slug)->firstOrFail();

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
        // sticky review aliased as user review
        $userReview = new UserReview();
        // sticky review name
        $userReview->review_title = $request->input('review_title');

        $tags = 'user-review, ';
        // this `type` column is to determine wheather the review is a textual or audio or video review
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

        if ($request->input('recommendation')) {
            if ($request->input('grant_review_use')) {
                $reviewType = 3; //created by user through review link and also show
                $tags .= 'postive-review, auto-approved';
            } else {
                $reviewType = 2; //created by user through review link but no permission to show in web recommend us yes
                $tags .= 'postive-review, not-approved';
            }
        } else {
            $reviewType = 4;     //created by user through review link with recommend us no
            $tags .= 'negative-review';
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

        $userReview->load('negativeReviews');

        return response()->json([
            'status' => true,
            'message' => "Thank you for reviewing us.",
        ]);
    }
}
