<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\traits\AuthTrait;

class CampaignRequest extends FormRequest
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
    public function rules()
    {
        return [
            'created_by'            => 'required|numeric',
            'campaign_name'         => 'required',
            'domain_name'           => 'required',
            'styles'                => 'required|string',
            'delay'                 => 'required|numeric',
            'branding'              => 'required|boolean',
            'branding_id'           => 'required_if:branding, 1',
            'exit_pop_up'           => 'required|boolean',
            'exit_pop_up_ids_arr'   => 'required_if:exit_pop_up, 1',
            'is_active'             => 'required|string'
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
            'created_by.required'     => 'User ID who created this campaign is required!',
            'created_by.numeric'      => 'User ID should be a numeric digit',
            'campaign_name.required'  => 'Campaign Name is a required field.',
            'domain_name.required'    => 'Domain name is a required field.',
            'styles.required'         => 'Please define a style.',
            'delay.required'          => 'Time Delay is required.',
            'delay.numeric'           => 'Time Delay should be numeric.',
            'branding.required'       => 'Branding is required.',
            'branding.boolean'        => 'Branding needs to be on or off!',
            'branding_id.required_if' => 'Branding id required',
            'is_active'               => 'You have to specify the campaign is active or not!'
        ];
    }
}
