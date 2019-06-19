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
    type?: number;
    review_type?: number;
    name?: string;
    tags?: string;
    review?: string;
    review_text?: string;
    review_audio?: File;
    review_video?: File;
    rating?: number;
    reviewd_at?: string;
    image?: File;
    image_url?: string;
    created_at?: string;
    has_brand?: number;
    brand_id?: string;
    brands?: any;
}

/**
 * StickyReviewTypesModel model to hold data for review types. There are three types of
 * review type for now textual | audio | video
 * @class StickyReviewTypesModel
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
export class StickyReviewTypesModel {
    id: number;
    name: string;
    slug: string;
}