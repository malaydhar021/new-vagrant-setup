<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class BrandRequest extends FormRequest
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
            'name' => "required|min:1|max:25",
            'url' => "required|url",
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
            'name.required' => "Name is required.",
            'name.min' => "Name should be between 1 to 25 characters length long.",
            'name.max' => "Name should be between 1 to 25 characters length long.",
            'url.required' => "URL is Required",
            'url.url' => "URL should be a valid URL",
        ];
    }
}
