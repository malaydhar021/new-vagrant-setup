<?php

namespace App;

use App\Traits\FileStorage;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\ZapierWebhook;

class StickyReview extends Model
{
    use FileStorage, SoftDeletes, ZapierWebhook;

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

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
        'description',
        'image',
        'rating',
        'review_link_id',
        'has_brand',
        'brand_id',
        'created_by',
    ];

    /**
     * Set the sticky review's review title
     *
     * @param  string  $value
     * @return void
     */
    public function setReviewTitleAttribute($value)
    {
        $this->attributes['name'] = $value;
    }

    /**
     * Get the sticky review's review title
     *
     * @return string
     */
    public function getReviewTitleAttribute()
    {
        return $this->name;
    }

    /**
     * Set the sticky review's review text
     *
     * @param  string  $value
     * @return void
     */
    public function setReviewTextAttribute($value)
    {
        $this->attributes['description'] = $value;
    }

    /**
     * Get the sticky review's review text
     *
     * @return string
     */
    public function getReviewTextAttribute()
    {
        return $this->description;
    }

    /**
     * Set the sticky review's review audio
     *
     * @param  \Illuminate\Http\UploadedFile  $value
     * @return void
     */
    public function setReviewAudioAttribute($value)
    {
        if ($this->image) {
            $this->deleteImageFile($this->image);
        }

        $this->attributes['description'] = $this->saveAudioFile($value);
    }

    /**
     * Get the sticky review's review video
     *
     * @return string
     */
    public function getReviewAudioAttribute()
    {
        return $this->getAudioFileURI($this->description);
    }

    /**
     * Set the sticky review's review audio
     *
     * @param  \Illuminate\Http\UploadedFile  $value
     * @return void
     */
    public function setReviewVideoAttribute($value)
    {
        if ($this->image) {
            $this->deleteVideoFile($this->image);
        }

        $this->attributes['description'] = $this->saveVideoFile($value);
    }

    /**
     * Get the sticky review's review video
     *
     * @return string
     */
    public function getReviewVideoAttribute()
    {
        return $this->getVideoFileURI($this->description);
    }

    /**
     * Set the sticky review's image
     *
     * @param  \Illuminate\Http\UploadedFile  $value
     * @return void
     */
    public function setImageAttribute($value)
    {
        if ($this->image) {
            $this->deleteImageFile($this->image);
        }

        $this->attributes['image'] = $this->saveImageFile($value);
    }

    /**
     * Get the sticky review's image URL
     *
     * @return string
     */
    public function getImageUrlAttribute()
    {
        return $this->getImageFileURI($this->image);
    }

    /**
     * Set the sticky review's profile picture
     *
     * @param  \Illuminate\Http\UploadedFile  $value
     * @return void
     */
    public function setProfilePictureAttribute($value)
    {
        if ($this->image) {
            $this->deleteImageFile($this->image);
        }

        $this->attributes['image'] = $this->saveImageFile($value);
    }

    /**
     * Get the sticky review's profile picture
     *
     * @return string
     */
    public function getProfilePictureAttribute()
    {
        return $this->getImageFileURI($this->image);
    }

    /**
     * Get the sticky review's review type
     *
     * @param string $value
     * @return int
     */
    public function getReviewTypeAttribute($value)
    {
        return (int) $value;
    }

    /**
     * Get the sticky review's type
     *
     * @param string $value
     * @return int
     */
    public function getTypeAttribute($value)
    {
        switch ($value) {
            case "textual":
                return 1;
            case "audio":
                return 2;
            case "video":
                return 3;
            default:
                return (int) $value;
        };
    }

    /**
     * Get the sticky review's rating
     *
     * @param string $value
     * @return int
     */
    public function getRatingAttribute($value)
    {
        return (int) $value;
    }

    /**
     * Campaigns has attached the sticky review
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function campaigns()
    {
        return $this->belongsToMany(Campaign::class);
    }

    /**
     * Sticky reviews owns by negative reviews
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function negativeReviews()
    {
        return $this->belongsTo(NegativeReview::class, 'id', 'sticky_review_id');
    }

    /**
     * The user owns the sticky review
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'created_by', 'id');
    }

    /**
     * The review link accepts the sticky review
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function reviewLink()
    {
        return $this->belongsTo(ReviewLink::class);
    }

    /**
     * Brands with sticky reviews
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function brands()
    {
        return $this->hasOne(Branding::class, 'id', 'brand_id');
    }

    public function setIdAttribute ($value) {
        $this->attributes['id'] = $value;
        $this->checkAndSendStickyReviewDataToZapier($value);
        // \Log::info('I am inserting you ! '.$value);
    }

  /**
   * Function to return tags as an array
   * @param $value
   * @return array
   */
  public function getTagsAttribute($value)
  {
    $tagList = explode(",", $value);
    $str_arr = array_filter($tagList, function ($tag) {
        return strlen(trim($tag));
    });
    return $str_arr;
  }

}
