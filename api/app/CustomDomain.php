<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CustomDomain extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'domain',
        'created_by',
    ];
    
    /**
     * The user owns the branding
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'created_by', 'id');
    }
}
