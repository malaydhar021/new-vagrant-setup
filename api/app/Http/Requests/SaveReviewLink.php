<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Traits\AuthTrait;
class SaveReviewLink extends FormRequest
{
    use AuthTrait;
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        if (is_integer($this->isAuthenticated())) {
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
    public function rules() {
        return [
            'myLogo'                        => 'required|image',
            'name'                          => 'required|string',
            'description'                   => 'required| string',
            'url_slug'                      => 'required|unique:review_links,url_slug',
            'min_rating'                    => 'required_if:auto_approve, 1',
            'negative_info_review_msg_1'    => 'required',
            'negative_info_review_msg_2'    => 'required',
            'positive_review_msg'           => 'required',
            'created_by'                    => 'required|numeric'
        ];
    }
    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array
     */
    public function messages() {
        return [
            'myLogo.required'                       => 'Review link logo is required!',
            'myLogo.image'                          => 'Logo should be type of jpg, jpeg, png, bmp, gif or svg. No other file format is supported.',
            'name.required'                         => 'Review Link name is required!',
            'description.required'                  => 'Review description is required!',
            'url_slug.required'                     => 'URL slug is required!',
            'url_slug.unique'                       => 'URL slug should be unique!',
            'min_rating.required_if'                => 'If auto approve is on you have to define minimum star rating, else you can switch off it',
            'negative_info_review_msg_1.required'   => 'Negative info message is required',
            'negative_info_review_msg_2.required'   => 'Negative info message is required',
            'positive_review_msg.required'          => 'Positive info message is required',
            'created_by.required'                   => 'Please provide the id of the review link creator, and it should be numeric'
        ];
    }
}
