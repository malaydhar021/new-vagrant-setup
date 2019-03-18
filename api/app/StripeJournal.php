<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class StripeJournal extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'stripe_journal';

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id',
        'type',
        'object',
        'object_id',
        'object_meta',
        'created_at',
    ];

    /**
     * Set the journal's created at time.
     *
     * @param  string  $value
     * @return void
     */
    public function setCreatedAtAttribute($value)
    {
        $this->attributes['created_at'] = Carbon::createFromTimestamp($value)->toDateTimeString();
    }
}
