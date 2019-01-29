<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SignUpRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name'                  => 'required|string|max:255',
            'email'                 => 'required|string|email|max:255|unique:users',
            'password'              => 'required|string',
            'password_confirmation' => 'required|string|same:password',
            'stripe_plan'           => 'required|string',
            'card_no'               => 'required',
            'month'                 => 'required|max:2',
            'year'                  => 'required|max:4',
            'cvc'                   => 'required'
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
            'name.required'                  => 'Name is required.',
            'email.required'                 => 'Email is required.',
            'email.email'                    => 'Email should be type of email ex. example@domainname.com.',
            'email.unique'                   => 'Email already exists! Click on forget password to recover.',
            'password.required'              => 'Password is required.',
            'password_confirmation.required' => 'Confirm password could not be empty.',
            'password_confirmation.same'     => 'Password and confirm password did not match.',
            'stripe_plan.required'           => 'You need to subscribe to a stripe plan.',
            'card_no.required'               => 'Credit card number is required.',
            'card_no.number'                 => 'Wrong credit card number!',
            'month.required'                 => 'Expiry month is required',
            'month.max'                      => 'Month should be maximum of 2 digits.',
            'year.required'                  => 'Expiry year is required.',
            'year.max'                       => 'Year should be maximum of 4 digits',
            'cvc'                            => 'Cvc is required.'
        ];
    }
}
