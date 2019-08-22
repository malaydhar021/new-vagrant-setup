<?php

namespace App\Observers;

use App\StickyReview;
use App\ReviewLink;

class ReviewLinkObserver
{
    /**
     * Handle the review link "deleted" event.
     *
     * @param  \App\ReviewLink  $reviewLink
     * @return void
     */
    public function deleted(ReviewLink $reviewLink)
    {
        if($reviewLink->stickyReviews()->count() > 0) {
            foreach($reviewLink->stickyReviews()->get() as $stickyReview) {
                $stickyReview->update(['review_link_id' => null]);
            }
        }
    }
}
