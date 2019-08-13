<?php

namespace App\Http\Controllers;

use App\Exceptions\HttpBadRequestException;
use App\User;
use App\Subscription;
use Exception;

use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use App\Traits\Subscription as StripeSubscription;

class ThirdPartyWebhooksController extends Controller
{
    /**
     * Create the user
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        try {
            if (! $request->has('email') || ! $request->input('email')) {
                throw new HttpBadRequestException("'email' is required.");
            }
            if (!$request->has('name') || !$request->input('name')) {
                throw new HttpBadRequestException("'name' is required.");
            }
            if (!$request->has('plan') || !$request->input('plan')) {
                throw new HttpBadRequestException("'plan' is required.");
            } else {
                if ($request->input('plan') < 1 || $request->input('plan') > 3) {
                    throw new HttpBadRequestException("'plan' should be one of 1, 2 or 3");
                }
            }
            if (!$request->has('aid') || !$request->input('aid')) {
                throw new HttpBadRequestException("'aid' is required.");
            }

            $user = User::whereEmail(trim($request->input('email')))->first();

            if ($user) {
                return response()->json([
                    'data' => [
                        'http_code' => 200,
                        'status' => false,
                        'message' => "The email '{$request->input('email')}' has already registered. " .
                            "Please use a different email or login to access the platform.",
                    ],
                ]);
            } else {
                $user = new User();
                $user->name = $request->input('name');
                $user->email = $request->input('email');
                $user->password = 123456;
                $user->pricing_plan = $request->input('plan');
                $user->subscription_status = 'ACTIVE';
                $user->api_token = md5(uniqid(rand(999999999, 9999999999), true));
                $user->is_third_party = true;

                if ($request->has('aid'))
                    $user->affiliate_id = $request->input('aid');

                if ($user->save()) {
                    return response()->json([
                        'data' => [
                            'http_code' => 200,
                            'status' => true,
                            'message' => "Successfully created the user. Default password is 123456.",
                            'payload' => [
                                'email' => $request->input('email'),
                                'password' => 123456,
                            ],
                        ],
                    ]);
                }
            }
        } catch (HttpBadRequestException $e) {
            return response()->json([
                'data' => [
                    'http_code' => 200,
                    'status' => false,
                    'message' => $e->getMessage(),
                ],
            ]);
        } catch (Exception $e) {
            return response()->json([
                'data' => [
                    'http_code' => 200,
                    'status' => false,
                    'message' => "Oops! Something went wrong. Please try again later.",
                    'payload' => [
                        'error' => array_key_exists(2, $e->errorInfo) ? $e->errorInfo[2] : $e->getMessage(),
                        'trace' => $e->getTrace(),
                    ],
                ],
            ]);
        }
    }

    /**
     * Delete the user
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Request $request)
    {
        try {
            if (!$request->has('email') || !$request->input('email')) {
                throw new HttpBadRequestException("'email' is required.");
            }


            $user = User::where('email', $request->input('email'))->firstOrFail();

            if($user->affiliate_id != null &&  $user->sale_id != null){
                $this->callAffiliateApiForDeactive($user->sale_id, false);
            }

            $user->delete();

            return response()->json([
                'data' => [
                    'http_code' => 200,
                    'status' => true,
                    'message' => 'Successfully deleted the user.',
                ],
            ]);
        } catch (HttpBadRequestException $e) {
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
                    'message' => "No user found with the email '{$request->input('email')}'.",
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
    }

    /**
     * Alter the user's status as active/inactive
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function alterStatus(Request $request)
    {
        try {
            if (!$request->has('email') || !$request->input('email')) {
                throw new HttpBadRequestException("'email' is required.");
            }
            if (!$request->has('suspend') || !strlen(trim($request->input('suspend')))) {
                throw new HttpBadRequestException("'suspend' is required.");
            } else {
                if ($request->input('suspend') != 0 && $request->input('suspend') != 1) {
                    throw new HttpBadRequestException("'suspend' should be 0 or 1.");
                }
            }

            $user = User::where('email', $request->input('email'))->first();

            if($request->input('suspend') == 0 ){
              if($user->stripe_id != null) {
                $reason = 'Suspended';
                $description = 'Suspended using the third party webhook';
                $user->cancelSubscription($reason, $description);
                $user->card_brand = null;
                $user->card_last_four = null;
                $user->card_exp_month = null;
                $user->card_exp_year = null;
              }
              $user->subscription_status = 'TERMINATED';
              $user->is_active = $request->input('suspend') ? "0" : "1";
              $user->update();
            } else {
              if($user->stripe_id != null){
                return response()->json([
                  'data' => [
                    'http_code' => 200,
                    'status' => true,
                    'message' => "Sorry this user cannot be Unsuspend.",
                  ]
                ]);
              }
              $user->subscription_status = 'ACTIVE';
              $user->is_active = $request->input('suspend') ? "0" : "1";
              $user->update();
            }

            $status = $user->is_active ? "deactived" : "actived";
            return response()->json([
                'data' => [
                    'http_code' => 200,
                    'status' => true,
                    'message' => "User login ${status} successfully.",
                ]
            ]);
        } catch (HttpBadRequestException $e) {
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
                    'message' => "No user found with the email '{$request->input('email')}'.",
                ],
            ]);
        } catch (Exception $e) {
            return response()->json([
                'data' => [
                    'http_code' => 200,
                    'status' => true,
                    'message' => "Oops! Something went wrong in server. Please try again later.",
                    'payload' => [
                        'error' => $e->getMessage(),
                        'trace' => $e->getTrace(),
                    ],
                ],
            ]);
        }
    }

    /**
     * Call to affiliate api for active / deactive an user
     * @param $saleId
     * @param $isActive
     */
    public function callAffiliateApiForDeactive($saleId, $isActive) {
        $client = new \GuzzleHttp\Client();
        $body = [
            'saleId' 	        =>  $saleId,
            'is_active'         =>  $isActive,
        ];
        $res = $client->post('https://api-affiliate.tier5.us/hooks/sales', [  'json'=> $body ]);
        if($res->getStatusCode() == 200){
            $response  = json_decode($res->getBody());
             \Log::info('response from the update sales ...  ' .print_r($response,true));
        }else{
            // something went wrong
            \Log::info("Something went wrong !");
        }
    }
}
