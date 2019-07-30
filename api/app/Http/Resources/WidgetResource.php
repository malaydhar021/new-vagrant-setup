<?php

namespace App\Http\Resources;

use App\Helpers\Hashids;
use App\StickyReview;
use App\CampaignStickyReview;

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

        $getStickyReviewsIds =  CampaignStickyReview::where('campaign_id', $this->id)->pluck('sticky_review_id');

        $srQuery = StickyReview::whereIn('id', $getStickyReviewsIds)->with('brands')->orderBy('created_at', 'DESC');

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
