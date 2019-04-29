<?php

namespace App\Http\Requests;

use App\Exceptions\PrivilegeViolationException;

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

            if ($user->brands_count >= config('pricing.plans.' . $user->pricing_plan . '.privileges')['brands']) {
                throw new PrivilegeViolationException(
                    "You can not create a new brand, please delete one existing brand or upgrade your " .
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
