<?php

namespace App;

use App\Notifications\PasswordResetRequest;
use App\Notifications\PasswordResetSuccess;
use App\Traits\Subscription;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

use Laravel\Passport\HasApiTokens;
use Laravel\Cashier\Billable;

class User extends Authenticatable
{
    use Billable, HasApiTokens, Notifiable, Subscription;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'affiliate_id',
        'subscription_status',
        'pricing_plan',
        'is_third_party',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'stripe_id',
        'card_brand',
        'card_last_four',
        'card_exp_month',
        'card_exp_year',
        'subscription_status',
        'trial_ends_at',
        'pricing_plan',
        'api_token',
    ];

    /**
     * Set the user's password.
     *
     * @param  string  $value
     * @return void
     */
    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = bcrypt($value);
    }

    /**
     * Get the subscription object of an user
     *
     * @return \Laravel\Cashier\Subscription
     */
    public function getSubscriptionAttribute()
    {
        return $this->subscription('main');
    }

    /**
     * Send password reset request notification with greetings
     *
     * @param string $token
     * @return void
     */
    public function sendPasswordResetRequestNotification($token)
    {
        return $this->notify(new PasswordResetRequest($token, $this->name));
    }

    /**
     * Send password reset success notification with greetings
     *
     * @return void
     */
    public function sendPasswordResetSuccessNotification()
    {
        return $this->notify(new PasswordResetSuccess($this->name));
    }

    /**
     * Brands owns by the user
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function brands()
    {
        return $this->hasMany(Branding::class);
    }

    /**
     * Get the count of brands owns by the user
     *
     * @return integer
     */
    public function getBrandsCountAttribute()
    {
        return $this->brands->count();
    }

    /**
     * Campaigns owns by the user
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function campaigns()
    {
        return $this->hasMany(Campaign::class, 'created_by', 'id');
    }

    /**
     * Get the count of campaigns owns by the user
     *
     * @return integer
     */
    public function getCampaignsCountAttribute()
    {
        return $this->campaigns->count();
    }

    /**
     * Review Links owns by the user
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function reviewLinks()
    {
        return $this->hasMany(ReviewLink::class, 'created_by', 'id');
    }

    /**
     * Get the count of review links owns by the user
     *
     * @return integer
     */
    public function getReviewLinksCountAttribute()
    {
        return $this->reviewLinks->count();
    }

    /**
     * Sticky reviews owns by the user and created by the user
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function stickyReviewsCreatedByOwner()
    {
        return $this->hasMany(StickyReview::class, 'created_by', 'id');
    }

    /**
     * Sticky reviews owns by the user and came from review links
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasManyThrough
     */
    public function stickyReviewsFromReviewLinks()
    {
        return $this->hasManyThrough(
            StickyReview::class,
            ReviewLink::class,
            'created_by',           // Foreign key on review_links table...
            'review_link_id',       // Foreign key on sticky_reviews table...
            'id',                   // Local key on users table...
            'id'                    // Local key on review_links table...
        );
    }

    /**
     * Get the count of sticky reviews owns by the user
     *
     * @return integer
     */
    public function getStickyReviewsCountAttribute()
    {
        return $this->stickyReviewsCreatedByOwner->count() + $this->stickyReviewsFromReviewLinks->count();
    }

    /**
     * Exit Pop-ups owns by the user
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function exitPopups()
    {
        return $this->hasMany(ExitPopUp::class, 'created_by', 'id');
    }

    /**
     * Get the count of exit Pop-ups owns by the user
     *
     * @return integer
     */
    public function getExitPopupsCountAttribute()
    {
        return $this->exitPopups->count();
    }

    /**
     * Cancelled subscriptions of the user
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function cancelledSubscriptions()
    {
        return $this->hasMany(CancelledSubscription::class);
    }
}
