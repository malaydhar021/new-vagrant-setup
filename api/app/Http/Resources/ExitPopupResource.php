<?php

namespace App\Http\Resources;

use App\Helpers\Hashids;
use Carbon\Carbon;

class ExitPopupResource extends Resource
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
            ];
        } else {
            return [
                'id' => Hashids::encode($this->id),
                'name' => $this->name,
                'header_text' => $this->header_text,
                'header_background_color' => $this->header_background_color,
                'header_text_color' => $this->header_text_color,
                'semi_header_text' => $this->semi_header_text,
                'semi_header_text_color' => $this->semi_header_text_color,
                'body_background_color' => $this->body_background_color,
                'cta_link_url' => $this->cta_link_url,
                'campaign' => new CampaignsResource($this->campaign),
                'btn_size' => $this->btn_size,
                'btn_text' => $this->btn_text,
                'btn_color' => $this->btn_color,
                'btn_text_color' => $this->btn_text_color,
                'created_by' => new UserResource($this->created_by),
                'created_at' => Carbon::parse($this->created_at)->toDateTimeString(),
                'updated_at' => Carbon::parse($this->updated_at)->toDateTimeString(),
            ];
        }
    }
}
