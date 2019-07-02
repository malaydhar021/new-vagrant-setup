<?php

namespace App\Http\Requests;

use App\Helpers\Hashids;

use App\Exceptions\PrivilegeViolationException;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class ExitPopUpRequest extends FormRequest
{
    /**
     * Get the validator instance for the request.
     *
     * @return \Illuminate\Contracts\Validation\Validator
     */
    public function getValidatorInstance()
    {
        $this->merge([
            'has_campaign' => (integer) $this->request->get('has_campaign'),
            'has_sticky_reviews' => (integer) $this->request->get('has_sticky_reviews'),
            'has_email_field' => (integer) $this->request->get('has_email_field'),
            'style_id'=> Hashids::decode($this->request->get('style_id')),
        ]);

        $request = $this->request->all();
        if ($this->request->has('has_campaign') && $this->request->has('campaign_id')) {
            if ($this->request->get('campaign_id')) {
                $this->merge([
                    'campaign_id' => Hashids::decode($this->request->get('campaign_id')),
                ]);
            } else {
                unset($request['campaign_id']);
            }
        }

        if ($this->request->has('has_sticky_reviews') && $this->request->has('sticky_reviews') && $this->request->get('sticky_reviews') == null) {
            unset($request['sticky_reviews']);
        }
        $this->request = (new Request())->replace($request);
        return parent::getValidatorInstance();
    }

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
                $saturationPoint = config('pricing.plans.' . $pricingPlan . '.privileges')['exit-popups'];

                if (($saturationPoint !== -1) && ($user->exit_popups_count >= $saturationPoint)) {
                    throw new PrivilegeViolationException(
                        "You can not create a new exit popup, please delete one existing exit popup or upgrade your " .
                            "current subscription plan."
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
            'name' => "required|string",
            'has_campaign' => "required|boolean",
            'campaign_id' => "required_if:has_campaign,1|exists:campaigns,id",
            'has_sticky_reviews' => "required|boolean",
            'sticky_reviews' => "required_if:has_sticky_reviews,1|array",
            'sticky_reviews.*'  => "required_if:has_sticky_reviews,1|string|distinct",
            'has_email_field' => "required|boolean",
            'header_text' => "required|string",
            'header_text_color' => "required|string",
            'header_background_color' => "required|string",
            'paragraph_text' => "required|string",
            'paragraph_text_color' => "required|string",
            'body_background_color' => "required|string",
            'popup_backdrop_color' => "required|string",
            'button_text' => "required_if:has_email_field,1|string",
            // 'button_url' => "url",
            'button_text_color' => "required_if:has_email_field,1|string",
            'button_background_color' => "required_if:has_email_field,1|string",
            'style_id' => "required|exists:exit_popup_styles,id",
            'cta_button_text' => "required",
            'cta_button_text_color' => "required",
            'cta_button_background_color' => "required",
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
            'name.required' => "Exit pop up name is required!",
            'name.string' => "Exit pop up name should be a valid string.",
            'has_campaign.required' => "Campaign switch is required.",
            'has_campaign.boolean' => "Campaign switch needs to be turned on or off.",
            'campaign_id.required_if' => "Campaign is required.",
            'campaign_id.exists' => "This campaign does not matches our record, please select a valid campaign.",
            'has_sticky_reviews.required' => "Sticky review switch is required.",
            'has_sticky_reviews.boolean' => "Sticky review switch needs to be turned on or off.",
            'sticky_reviews.required_if' => "Sticky reviews are required.",
            'sticky_reviews.array' => "Sticky reviews should be an array.",
            'sticky_reviews*.required_if' => "At least one sticky review item is required inside the array.",
            'sticky_reviews*.string' => "Sticky review item should be a valid string.",
            'sticky_reviews*.distinct' => "Sticky review item should be distinct, no repeated item is allowed.",
            'has_email_field.required' => "Add email field is required",
            'has_email_field.boolean' => "Add email field to be turned on or off.",
            'header_text.required' => "Header text is required.",
            'header_text.string' => "Header text should be a valid string.",
            'header_text_color.required' => "Header text color is required.",
            'header_text_color.string' => "Header text color should be a valid string.",
            'header_background_color.required' => "Header background color is required!",
            'header_background_color.string' => "Header background color should be valid string.",
            'paragraph_text.required' => "Paragraph text is required.",
            'paragraph_text.string' => "Paragraph text should be a valid string.",
            'paragraph_text_color.required' => "Paragraph text color is required.",
            'paragraph_text_color.string' => "Paragraph text color should be a valid string.",
            'body_background_color.required' => "Body background color is required.",
            'body_background_color.string' => "Body background color should be a valid string.",
            'popup_backdrop_color.required' => "Popup backdrop color is required.",
            'popup_backdrop_color.string' => "Popup backdrop color should be a valid string.",
            'button_text.required_if' => "Button text is required.",
            'button_text.string' => "Button text should be a valid string.",
            // 'button_url.required_if' => "Button url is required.",
            // 'button_url.url' => "Button url should be a valid URL.",
            'button_text.required_if' => "Button text is required.",
            'button_text.string' => "Button text should be a valid string.",
            'button_text_color.required_if' => "Button text color is required.",
            'button_text_color.string' => "Button text color should be a valid string.",
            'button_background_color.required_if' => "Button background color is required.",
            'button_background_color.string' => "Button background color should be a valid string.",
            'style_id.required' => "Style is required.",
            'style_id.exists' => "This style does not matches our record, please select a valid style.",
            'cta_button_text.required' => "CTA button text is required.",
            'cta_button_text_color.required' => "CTA button text color is required.",
            'cta_button_background_color.required' => "CTA button background color is required.",
        ];
    }
}
