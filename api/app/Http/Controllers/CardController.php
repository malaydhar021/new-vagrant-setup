<?php

namespace App\Http\Controllers;

use App\Http\Resources\CardResource;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\CardRequest;

class CardController extends Controller
{

    /**
     * Get the card info of authenticated user
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        return response()->json([
            'status' => true,
            'message' => "User's card info fetched successfully.",
            'card' => new CardResource(Auth::user()),
        ]);
    }

    /**
     * Update the card info of authenticated user
     *
     * @param  \App\Http\Request\CardRequest
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(CardRequest $request)
    {
        Auth::user()->updateCardInfo(null, [
            'number' => $request->input('card_number'),
            'exp_month' => $request->input('expiry_month'),
            'exp_year' => $request->input('expiry_year'),
            'cvc' => $request->input('cvc_number'),
        ], true, true);

        return response()->json([
            'status' => true,
            'message' => "User's card info updated successfully.",
            'card' => new CardResource(Auth::user()),
        ]);
    }
}
