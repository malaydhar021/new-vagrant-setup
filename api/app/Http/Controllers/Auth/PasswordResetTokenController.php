<?php

namespace App\Http\Controllers\Auth;

use App\PasswordReset;
use App\User;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class PasswordResetTokenController extends Controller
{
    /**
     * Create a password reset token
     *
     * @return void
     */
    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
        ]);
        $user = User::whereEmail($request->input('email'))->first();

        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => "We can't find an user with that e-mail address.",
            ], 200);
        }

        $passwordReset = PasswordReset::updateOrCreate([
                'email'  => $user->email
            ], [
                'email'  => $user->email,
                'token'  => str_random(64)
            ]);

        if ($user && $passwordReset) $user->sendPasswordResetRequestNotification($passwordReset->token);

        return response()->json([
            'status' => true,
            'message' => "We have e-mailed you the password reset link!",
        ]);
    }

    /**
     * Search and validate password reset token
     *
     * @param string $token
     * @return void
     */
    public function show($token)
    {
        $passwordReset = PasswordReset::where('token', $token)->first();

        if (!$passwordReset) {
            return response()->json([
                'status' => false,
                'message' => "This password reset token is invalid.",
            ], 401);
        }

        if (Carbon::parse($passwordReset->updated_at)->addMinutes(60)->isPast()) { // Token is valid for 1 hour only
            $passwordReset->delete();

            return response()->json([
                'status' => false,
                'message' => "This password reset token is invalid.",
            ], 401);
        }

        return response()->json([
            'status' => true,
            'message' => "Password reset token is valid",
            'data' => $passwordReset,
        ]);
    }
}
