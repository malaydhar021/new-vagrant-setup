/**
 * Interface for Review data interface
 * @interface ReviewDataInterface
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
export interface ReviewDataInterface {
    type: string;
    url_link: string;
    image: string;
    name: string;
    description: string;
    created_at: string;
    review_link: any;
    rating: any;
    has_brand: number;
    brands: any;
}