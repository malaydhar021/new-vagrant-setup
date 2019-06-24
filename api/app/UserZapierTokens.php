<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserZapierTokens extends Model
{
    use SoftDeletes;

    /**
     *
     * user review review links
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function reviewLinks()
    {
        return $this->hasMany(ReviewLink::class, 'created_by', 'created_by');
    }

    /**
     * Exit Pop-ups owns by the user
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function exitPopups()
    {
        return $this->hasMany(ExitPopUp::class, 'created_by', 'created_by');
    }

}
