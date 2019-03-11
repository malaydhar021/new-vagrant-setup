<?php

namespace App;

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
        'stripe_id',
        'card_brand',
        'card_last_four',
        'trial_ends_at',
        'is_third_party',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
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
}
