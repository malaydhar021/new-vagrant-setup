<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class UserProfileRequest extends FormRequest
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
            'email' => "email|unique:users,email," . Auth::user()->id,
            'image' => "nullable|image|mimes:gif,jpeg,png,webp",
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
            'email.email' => "Email should be type of email. Example: jon@tier5.us",
            'email.unique' => "Email already exists, and registered with some other user.",
            'image.image' => "Image is not a valid image",
            'image.image' => "Image should be type of .gif, .jpg, .jpeg, .png, or .webp. " .
                "No other file format is currently supported.",
        ];
    }
}
