<?php

namespace App\Http\Resources;

use App\Helpers\Hashids;
use Carbon\Carbon;

class UserResource extends Resource
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
                'email' => $this->email,
                'image' => $this->image_url,
            ];
        } else {
            return [
                'id' => Hashids::encode($this->id),
                'name' => $this->name,
                'email' => $this->email,
                'image' => $this->image_url,
                'subscription' => new SubscriptionResource($this),
                'created_at' => Carbon::parse($this->created_at)->toDateTimeString(),
                'updated_at' => Carbon::parse($this->updated_at)->toDateTimeString(),
            ];
        }
    }
}
