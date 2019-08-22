<?php

namespace App\Providers;

use App\Observers\UserObserver;
use App\Observers\StickyReviewObserver;
use App\Observers\SubscribedEmailObserver;
use App\Observers\ReviewLinkObserver;
use App\User;
use App\StickyReview;
use App\ReviewLink;
use App\SubscribedEmail;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        User::observe(UserObserver::class);
        StickyReview::observe(StickyReviewObserver::class);
        SubscribedEmail::observe(SubscribedEmailObserver::class);
        ReviewLink::observe(ReviewLinkObserver::class);
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}
