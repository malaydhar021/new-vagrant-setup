<?php

namespace App\Http\Controllers;

use App\Exceptions\HttpBadRequestException;
use App\Http\Requests\SubscriptionRequest;
use App\Http\Resources\SubscriptionResource;

use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class SubscriptionController extends Controller
{
    /**
     * Allowed plan names
     *
     * @var array
     */
    private $allowedPlanNames;

    /**
     * SubscriptionController Constructor
     */
    public function __construct()
    {
        $this->allowedPlanNames = array_keys(config('pricing.plans'));
    }

    /**
     * Get the subscription info of the authenticated user.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        if(Auth::user()->subscription_status !== 'ACTIVE' && Auth::user()->subscription_status !== 'NA') {
            return response()->json([
                'status' => true,
                'message' => "Your account does not have any active subscription plan. Please contact to support for more details.",
                'subscription' => new SubscriptionResource(Auth::user()),
            ], 401);
        }
        return response()->json([
            'status' => true,
            'message' => "Your subscription info fetched successfully.",
            'subscription' => new SubscriptionResource(Auth::user()),
        ]);
    }

    /**
     * Create a new subscription for the authenticated user.
     *
     * @param  \App\Http\Requests\SubscriptionRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(SubscriptionRequest $request)
    {
        $user = Auth::user();

        $user->subscribeToPlan($request->input('pricing_plan_type'), null, [
            'number' => $request->input('card_number'),
            'exp_month' => $request->input('expiry_month'),
            'exp_year' => $request->input('expiry_year'),
            'cvc' => $request->input('cvc_number'),
        ], true);

        return response()->json([
            'status' => true,
            'message' => "You have successfully subscribed to "
                . config('pricing.plans.' . $user->pricing_plan . '.alias') . " plan.",
            'subscription' => new SubscriptionResource($user),
        ]);
    }

    /**
     * Change the active subscription plan for the authenticated user.
     *
     * @param  \App\Http\Requests\SubscriptionRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(SubscriptionRequest $request)
    {
        $user = Auth::user();
        if($user->is_active == 1){
          return response()->json([
            'status' => false,
            'message' => "Your account is not active, Please contact your sales person or Tier5 partner.",
            'errors' => []
          ],400);
        }

        $currentPlan = array_search($user->pricing_plan, $this->allowedPlanNames);
        $newPlan = array_search($request->input('pricing_plan_type'), $this->allowedPlanNames);
        $wannaDowngrade = $currentPlan > $newPlan;

        $newPlanPrivileges = config('pricing.plans.' . $request->input('pricing_plan_type') . '.privileges');

        if ($wannaDowngrade) {
            if ($user->is_third_party) {
                return response()->json([
                    'status' => false,
                    'message' => "You are not allowed to downgrade. Please contact your sales person or Tier5 partner.",
                    'requested_action' => 'downgrade',
                    'card_required' => false,
                    'errors' => []
                ],400);
            }

            $limitExceeds = [];
            if (($newPlanPrivileges['brands'] !== -1) && ($user->brands_count > $newPlanPrivileges['brands'])) {
                $limitExceeds['brands'] = $user->brands_count - $newPlanPrivileges['brands'];
            }
            if (($newPlanPrivileges['campaigns'] !== -1) &&
                ($user->campaigns_count > $newPlanPrivileges['campaigns'])) {
                $limitExceeds['campaigns'] = $user->campaigns_count - $newPlanPrivileges['campaigns'];
            }
            if (($newPlanPrivileges['review-links'] !== -1) &&
                ($user->review_links_count > $newPlanPrivileges['review-links'])) {
                $limitExceeds['review-links'] = $user->review_links_count - $newPlanPrivileges['review-links'];
            }
            if (($newPlanPrivileges['sticky-reviews'] !== -1) &&
                ($user->sticky_reviews_count > $newPlanPrivileges['sticky-reviews'])) {
                $limitExceeds['sticky-reviews'] = $user->sticky_reviews_count - $newPlanPrivileges['sticky-reviews'];
            }
            if (($newPlanPrivileges['exit-popups'] !== -1) &&
                ($user->exit_popups_count > $newPlanPrivileges['exit-popups'])) {
                $limitExceeds['exit-popups'] = $user->exit_popups_count - $newPlanPrivileges['exit-popups'];
            }

            if (! empty($limitExceeds)) {
                $exceedMessages = [];
                foreach ($limitExceeds as $unit => $exceed) {
                    $exceedMessages[] = "You need to delete " . $exceed . " "
                        . ucwords(str_replace('_', ' ', $unit)) . "(s) to be able to downgrade.";
                }

                return response()->json([
                    'status' => false,
                    'message' => "You can not downgrade at the moment, to downgrade please consider followings.",
                    'requested_action' => 'downgrade',
                    'card_required' => false,
                    'errors' => $exceedMessages,
                ],400);
            }
        }

        if (!$wannaDowngrade && $user->is_third_party && !$user->card_last_four) {
            // Wanna upgrade but don't have card info
            return response()->json([
                'status' => false,
                'message' => "Before upgrading your subscription you need to provide your card details.",
                'requested_action' => 'upgrade',
                'card_required' => true,
                'errors' => []
            ], 400);
        } else {
            $user->changeSubscriptionPlan($request->input('pricing_plan_type'));
            // call the API depending on the affiliate_id and if the sale id is null/recording the sale in affiliate platform
            if($user->affiliate_id != null && $user->sale_id == null ){
                $this->CallAffiliateAction(1, $user, $request->input('pricing_plan_type'));
            }
            // call the API for update the sails in affiliate platform
            if($user->affiliate_id != null && $user->sale_id != null ){
                $this->CallAffiliateAction(2, $user, $request->input('pricing_plan_type'));
            }
        }

        return response()->json([
            'status' => true,
            'message' => "You have " . ($wannaDowngrade ? "downgraded" : "upgraded")
                . " successfully to " . config('pricing.plans.' . $user->pricing_plan . '.alias') . " plan.",
            'subscription' => new SubscriptionResource($user),
        ]);
    }

    /**
     * Cancel the active subscription for the authenticated user.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Request $request)
    {
        if (! $request->has('reason')) throw new HttpBadRequestException("Reason is required.");

        $user = Auth::user();
        $user->cancelSubscription($request->input('reason'), $request->input('description'));
        // call Affiliate Api for Deactivate the user
        if($user->affiliate_id != null && $user->sale_id != null){
            $this->callAffiliateApiForDeactive($user->sale_id, 0);
        }
        return response()->json([
            'status' => true,
            'message' => "You have cancelled your subscription successfully.",
            'subscription' => new SubscriptionResource($user),
        ]);
    }

    /**
     * Call affiliate API for add, update and delete a sale
     * @param $actionType
     * action of the api 1 => add ,2 => update ,3 => active / deactive / cancel
     * @param $user
     * @param $pricingPlanType
     */
    public function CallAffiliateAction($actionType, $user, $pricingPlanType) {
        $getPlanInfo = config('pricing.plans.'.$pricingPlanType); // get all data from the plans config
        if ($getPlanInfo != null) {
            if ($getPlanInfo['type'] == 'recurring') {
                $paymentType = 1;
            } else {
                $paymentType = 0;
            }
            if ($getPlanInfo['trial'] != null) {
                $trialPeriod = $getPlanInfo['trial'];
            } else {
                $trialPeriod = 0;
            }
            $currentDate = Carbon::now();    // getting current date
            /* calling the API with require date */
        }
        $body= [];
        switch ($actionType){
            case 1:
                // some case 1 add body of the request for add a sale
                $body = [
                    'product_name'      => 'Sticky Reviews',
                    'product_id'        =>  6,
                    'ammount'  	 	      =>  $getPlanInfo['amount'],
                    'payment_type' 	    =>  $paymentType,
                    'trial_period' 	    =>  $trialPeriod,
                    'date_registered' 	=>  $currentDate->toDateString(),
                    'affiliateId' 	    =>  $user->affiliate_id,
                    'email' 	          =>  $user->email,
                    'isPaid'            => true,
                    'plan'              => $getPlanInfo['name'],
                ];
            break;

            case 2:
                //some case 2 add body of the request for update a sale
                $body = [
                    'product_name'      => 'Sticky Reviews',
                    'ammount'  	 	      =>  $getPlanInfo['amount'],
                    'payment_type' 	    =>  $paymentType,
                    'saleId' 	          =>  $user->sale_id,
                    'isPaid'            => true,
                    'plan'              => $getPlanInfo['name'],
                ];
             break;
            default:
        }
        // \Log::info("data of Body ". print_r($body,true));
        $client = new \GuzzleHttp\Client();
        $url =  config('app.AFFILIATE_URL');
        // \Log::info('Affiliate url --> '.$url);
        $res = $client->post($url.'/hooks/sales', [  'form_params'=> $body ]);
        if($res->getStatusCode() == 200 && $actionType == 1 ) {
          $response = json_decode($res->getBody());
          $updateUserSaleId = User::find($user->id);
          if ($response->httpCode != 500) {
            if ($updateUserSaleId) {
              $updateUserSaleId->sale_id = $response->payload->saleId;
              $updateUserSaleId->save();
            } else {
              \Log::info("not found the user !");
            }
          } else {
            // error return
            \Log::info("Message from the affiliate ->  " . $response->message);
          }
        } elseif($res->getStatusCode() == 200 && $actionType == 2 ) {
            $response  = json_decode($res->getBody());
            \Log::info('response from the update sales ...  ' .print_r($response,true));
        } else {
            // something went wrong
          \Log::info("response from the update sales -> Invalid action or status code ... ");
        }
    }

    /**
     * Call to affiliate api for active / deactive an user
     * @param $saleId
     * @param $isActive
     */
    public function callAffiliateApiForDeactive($saleId, $isActive) {
        \Log::info("saleId".$saleId. "isActive ".$isActive);
        $client = new \GuzzleHttp\Client();
        $url =  config('app.AFFILIATE_URL');
        if($isActive == 0){
            $isActive = false;
        }else{
            $isActive = true;
        }

        $body = [
            'saleId' 	        =>  $saleId,
            'is_active'       =>  $isActive,
        ];

        $res = $client->post($url.'/hooks/sales', [  'json'=> $body ]);
        if($res->getStatusCode() == 200){
            $response  = json_decode($res->getBody());
            \Log::info('response from the update sales ...  ' .print_r($response,true));
        }else{
            // something went wrong
            \Log::info("Something went wrong !");
        }
    }

    /**
     *
     */
    public function validatePlanPrivileges(Request $request) {
        $user = Auth::user();
        $currentPlan = array_search($user->pricing_plan, $this->allowedPlanNames);
        $newPlan = array_search($request->input('pricing_plan_type'), $this->allowedPlanNames);
        $wannaDowngrade = $currentPlan > $newPlan;

        $newPlanPrivileges = config('pricing.plans.' . $request->input('pricing_plan_type') . '.privileges');

        if ($wannaDowngrade) {
            if ($user->is_third_party) {
                return response()->json([
                    'status' => false,
                    'message' => "You are not allowed to downgrade. Please contact your sales person or Tier5 partner.",
                    'requested_action' => 'downgrade',
                    'card_required' => false,
                    'errors' => []
                ],400);
            }

            $limitExceeds = [];
            if (($newPlanPrivileges['brands'] !== -1) && ($user->brands_count > $newPlanPrivileges['brands'])) {
                $limitExceeds['brands'] = $user->brands_count - $newPlanPrivileges['brands'];
            }
            if (($newPlanPrivileges['campaigns'] !== -1) &&
                ($user->campaigns_count > $newPlanPrivileges['campaigns'])) {
                $limitExceeds['campaigns'] = $user->campaigns_count - $newPlanPrivileges['campaigns'];
            }
            if (($newPlanPrivileges['review-links'] !== -1) &&
                ($user->review_links_count > $newPlanPrivileges['review-links'])) {
                $limitExceeds['review-links'] = $user->review_links_count - $newPlanPrivileges['review-links'];
            }
            if (($newPlanPrivileges['sticky-reviews'] !== -1) &&
                ($user->sticky_reviews_count > $newPlanPrivileges['sticky-reviews'])) {
                $limitExceeds['sticky-reviews'] = $user->sticky_reviews_count - $newPlanPrivileges['sticky-reviews'];
            }
            if (($newPlanPrivileges['exit-popups'] !== -1) &&
                ($user->exit_popups_count > $newPlanPrivileges['exit-popups'])) {
                $limitExceeds['exit-popups'] = $user->exit_popups_count - $newPlanPrivileges['exit-popups'];
            }

            if (! empty($limitExceeds)) {
                $exceedMessages = [];
                foreach ($limitExceeds as $unit => $exceed) {
                    $exceedMessages[] = "You need to delete " . $exceed . " "
                        . ucwords(str_replace('_', ' ', $unit)) . "(s) to be able to downgrade.";
                }

                return response()->json([
                    'status' => false,
                    'message' => "You can not downgrade at the moment, to downgrade please consider followings.",
                    'requested_action' => 'downgrade',
                    'card_required' => false,
                    'errors' => $exceedMessages,
                ],400);
            }
        }
        return response()->json([
            'status' => true,
            'message' => "You are good to downgrade your plan",
            'requested_action' => 'downgrade'
        ]);
    }

}
