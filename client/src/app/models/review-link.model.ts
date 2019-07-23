/**
 * ReviewLinkModel is holding the data param for each request like 
 * `create`, `list`, `update` and `delete` brands.
 * @class ReviewLinkModel
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
export class ReviewLinkModel {
    id?: string;
    logo?: File;
    description?: string;
    name?: string;
    url_slug?: string;
    campaign_id?: number;
    auto_approve?: number;
    min_rating?: number;
    negative_info_review_message_1?: string;
    negative_info_review_message_2?: string;
    positive_review_message?: string;
    created_by?: number;
    campaign?: any;
    page_background?: string;
    modal_background?: string;
    text_color?: string;
    copyright_text?: string;
    _method?: string;
    custom_domain?: any;
  }
