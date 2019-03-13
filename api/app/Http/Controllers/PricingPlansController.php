<?php

namespace App\Http\Controllers;

class PricingPlansController extends Controller
{
    /**
     * Get all pricing plans
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        if (empty(config('pricing'))) {
            return response()->json([
                'status' => false,
                'message' => "Pricing plans could not fetch.",
            ]);
        }

        return response()->json([
            'status' => true,
            'message' => "Pricing plans fetched successfully.",
            'pricing_plans' => config('pricing.plans'),
            'currency_symbol' => config('pricing.currency.symbol'),
        ]);
    }
}
