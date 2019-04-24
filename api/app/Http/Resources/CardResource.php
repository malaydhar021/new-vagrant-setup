<?php

namespace App\Http\Resources;

use Illuminate\Support\Str;

class CardResource extends Resource
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
            'number' => $this->card_last_four,
            'brand' => ucwords(str_replace('_', ' ', Str::snake($this->card_brand))),
            'expiry_month' => $this->card_exp_month,
            'expiry_year' => $this->card_exp_year,
            'owner' => (new UserResource($this))->briefOnly(),
        ];
    }
}
