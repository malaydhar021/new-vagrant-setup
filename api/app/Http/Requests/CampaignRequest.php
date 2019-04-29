<?php

namespace App\Http\Requests;

use App\Exceptions\PrivilegeViolationException;

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
        if (Auth::check()) {
            $user = Auth::user();

            if ($user->subscription_status == 'CANCELLED') {
                throw new PrivilegeViolationException(
                    "Your action is forbidden due to cancellation of your subscription plan. Please resubscribe again" .
                        " to continue."
                );
            } elseif ($user->subscription_status == 'TERMINATED') {
                throw new PrivilegeViolationException(
                    "Your action is forbidden due to termination of your subscription plan. Please resubscribe again " .
                        "to continue."
                );
            }

            if ($user->campaigns_count >= config('pricing.plans.' . $user->pricing_plan . '.privileges')['campaigns']) {
                throw new PrivilegeViolationException(
                    "You can not create a new campaign, please delete one existing campaign or upgrade your " .
                        "current subscription plan."
                );
            }

            return true;
        }

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
            'campaign_name' => 'required',
            'domain_name' => 'required',
            'style_id' => 'required|string',
            'delay' => 'nullable|numeric',
            'delay_before_start' => 'nullable|numeric',
            'stay_timing' => 'nullable|numeric',
            'branding' => 'required|boolean',
            'branding_id' => 'required_if:branding,1',
            'exit_pop_up' => 'required|boolean',
            'exit_pop_up_id' => 'required_if:exit_pop_up,1',
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
            'campaign_name.required' => "Campaign name is required.",
            'domain_name.required' => "Domain name is required.",
            'style_id.required' => "Please choose a style.",
            'delay.numeric' => "Delay between next appearance should be numeric.",
            'delay_before_start.numeric' => "Delay before start should be numeric.",
            'stay_timing.numeric' => "Stay timing should be numeric.",
            'branding.required' => "Branding is required.",
            'branding.boolean' => "Branding needs to be turned on or off.",
            'branding_id.required_if' => "Select one branding or turn off branding.",
            'exit_pop_up.required' => "Exit pop-up is required.",
            'exit_pop_up.boolean' => "Exit pop-up needs to be turned on or off.",
            'exit_pop_up_id.required_if' => "Select one exit pop-up or turn off exit pop-up.",
        ];
    }
}
