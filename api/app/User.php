<?php

namespace App;

use App\Notifications\CardExpiring;
use App\Notifications\CardUpdated;
use App\Notifications\PasswordResetRequest;
use App\Notifications\PasswordResetSuccess;
use App\Notifications\PasswordUpdated;
use App\Notifications\SubscriptionCreated;
use App\Notifications\SubscriptionDeleted;
use App\Notifications\SubscriptionTrialWillEnd;
use App\Notifications\SubscriptionUpdated;
use App\Traits\FileStorage;
use App\Traits\Subscription;
use App\Subscription as LocalSubscription;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\SoftDeletes;

use Laravel\Passport\HasApiTokens;
use Laravel\Cashier\Billable;
use App\Notifications\SubscriptionTerminated;


class User extends Authenticatable
{
    use Billable, FileStorage, HasApiTokens, Notifiable, Subscription, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'image',
        'stripe_id',
        'card_brand',
        'card_last_four',
        'card_exp_month',
        'card_exp_year',
        'subscription_status',
        'trial_ends_at',
        'pricing_plan',
        'affiliate_id',
        'is_third_party',
        'is_active',
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
     * Added soft delete to the deleted_at field
     * @var array
     */
    protected $dates = ['deleted_at'];

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
     * Set the user's image.
     *
     * @param  \Illumiate\Http\UploadedFile  $file
     * @return void
     */
    public function setImageAttribute($file)
    {
        if ($this->image) {
            $this->deleteImageFile($this->image);
        }

        $this->attributes['image'] = $this->saveImageFile($file);
    }

    /**
     * Get the user's image URL
     *
     * @return string
     */
    public function getImageUrlAttribute()
    {
        return $this->getImageFileURI($this->image);
    }

    public function setPricingPlanAttribute($value)
    {
        if ($value >= 1 && $value <= 3) {
            switch ($value) {
                case 1:
                    $value = 'lowest';
                    break;
                case 2:
                    $value = 'modest';
                    break;
                case 3:
                    $value = 'highest';
                    break;
                default:
                    $value = 'lowest';
            }
        }

        return $this->attributes['pricing_plan'] = $value;
    }

    /**
     * Get all the subscription of an user
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function localSubscriptions()
    {
        return $this->hasMany(LocalSubscription::class);
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
        $this->notify(new PasswordResetRequest($token, $this->name));
    }

    /**
     * Send password reset success notification with greetings
     *
     * @return void
     */
    public function sendPasswordResetSuccessNotification()
    {
        $this->notify(new PasswordResetSuccess($this->name));
    }

    /**
     * Send password updated notification with greetings
     *
     * @return void
     */
    public function sendPasswordUpdatedNotification()
    {
        $this->notify(new PasswordUpdated($this->name, $this->updated_at));
    }

    /**
     * Send subscription created notification with greetings
     *
     * @param boolean $isTrailing
     * @return void
     */
    public function sendSubscriptionCreatedNotification($isTrailing = false)
    {
        $this->notify(new SubscriptionCreated($this->name, $this->pricing_plan, $isTrailing));
    }

    /**
     * Send subscription deleted notification with greetings
     *
     * @return void
     */
    public function sendSubscriptionUpdatedNotification()
    {
        $this->notify(new SubscriptionUpdated($this->name, $this->pricing_plan));
    }

    /**
     * Send subscription deleted notification with greetings
     *
     * @return void
     */
    public function sendSubscriptionDeletedNotification()
    {
        $this->notify(new SubscriptionDeleted($this->name));
    }

    /**
     * Send subscription trial will end notification with greetings
     *
     * @return void
     */
    public function sendSubscriptionTrialWillEndNotification()
    {
        $this->notify(new SubscriptionTrialWillEnd($this->name));
    }

    /**
     * Send card expiring notification with greetings
     *
     * @return void
     */
    public function sendCardExpiringNotification()
    {
        $this->notify(new CardExpiring($this->name));
    }

    /**
     * Send card expiring notification with greetings
     *
     * @return void
     */
    public function sendCardUpdatedNotification()
    {
        $this->notify(new CardUpdated($this->name));
    }

    /**
     * Send subscription terminated notification with greetings
     *
     * @return void
     */
    public function sendSubscriptionTerminatedNotification()
    {
        $this->notify(new SubscriptionTerminated($this->name));
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
