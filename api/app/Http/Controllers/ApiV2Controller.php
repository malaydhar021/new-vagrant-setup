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