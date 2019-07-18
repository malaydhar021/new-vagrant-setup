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
        'style_id',
        'delay',
        'delay_before_start',
        'stay_timing',
        'loop',
        'exit_pop_up',
        'exit_pop_up_id',
        'branding',
        'branding_id',
        'custom_domain_id',
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
     * @param  string  $value
     * @return void
     */
    public function setDomainNameAttribute($value)
    {
        $segements = null;
        preg_match('/^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/?\n]+)/', $value, $segements);

        $this->attributes['domain_name'] = $segements[1];
    }

    /**
     * Get the campaign's domain name
     *
     * @param  string  $value
     * @return string
     */
    public function getDomainNameAttribute($value)
    {
        $segements = null;
        preg_match('/^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/?\n]+)/', $value, $segements);

        return $segements[1];
    }

    /**
     * Get the campaign's delay
     *
     * @param  string  $value
     * @return integer
     */
    public function getDelayAttribute($value)
    {
        return (int) $value;
    }

    /**
     * Get the campaign's delay before start
     *
     * @param  string  $value
     * @return integer
     */
    public function getDelayBeforeStartAttribute($value)
    {
        return (int) $value;
    }

    /**
     * Get the campaign's stay timing
     *
     * @param  string  $value
     * @return integer
     */
    public function getStayTimingAttribute($value)
    {
        return (int) $value;
    }

    /**
     * Get the campaign's loop
     *
     * @param  string  $value
     * @return boolean
     */
    public function getLoopAttribute($value)
    {
        return (boolean) $value;
    }

    /**
     * Get the campaign's is active
     *
     * @param  string  $value
     * @return boolean
     */
    public function getIsActiveAttribute($value)
    {
        return (boolean) ! $value;
    }

    /**
     * Get the campaign's is active
     *
     * @return boolean
     */
    public function getIsBrandOnAttribute()
    {
        return (boolean) $this->branding;
    }

    /**
     * Stiky reviews attached to the campaign
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function stickyReviews()
    {
        return $this->belongsToMany(StickyReview::class)->orderBy('created_at','desc');
    }

    /**
     * The Branding attached to the campaign
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function brandingDetails()
    {
        return $this->hasOne(Branding::class, 'id', 'branding_id');
    }

    /**
     * The exit pop-up attached to the campaign
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function exitPopUp()
    {
        return $this->hasOne(ExitPopUp::class, 'id', 'exit_pop_up_id');
    }

    /**
     * The campaign style decorates the campaign
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function campaignStyle()
    {
        return $this->belongsTo(CampaignStyle::class, 'style_id', 'id');
    }

    /**
     * The user owns the campaign
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'created_by', 'id');
    }
    
    /**
     * Get the custom domain associated with the campaign
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function customDomain()
    {
        return $this->belongsTo(CustomDomain::class);
    }
}
