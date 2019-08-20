<?php

/**
 * DashboardController will be used for collecing analytics data for a user
 * @package DashboardController
 * @version 1.0.0
 * @author Tier5 LLC <work@tier5.us>
 * @license Proprietary
 */
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    /**
     * Method to fetch all analytics data for a certain user
     * @since 1.0.0
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index() 
    {
        return response()->json([
            'status' => true,
            'message' => "Dashboard data have been fetched successfully",
            'data' => null
        ]);
    }
}