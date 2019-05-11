/**
 * User review model
 * @class UserReviewModel
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
export class UserReviewModel {
  recommendation?: boolean;
  review_title?: string;
  review_type?: number;
  review_text?: string;
  review_audio?: File;
  review_video?: File;
  rating?: number;
  email?: string;
  phone_number?: number;
  grant_review_use?: boolean;
  profile_picture?: File;
  review_link_id?: string;
}