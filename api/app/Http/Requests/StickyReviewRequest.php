<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StickyReviewRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        if (Auth::check())  return true;

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
            'name' => 'required',
            'description' => 'required',
            'rating' => 'required|integer|min:1|max:5',
            'image' => 'required|image|mimes:gif,jpeg,png,tiff,x-icon,x-ms-bmp,webp'
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
            'name.required' => 'Name is required.',
            'description.required' => 'Description is required.',
            'rating.required' => "Rating is required.",
            'rating.integer' => "Rating is not a integer.",
            'rating.min' => "Rating should be minimum 1 and maximum 5",
            'rating.max' => "Rating should be minimum 1 and maximum 5",
            'image.required' => 'Image is required.',
            'image.image' => "Image is not a valid image",
            'image.image' => "Image should be type of jpg, jpeg, png, bmp, gif, ico or webp." .
                "No other file format is currently supported.",
        ];
    }
}
