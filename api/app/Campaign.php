<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Campaign extends Model
{
    use SoftDeletes;
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'unique_script_id',
        'created_by',
        'campaign_name',
        'domain_name',
        'styles',
        'delay',
        'delay_before_start',
        'loop',
        'exit_pop_up',
        'exit_pop_up_id',
        'branding',
        'branding_id',
        'is_active'
    ];

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['deleted_at'];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'styles',
        'deleted_at',
    ];

    /**
     * Set the campaign's domain name
     *
     * @param  strong  $value
     * @return void
     */
    public function setDomainNameAttribute($value)
    {
        $segements = null;
        preg_match('/^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/?\n]+)/', $value, $segements);

        $this->attributes['domain_name'] = $segements[1];
    }

    /**
     * this functions defines many to many relationship  to StickyReview model
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function stickyReviews()
    {
        return $this->belongsToMany('App\StickyReview')->orderBy('created_at','desc');
    }

    /**
     * this function returns the data of related branding
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function brandingDetails()
    {
        return $this->hasOne('App\Branding', 'id', 'branding_id');
    }

    /**
     * Exit pop up one to one relation
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function exitPopUp()
    {
        return $this->hasOne('App\ExitPopUp', 'id', 'exit_pop_up_id');
    }

    public function campaignStyle()
    {
        return $this->belongsTo(CampaignStyle::class, 'style_id', 'id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'created_by', 'id');
    }
}
