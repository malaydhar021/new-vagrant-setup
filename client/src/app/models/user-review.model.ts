/**
 * User review model
 * @class UserReviewModel
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
export class UserReviewModel {
  recommendation?: any;
  review_title?: string;
  review_type?: any;
  review_text?: string;
  review_audio?: File;
  review_video?: File;
  rating?: any;
  email?: string;
  phone_number?: any;
  grant_review_use?: any;
  profile_picture?: File;
  review_link_id?: string;
  review_link_slug?: string;
  negative_review_message_1?: string;
  negative_review_message_2?: string;
  positive_review_message?: string;
}