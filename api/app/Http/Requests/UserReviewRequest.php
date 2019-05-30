<?php

namespace App\Http\Requests;

use App\Helpers\Hashids;
use App\ReviewLink;

use Illuminate\Foundation\Http\FormRequest;

class UserReviewRequest extends FormRequest
{
    /**
     * Get the validator instance for the request.
     *
     * @return \Illuminate\Contracts\Validation\Validator
     */
    public function getValidatorInstance()
    {
        if ($this->request->has('review_link_id')) {
            $this->merge([
                'review_link_id' => Hashids::decode($this->request->get('review_link_id')),
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
        if (ReviewLink::whereUrlSlug($this->route('slug'))->first()) return true;

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
            'recommendation' => "required|boolean",
            'review_title' => "required|string|min:1|max:25",
            'review_type' => "required|integer|digits:1|min:1|max:3",
            'review_text' => "required_if:review_type,1|string|min:1|max:60",
            'review_audio' => "required_if:review_type,2|file|" .
                "mimetypes:application/octet-stream,application/ogg,audio/AMR,audio/x-matroska,audio/mpeg,audio/mp4," .
                "audio/ogg,audio/webm,video/webm,audio/vorbis,audio/wav,audio/wave,audio/vnd.wav,audio/x-aac,audio/x-ms-wma",
            'review_video' => "required_if:review_type,3|file|" .
                "mimetypes:application/octet-stream,application/ogg,video/3gpp,video/x-matroska,video/mp4," .
                "video/mpeg,video/ogg,video/quicktime,video/webm,video/x-flv,video/x-msvideo,video/x-ms-wmv",
            'rating' => "required|integer|digits:1|min:1|max:5",
            'email' => "required_if:recommendation,0|email",
            'phone_number' => "sometimes|nullable|phone:AUTO",
            'grant_review_use' => "required_if:recommendation,1|nullable",
            'profile_picture' => "required_if:grant_review_use,1|image|mimes:gif,jpeg,png,webp",
            'review_link_id' => "required|exists:review_links,id",
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
            'recommendation.required' => "Recommendation is required.",
            'recommendation.boolean' => "Recommendation should be yes or no.",
            'review_title.required' => 'Review title is required.',
            'review_title.min' => "Review title should be between 1 to 25 characters length long.",
            'review_title.max' => "Review title should be between 1 to 25 characters length long.",
            'review_type.required' => "Review type is required",
            'review_type.integer' => "Review type should be a valid integer",
            'review_type.digits' => "Review type should be a 1 digit integer.",
            'review_type.min' => "Review type should be among the 1, 2 or 3.",
            'review_type.max' => "Review type should be among the 1, 2 or 3.",
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
            'rating.required' => "Rating is required.",
            'rating.integer' => "Rating should be a valid integer.",
            'rating.digits' => "Rating should be a 1 digit integer.",
            'rating.min' => "Rating should be minimum 1 and maximum 5",
            'rating.max' => "Rating should be minimum 1 and maximum 5",
            'email.required_if' => "Email is required if not recommeneded.",
            'email.email' => "Email is not a valid email.  Example: jon@tier5.us",
            'phone_number.required_if' => "Phone number is required if not recommeneded.",
            'phone_number.phone' => "Phone number is not a valid phone number.",
            'grant_review_use.required_if' => "Grant review use is required if recommeneded.",
            'grant_review_use.boolean' => "Grant review use should be yes or no.",
            'profile_picture.required_if' => "Profile picture is required if granted to use review.",
            'profile_picture.image' => "Profile picture is not a valid image file.",
            'profile_picture.mimes' => "Profile picture is not a valid image file. Image should be type of " .
                ".gif, .jpg, .jpeg, .png, or .webp. No other file format is currently supported.",
            'review_link_id.required' => "Review link is required.",
            'review_link_id.exists' => "This review link does not matches our record, please specify a valid review link.",
        ];
    }
}
