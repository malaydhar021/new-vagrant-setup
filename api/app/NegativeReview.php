<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class NegativeReview extends Model
{
    use SoftDeletes;

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['deleted_at'];

    /**
     * Set the sticky review's phone number
     *
     * @param  string  $value
     * @return string
     */
    public function setPhoneNumberAttribute($value)
    {
        $this->attributes['phone'] = $value;
    }

    /**
     * Get the negative review's phone number
     *
     * @return string
     */
    public function getPhoneNumberAttribute()
    {
        return $this->phone;
    }

    /**
     * Get the negative review owns by sticky review
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function stickyReview()
    {
        return $this->hasOne(StickyReview::class, 'id', 'sticky_review_id');
    }
}
