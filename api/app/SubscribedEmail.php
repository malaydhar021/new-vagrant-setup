<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SubscribedEmail extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [];

    /**
     * The exit popup gathers the subscribed email
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function exitPopup()
    {
        return $this->belongsTo(ExitPopUp::class, 'exit_pop_up_id', 'id');
    }
}
