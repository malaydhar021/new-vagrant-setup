<?php

namespace App\Http\Resources;

use App\Helpers\Hashids;
use App\StickyReview;

use Illuminate\Http\Resources\Json\JsonResource;

class WidgetExitPopupResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $exitPopupDetails = $this->whenLoaded('exitPopUp');
        if ($exitPopupDetails) {
            if ($exitPopupDetails->load('style') && isset($exitPopupDetails->style)) {
                $exitPopupStyle = $exitPopupDetails->style->type;
            } else {
                $exitPopupStyle = null;
            }

            if ($exitPopupDetails->load('stickyReviews') && isset($exitPopupDetails->stickyReviews)) {
                $exitPopupSRQuery = StickyReview::join(
                    'exit_pop_up_sticky_review',
                    'exit_pop_up_sticky_review.sticky_review_id',
                    '=',
                    'sticky_reviews.id'
                )->where('exit_pop_up_sticky_review.exit_pop_up_id', $exitPopupDetails->id);

                if ($exitPopupSRQuery->count()) {
                    $exitPopupStickyReviews = $exitPopupSRQuery->paginate(5);
                    (StickyReviewResource::collection($exitPopupStickyReviews))->briefOnly();
                } else {
                    $exitPopupStickyReviews = [];
                }
//                $exitPopupStickyReviews = StickyReviewResource::collection($exitPopupDetails->stickyReviews)->briefOnly();
            } else {
                $exitPopupStickyReviews = null;
            }

            $exitPopup = [
                'id' => Hashids::encode($exitPopupDetails->id),
                'style' => $exitPopupStyle,
                'header_text' => $exitPopupDetails->header_text,
                'header_text_color' => $exitPopupDetails->header_text_color,
                'header_background_color' => $exitPopupDetails->header_background_color,
                'paragraph_text' => $exitPopupDetails->paragraph_text,
                'paragraph_text_color' => $exitPopupDetails->paragraph_text_color,
                'body_background_color' => $exitPopupDetails->body_background_color,
                'popup_backdrop_color' => $exitPopupDetails->popup_backdrop_color,
                'button_text' => $exitPopupDetails->button_text,
                'button_url' => $exitPopupDetails->button_url,
                'button_text_color' => $exitPopupDetails->button_text_color,
                'button_background_color' => $exitPopupDetails->button_background_color,
                'has_email_field' => $exitPopupDetails->has_email_field,
                'sticky_reviews' => $exitPopupStickyReviews,
                'cta_button_text' => $exitPopupDetails->cta_button_text,
                'cta_button_text_color' => $exitPopupDetails->cta_button_text_color,
                'cta_button_background_color' => $exitPopupDetails->cta_button_background_color,
            ];
        } else {
            $exitPopup = null;
        }

        return $exitPopup;
    }
}
