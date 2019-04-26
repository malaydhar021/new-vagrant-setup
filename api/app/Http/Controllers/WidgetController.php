<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Campaign;
use App\Http\Resources\WidgetResource;

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

        return response()->json([
            'status' => true,
            'message' => "Widget details fetched successfully.",
            'data' => new WidgetResource($campaign),
        ]);
    }

    /**
     * Store postback information from widget
     *
     * @param  \Illuminate\Http\Request
     * @param  string  $usid
     * @return \Illuminate\Http\JsonResponse
     */
    public function postback(Request $request, $usid)
    {
        return response()->json([
            'status' => true,
            'message' => "Thanks for subscribing.",
        ]);
    }
}
