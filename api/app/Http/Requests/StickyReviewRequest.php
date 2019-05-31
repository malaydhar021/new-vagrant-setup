<?php

namespace App\Http\Requests;

use App\Exceptions\PrivilegeViolationException;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StickyReviewRequest extends FormRequest
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

            if($this->method == "POST") {
                $pricingPlan = $user->pricing_plan;
                $saturationPoint = config('pricing.plans.' . $pricingPlan . '.privileges')['sticky-reviews'];

                if (($saturationPoint !== -1) && ($user->sticky_reviews_count >= $saturationPoint)) {
                    throw new PrivilegeViolationException(
                        "You can not create a new sticky review, please delete one existing sticky review or upgrade " .
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
            'name' => "required|string|min:1|max:25",
            'rating' => "required|integer|digits:1|min:1|max:5",
            'type' => "required|integer|digits:1|min:1|max:3",
            'review_text' => [
                $this->method() == 'POST' ? "required_if:type,1" : "nullable",
                "string",
                "min:1",
                "max:60"
            ],
            'review_audio' => [
                $this->method() == 'POST' ? "required_if:type,2" : "nullable",
                "file",
                "mimetypes:application/octet-stream,application/ogg,audio/AMR,audio/x-matroska,audio/mpeg,audio/mp4," .
                "audio/ogg,audio/webm,audio/vorbis,audio/wav,audio/wave,audio/vnd.wav,audio/x-aac,audio/x-ms-wma",
            ],
            'review_video' => [
                $this->method() == 'POST' ? "required_if:type,3" : "nullable",
                "file",
                "mimetypes:application/octet-stream,application/ogg,video/3gpp,video/x-matroska,video/mp4," .
                "video/mpeg,video/ogg,video/quicktime,video/webm,video/x-flv,video/x-msvideo,video/x-ms-wmv",
            ],
            'image' => [
                $this->method() == 'POST' ? "required" : "nullable",
                "image",
                "mimes:gif,jpeg,png,webp"
            ],
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
            'name.required' => 'Name is required.',
            'name.min' => "Name should be between 1 to 25 characters length long.",
            'name.max' => "Name should be between 1 to 25 characters length long.",
            'rating.required' => "Rating is required.",
            'rating.integer' => "Rating should be a valid integer.",
            'rating.digits' => "Rating should be a 1 digit integer.",
            'rating.min' => "Rating should be minimum 1 and maximum 5",
            'rating.max' => "Rating should be minimum 1 and maximum 5",
            'type.required' => "Type is required",
            'type.integer' => "Type should be a valid integer",
            'type.digits' => "Type should be a 1 digit integer.",
            'type.min' => "Type should be among the 1, 2 or 3.",
            'type.max' => "Type should be among the 1, 2 or 3.",
            'review_text.required_if' => "Review text is required when type is textual.",
            'review_text.min' => "Review text should be between 1 to 60 characters length long.",
            'review_text.max' => "Review text should be between 1 to 60 characters length long.",
            'review_audio.required_if' => "Review audio is required when type is audio.",
            'review_audio.mimetypes' => "Review audio is not a valid audio file. It should be type of " .
                ".aac, .amr, .mka, .mp3, .mp4, .ogg, .wma, .wav, or .webm. " .
                "No other file format is currently supported.",
            'review_video.required_if' => "Review video is required when type is video.",
            'review_video.mimetypes' => "Review video is not a valid video file. It should be type of " .
                ".3gp, .avi, .flv, .mkv, .mp4, .mpg, .mov, .ogg, .wmv, or .webm. " .
                "No other file format is currently supported.",
            'image.required' => "Image is required.",
            'image.image' => "Image is not a valid image file.",
            'image.mimes' => "Image is not a valid image file. Image should be type of " .
                ".gif, .jpg, .jpeg, .png, or .webp. No other file format is currently supported.",
        ];
    }
}
