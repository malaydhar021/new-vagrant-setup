<?php

namespace App\Http\Resources;

use App\Helpers\Hashids;
use Carbon\Carbon;

class StickyReviewResource extends Resource
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
                'review_text' => $this->description,
                'image_url' => $this->image_url,
                'tags' => $this->tags,
                'rating' => $this->rating,
                'review_type' => $this->review_type,
            ];
        } else {
            return [
                'id' => Hashids::encode($this->id),
                'name' => $this->name,
                'review_text' => $this->description,
                'image_url' => $this->image_url,
                'tags' => $this->tags,
                'rating' => $this->rating,
                'review_type' => $this->review_type,
                'review_link' => (new ReviewLinkResource($this->review_link))->briefOnly(),
                'created_by' => (new UserResource($this->user))->briefOnly(),
                'created_at' => Carbon::parse($this->created_at)->toDateTimeString(),
                'updated_at' => Carbon::parse($this->updated_at)->toDateTimeString(),
            ];
        }
    }
}
