<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class ReviewLink extends Model
{
    use SoftDeletes;
    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['deleted_at'];

    /**
     * relation with campaign
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function campaign() {
        return $this->hasOne('App\Campaign', 'id', 'campaign_id');
    }

    /**
     * converts url slug of reviewlink ID
     * @param null $url_slug
     * @return null
     */
    public static function urlSlugToReviewLinkId($url_slug = null) {
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
    public static function autoAssignToCampaign($url_slug = null, $sticky_review_id = null, $review_type = null, $rating = null) {
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
    
    /**
     * Function to create another attribute in stickyreviews data object
     * @return string Image url
     */
    public function getImageUrlAttribute()
    {
        return config('app.url'). "/uploads/sticky-review-images/{$this->image}";
    }
}
