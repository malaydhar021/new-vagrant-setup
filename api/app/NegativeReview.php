<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class NegativeReview extends Model
{
    use SoftDeletes;
    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['deleted_at'];
    public static function storeNegativeReview($sticky_review_id = null, $email = null, $phone = null) {
        try {
            $negative_review = new NegativeReview();
            $negative_review->sticky_review_id = $sticky_review_id;
            $negative_review->email = $email;
            $negative_review->phone = $phone;
            if ($negative_review->save()) {
                return true;
            } else {
                return false;
            }
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * relation to sticky review
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function stickyReview() {
        return $this->hasOne('App\StickyReview', 'id', 'sticky_review_id');
    }
}
