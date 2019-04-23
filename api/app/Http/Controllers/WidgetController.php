<?php

namespace App\Http\Controllers;

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
        return response()->json([
            'status' => true,
            'message' => "OK",
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
