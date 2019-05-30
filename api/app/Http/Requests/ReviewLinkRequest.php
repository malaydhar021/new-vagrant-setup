<?php

namespace App\Http\Requests;

use App\Helpers\Hashids;

use App\Exceptions\PrivilegeViolationException;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class ReviewLinkRequest extends FormRequest
{
    /**
     * Get the validator instance for the request.
     *
     * @return \Illuminate\Contracts\Validation\Validator
     */
    public function getValidatorInstance()
    {
        if ($this->request->has('campaign_id')) {
            $this->merge([
                'campaign_id' => Hashids::decode($this->request->get('campaign_id')),
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
        if($this->method == "POST") {
            if (Auth::check()) {
                $user = Auth::user();
                $pricingPlan = $user->pricing_plan;
                $saturationPoint = config('pricing.plans.' . $pricingPlan . '.privileges')['review-links'];
                if (($saturationPoint !== -1) && ($user->review_links_count >= $saturationPoint)) {
                    throw new PrivilegeViolationException(
                        "You can not create a new review link, please delete one existing review link or upgrade your " .
                            "current subscription plan."
                    );
                }
                return true;
            }
            return false;
        }
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
            'name' => "required|string",
            'url_slug' => "required|unique:review_links,id," . $this->route('id'),
            'logo' => [
                $this->method() == 'POST' ? "required" : "nullable",
                "image",
                "mimes:gif,jpeg,png,tiff,x-icon,x-ms-bmp,webp",
            ],
            'description' => "required|string",
            'auto_approve' => "required|boolean",
            'min_rating' => "required_if:auto_approve,1|integer",
            'positive_review_message' => "required|string",
            'negative_info_review_message_1' => "required|string",
            'negative_info_review_message_2' => "required|string",
            'page_background' => "required|string",
            'modal_background' => "required|string",
            'text_color' => "required|string",
            'copyright_text' => "nullable|string|min:1|max:255",
            // 'campaign_id' => "required|exists:campaigns,id",
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
            'name.required' => "Review Link name is required.",
            'url_slug.required' => "URL slug is required.",
            'url_slug.unique' => "URL slug should be unique.",
            'logo.required' => "Logo is required.",
            'logo.image' => "Logo is not a valid image",
            'logo.mimes' => "Logo should be type of jpg, jpeg, png, bmp, gif, ico or webp." .
                "No other file format is currently supported.",
            'description.required' => "Description is required.",
            'auto_approve.required' => "Please turn on or off auto approve switch.",
            'auto_approve.boolean' => "Please turn on or off auto approve switch.",
            'min_rating.required_if' => "If auto approve is on you have to define minimum star rating, " .
                "else you can switch off it.",
            'negative_info_review_msg_1.required' => "Negative info message is required.",
            'negative_info_review_msg_2.required' => "Negative info message is required.",
            'positive_review_msg.required' => "Positive info message is required.",
            'page_background.required' => "Page background is required.",
            'page_background.string' => "Page background is not a valid string.",
            'modal_background.required' => "Modal background is required.",
            'modal_background.string' => "Modal background is not a valid string.",
            'text_color.required' => "Text color is required.",
            'text_color.string' => "Text color is not a valid string.",
            'copyright_text.required' => "Copyright text is required.",
            'copyright_text.string' => "Copyright text is not a valid string.",
            'copyright_text.min' => "Copyright text should be 1 to 255 characters length long.",
            'copyright_text.max' => "Copyright text should be 1 to 255 characters length long.",
            'campaign_id.required' => "Campaign is required.",
            'campaign_id.exists' => "This campaign does not matches our record, please select a valid campaign.",
        ];
    }
}
