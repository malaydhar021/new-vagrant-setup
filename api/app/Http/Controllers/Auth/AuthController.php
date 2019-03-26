<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\SignUpRequest;
use App\Traits\Subscription;
use App\User;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use Carbon\Carbon;

class AuthController extends Controller
{
    use Subscription;

    /**
     * Checks if an email is registered or not
     *
     * @param  Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function checkEmail(Request $request)
    {
        $exists = User::whereEmail("{$request->input('email')}")->first();

        if ($exists) {
            return response()->json([
                'status' => false,
                'message' => "Email already exists, please click on forget password to recover.",
            ]);
        } else {
            return response()->json([
                'status' => true,
                'message' => "No one have registered with email, go ahead and register.",
            ]);
        }
    }

    /**
     * Registers an user to the platform and subscribes for the free trial
     *
     * @param  SignUpRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(SignUpRequest $request)
    {
        $user = new User();
        $user->name = $request->input('name');
        $user->email = $request->input('email');
        $user->password = $request->input('password');
        $user->pricing_plan = 'lowest';

        if ($request->has('affiliate_id'))
            $user->affiliate_id = $request->input('affiliate_id');

        $user->subscribeToFreeTrial(null, [
            'number' => $request->input('card_number'),
            'exp_month' => $request->input('expiry_month'),
            'exp_year' => $request->input('expiry_year'),
            'cvc' => $request->input('cvc_number'),
        ], true);

        // TODO: Dispatch email notification for successful registration process
        // $user->notify(new RegisterationSuccessful($user));

        return response()->json([
            'status' => true,
            'message' => "Successfully registered user.",
        ], 201);
    }

    /**
     * Logs in an user and create token
     *
     * @param  LoginRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(LoginRequest $request)
    {
        $credentials = request(['email', 'password']);
        $credentials['is_active'] = 1;

        if (!Auth::attempt($credentials))
            return response()->json([
                'status' => false,
                'message' => "Login failed! Credentials does not match our records."
            ], 401);

        $tokenResult = Auth::user()->createToken('Login Access Token');

        $token = $tokenResult->token;
        $token->expires_at = $request->remember_me ? Carbon::now()->addWeeks(1) : Carbon::now()->addDays(1);

        $token->save();

        return response()->json([
            'status' => true,
            'message' => "Welcome! You have logged in successfully.",
            'access_token' => $tokenResult->accessToken,
            'token_type' => 'Bearer',
            'expires_at' => Carbon::parse($tokenResult->token->expires_at)->toDateTimeString()
        ]);
    }

    /**
     * Logs out an user (Revoke the token)
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        if (Auth::check()) {
            Auth::user()->token()->revoke();
        }

        return response()->json([
            'status' => true,
            'message' => "Bye! You have logged out successfully."
        ]);
    }
}
