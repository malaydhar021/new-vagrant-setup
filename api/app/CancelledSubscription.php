<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CancelledSubscription extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'subscription_id',
        'reason',
        'description',
    ];

    /**
     * The user cancelled the subscription
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
