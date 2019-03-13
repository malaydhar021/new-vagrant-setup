<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Vinkla\Hashids\Facades\Hashids;
use Carbon\Carbon;

class User extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => Hashids::encode($this->id),
            'name' => $this->name,
            'email' => $this->email,
            'privileges' => config("pricing.plans.{$this->pricing_plan}.privileges"),
            'created_at' => Carbon::parse($this->created_at)->toDateTimeString(),
            'updated_at' => Carbon::parse($this->updated_at)->toDateTimeString(),
        ];
    }
}
