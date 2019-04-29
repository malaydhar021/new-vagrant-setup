<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ExitPopUp extends Model
{
    use SoftDeletes;

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['deleted_at'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'header_text',
        'header_background_color',
        'header_text_color',
        'semi_header_text',
        'semi_header_text_color',
        'body_background_color',
        'popup_backdrop_color',
        'cta_link_url',
        'has_campaign',
        'campaign_id',
        'has_email_field',
        'btn_size',
        'btn_text',
        'btn_color',
        'btn_text_color',
        'has_sticky_reviews',
        'style_id',
        'created_by',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'btn_size',
    ];

    /**
     * Get the exit popup's has campaign
     *
     * @param  string  $value
     * @return boolean
     */
    public function getHasCampaignAttribute($value)
    {
        return (boolean) $value;
    }

    /**
     * Get the exit popup's has sticky reviews
     *
     * @param  string  $value
     * @return boolean
     */
    public function getHasStickyReviewsAttribute($value)
    {
        return (boolean) $value;
    }

    /**
     * Get the exit popup's has email field
     *
     * @param  string  $value
     * @return boolean
     */
    public function getHasEmailFieldAttribute($value)
    {
        return (boolean) $value;
    }

    /**
     * Set the exit popup's paragraph text
     *
     * @param  string  $value
     * @return void
     */
    public function setParagraphTextAttribute($value)
    {
        $this->attributes['semi_header_text'] = $value;
    }

    /**
     * Get the exit popup's paragraph text
     *
     * @param  string  $value
     * @return string
     */
    public function getParagraphTextAttribute()
    {
        return $this->semi_header_text;
    }

    /**
     * Set the exit popup's paragraph text color
     *
     * @param  string  $value
     * @return void
     */
    public function setParagraphTextColorAttribute($value)
    {
        $this->attributes['semi_header_text_color'] = $value;
    }

    /**
     * Get the exit popup's paragraph text color
     *
     * @param  string  $value
     * @return string
     */
    public function getParagraphTextColorAttribute()
    {
        return $this->semi_header_text_color;
    }

    /**
     * Set the exit popup's button text
     *
     * @param  string  $value
     * @return void
     */
    public function setButtonTextAttribute($value)
    {
        $this->attributes['btn_text'] = $value;
    }

    /**
     * Get the exit popup's button text
     *
     * @param  string  $value
     * @return string
     */
    public function getButtonTextAttribute()
    {
        return $this->btn_text;
    }

    /**
     * Set the exit popup's button URL
     *
     * @param  string  $value
     * @return void
     */
    public function setButtonUrlAttribute($value)
    {
        $this->attributes['cta_link_url'] = $value;
    }

    /**
     * Get the exit popup's button URL
     *
     * @param  string  $value
     * @return string
     */
    public function getButtonUrlAttribute()
    {
        return $this->cta_link_url;
    }

    /**
     * Set the exit popup's button text color
     *
     * @param  string  $value
     * @return void
     */
    public function setButtonTextColorAttribute($value)
    {
        $this->attributes['btn_text_color'] = $value;
    }

    /**
     * Get the exit popup's button text color
     *
     * @param  string  $value
     * @return string
     */
    public function getButtonTextColorAttribute()
    {
        return $this->btn_text_color;
    }

    /**
     * Set the exit popup's button background color
     *
     * @param  string  $value
     * @return void
     */
    public function setButtonBackgroundColorAttribute($value)
    {
        $this->attributes['btn_color'] = $value;
    }

    /**
     * Get the exit popup's button background color
     *
     * @param  string  $value
     * @return string
     */
    public function getButtonBackgroundColorAttribute()
    {
        return $this->btn_color;
    }

    /**
     * Set the exit popup's button size
     *
     * @param  string  $value
     * @return void
     */
    public function setButtonSizeAttribute($value)
    {
        $this->attributes['btn_size'] = $value;
    }

    /**
     * The style that the exit popup renders
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function style()
    {
        return $this->belongsTo(ExitPopupStyle::class, 'style_id', 'id');
    }

    /**
     * The campaign, the exit pop-up has attached to
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function campaign()
    {
        return $this->belongsTo(Campaign::class);
    }

    /**
     * The sticky reviews attached to the exit pop-up
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function stickyReviews()
    {
        return $this->belongsToMany(StickyReview::class);
    }

    /**
     * The user owns the exit popup
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'created_by', 'id');
    }

    /**
     * The subscribed emails gathered by the exit popup
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function subscribedEmail()
    {
        return $this->hasMany(SubscribedEmail::class, 'exit_pop_up_id', 'id');
    }
}
