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
                'logo' => $this->logo,
                'url_slug' => $this->url_slug,
            ];
        } else {
            return [
                'id' => $this->id,
                'name' => $this->name,
                'logo' => $this->logo,
                'description' => $this->description,
                'url_slug' => $this->url_slug,
                'auto_approve' => (boolean) $this->auto_approve,
                'min_rating' => $this->min_rating,
                'negative_info_review_msg_1' => $this->negative_info_review_msg_1,
                'negative_info_review_msg_2' => $this->negative_info_review_msg_2,
                'positive_review_msg' => $this->positive_review_msg,
                'campaign' => (new CampaignsResource($this->campaign))->briefOnly(),
                'created_by' => (new UserResource($this->user))->briefOnly(),
                'created_at' => Carbon::parse($this->created_at)->toDateTimeString(),
                'updated_at' => Carbon::parse($this->updated_at)->toDateTimeString(),
            ];
        }
    }
}
