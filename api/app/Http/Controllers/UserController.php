<?php

namespace App\Http\Controllers;

use App\Exceptions\HttpBadRequestException;
use App\Http\Requests\UserPasswordRequest;
use App\Http\Requests\UserProfileRequest;
use App\Http\Resources\UserResource;

use App\UserZapierTokens;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Get the authenticated User
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        return response()->json([
            'status' => true,
            'message' => "User's info fetched successfully.",
            'data' => new UserResource(Auth::user()),
        ]);
    }

    /**
     * Update the authenticated user's profile info
     *
     * @param  \App\Http\Resources\UserProfileRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(UserProfileRequest $request)
    {
        $user = Auth::user();
        $user->name = $request->has('name') ? $request->input('name') : $user->name;
        $user->email = $request->has('email') ? $request->input('email') : $user->email;
        if ($request->has('image')) {
            $user->image = $request->file('image');
        }
        $user->update();

        return response()->json([
            'status' => true,
            'message' => "Your profile info has updated successfully.",
            'data' => [
                'user' => new UserResource($user),
            ],
        ]);
    }

    /**
     * Update authenticated user's password
     *
     * @param \App\Http\Resources\UserPasswordRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updatePassword(UserPasswordRequest $request)
    {
        $user = Auth::user();

        if (Hash::check($request->input('current_password'), $user->password)) {
            $user->update(['password' => $request->input('new_password')]);

            $user->sendPasswordUpdatedNotification();
            // revoke user token
            $user->token()->revoke();
            return response()->json([
                'status' => true,
                'message' => "Your password has updated successfully.",
                'data' => [
                    'user' => new UserResource($user),
                ],
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => "Current password is invalid.",
            ], 400);
        }
    }

    /**
     * Function to create user zapier token
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function createUserZapierToken(Request $request) {
        // check for existing token
        $user = Auth::user();
        $getTokenInfo = UserZapierTokens::where('created_by',$user->id)->get();

        if(count($getTokenInfo) != 0){
            return response()->json([
                'data' => [
                    'http_code' => 200,
                    'status' => false,
                    'message' => "Please delete the existing token to create a new token.",
                ],
            ]);
        }

        if($request->tokenName != ''){

            $token = $this->generateRandomString(61);
            $storeToken = new UserZapierTokens();
            $storeToken->created_by = $user->id;
            $storeToken->token_name = $request->tokenName;
            $storeToken->token = $token;
            if($storeToken->save()){
                return response()->json([
                    'data' => [
                        'status' => true,
                        'message' => "Zapier token created succesfully.",
                        'data' => $storeToken,
                        'http_code' => 200,
                        ],
                    ]);
            } else {
                return response()->json([
                    'data' => [
                        'status' => true,
                        'message' => "Zapier token not created !",
                        'data' => $storeToken,
                        'http_code' => 200,
                    ],
                ]);
            }
        } else {
            // sorry u can't create zapier token
            return response()->json([
                'data' => [
                    'http_code' => 200,
                    'status' => false,
                    'message' => "Oops! Something went wrong in server. Please try again later.",
                ],
            ]);
        }
    }

    /**
     * Function to generate zapier token
     * @param $length
     * @return string
     */
    function generateRandomString($length) {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }

    /**
     * Function to delete user zapier token
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteUserZapierToken($id){
            if($id != ''){
                try{
                    $zapierToken = UserZapierTokens::where('id', $id)->firstOrFail();
                    $zapierToken->delete();
                    return response()->json([
                        'data' => [
                            'http_code' => 200,
                            'status' => true,
                            'message' => 'Zapier token deleted successfully.',
                        ],
                    ]);
                }catch (HttpBadRequestException $e) {
                    return response()->json([
                        'data' => [
                            'http_code' => 200,
                            'status' => false,
                            'message' => $e->getMessage(),
                        ],
                    ]);
                } catch (ModelNotFoundException $e) {
                    return response()->json([
                        'data' => [
                            'http_code' => 200,
                            'status' => false,
                            'message' => "Zapier token not found.",
                        ],
                    ]);
                } catch (Exception $e) {
                    return response()->json([
                        'data' => [
                            'http_code' => 200,
                            'status' => false,
                            'message' => "Oops! Something went wrong in server. Please try again later.",
                            'payload' => [
                                'error' => $e->getMessage(),
                                'trace' => $e->getTrace(),
                            ],
                        ],
                    ]);
                }

            }else{
                return response()->json([
                    'data' => [
                        'http_code' => 200,
                        'status' => false,
                        'message' => "Oops! Something went wrong in server. Please try again later.",
                    ],
                ]);
            }
    }

    public function getUserZapierToken() {
        $user = Auth::user();
        $getTokenInfo = UserZapierTokens::where('created_by',$user->id)->get();
            return response()->json([
                'data' => [
                    'data' => $getTokenInfo,
                    'http_code' => 200,
                    'status' => true,
                    'message' => "User zapier token retrive.",
                ],
            ]);
    }
}
