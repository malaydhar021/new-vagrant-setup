<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use App\Exceptions\PrivilegeViolationException;

class CustomDoaminRequest extends FormRequest
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

            if($this->method() == "POST") {
                $pricingPlan = $user->pricing_plan;
                $saturationPoint = config('pricing.plans.' . $pricingPlan . '.privileges')['custom-domains'];

                if (($saturationPoint !== -1) && ($user->custom_domains_count >= $saturationPoint)) {
                    throw new PrivilegeViolationException(
                        "You can not create a new custom domain, please delete one existing custom domain or upgrade " .
                            "your current subscription plan."
                    );
                }
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
            'name' => 'required',
            'domain' => "required|unique:custom_domains,domain,{$this->route('id')}"
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
            'domain.required' => "Domain is required.",
            'domain.unique' => "Domain should be unique",
        ];
    }
}
