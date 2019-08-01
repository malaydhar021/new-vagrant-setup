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
      // Identify the user card info and make pay_info as 0 or 1 depending on the user card is added to or not.
      if($this->card_last_four != null ){
        $haveCard = 1;  // If card is added then the value will be 1
      }else{
        $haveCard = 0; // If card is not added then the value will be 0
      }
        if ($this->isBrief) {
            return [
                'id' => Hashids::encode($this->id),
                'name' => $this->name,
                'email' => $this->email,
            ];
        } else {
            return [
                'id' => Hashids::encode($this->id),
                'name' => $this->name,
                'email' => $this->email,
                'image' => $this->image_url,
                'pay_info'=> $haveCard,
                'subscription' => new SubscriptionResource($this),
                'created_at' => Carbon::parse($this->created_at)->toDateTimeString(),
                'updated_at' => Carbon::parse($this->updated_at)->toDateTimeString(),
            ];
        }
    }
}
