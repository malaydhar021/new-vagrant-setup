<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Helpers\Hashids;

class WidgetResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $brandingDetails = $this->whenLoaded('brandingDetails');
        if ($brandingDetails) {
            $brand =[
                'name' => $brandingDetails->name,
                'url' => $brandingDetails->url,
            ];
        } else {
            $brand = null;
        }

        $exitPopupDetails = $this->whenLoaded('exitPopUp');
        if ($exitPopupDetails) {
            if ($exitPopupDetails->load('style') && isset($exitPopupDetails->style)) {
                $exitPopupStyle = $exitPopupDetails->style->type;
            } else {
                $exitPopupStyle = null;
            }

            $exitPopup = [
                'id' => Hashids::encode($exitPopupDetails->id),
                'style' => $exitPopupStyle,
                'header_text' => $exitPopupDetails->header_text,
                'header_text_color' => $exitPopupDetails->header_text_color,
                'header_background_color' => $exitPopupDetails->header_background_color,
                'paragraph_text' => $exitPopupDetails->paragraph_text,
                'paragraph_text_color' => $exitPopupDetails->paragraph_text_color,
                'body_background_color' => $exitPopupDetails->body_background_color,
                'popup_backdrop_color' => $exitPopupDetails->popup_backdrop_color,
                'button_text' => $exitPopupDetails->button_text,
                'button_url' => $exitPopupDetails->button_url,
                'button_text_color' => $exitPopupDetails->button_text_color,
                'button_background_color' => $exitPopupDetails->button_background_color,
                'has_email_field' => $exitPopupDetails->has_email_field,
            ];
        } else {
            $exitPopup = null;
        }

        return [
            'unique_script_id' => $this->unique_script_id,
            'domain_name' => $this->domain_name,
            'is_active' => $this->is_active,
            'style' => $this->whenLoaded('campaignStyle')->type,
            'delay' => $this->delay,
            'delay_before_start' => $this->delay_before_start,
            'stay_timing' => $this->stay_timing,
            'loop' => $this->loop,
            'is_brand_on' => $this->is_brand_on,
            'brand' => $brand,
            'sticky_reviews' => (StickyReviewResource::collection($this->whenLoaded('stickyReviews')))->briefOnly(),
            'exit_pop_up' => $exitPopup,
        ];
    }
}
