<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class CardRequest extends FormRequest
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
            'card_number'  => "required|integer|digits_between:14,16",
            'cvc_number' => "required|integer|digits_between:3,5",
            'expiry_month' => "required|integer|min:01|max:12",
            'expiry_year' => "required|integer|min:{$this->currentYear}|max:{$this->twoDecadesLater}",
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
            'card_number.required' => "Card number is required.",
            'card_number.integer' => "Card number should be numeric value.",
            'card_number.digits_between' => "Card number should be between 14 to 16 digits long.",
            'cvc_number.required' => "CVC number is required.",
            'cvc_number.integer' => "CVC number should br numeric value.",
            'cvc_number.digits_between' => "CVC number should be between 3 to 5 digits long.",
            'expiry_month.required' => "Expiry month is required",
            'expiry_month.integer' => "Expiry month should br numeric value.",
            'expiry_month.min' => "Expiry month should be between 01 to 12.",
            'expiry_month.max' => "Expiry month should be between 01 to 12.",
            'expiry_month.size' => "Expiry month should be exactly of 2 digits.",
            'expiry_year.required' => "Expiry year is required.",
            'expiry_year.integer' => "Expiry year should be numeric value.",
            'expiry_year.min' => "Expiry year should be between {$this->currentYear} to {$this->twoDecadesLater}.",
            'expiry_year.max' => "Expiry year should be between {$this->currentYear} to {$this->twoDecadesLater}.",
            'expiry_year.size' => "Expiry year should be exactly of 4 digits.",
        ];
    }
}
