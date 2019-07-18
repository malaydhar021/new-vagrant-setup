<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CampaignStickyReview extends Model
{
    //
    protected $table = 'campaign_sticky_review';

    public function stickyReviews()
    {
        $this->hasOne(StickyReview::class, 'id', 'sticky_review_id');
    }
}
