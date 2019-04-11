<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class CampaignRequest extends FormRequest
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
            'campaign_name'         => 'required',
            'domain_name'           => 'required',
            'style_id'              => 'required|string',
            'delay'                 => 'required|numeric',
            'branding'              => 'required|boolean',
            'branding_id'           => 'required_if:branding, 1',
            'exit_pop_up'           => 'required|boolean',
            'exit_pop_up_id'        => 'required_if:exit_pop_up, 1',
            'is_active'             => 'nullable|boolean',
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
            'campaign_name.required'  => 'Campaign name is a required field.',
            'domain_name.required'    => 'Domain name is a required field.',
            'styles.required'         => 'Please choose a style.',
            'delay.required'          => 'Time Delay is required.',
            'delay.numeric'           => 'Time Delay should be numeric.',
            'branding.required'       => 'Branding is required.',
            'branding.boolean'        => 'Branding needs to be on or off!',
            'branding_id.required_if' => 'Branding id required',
            'is_active.boolean'       => 'Is active shoulde be boolean type',
        ];
    }
}
