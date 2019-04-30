<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class UserPasswordRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        if (Auth::check()) return true;

        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'current_password' => "required",
            'new_password' => "required|string|min:8|"
                . "regex:/^.*(?=.{3,})(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\d\X])(?=.*[!$#%]).*$/|confirmed",
            'new_password_confirmation' => "required|string|min:8|"
                . "regex:/^.*(?=.{3,})(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\d\X])(?=.*[!$#%]).*$/",
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'current_password.required' => "Current password is required.",
            'new_password.required' => "New password is required.",
            'new_password.min' => "New password should be at least 8 characters long",
            'new_password.regex' => "New password should contains one English uppercase characters (A–Z), " .
                "one English lowercase characters (a–z), " .
                "one numeric value (0–9) and one special characters (!, $, #, or %)",
            'new_password.confirmed' => "New password and re-entered new password should be exactly same.",
            'new_password_confirmation.required' => "Please re-enter new password.",
            'new_password_confirmation.min' => "Re-entered new password should be at least 8 characters long",
            'new_password_confirmation.regex' => "Re-entered new password should contains one English uppercase " .
                "characters (A–Z), one English lowercase characters (a–z), " .
                "one numeric value (0–9) and one special characters (!, $, #, or %)",
        ];
    }
}
