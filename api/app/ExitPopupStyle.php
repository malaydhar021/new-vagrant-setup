<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ExitPopupStyle extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'type',
    ];

    /**
     * Exit popup uses the style
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function exitPopups()
    {
        $this->hasMany(ExitPopUp::class, 'style_id', 'id');
    }
}
