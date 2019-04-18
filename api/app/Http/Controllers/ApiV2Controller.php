<?php

namespace App\Http\Controllers;

use App\ExitPopUp;
use App\Http\Requests\ExitPopUpRequest;
use App\Http\Requests\ReviewLinkRequest;
use App\Campaign;
use App\NegativeReview;
use App\ReviewLink;
use App\StickyReview;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\User;
use Intervention\Image\Facades\Image;
use Illuminate\Support\Facades\Auth;

class ApiV2Controller extends Controller
{
    /**
     * this function returns authenticated user id if authenticated
     * @return bool|integer
     */
    public function isAuthenticated()
    {
        if (Auth::check()) {
            return Auth::user()->id;
        } else {
            return false;
        }
    }

    /**
     * this function helps to create a user when its coming from third party
     * like clickfunnel
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function postSignUpUserThirdParty(Request $request)
    {
        // for cross origin requests
        if ($request->has('name') && $request->has('email')) {
            try {
                $user = User::whereEmail(trim($request->email))->first();

                if ($user) {
                    return response()->json([
                        'data' => [
                            'http_code' => 200,
                            'status' => false,
                            'message' => 'This email already registered with us.',
                        ],
                    ], 200);
                } else {
                    $userCreate = User::create([
                        'name'              => $request->name,
                        'email'             => $request->email,
                        'password'          => bcrypt(123456),
                        'stripe_plan_id'    => $request->stripe_plan_id != null ? $request->stripe_plan_id : null,
                        'is_third_party'    => 1,
                        'api_token'         => md5(uniqid(rand(999999999, 9999999999), true)),
                    ]);
                    if ($userCreate) {
                        return response()->json([
                            'data' => [
                                'http_code' => 200,
                                'status' => true,
                                'message' => 'Successfully created the user! By default password has been set to 123456, '
                                    . 'do change it after you login',
                            ],
                        ], 200);
                    }
                }
            } catch (\Exception $e) {
                return response()->json([
                    'data' => [
                        'http_code' => 200,
                        'status' => false,
                        'message' => "Oops! Something went wrong in server. Please try again later.",
                        'payload' => [
                            'message' => array_key_exists(2, $e->errorInfo) ? $e->errorInfo[2] : $e->getMessage(),
                        ],
                    ],
                ], 200);
            }
        } else {
            return response()->json([
                'data' => [
                    'http_code' => 200,
                    'status' => false,
                    'message' => 'Missing expected param!'
                ]
            ], 200);
        }
    }

    /**
     * this function deletes a row from user table for which the id has been provided
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function postDeleteUser(Request $request)
    {
        if ($request->has('email')) {
            try {
                $trash_user = User::where('email', $request->email)->first();
                if ($trash_user) {
                    if ($trash_user->delete()) {
                        return response()->json([
                            'data' => [
                                'http_code' => 200,
                                'status' => true,
                                'message' => 'Successfully deleted the user!'
                            ],
                        ], 200);
                    } else {
                        return response()->json([
                            'data' => [
                                'http_code' => 200,
                                'status' => false,
                                'message' => 'Something went wrong while deleting the record!'
                            ],
                        ], 200); // for zapier its 200 the error code. Dont change in future then it will break the system
                    }
                } else {
                    return response()->json([
                        'data' => [
                            'http_code' => 200,
                            'status' => false,
                            'message' => 'No Records found with the email '. $request->email
                        ],
                    ], 200);
                }
            } catch (\Exception $e) {
                return response()->json([
                    'data' => [
                        'http_code' => 200,
                        'status' => false,
                        'message' => "Oops! Something went wrong in server. Please try again later.",
                        'payload' => [
                            'message' => $e->getMessage(),
                        ],
                    ]
                ], 200);
            }
        } else {
            return response()->json([
                'data' => [
                    'http_code' => 200,
                    'status' => false,
                    'message' => 'Missing expected param!',
                ]
            ], 200);
        }
    }

    /**
     * update the state of a user active or inactive  0->active 1->inactive
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function postAlterState(Request $request)
    {
        if ($request->has('alter_flg') && $request->has('email')) {
            try {
                $find_user = User::where('email', $request->email)->update(['is_active' => $request->alter_flg]);
                if ($find_user) {
                    return response()->json([
                        'data' => [
                            'http_code' => 200,
                            'status' => true,
                            'message' => 'Successfully updated the user!',
                        ]
                    ], 200);
                } else {
                    return response()->json([
                        'data' => [
                            'http_code' => 200,
                            'status' => false,
                            'message' => 'Something went wrong while updating the record!',
                        ],
                    ], 200);
                }
            } catch (\Exception $e) {
                return response()->json([
                    'data' => [
                        'http_code' => 200,
                        'status' => true,
                        'message' => "Oops! Something went wrong in server. Please try again later.",
                        'payload' => [
                            'message' => $e->getMessage(),
                        ],
                    ],
                ], 200);
            }
        } else {
            return response()->json([
                'data' => [
                    'http_code' => 200,
                    'status' => false,
                    'message' => 'Missing expected param!',
                ]
            ], 200);
        }
    }

    /**
     * Get the list of all the pop ups created by a particular user
     *
     *  @return \Illuminate\Http\JsonResponse
     */
    public function getAllExitPopUps()
    {
        if (is_integer($this->isAuthenticated())) {
            try {
                $exit_pop_ups = ExitPopUp::where('created_by', $this->isAuthenticated())
                    ->with('stickyReviews')
                    ->orderBy('created_at', 'desc')
                    ->get();
                if ($exit_pop_ups) {
                    return response()->json([
                        'status'   => true,
                        'message' => $exit_pop_ups
                    ], 200);
                } else {
                    return response()->json([
                        'status'   => false,
                        'message' => 'No results found!'
                    ], 404);
                }
            } catch (\Exception $e) {
                return response()->json([
                    'status'   => false,
                    'message' => "Oops! Something went wrong in server. Please try again later.",
                    'message' => $e->getMessage()
                ], 500);
            }
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Failed to authenticate. Please login again to continue!'
            ], 403);
        }
    }

    /**
     * This function stores exit pop up in db
     *
     * @param ExitPopUpRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function postExitPopUpRequest(ExitPopUpRequest $request)
    {
        try {
            DB::beginTransaction();
            $saveExitPopUp = ExitPopUp::create([
                'created_by'                => $request->created_by,
                'name'                      => $request->name,
                'header_text'               => $request->header_text,
                'header_background_color'   => $request->header_background_color,
                'header_text_color'         => $request->header_text_color,
                'semi_header_text'          => strlen($request->semi_header_text) ? $request->semi_header_text : null,
                'semi_header_text_color'    => strlen($request->semi_header_text) ? $request->semi_header_text_color : null,
                'body_background_color'     => $request->body_background_color,
                'cta_link_url'              => $request->cta_link_url,
                'campaign_id'               => $request->select_active_campaign,
                'btn_size'                  => $request->btn_size,
                'btn_text'                  => $request->btn_text,
                'btn_color'                 => $request->btn_color,
                'btn_text_color'            => $request->btn_text_color
            ]);
            if ($saveExitPopUp) {
                // pivot assigns
                // assign sticky reviews as pivot #1
                $saveExitPopUp->stickyReviews()->sync($request->select_sticky_reviews);
                //assign campaign
                $find_update_campaign = Campaign::where('id', $request->select_active_campaign)->update(['exit_pop_up' => '1', 'exit_pop_up_id' => $saveExitPopUp->id]);
                if ($find_update_campaign) {
                    DB::commit();
                    return response()->json([
                        'status' => true,
                        'message' => 'Successfully saved record!'
                    ], 200);
                } else {
                    return response()->json([
                        'status' => false,
                        'message' => 'Unable to assign to a campaign. Not campaign found'
                    ], 404);
                }
            } else {
                DB::rollBack();
                return response()->json([
                    'status' => false,
                    'message' => 'Unable to store record in database, Internal Server Error!'
                ], 500);
            }
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => "Oops! Something went wrong in server. Please try again later.",
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * update exit pop up
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function postUpdateExitPopUp(Request $request)
    {
        if (is_integer($this->isAuthenticated())) {
            if ($request->has('id')) {
                try {
                    $search_exit_pop_up = ExitPopUp::where('id', $request->id)->update([
                        'created_by'                => $request->created_by,
                        'name'                      => $request->name,
                        'header_text'               => $request->header_text,
                        'header_background_color'   => $request->header_background_color,
                        'header_text_color'         => $request->header_text_color,
                        'semi_header_text'          => strlen($request->semi_header_text) ? $request->semi_header_text : null,
                        'semi_header_text_color'    => strlen($request->semi_header_text) ? $request->semi_header_text_color : null,
                        'body_background_color'     => $request->body_background_color,
                        'cta_link_url'              => $request->cta_link_url,
                        'campaign_id'               => $request->select_active_campaign,
                        'btn_size'                  => $request->btn_size,
                        'btn_text'                  => $request->btn_text,
                        'btn_color'                 => $request->btn_color,
                        'btn_text_color'            => $request->btn_text_color
                    ]);
                    if ($search_exit_pop_up) {
                        // pivot assigns
                        // assign sticky reviews as pivot #1
                        $exit_pop_up = ExitPopUp::findOrFail($request->id);
                        $exit_pop_up->stickyReviews()->sync($request->select_sticky_reviews);
                        //assign campaign
                        $find_update_campaign = Campaign::where('id', $request->select_active_campaign)->update(['exit_pop_up' => '1', 'exit_pop_up_id' => $request->id]);
                        return response()->json([
                            'status' => true,
                            'message' => 'Successfully updated the record!'
                        ], 200);
                    } else {
                        return response()->json([
                            'status' => false,
                            'message' => 'Internal server error.'
                        ], 500);
                    }
                } catch (\Exception $e) {
                    return response()->json([
                        'status' => false,
                        'message' => "Oops! Something went wrong in server. Please try again later.",
                        'message' => $e->getMessage()
                    ], 500);
                }
            } else {
                return response()->json([
                    'status' => false,
                    'message' => 'Missing expected params. Hint: id.'
                ], 400);
            }
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Failed to authenticate. Please login again to continue!'
            ], 403);
        }
    }

    /**
     * Delete exit pop up from db (soft delete)
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function postDeleteExitPopUp(Request $request)
    {
        if (is_integer($this->isAuthenticated())) {
            if ($request->has('id')) {
                try {
                    $find_exit_pop_up = ExitPopUp::findOrFail($request->id);
                    if ($find_exit_pop_up->delete()) {
                        return response()->json([
                            'status' => true,
                            'message' => 'Successfully deleted record!'
                        ], 200);
                    } else {
                        return response()->json([
                            'status' => false,
                            'message' => 'Failed to delete the record! Internal server error.'
                        ], 500);
                    }
                } catch (\Exception $e) {
                    return response()->json([
                        'status' => false,
                        'message' => "Oops! Something went wrong in server. Please try again later.",
                        'message' => $e->getMessage()
                    ], 500);
                }
            } else {
                return response()->json([
                    'status' => false,
                    'message' => 'Missing expected params. Hint: id.'
                ], 400);
            }
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Failed to authenticate. Please login again to continue!'
            ], 403);
        }
    }

    /**
     * Fetch all the records of stored review links
     *
     * @param string $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAllReviewLinks($id = null)
    {
        if ($id) {
            try {
                $review_links = ReviewLink::where('url_slug', $id)->with('campaign')->first();
                if ($review_links) {
                    return response()->json([
                        'status' => true,
                        'message' => 'Fetched all review links',
                        'data' => $review_links
                    ], 200);
                } else {
                    return response()->json([
                        'status' =>false,
                        'message' => 'Sorry no records found!',
                        'data'=> []
                    ], 200);
                }
            } catch (\Exception $e) {
                return response()->json([
                    'status' => false,
                    'message' => "Oops! Something went wrong in server. Please try again later.",
                    'errors' => [$e->getMessage()]
                ], 500);
            }
        } else {
            if (is_integer($this->isAuthenticated())) {
                try {
                    $review_links = ReviewLink::where('created_by', $this->isAuthenticated())->orderBy('created_at', 'desc')->with('campaign')->get();
                    if ($review_links) {
                        return response()->json([
                            'status' => true,
                            'message' => 'Fetched all review links',
                            'data'  =>  $review_links
                        ], 200);
                    } else {
                        return response()->json([
                            'status' => true,
                            'message' => 'Sorry no records found!'
                        ], 404);
                    }
                } catch (\Exception $e) {
                    return response()->json([
                        'status' => false,
                        'message' => "Oops! Something went wrong in server. Please try again later.",
                        'message' => $e->getMessage()
                    ], 500);
                }
            } else {
                return response()->json([
                    'status' => false,
                    'message' => 'Failed to authenticate. Please login again to continue!'
                ], 403);
            }
        }
    }

    /**
     * check for duplicate url slug
     *
     *  @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function postCheckDuplicateReviewLink(Request $request)
    {
        if (is_integer($this->isAuthenticated())) {
            try {
                if ($request->has('url_slug')) {
                    $search_url_slug = ReviewLink::where('url_slug', $request->url_slug)->first();
                    if ($search_url_slug) {
                        return response()->json([
                            'status' => false,
                            'message' => 'This url slug is not available try to use another one'
                        ], 403);
                    } else {
                        return response()->json([
                            'status' => true,
                            'message' => 'You can use this url slug, its available'
                        ], 200);
                    }
                } else {
                    return response()->json([
                        'status' => false,
                        'message' => 'Missing expected param(s)!'
                    ], 400);
                }
            } catch (\Exception $e) {
                return response()->json([
                    'status' => false,
                    'message' => "Oops! Something went wrong in server. Please try again later.",
                    'message' => $e->getMessage()
                ], 500);
            }
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Failed to authenticate. Please login again to continue!'
            ], 403);
        }
    }

    /**
     * this function creates a review link for the users
     * @param  ReviewLinkRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function postCreateReviewLink(ReviewLinkRequest $request)
    {
        try {
            /* get the extension */
            $extension = $request->file('myLogo')->getClientOriginalExtension();
            /* rename the file to store in db */
            $fileNameToStore = 'emv_logo_' . time() . '.' . $extension;
            $img = Image::make($request->file('myLogo'))
                ->resize(64, 64)
                ->save('uploads/sticky-review-images/' . $fileNameToStore);
            if ($img) {
                $create_review_link                                 = new ReviewLink();
                $create_review_link->logo                           = $fileNameToStore;
                $create_review_link->name                           = $request->name;
                $create_review_link->description                    = $request->description;
                $create_review_link->url_slug                       = $request->url_slug;
                $create_review_link->campaign_id                    = $request->has('campaign_id') && $request->campaign_id != null ? $request->campaign_id : null;
                $create_review_link->auto_approve                   = $request->has('auto_approve') || $request->auto_approve != null ? $request->auto_approve : 0;
                $create_review_link->min_rating                     = $create_review_link->auto_approve == 1 ? $request->min_rating : null;
                $create_review_link->negative_info_review_msg_1     = $request->negative_info_review_msg_1;
                $create_review_link->negative_info_review_msg_2     = $request->negative_info_review_msg_2;
                $create_review_link->positive_review_msg            = $request->positive_review_msg;
                $create_review_link->created_by                     = $request->created_by;
                if ($create_review_link->save()) {
                    return response()->json([
                        'status' => true,
                        'message' => 'Successfully saved review link'
                    ], 200);
                } else {
                    return response()->json([
                        'status' => false,
                        'message' => 'Something went wrong while saving the data. Please try again later!'
                    ], 500);
                }
            } else {
                return response()->json([
                    'status' => false,
                    'message' => 'Failed to upload the logo. Please try again later!'
                ], 500);
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => "Oops! Something went wrong in server. Please try again later.",
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * This function helps to update the review link in db
     *
     * @param  ReviewLinkRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function postUpdateReviewLink(ReviewLinkRequest $request)
    {
        if (is_integer($this->isAuthenticated())) {
            if ($request->has('id')) {
                if ($request->hasFile('myLogo')) {
                    try {
                        /* get the extension */
                        $extension = $request->file('myLogo')->getClientOriginalExtension();
                        /* rename the file to store in db */
                        $fileNameToStore = 'emv_logo_' . time() . '.' . $extension;
                        $img = Image::make($request->file('myLogo'))
                            ->resize(64, 64)
                            ->save('uploads/sticky-review-images/' . $fileNameToStore);
                    } catch (\Exception $e) {
                        return response()->json([
                            'status' => false,
                            'message' => "Oops! Something went wrong in server. Please try again later.",
                            'message' => $e->getMessage()
                        ], 500);
                    }
                }
                /* if image does not exist ie. user does not want to change image */
                try {
                    if ($request->hasFile('myLogo') && $img) {
                        // for image name to update
                        $findReviewLink = ReviewLink::where('id', $request->id)
                            ->update([
                                'logo' => $fileNameToStore,
                                'name' => $request->name,
                                'description' => $request->description,
                                'url_slug' => $request->url_slug,
                                'campaign_id' => $request->has('campaign_id') && $request->campaign_id != null ? $request->campaign_id : null,
                                'auto_approve' => $request->has('auto_approve') || $request->auto_approve != null ? $request->auto_approve : 0,
                                'min_rating' => $request->auto_approve == 1 ? $request->min_rating : null,
                                'negative_info_review_msg_1' => $request->negative_info_review_msg_1,
                                'negative_info_review_msg_2' => $request->negative_info_review_msg_2,
                                'positive_review_msg' => $request->positive_review_msg,
                                'created_by' => $request->created_by
                            ]);
                    } else {
                        $findReviewLink = ReviewLink::where('id', $request->id)
                            ->update([
                                'name' => $request->name,
                                'description' => $request->description,
                                'url_slug' => $request->url_slug,
                                'campaign_id' => $request->has('campaign_id') && $request->campaign_id != null ? $request->campaign_id : null,
                                'auto_approve' => $request->has('auto_approve') || $request->auto_approve != null ? $request->auto_approve : 0,
                                'min_rating' => $request->auto_approve == 1 ? $request->min_rating : null,
                                'negative_info_review_msg_1' => $request->negative_info_review_msg_1,
                                'negative_info_review_msg_2' => $request->negative_info_review_msg_2,
                                'positive_review_msg' => $request->positive_review_msg,
                                'created_by' => $request->created_by
                            ]);
                    }
                    if ($findReviewLink) {
                        return response()->json([
                            'status' => true,
                            'message' => 'Successfully updated the record!'
                        ], 200);
                    } else {
                        return response()->json([
                            'status' => false,
                            'message' => 'Failed while updating. Please try again after some time.'
                        ], 500);
                    }
                } catch (\Exception $e) {
                    return response()->json([
                        'status' => false,
                        'message' => "Oops! Something went wrong in server. Please try again later.",
                        'message' => $e->getMessage()
                    ], 500);
                }
            } else {
                return response()->json([
                    'status' => false,
                    'message' => 'Missing expected params. Hint: id.'
                ], 400);
            }
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Failed to authenticate. Please login again to continue!'
            ], 403);
        }
    }

    /**
     * delete review link (soft delete)
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function postDeleteReviewLink(Request $request)
    {
        if (is_integer($this->isAuthenticated())) {
            if ($request->has('id')) {
                try {
                    $find_review_link = ReviewLink::findOrFail($request->id);
                    if ($find_review_link) {
                        if ($find_review_link->delete()) {
                            return response()->json([
                                'status' => true,
                                'message' => 'Successfully deleted record!'
                            ], 200);
                        } else {
                            return response()->json([
                                'status' => false,
                                'message' => 'Internal server error!'
                            ], 500);
                        }
                    } else {
                        return response()->json([
                            'status' => true,
                            'message' => 'No results found!'
                        ], 404);
                    }
                } catch (\Exception $e) {
                    return response()->json([
                        'status'   => false,
                        'message' => "Oops! Something went wrong in server. Please try again later.",
                        'message' => $e->getMessage()
                    ], 500);
                }
            } else {
                return response()->json([
                    'status' => false,
                    'message' => 'Missing expected params. Hint: id.'
                ], 400);
            }
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Failed to authenticate. Please login again to continue!'
            ], 403);
        }
    }

    /**
     * this function attaches review link with the campaign
     * @param null $campaign_id_arr
     * @param null $reviewLinkId
     * @return boolean
     */
    public function assignReviewLinkToCampaign($campaign_id_arr = null, $reviewLinkId = null)
    {
        if (is_integer($this->isAuthenticated()) && count($campaign_id_arr) && $reviewLinkId) {
            try {
                $findReviewLink = ReviewLink::find($reviewLinkId);
                if ($findReviewLink) {
                    if ($findReviewLink->campaigns()->sync($campaign_id_arr)) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            } catch (\Exception $e) {
                return false;
            }
        } else {
            return false;
        }
    }

    /**
     * Store sticky reviews in db coming from user review
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function postSaveUserReview(Request $request)
    {
        // would you like to recommend us is true
        if ($request->step1 === 'true') {
            // show in web is true
            if ($request->step3 === 'true') {
                    if ($request->hasFile('imageData')) {
                        $extension = $request->file('imageData')->getClientOriginalExtension();
                        $fileNameToStore = 'emv_' . time() . '.' . $extension;
                        $img = Image::make($request->file('imageData'))
                                ->resize(64, 64)
                                ->save('uploads/sticky-review-images/' . $fileNameToStore);
                    } else {
                        $fileNameToStore = 'reviews_default.png';
                        $img = true;
                    }
                if ($img) {
                    $step2 = json_decode($request->step2, true);
                    if (StickyReview::storeStickyReview(
                        $request->created_by,
                        $step2['review_title'],
                        $step2['description'],
                        $fileNameToStore,
                        $step2['rating'],
                        3,
                        $request->review_link_id
                    )) {
                        return response()->json([
                            'status' => true,
                            'message' => 'Successfully saved record!'
                        ],200);
                    } else {
                        return response()->json([
                            'status' => false,
                            'message' => 'Failed to store data! Please try again later'
                        ],500);
                    }
                } else {
                    return response()->json([
                        'status' => false,
                        'message' => 'Failed to store image! Please try again later'
                    ],500);
                }
            } else {
                // show in web false
                if (StickyReview::storeStickyReview(
                    $request->created_by,
                    json_decode($request->step2, true)['review_title'],
                    json_decode($request->step2, true)['description'],
                    'reviews_default.png',
                    json_decode($request->step2, true)['rating'],
                    2,
                    $request->review_link_id
                )) {
                    return response()->json([
                        'status' => true,
                        'message' => 'Successfully saved record!'
                    ],200);
                } else {
                    return response()->json([
                        'status' => false,
                        'message' => 'Failed to store data! Please try again later'
                    ],500);
                }
            }
        } else {
            // recommend us false
            $review_id = StickyReview::storeStickyReview(
                $request->created_by,
                json_decode($request->step2, true)['review_title'],
                json_decode($request->step2, true)['description'],
                'reviews_dislike.png',
                json_decode($request->step2, true)['rating'],
                4,
                $request->review_link_id
            );
            if ($review_id) {
                if (NegativeReview::storeNegativeReview($review_id, json_decode($request->step3, true)['email'], json_decode($request->step3, true)['phone_number'])) {
                    return response()->json([
                        'status' => true,
                        'message' => 'Successfully saved record!'
                    ],200);
                } else {
                    return response()->json([
                        'status' => false,
                        'message' => 'Failed to store data! Please try again later'
                    ],500);
                }
            } else {
                return response()->json([
                    'status' => false,
                    'message' => 'Failed to store data! Please try again later'
                ],500);
            }
        }
    }

    /**
     * this function query a particular campaign from database with uniqueid
     * @param null $uniqueId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getParticularCampaign($uid = null)
    {
        if ($uid) {
            try {
                $findCampaign = Campaign::where('unique_script_id', $uid)
                    ->with('stickyReviews', 'brandingDetails', 'exitPopUp')
                    ->orderBy('created_at', 'desc')
                    ->first();
                if ($findCampaign) {
                    return response()->json([
                        'status' => true,
                        'message' => $findCampaign
                    ], 200);
                } else {
                    return response()->json([
                        'status' => true,
                        'message' => 'Did not able to find any campaign. Please check the id'
                    ], 404);
                }
            } catch (\Exception $e) {
                return response()->json([
                    'status' => false,
                    'message' => "Oops! Something went wrong in server. Please try again later.",
                    'message' => $e->getMessage()
                ], 500);
            }
        } else {
            return response()->json([
                'status' => false,
                'message' => 'No id found!'
            ], 400);
        }
    }
}