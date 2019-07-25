<?php

namespace App\Http\Resources;

use App\Helpers\Hashids;
use Carbon\Carbon;

class SubscriptionResource extends Resource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        if ($this->subscription) {
            if ($this->isBrief) {
                return [
                    'status' => $this->subscription_status,
                    'data' => [
                        'pricing_plan' => config("pricing.plans.{$this->pricing_plan}.id"),
                    ]
                ];
            }
            return [
                'status' => $this->subscription_status,
                'data' => [
                    'name' => $this->subscription->name,
                    'trial_ends_at' => $this->subscription->trial_ends_at ?
                        Carbon::parse($this->subscription->trial_ends_at)->toDateTimeString() : null,
                    'ends_at' => $this->subscription->ends_at ?
                        Carbon::parse($this->subscription->ends_at)->toDateTimeString() : null,
                    'subscriber' => Hashids::encode($this->id),
                    'pricing_plan' => config("pricing.plans.{$this->pricing_plan}"),
                    'created_at' => Carbon::parse($this->subscription->created_at)->toDateTimeString(),
                    'updated_at' => Carbon::parse($this->subscription->updated_at)->toDateTimeString(),
                ]
            ];
        } else {
            if ($this->isBrief) {
                return [
                    'status' => $this->subscription_status,
                    'data' => [
                        'pricing_plan' => config("pricing.plans.{$this->pricing_plan}.id"),
                    ]
                ];
            }
            return [
                'status' => $this->subscription_status,
                'data' => [
                    'pricing_plan' => config("pricing.plans.{$this->pricing_plan}")
                ],
            ];
        }
    }
}
