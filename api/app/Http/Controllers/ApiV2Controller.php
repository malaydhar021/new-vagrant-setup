<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;

class ApiV2Controller extends Controller
{
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
                    ]);
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
                        ]);
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
                ]);
            }
        } else {
            return response()->json([
                'data' => [
                    'http_code' => 200,
                    'status' => false,
                    'message' => 'Missing expected param!'
                ]
            ]);
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
                        ]);
                    } else {
                        return response()->json([
                            'data' => [
                                'http_code' => 200,
                                'status' => false,
                                'message' => 'Something went wrong while deleting the record!'
                            ],
                        ]); // for zapier its 200 the error code. Dont change in future then it will break the system
                    }
                } else {
                    return response()->json([
                        'data' => [
                            'http_code' => 200,
                            'status' => false,
                            'message' => 'No Records found with the email '. $request->email
                        ],
                    ]);
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
                ]);
            }
        } else {
            return response()->json([
                'data' => [
                    'http_code' => 200,
                    'status' => false,
                    'message' => 'Missing expected param!',
                ]
            ]);
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
                    ]);
                } else {
                    return response()->json([
                        'data' => [
                            'http_code' => 200,
                            'status' => false,
                            'message' => 'Something went wrong while updating the record!',
                        ],
                    ]);
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
                ]);
            }
        } else {
            return response()->json([
                'data' => [
                    'http_code' => 200,
                    'status' => false,
                    'message' => 'Missing expected param!',
                ]
            ]);
        }
    }
}
