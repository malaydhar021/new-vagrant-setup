<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'email' => "required|string|email",
            'password' => "required|string",
            'remember_me' => "nullable|boolean",
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
            'email.required' => "Email is required.",
            'email.email' => "Email should be type of email. Example: jon@tier5.us",
            'password.required' => "Password is required.",
            'remember_me.boolean' => "Remember me should be boolean type.",
        ];
    }
}
