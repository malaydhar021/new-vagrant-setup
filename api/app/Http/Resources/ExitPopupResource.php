<?php

namespace App\Http\Resources;

use App\Helpers\Hashids;
use Carbon\Carbon;

class ExitPopupResource extends Resource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        if ($this->isBrief) {
            return [
                'id' => Hashids::encode($this->id),
                'name' => $this->name,
            ];
        } else {
            return [
                'id' => Hashids::encode($this->id),
                'name' => $this->name,
                'has_campaign' => $this->has_campaign,
                'campaign' => (new CampaignsResource($this->whenLoaded('campaign'))),
                'has_sticky_reviews' => $this->has_sticky_reviews,
                'sticky_reviews' => (StickyReviewResource::collection($this->whenLoaded('stickyReviews')))->briefOnly(),
                'has_email_field' => $this->has_email_field,
                'header_text' => $this->header_text,
                'header_text_color' => $this->header_text_color,
                'header_background_color' => $this->header_background_color,
                'paragraph_text' => $this->paragraph_text,
                'paragraph_text_color' => $this->paragraph_text_color,
                'body_background_color' => $this->body_background_color,
                'popup_backdrop_color' => $this->popup_backdrop_color,
                'button_text' => $this->button_text,
                'button_url' => $this->button_url,
                'button_text_color' => $this->button_text_color,
                'button_background_color' => $this->button_background_color,
                // 'style' => (new ExitPopupStyleResource($this->whenLoaded('campaignStyle')))->briefOnly(), // style
                'style_id' => (new ExitPopupStyleResource($this->whenLoaded('style')))->briefOnly(),
                'cta_button_text' => $this->cta_button_text,
                'cta_button_text_color' => $this->cta_button_text_color,
                'cta_button_background_color' => $this->cta_button_background_color,
                'popup_preview_img' => $this->popup_preview_img,
                'created_by' => (new UserResource($this->whenLoaded('user')))->briefOnly(),
                'created_at' => Carbon::parse($this->created_at)->toDateTimeString(),
                'updated_at' => Carbon::parse($this->updated_at)->toDateTimeString(),
            ];
        }
    }
}
