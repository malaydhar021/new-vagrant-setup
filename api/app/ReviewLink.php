<?php

namespace App;

use App\Traits\FileStorage;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ReviewLink extends Model
{
    use FileStorage, SoftDeletes;

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['deleted_at'];

    /**
     * Set the sticky review's image
     *
     * @param  \Illuminate\Http\UploadedFile  $value
     * @return void
     */
    public function setLogoAttribute($value)
    {
        if ($this->logo) {
            $this->deleteImageFile($this->logo);
        }

        $this->attributes['logo'] = $this->saveImageFile($value);
    }

    /**
     * Get review link's image URL
     *
     * @return string
     */
    public function getLogoUrlAttribute()
    {
        return $this->getImageFileURI($this->logo);
    }

    /**
     * Get review link's auto approve
     *
     * @param  string  $value
     * @return boolean
     */
    public function getAutoApproveAttribute($value)
    {
        return (boolean) $value;
    }

    /**
     * Get review link's auto approve
     *
     * @param  string  $value
     * @return integer
     */
    public function getMinRatingAttribute($value)
    {
        return (int) $value;
    }

    /**
     * Set review link's positive review message
     *
     * @param  string  $value
     * @return void
     */
    public function setPositiveReviewMessageAttribute($value)
    {
        $this->attributes['positive_review_msg'] = $value;
    }

    /**
     * Get review link's
     *
     * @return string
     */
    public function getPositiveReviewMessageAttribute()
    {
        return $this->positive_review_msg;
    }

    /**
     * Set review link's negative info review message 1
     *
     * @param  string  $value
     * @return void
     */
    public function setNegativeInfoReviewMessage1Attribute($value)
    {
        $this->attributes['negative_info_review_msg_1'] = $value;
    }

    /**
     * Get review link's
     *
     * @return string
     */
    public function getNegativeInfoReviewMessage1Attribute()
    {
        return $this->negative_info_review_msg_1;
    }

    /**
     * Set review link's negative info review message 2
     *
     * @param  string  $value
     * @return void
     */
    public function setNegativeInfoReviewMessage2Attribute($value)
    {
        $this->attributes['negative_info_review_msg_2'] = $value;
    }

    /**
     * Get review link's negative info review message 2
     *
     * @return string
     */
    public function getNegativeInfoReviewMessage2Attribute()
    {
        return $this->negative_info_review_msg_2;
    }

    /**
     * Get the campaigns which owns the review link
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function campaign()
    {
        return $this->hasOne(Campaign::class, 'id', 'campaign_id');
    }

    /**
     * Get the sticky reviews attached to the review lik
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function stickyReviews()
    {
        return $this->hasMany(StickyReview::class);
    }

    /**
     * Get the user owns the review link
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'created_by', 'id');
    }

    /**
     * converts url slug of reviewlink ID
     * @param null $url_slug
     * @return null
     */
    public static function urlSlugToReviewLinkId($url_slug = null)
    {
        if ($url_slug) {
            $findId = ReviewLink::where('url_slug', $url_slug)->first();
            if ($findId) {
                return $findId->id;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    /**
     * auto assign campaign
     * @param null $url_slug
     * @param null $sticky_review_id
     * @return bool
     */
    public static function autoAssignToCampaign($url_slug = null, $sticky_review_id = null, $review_type = null, $rating = null)
    {
        if ($url_slug && $sticky_review_id) {
            $findReview = ReviewLink::where('url_slug', $url_slug)->first();
            if ($findReview->auto_approve === 1 && $findReview->min_rating <= $rating) {
                if ($review_type === 1 || $review_type === 3) {
                    if ($findReview && $findReview->campaign_id != null) {
                        $findCampaign = Campaign::findOrFail($findReview->campaign_id);
                        if ($findCampaign) {
                            $findCampaign->stickyReviews()->attach($sticky_review_id);
                        } else {
                            return false;
                        }
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
}
