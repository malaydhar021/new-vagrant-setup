<?php

namespace App\Http\Controllers;

use App\Http\Requests\CardRequest;
use App\Http\Resources\UserResource;
use App\Http\Resources\CardResource;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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
            'user' => new UserResource(Auth::user()),
        ]);
    }

    /**
     * Get the card info of authenticated user
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getCard()
    {
        return response()->json([
            'status' => true,
            'card' => new CardResource(Auth::user()),
        ]);
    }

    /**
     * Update the card info of authenticated user
     *
     * @param  \App\Http\Request\CardRequest
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateCard(Request $request)
    {
        Auth::user()->updateCardInfo(null, [
            'number' => $request->input('card_number'),
            'exp_month' => $request->input('expiry_month'),
            'exp_year' => $request->input('expiry_year'),
            'cvc' => $request->input('cvc_number'),
        ], true, true);

        return response()->json([
            'status' => true,
            'card' => new CardResource(Auth::user()),
        ]);
    }
}
