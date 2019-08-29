<?php

namespace App\Observers;

use App\Branding;

class BrandingObserver
{
    /**
     * Handle the branding "deleted" event.
     *
     * @param  \App\Branding  $branding
     * @return void
     */
    public function deleted(Branding $branding)
    {
        // remove brand from campaign
        if($branding->campaigns()->count() > 0) {
            foreach($branding->campaigns()->get() as $campaign) {
                $campaign->update(['branding' => 0, 'branding_id' => null]);
            }
        }
        // remove brand from sticky reviews
        if($branding->stickyReviews()->count() > 0) {
            foreach($branding->stickyReviews()->get() as $stickyReview) {
                $stickyReview->update(['has_brand' => 0, 'brand_id' => null]);
            }
        }
    }
}
