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

        $getStickyReviewIds =  CampaignStickyReview::where('campaign_id', $this->id)->pluck('sticky_review_id');

        $srQuery = StickyReview::whereIn('id', $getStickyReviewIds)->with('brands')->orderBy('created_at', 'DESC');
        // Please do not remove the following commented out block
        /*
        $srQuery = StickyReview::whereIn('id', $getStickyReviewIds)->where(function ($q) {
            return $q->where(function ($q1) {
                return $q1->where('review_type', 1)->orWhere(function ($q2) {
                    return $q2->where('review_type', 3)->where(function ($q3) {
                        return $q3->where('is_accept', 1)->orWhere('is_accept', null);
                    });
                });
            })->orWhere(function ($q1) {
                return $q1->where(function ($q2) {
                    return $q2->where('review_type', 2)->orWhere('is_accept', 1);
                })->where(function ($q2) {
                    return $q2->where('review_type', 4)->orWhere('is_accept', 1);
                });
            });
        })->with('brands')->orderBy('created_at', 'DESC');
        */

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
