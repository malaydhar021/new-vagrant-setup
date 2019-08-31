<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\PasswordReset;
use App\User;

use Illuminate\Http\Request;

class PasswordResetController extends Controller
{
    /**
     * Reset a password
     *
     * @return void
     */
    public function update(Request $request)
    {
        $request->validate([
            'email' => "required|string|email",
            'password' => "required|string|min:8|"
                . "regex:/^.*(?=.{3,})(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\d\X])(?=.*[!$#%]).*$/|confirmed",
            'token' => "required|string|size:64"
        ]);

        $passwordReset = PasswordReset::whereEmail($request->input('email'))
            ->whereToken($request->input('token'))
            ->first();

        if (!$passwordReset) {
            return response()->json([
                'status' => false,
                'message' => "This password reset token is invalid.",
            ], 404);
        }

        $user = User::where('email', $passwordReset->email)->first();

        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => "We can not find a user with that e-mail address.",
            ], 404);
        }

        $user->update(['password' => $request->input('password')]);
        
        $passwordReset->delete();
        // revoke current token
        \DB::table('oauth_access_tokens')
        ->where('id', $user->id)
        ->update([
            'revoked' => true
        ]);
        
        $user->sendPasswordResetSuccessNotification();

        return response()->json([
            'status' => true,
            'message' => "You have successfully reset your password.",
            'data' => new UserResource($user),
        ]);
    }
}
