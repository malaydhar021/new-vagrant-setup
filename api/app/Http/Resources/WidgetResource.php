<?php

namespace App\Http\Resources;

use App\Helpers\Hashids;
use App\StickyReview;

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
        $brandingDetails = $this->whenLoaded('brandingDetails');
        if ($brandingDetails) {
            $brand = [
                'name' => $brandingDetails->name,
                'url' => $brandingDetails->url,
            ];
        } else {
            $brand = null;
        }

        $exitPopupDetails = $this->whenLoaded('exitPopUp');
        if ($exitPopupDetails) {
            $exitPopup = true;
        } else {
            $exitPopup = null;
        }

        $srQuery = StickyReview::join(
            'campaign_sticky_review',
            'campaign_sticky_review.sticky_review_id',
            '=',
            'sticky_reviews.id'
        )->where('campaign_sticky_review.campaign_id', $this->id);

        if ($srQuery->count()) {
            $stickyReviews = $srQuery->paginate(5);
            (StickyReviewResource::collection($stickyReviews))->briefOnly();
        } else {
            $stickyReviews = [];
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
            'sticky_reviews' => $stickyReviews,
            'has_exit_pop_up' => $exitPopup ? true : false,
            'exit_pop_up' => $exitPopup, // will be deprecated in next release
        ];
    }
}
