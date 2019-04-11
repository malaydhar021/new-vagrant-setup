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
                'domain_name' => $this->domain_name,
                'style' => (new CampaignStyleResource($this->campaignStyle))->briefOnly(),
                'is_brief' => $this->isBrief,
            ];
        } else {
            return [
                'id' => Hashids::encode($this->id),
                'unique_script_id' => $this->unique_script_id,
                'campaign_name' => $this->campaign_name,
                'domain_name' => $this->domain_name,
                'style' => (new CampaignStyleResource($this->whenLoaded('campaignStyle')))->briefOnly(),
                'delay' => $this->delay,
                'delay_before_start' => $this->delay_before_start,
                'loop' => (boolean) $this->loop,
                'exit_pop_up' => (new ExitPopupResource($this->whenLoaded('exitPopUp')))->briefOnly(),
                'branding' => (new BrandResource($this->whenLoaded('brandingDetails')))->briefOnly(),
                'sticky_reviews' => (StickyReviewResource::collection($this->whenLoaded('stickyReviews')))->briefOnly(),
                'is_active' => (boolean) !$this->is_active,
                'created_by' => (new UserResource($this->whenLoaded('user')))->briefOnly(),
                'created_at' => Carbon::parse($this->created_at)->toDateTimeString(),
                'updated_at' => Carbon::parse($this->updated_at)->toDateTimeString(),
            ];
        }
    }
}
