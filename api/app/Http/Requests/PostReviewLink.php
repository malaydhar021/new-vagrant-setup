<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Traits\AuthTrait;

class PostReviewLink extends FormRequest
{
    use AuthTrait;
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        if(is_integer($this->isAuthenticated())) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'created_by'            => 'required|numeric',
            'url_slug'              => 'required|string',
            'min_rating'            => 'required|numeric|between:1,5',
            'sticky_review_name'    => 'required|string',
            'sticky_review_desc'    => 'required|string',
            'sticky_review_img'     => 'required|image',
            'sticky_review_rating'  => 'required|numeric|between:1,5',
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
            'created_by.required'               => 'User ID who created this campaign is required!',
            'created_by.numeric'                => 'User ID should be a numeric digit',
            'url_slug.required'                 => 'URL slug is required to form the url by the system',
            'url_slug.string'                   => 'URL slug should be a string',
            'min_rating.rating'                 => 'Minimum rating needs to be declared',
            'min_rating.numeric'                => 'Minimum rating need to be a integer number between 1 to 5',
            'min_rating.between'                => 'Minimum rating need to be a integer number between 1 to 5',
            'sticky_review_name.required'       => 'Sticky review name is required.',
            'sticky_review_name.string'         => 'Sticky review name should be type of string.',
            'sticky_review_desc.required'       => 'Sticky review description is required!',
            'sticky_review_desc.string'         => 'Sticky review description should be type of string.',
            'sticky_review_img.required'        => 'Sticky review image is required!',
            'sticky_review_img.image'           => 'Image should be type of jpg, jpeg, png, bmp, gif or svg. No other file format is supported.',
            'sticky_review_rating.numeric'      => 'Sticky review rating should be integer and should be between 1 to 5',
            'sticky_review_rating.required'     => 'Sticky review rating is required!',
            'sticky_review_rating.between'      => 'Sticky review rating should be integer and should be between 1 to 5'
        ];
    }
}
