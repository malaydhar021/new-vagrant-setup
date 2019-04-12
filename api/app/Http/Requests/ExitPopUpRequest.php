<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Traits\AuthTrait;

class ExitPopUpRequest extends FormRequest
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
            'created_by'                => 'required|numeric',
            'name'                      => 'required|string',
            'header_text'               => 'required|string',
            'header_text_color'         => 'required|string',
            'header_background_color'   => 'required|string',
            'semi_header_text_color'    => 'required_if:semi_header_text,!=,null',
            'select_active_campaign'    => 'required|numeric',
            'select_sticky_reviews'     => 'required'
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
            'created_by.required'                   => 'Please provide the id of the review link creator, and it should be numeric',
            'created_by.numeric'                    => 'You should provide the id of the creator and it should be numeric',
            'name.required'                         => 'Exit pop up name is required!',
            'name.string'                           => 'Exit pop up name should be type of string.',
            'header_text.required'                  => 'Exit pop up header text is required!',
            'header_text.string'                    => 'Exit pop up header text should be type of string.',
            'header_text_color.required'            => 'Exit pop up header text color is required!',
            'header_text_color.string'              => 'Exit pop up header text color should be type of string.',
            'header_background_color.required'      => 'Header background color is required!',
            'header_background_color.string'        => 'Header background color should be type oof string. Hint: define rgba or hex code.',
            'semi_header_text_color.required_if'    => 'Semi header text color is required if you define a text as semi header text.',
            'select_active_campaign.required'       => 'Please select a campaign.',
            'select_active_campaign.numeric'        => 'Please select the active campaign properly!',
            'select_sticky_reviews'                 => 'Please select one or more sticky reviews!'
        ];
    }
}
