<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SignUpRequest extends FormRequest
{
    /**
     * The current year
     *
     * @var int
     */
    private $currentYear;

    /**
     * Year after a decade later
     *
     * @var int
     */
    private $twoDecadesLater;

    /**
     * SignUpRequest constructor
     */
    public function __construct()
    {
        $this->currentYear = date('Y');
        $this->twoDecadesLater = $this->currentYear + 19;
    }

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
     * @todo Need to add more validation for expiry month and year
     * @return array
     */
    public function rules()
    {
        return [
            'name' => "required|string",
            'email' => "required|string|email|unique:users",
            'password' => "required|string|min:8"
                . "|regex:/^.*(?=.{3,})(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\d\X])(?=.*[!$#%]).*$/",
            'card_number'  => "required|integer|digits_between:14,16",
            'cvc_number' => "required|integer|digits_between:3,5",
            'expiry_month' => "required", // |integer|min:1|max:12
            'expiry_year' => "required", // |integer|min:{$this->currentYear}|max:{$this->twoDecadesLater}
            'affiliate_id' => 'nullable|numeric|min:3',
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
            'name.required' => ['message' => "Name is required."],
            'email.required' => ['message' => "Email is required."],
            'email.email' => ['message' => "Email should be type of email. Example: jon@tier5.us"],
            'email.unique' => ['message' => "Email already exists, please click on forget password to recover."],
            'password.required' => ['message' => "Password is required."],
            'password.min' => ['message' => "Password should be at least 8 characters long"],
            'password.regex' => [
                'message' => "Password should contains one english uppercase characters (A–Z), " .
                            "one english lowercase characters (a–z), " .
                            "one numeric value (0–9) and one special characters (!, $, #, or %)",
                'rules' => [
                    "English uppercase characters (A–Z)",
                    "English lowercase characters (a–z)",
                    "Numeric value (0–9)",
                    "Special characters (!, $, #, or %)",
                ],
            ],
            'card_number.required' => ['message' => "Card number is required."],
            'card_number.integer' => ['message' => "Card number should be numeric value."],
            'card_number.digits_between' => ['message' => "Card number should be between 14 to 16 digits long."],
            'cvc_number.required' => ['message' => "CVC number is required."],
            'cvc_number.integer' => ['message' => "CVC number should br numeric value."],
            'cvc_number.digits_between' => ['message' => "CVC number should be between 3 to 5 digits long."],
            'expiry_month.required' => ['message' => "Expiry month is required"],
            'expiry_month.integer' => ['message' => "Expiry month should br numeric value."],
            'expiry_month.min' => ['message' => "Expiry month should be between 01 to 12."],
            'expiry_month.max' => ['message' => "Expiry month should be between 01 to 12."],
            'expiry_month.size' => ['message' => "Expiry month should be exactly of 2 digits."],
            'expiry_year.required' => ['message' => "Expiry year is required."],
            'expiry_year.integer' => ['message' => "Expiry year should be numeric value."],
            'expiry_year.min' => ['message' => "Expiry year should be between {$this->currentYear} to {$this->twoDecadesLater}."],
            'expiry_year.max' => ['message' => "Expiry year should be between {$this->currentYear} to {$this->twoDecadesLater}."],
            'expiry_year.size' => ['message' => "Expiry year should be exactly of 4 digits."],
            'affiliate_id.numeric' => ['message' => "Affiliate ID should be numeric value."],
            'affiliate_id.min' => ['message' => "Affiliate ID should be minimum 3 digits numeric value."],
        ];
    }
}
