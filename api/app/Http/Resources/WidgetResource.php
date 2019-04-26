<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

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
            'brand' => [
                'name' => $this->whenLoaded('brandingDetails')->name,
                'url' => $this->whenLoaded('brandingDetails')->url,
            ],
            'sticky_reviews' => (StickyReviewResource::collection($this->whenLoaded('stickyReviews')))->briefOnly(),
            'exit_pop_up' => [
                // 'style' => $this->whenLoaded('exitPopup')->style->type,
                'header_text' => $this->whenLoaded('exitPopUp')->header_text,
                'header_text_color' => $this->whenLoaded('exitPopUp')->header_text_color,
                'header_background_color' => $this->whenLoaded('exitPopUp')->header_background_color,
                'paragraph_text' => $this->whenLoaded('exitPopUp')->paragraph_text,
                'paragraph_text_color' => $this->whenLoaded('exitPopUp')->paragraph_text_color,
                'body_background_color' => $this->whenLoaded('exitPopUp')->body_background_color,
                'popup_backdrop_color' => $this->whenLoaded('exitPopUp')->popup_backdrop_color,
                'button_text' => $this->whenLoaded('exitPopUp')->button_text,
                'button_url' => $this->whenLoaded('exitPopUp')->button_url,
                'button_text_color' => $this->whenLoaded('exitPopUp')->button_text_color,
                'button_background_color' => $this->whenLoaded('exitPopUp')->button_background_color,
                'has_email_field' => $this->whenLoaded('exitPopUp')->has_email_field,
            ],
        ];
    }
}
