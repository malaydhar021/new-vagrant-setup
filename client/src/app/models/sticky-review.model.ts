/**
 * StickyReviewModel is holding the data param for each request like 
 * `create`, `list`, `update` and `delete` campaigns.
 * @class StickyReviewModel
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
export class StickyReviewModel {
    id?: number;
    review_type?: number;
    name?: string;
    tags?: string;
    description?: string;
    rating?: number;
    myDateString?: string;
    image?: File;
    image_url?: string;
    created_at?: string;
}