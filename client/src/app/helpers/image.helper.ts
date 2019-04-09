import { environment } from '../../environments/environment';

/**
 * imageBaseUrl constant holds base url for uploaded images
 * ### *DEPRECATED*
 * @constant imageBaseUrl
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @deprecated In version 1.0.0
 * @license Proprietary
 */
export const imageBaseUrl: string = environment.UPLOAD_BASE_URL;

/**
 * StickyReviewImages class will return the url of all images uploaded for sticky reviews
 * ### *DEPRECATED*
 * @class StickyReviewImages
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @deprecated In version 1.0.0
 * @license Proprietary
 */
export class StickyReviewImages {

    public static get url() : string {
        return imageBaseUrl.concat('/sticky-review-images');
    }
}