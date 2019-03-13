<?php

namespace App\Http\Controllers;

use App\Exceptions\HttpBadRequestException;
use App\Http\Requests\SubscriptionRequest;
use App\Http\Resources\SubscriptionResource;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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

        $currentPlan = array_search($user->pricing_plan, $this->allowedPlanNames);
        $newPlan = array_search($request->input('pricing_plan_type'), $this->allowedPlanNames);
        $wannaDowngrade = $currentPlan > $newPlan;

        $newPlanPriviledges = config('pricing.plans.' . $request->input('pricing_plan_type') . '.privileges');

        if ($wannaDowngrade) {
            if ($user->is_third_party) {
                return response()->json([
                    'status' => false,
                    'message' => "You are not allowed to downgrade. Please contact your sales person or Tier5 partner.",
                    'requested_action' => 'downgrade',
                    'card_required' => false,
                ]);
            }

            $limitExceeds = [];
            if ($user->brands_count > $newPlanPriviledges['brands']) {
                $limitExceeds['brands'] = $user->brands_count - $newPlanPriviledges['brands'];
            }
            if ($user->campaigns_count > $newPlanPriviledges['campaigns']) {
                $limitExceeds['campaigns'] = $user->campaigns_count - $newPlanPriviledges['campaigns'];
            }
            if ($user->review_links_count > $newPlanPriviledges['review-links']) {
                $limitExceeds['review-links'] = $user->review_links_count - $newPlanPriviledges['review-links'];
            }
            if ($user->sticky_reviews_count > $newPlanPriviledges['sticky-reviews']) {
                $limitExceeds['sticky-reviews'] = $user->sticky_reviews_count - $newPlanPriviledges['sticky-reviews'];
            }
            if ($user->exit_popups_count > $newPlanPriviledges['exit-popups']) {
                $limitExceeds['exit-popups'] = $user->exit_popups_count - $newPlanPriviledges['exit-popups'];
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
                    'steps_required' => $exceedMessages,
                ]);
            }
        }

        if (!$wannaDowngrade && $user->is_third_party) {    // Wanna upgrade but don't have card info
            return response()->json([
                'status' => false,
                'message' => "Before upgrading your subscription you need to provide your card details.",
                'requested_action' => 'upgrade',
                'card_required' => true,
            ]);
        } else {
            $user->changeSubscriptionPlan($request->input('pricing_plan_type'));
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

        return response()->json([
            'status' => true,
            'message' => "You have cancelled your subscription successfully.",
            'subscription' => new SubscriptionResource($user),
        ]);
    }
}
