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
        $type = $this->type;

        switch ($this->type) {
            case 1:
                // $type = "textual";
                $review = $this->review_text;
                break;
            case 2:
                // $type = "audio";
                $review = $this->review_audio;
                break;
            case 3:
                // $type = "video";
                $review = $this->review_video;
                break;
            default:
                // $type = "textual";
                $review = $this->description;
        }

        if ($this->isBrief) {
            return [
                'id' => Hashids::encode($this->id),
                'name' => $this->name,
                'rating' => $this->rating,
                'type' => $type,
                'review' => $review,
                'image_url' => $this->image_url,
                'reviewed_at' => Carbon::parse($this->created_at)->toDateTimeString(),
                'created_by' => (new UserResource($this->user))->briefOnly(),
            ];
        } else {
            return [
                'id' => Hashids::encode($this->id),
                'name' => $this->name,
                'rating' => $this->rating,
                'type' => $type,
                'review' => $review,
                'image_url' => $this->image_url,
                'tags' => $this->tags,
                'review_type' => $this->review_type,
                'review_link' => (new ReviewLinkResource($this->whenLoaded('reviewLink')))->briefOnly(),
                'campaigns' => (CampaignsResource::collection($this->whenLoaded('campaigns')))->briefOnly(),
                'created_by' => (new UserResource($this->user))->briefOnly(),
                'reviewed_at' => Carbon::parse($this->created_at)->toDateTimeString(),
                'created_at' => Carbon::parse($this->created_at)->toDateTimeString(),
                'updated_at' => Carbon::parse($this->updated_at)->toDateTimeString(),
            ];
        }
    }
}
