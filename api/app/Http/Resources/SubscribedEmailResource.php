<?php

namespace App\Http\Resources;

use App\Helpers\Hashids;
use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class SubscribedEmailResource extends JsonResource
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
            'email' => $this->email,
            'exit_popup' => (new ExitPopupResource($this->whenLoaded('exitPopup')))->briefOnly(),
            'created_at' => Carbon::parse($this->created_at)->toDateTimeString(),
            'updated_at' => Carbon::parse($this->updated_at)->toDateTimeString(),
        ];
    }
}
