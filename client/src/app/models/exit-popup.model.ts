/**
 * Exitpopup Model is holding the data param for each request like
 * `create`, `list`, `update` and `delete` brands.
 * @class ExitPopupModel
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */

export class ExitPopupModel {
    name?: string;
    has_campaign?: boolean;
    campaign_id?: string;
    has_sticky_reviews?: boolean;
    sticky_reviews?: any;
    has_email_field?: boolean;
    header_text?: string;
    header_text_color?: string;
    header_background_color?: string;
    paragraph_text?: string;
    paragraph_text_color?: string;
    body_background_color?: string;
    popup_backdrop_color?: string;
    button_text?: string;
    button_url?: string;
    button_text_color?: string;
    button_background_color?: string;
    style_id?: string;
    cta_button_text?: string;
    cta_button_text_color?: string;
    cta_button_background_color?: string;
    popup_preview_img?: string;
    popup_action?: string;
}