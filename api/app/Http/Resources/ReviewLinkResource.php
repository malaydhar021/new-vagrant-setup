<?php

namespace App\Http\Resources;

use App\Helpers\Hashids;
use Carbon\Carbon;

class ReviewLinkResource extends Resource
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
                'url_slug' => $this->url_slug,
                'logo' => $this->logo_url,
            ];
        } else {
            return [
                'id' => Hashids::encode($this->id),
                'name' => $this->name,
                'url_slug' => $this->url_slug,
                'logo' => $this->logo_url,
                'description' => $this->description,
                'auto_approve' => $this->auto_approve,
                'min_rating' => $this->min_rating,
                'positive_review_message' => $this->positive_review_message,
                'negative_info_review_message_1' => $this->negative_info_review_message_1,
                'negative_info_review_message_2' => $this->negative_info_review_message_2,
                'campaign' => (new CampaignsResource($this->whenLoaded('campaign')))->briefOnly(),
                'sticky_reviews' => (StickyReviewResource::collection($this->whenLoaded('stickyReview')))->briefOnly(),
                'created_by' => (new UserResource($this->whenLoaded('user')))->briefOnly(),
                'created_at' => Carbon::parse($this->created_at)->toDateTimeString(),
                'updated_at' => Carbon::parse($this->updated_at)->toDateTimeString(),
            ];
        }
    }
}
