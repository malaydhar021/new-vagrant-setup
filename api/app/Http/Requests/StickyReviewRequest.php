<?php

namespace App\Http\Requests;

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
        if (Auth::check())  return true;

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
            'review_text' => "required_if:type,1|string|min:1|max:60",
            'review_audio' => "required_if:type,2|file|" .
                "mimetypes:application/ogg,audio/mpeg,audio/mp4,audio/ogg,audio/webm,audio/vorbis,audio/vnd.wav," .
                "audio/x-mpegurl",
            'review_video' => "required_if:type,3|file|" .
                "mimetypes:application/ogg,application/x-mpegURL,video/3gpp,video/mp4,video/MP2T,video/ogg," .
                "video/quicktime,video/webm,video/x-msvideo,video/x-ms-wmv",
            'image' => "required|image|mimes:gif,jpeg,png,tiff,x-icon,x-ms-bmp,webp",
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
                ".mp3, .mp4, .m3u, .wav, .webm or .ogg. No other file format is currently supported.",
            'review_video.required_if' => "Review video is required when type is video.",
            'review_video.mimetypes' => "Review video is not a valid video file. It should be type of " .
                ".mp4, .m3u8, .ts, .3gp, .mov, .avi, .wmv, .webm or .ogg. No other file format is currently supported.",
            'image.required' => "Image is required.",
            'image.image' => "Image is not a valid image file.",
            'image.mimes' => "Image is not a valid image file. Image should be type of " .
                ".jpg, .jpeg, .png, .bmp, .gif, .ico or .webp. No other file format is currently supported.",
        ];
    }
}
