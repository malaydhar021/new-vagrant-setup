<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CampaignStyle extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id',
        'name',
    ];

    public function campaigns()
    {
        $this->hasMany(Campaign::class, 'style_id', 'id');
    }
}
