<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserPasswordRequest;
use App\Http\Requests\UserProfileRequest;
use App\Http\Resources\UserResource;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

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
            'message' => "User's info fetched successfully.",
            'data' => new UserResource(Auth::user()),
        ]);
    }

    /**
     * Update the authenticated user's profile info
     *
     * @param  \App\Http\Resources\UserProfileRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(UserProfileRequest $request)
    {
        $user = Auth::user();
        $user->name = $request->has('name') ? $request->input('name') : $user->name;
        $user->email = $request->has('email') ? $request->input('email') : $user->email;
        if ($request->has('image')) {
            $user->image_url = $request->file('image');
        }
        $user->update();

        return response()->json([
            'status' => true,
            'message' => "Your profile info has updated successfully.",
            'data' => [
                'user' => new UserResource($user),
            ],
        ], 201);
    }

    /**
     * Update authenticated user's password
     *
     * @param \App\Http\Resources\UserPasswordRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updatePassword(UserPasswordRequest $request)
    {
        $user = Auth::user();

        if (Hash::check($request->input('current_password'), $user->password)) {
            $user->update(['password' => $request->input('new_password')]);

            $user->sendPasswordUpdatedNotification();

            return response()->json([
                'status' => true,
                'message' => "Your password has updated successfully.",
                'data' => [
                    'user' => new UserResource($user),
                ],
            ], 201);
        } else {
            return response()->json([
                'status' => false,
                'message' => "Current password is invalid.",
            ], 403);
        }
    }
}
