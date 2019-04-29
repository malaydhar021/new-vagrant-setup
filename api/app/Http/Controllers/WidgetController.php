<?php

namespace App\Http\Controllers;

use App\Campaign;
use App\Exceptions\PrivilegeViolationException;
use App\Http\Requests\SubscribedEmailRequest;
use App\Http\Resources\WidgetResource;
use App\SubscribedEmail;

use Illuminate\Http\Request;

class WidgetController extends Controller
{
    /**
     * Get the widget details
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $usid
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request, $usid)
    {
        $campaign = Campaign::where('unique_script_id', $usid)
            ->with('campaignStyle', 'exitPopUp', 'brandingDetails', 'stickyReviews', 'user')
            ->firstOrFail();

        if ($campaign->user->subscription_status == 'CANCELLED' ||
            $campaign->user->subscription_status == 'TERMINATED'
        ) {
            throw new PrivilegeViolationException("Your action is forbidden.");
        }

        return response()->json([
            'status' => true,
            'message' => "Widget details fetched successfully.",
            'data' => new WidgetResource($campaign),
        ]);
    }

    /**
     * Store postback information from widget
     *
     * @param  \App\Http\Requests\SubscribedEmailRequest
     * @param  string  $usid
     * @return \Illuminate\Http\JsonResponse
     */
    public function postback(SubscribedEmailRequest $request, $usid)
    {
        $subscribedEmail = new SubscribedEmail();
        $subscribedEmail->email = $request->input('email');
        $subscribedEmail->exit_pop_up_id = $request->input('exit_popup_id');
        $subscribedEmail->save();

        return response()->json([
            'status' => true,
            'message' => "Thanks for subscribing.",
        ]);
    }
}
