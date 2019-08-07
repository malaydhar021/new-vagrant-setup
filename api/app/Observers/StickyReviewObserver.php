<?php

namespace App\Observers;

use App\StickyReview;
use App\Traits\WebsocketApi;

class StickyReviewObserver
{
    use WebsocketApi;
    /**
     * Handle the sticky review "created" event.
     *
     * @param  \App\StickyReview  $stickyReview
     * @return void
     */
    public function created(StickyReview $stickyReview)
    {
        $this->wsApiCall(config('websocket.api.sticky_reviews_count'));
        $this->wsApiCall(config('websocket.api.reviews_from_review_link_count'));
    }

    /**
     * Handle the sticky review "updated" event.
     *
     * @param  \App\StickyReview  $stickyReview
     * @return void
     */
    public function updated(StickyReview $stickyReview)
    {
        //
    }

    /**
     * Handle the sticky review "deleted" event.
     *
     * @param  \App\StickyReview  $stickyReview
     * @return void
     */
    public function deleted(StickyReview $stickyReview)
    {
        $this->wsApiCall(config('websocket.api.sticky_reviews_count'));
        $this->wsApiCall(config('websocket.api.reviews_from_review_link_count'));
    }

    /**
     * Handle the sticky review "restored" event.
     *
     * @param  \App\StickyReview  $stickyReview
     * @return void
     */
    public function restored(StickyReview $stickyReview)
    {
        $this->wsApiCall(config('websocket.api.sticky_reviews_count'));
        $this->wsApiCall(config('websocket.api.reviews_from_review_link_count'));
    }

    /**
     * Handle the sticky review "force deleted" event.
     *
     * @param  \App\StickyReview  $stickyReview
     * @return void
     */
    public function forceDeleted(StickyReview $stickyReview)
    {
        $this->wsApiCall(config('websocket.api.sticky_reviews_count'));
        $this->wsApiCall(config('websocket.api.reviews_from_review_link_count'));
    }
}
