<?php

namespace App\Http\Resources;

use App\Helpers\Hashids;
use Carbon\Carbon;

class BrandResource extends Resource
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
                'url' => $this->url,
            ];
        } else {
            return [
                'id' => Hashids::encode($this->id),
                'brand_name' => $this->brand_name,
                'url' => $this->url,
                'created_by' => (new UserResource($this->user))->briefOnly(),
                'created_at' => Carbon::parse($this->created_at)->toDateTimeString(),
                'updated_at' => Carbon::parse($this->updated_at)->toDateTimeString(),
            ];
        }
    }
}
