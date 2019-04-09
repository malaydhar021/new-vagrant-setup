<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class StickyReview extends Model
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
    protected $fillable = ['created_by', 'name', 'description', 'image', 'rating'];

    protected $appends = ['image_url'];
    /**
     * this functions defines many to many relationship  to Campaign model
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function campaigns()
    {
        return $this->belongsToMany('App\Campaign');
    }

    /**
     * relation to negative reviews
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function negativeReviews()
    {
        return $this->belongsTo('App\NegativeReview', 'id', 'sticky_review_id');
    }
    /**
     * store record in sticky reviews coming from user review store procedure
     * @param null $created_by
     * @param null $name
     * @param null $description
     * @param null $image
     * @param null $rating
     * @param null $review_type
     * @param null $review_link_id
     * @return bool
     */
    public static function storeStickyReview(
        $created_by = null,
        $name = null,
        $description = null,
        $image = null,
        $rating = null,
        $review_type = null,
        $review_link_id = null
    ) {
        try {
            $sticky_review                  = new StickyReview();
            $sticky_review->created_by      = $created_by;
            $sticky_review->name            = $name;
            $sticky_review->description     = $description;
            $sticky_review->image           = $image;
            $sticky_review->rating          = $rating;
            if ($review_type === 3) {
                $findReview = ReviewLink::where('url_slug', $review_link_id)->first();
                if ($findReview) {
                    if ($findReview->auto_approve === 1 && $findReview->min_rating <= $rating) {
                        $sticky_review->review_type     = $review_type;
                    } else {
                        $sticky_review->review_type     = 2;
                    }
                } else {
                    return false;
                }
            } else {
                $sticky_review->review_type     = $review_type;
            }
            $sticky_review->review_link_id  = ReviewLink::urlSlugToReviewLinkId($review_link_id);
            if ($sticky_review->save()) {
                // to auto assign
                ReviewLink::autoAssignToCampaign($review_link_id, $sticky_review->id, $review_type, $rating);
                if ($review_type == 4) {
                    return $sticky_review->id;
                } else {
                    return true;
                }
            } else {
                return false;
            }
        } catch (\Exception $e) {
            \Log::info('sticky review save error'.$e->getMessage());
            return false;
        }
    }
    
    /**
     * Function to create another attribute in stickyreviews data object
     * @return string Image url
     */
    public function getImageUrlAttribute()
    {
        return config('app.url') . "/uploads/sticky-review-images/{$this->image}";
    }
}
