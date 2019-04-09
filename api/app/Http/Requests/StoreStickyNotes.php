<?php

namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
use Auth;

class StoreStickyNotes extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
//        if (is_integer($this->isAuthenticated())) {
//            return true;
//        } else {
//            return false;
//        }
        if (Auth::check()) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => 'required',
            'description' => 'required',
            // 'image' => 'required|image'
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
            'name.required' => 'Sticky review name is required!',
            'description.required' => 'Sticky review description is required!',
            'image.required' => 'Sticky review image is required!',
            'image.image' => 'Image should be type of jpg, jpeg, png, bmp, gif or svg. No other file format is supported.'
        ];
    }
}
