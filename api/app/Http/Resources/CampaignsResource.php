<?php

namespace App\Http\Resources;

use App\Helpers\Hashids;
use Carbon\Carbon;

class CampaignsResource extends Resource
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
                'campaign_name' => $this->campaign_name,
                'style' => (new CampaignStyleResource($this->whenLoaded('campaignStyle')))->briefOnly(),
            ];
        } else {
            return [
                'id' => Hashids::encode($this->id),
                'unique_script_id' => $this->unique_script_id,
                'campaign_name' => $this->campaign_name,
                'domain_name' => $this->domain_name,
                'style' => (new CampaignStyleResource($this->whenLoaded('campaignStyle')))->briefOnly(),
                'style_id' => $this->style_id,
                'delay' => $this->delay,
                'delay_before_start' => (!is_null($this->delay_before_start)) ? $this->delay_before_start : null,
                'stay_timing' => $this->stay_timing,
                'loop' => $this->loop,
                'exit_pop_up' => (new ExitPopupResource($this->whenLoaded('exitPopUp')))->briefOnly(),
                'branding' => (new BrandResource($this->whenLoaded('brandingDetails')))->briefOnly(),
                'sticky_reviews' => (StickyReviewResource::collection($this->whenLoaded('stickyReviews')))->briefOnly(),
                'is_active' => $this->is_active,
                'created_by' => (new UserResource($this->whenLoaded('user')))->briefOnly(),
                'created_at' => Carbon::parse($this->created_at)->toDateTimeString(),
                'updated_at' => Carbon::parse($this->updated_at)->toDateTimeString(),
            ];
        }
    }
}
