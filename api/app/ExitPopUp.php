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
        'created_by',
        'name',
        'header_text',
        'header_background_color',
        'header_text_color',
        'semi_header_text',
        'semi_header_text_color',
        'body_background_color',
        'cta_link_url',
        'campaign_id',
        'btn_size',
        'btn_text',
        'btn_color',
        'btn_text_color'
    ];

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
        return $this->belongsToMany('App\StickyReview');
    }
}
