<?php

namespace App\Http\Requests;

use App\Campaign;
use App\Exceptions\PrivilegeViolationException;
use App\Helpers\Hashids;

use Illuminate\Foundation\Http\FormRequest;

class SubscribedEmailRequest extends FormRequest
{
    /**
     * Get the validator instance for the request.
     *
     * @return \Illuminate\Contracts\Validation\Validator
     */
    public function getValidatorInstance()
    {
        if ($this->request->has('exit_popup_id')) {
            $this->merge([
                'exit_popup_id' => Hashids::decode($this->request->get('exit_popup_id')),
            ]);
        }

        return parent::getValidatorInstance();
    }

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        $campaign = Campaign::whereUniqueScriptId($this->route('usid'))->with('user')->first();

        if ($campaign) {
            if ($campaign->user->subscription_status == 'CANCELLED' ||
                $campaign->user->subscription_status == 'TERMINATED') {
                throw new PrivilegeViolationException("Your action is forbidden.");
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
            'email' => "required|email",
            'exit_popup_id' => "required|exists:exit_pop_ups,id",
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
            'email.required' => "Email is required.",
            'email.email' => "Email should be type of email. Example: jon@tier5.us",
            'exit_popup_id.required' => "Exit popup is required.",
            'exit_popup_id.exists' => "This exit popup does not matches our record, make sure you are posting back " .
                "from a valid exit popup.",
        ];
    }
}
