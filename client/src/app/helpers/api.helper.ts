import { environment } from '../../environments/environment';

/**
 * apiBaseUrl constant holds the api base url based on the environment
 * @constant apiBaseUrl
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
export const apiBaseUrl: string = environment.API_BASE_URL;

/**
 * WidgetUrl constant holds the widget script url based on the environment
 * @constant WidgetUrl
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
export const WidgetUrl: string = environment.WIDGET_BASE_URL;

/**
 * AuthApiEndPoints helper is holding all auth related api endpoints based on the environment
 * @class AuthApiEndPoints
 * @author Tier5 LLC `<work@tier5.us>`
 * @version 1.0.0
 * @license Proprietary
 */
export class AuthApiEndPoints {
  /**
   * Method to generate api endpoint for user authentication
   * @method authenticateUser
   * @since version 1.0.0
   * @returns string
   */
  public static get authenticateUser(): string {
    return apiBaseUrl.concat('/auth/login');
  }

  /**
   * Function to generate api endpoint to validate a token
   *
   * @since 1.0.0
   * @returns string
   */
  public static get validateToken(): string {
    return apiBaseUrl.concat('/authenticated-user-details');
  }

  /**
   * This method will return the api endpoint for logout
   *
   * @since 1.0.0
   * @returns string
   */
  public static get logout(): string {
    return apiBaseUrl.concat('/auth/logout');
  }

  /**
   * This method will return the forgot password api endpoint.
   * @since 1.0.0
   * @returns string
   */
  public static get forgotPassword(): string {
    return apiBaseUrl.concat('/auth/password/token');
  }

  /**
   * This method will return the api route for verify a token for reset password
   * @method resetPasswordVerifyToken
   * @since version 1.0.0
   * @returns string
   */
  public static get resetPasswordVerifyToken() : string {
    return apiBaseUrl.concat('/auth/password/token/');
  }

  /**
   * This method will return the api route for reset the password
   * @method resetPassword
   * @since version 1.0.0
   * @returns string
   */
  public static get resetPassword() : string {
    return apiBaseUrl.concat('/auth/password');
  }
}


/**
 * SignupApiEndpoints class responsible all the api routes which is responsible for user signup.
 * It got few static methods which returns respective api route endpoints
 * @class SignupApiEndpoints
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
export class SignupApiEndpoints {

  /**
   * checkEmailIfExists returns the api route endpoind for check an email if exists.
   * For signup instead of checkEmailIfExists method, valdiateEmailPassword method
   * has been used.
   * @method checkEmailIfExists
   * @since version 1.0.0
   * @returns string
   */
  public static get checkEmailIfExists() : string {
    return apiBaseUrl.concat('/auth/email-registration-status');
  }

  /**
   * valdiateEmailPassword returns the api route endpoind for check an email if exists.
   * This api also do the server side validation for email and password
   * @method valdiateEmailPassword
   * @since version 1.0.0
   * @returns string
   */
  public static get valdiateEmailPassword() : string {
    return apiBaseUrl.concat('/auth/validate-email-password');
  }

  /**
   * signup returns the api route endpoind for register an user
   * @method checkEmailIfExists
   * @since version 1.0.0
   * @returns string
   */
  public static get signup() : string {
    return apiBaseUrl.concat('/auth/register');
  }
}


/**
 * BrandingApiEndpoints helper class is holding all static methods for branding api endpoints based on the environment
 * @class BrandingApiEndpoints
 * @author Tier5 LLC `<work@tier5.us>`
 * @version 1.0.1
 * @license Proprietary
 */
export class BrandingApiEndpoints {
  /**
   * Method to generate api endpoint to get all brandings
   * @method brands
   * @since Version 1.0.0
   * @returns String
   */
  public static get brands(): string {
    return apiBaseUrl.concat('/brands');
  }

  /**
   * addBrand to generate api endpoint to add a brand. This deprecated api provider
   * ### *DEPRECATED* ###
   * @method addBrand
   * @since Version 1.0.0
   * @deprecated In version 1.0.1
   * @returns String 
   */
  public static get addBrand(): string {
    return apiBaseUrl.concat('/post-add-branding');
  }

  /**
   * updateBrand to generate api endpoint to update a brand. This deprecated api provider
   * ### *DEPRECATED* ###
   * @method updateBrand
   * @since Version 1.0.0
   * @deprecated In version 1.0.1
   * @returns String 
   */
  public static get updateBrand() : string {
    return apiBaseUrl.concat('/update-branding');
  }

  /**
   * deleteBrand to generate api endpoint to delete a brand. This deprecated api provider
   * ### *DEPRECATED* ###
   * @method deleteBrand
   * @since Version 1.0.0
   * @deprecated In version 1.0.1
   * @returns String 
   */
  public static get deleteBrand() : string {
    return apiBaseUrl.concat('/delete-branding');
  }
}

/**
 * CampaignApiEndpoints helper class is holding all static methods for campaign related api endpoints based on the environment
 * @class CampaignApiEndpoints
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
export class CampaignApiEndpoints {
  /**
   * Method to generate api endpoint to get all campaigns
   * @method campaigns
   * @since Version 1.0.0
   * @returns String
   */
  public static get campaigns() : string {
    return apiBaseUrl.concat('/campaigns');
  }

  /**
   * Method to generate api endpoint to add a campaign
   * ### *DEPRECATED* ###
   * @method addCampaign
   * @since Version 1.0.0
   * @deprecated In version 1.0.0
   * @returns String
   */
  public static get addCampaign() : string {
    return apiBaseUrl.concat('/campaigns');
  }

  /**
   * Method to generate api endpoint to update a campaign
   * ### *DEPRECATED* ###
   * @method updateCampaign
   * @since Version 1.0.0
   * @deprecated In version 1.0.0
   * @returns String
   */
  public static get updateCampaign() : string {
    return apiBaseUrl.concat('/campaigns');
  }

  /**
   * Method to generate api endpoint to delete a campaign
   * ### *DEPRECATED* ###
   * @method deleteCampaign
   * @since Version 1.0.0
   * @deprecated In version 1.0.0
   * @returns String
   */
  public static get deleteCampaign() : string {
    return apiBaseUrl.concat('/campaigns');
  }

  /**
   * Method to generate api endpoint to generate campaign script id
   * @method getCampaignSctiptId
   * @since Version 1.0.0
   * @returns String
   */
  public static get getCampaignSctiptId() : string {
    return apiBaseUrl.concat('/generate-campaign-random-js-id');
  }

  /**
   * Method to generate api endpoint to update status of a campaign
   * @method updateCampaignStatus
   * @since Version 1.0.0
   * @returns String
   */
  public static get updateCampaignStatus() : string {
    return apiBaseUrl.concat('/toggle-campaign-status');
  }

  /**
   * Method to generate api endpoint to get all available styles
   * @method styles
   * @since Version 1.0.0
   * @returns String
   */
  public static get styles() : string {
    return this.campaigns.concat('/styles');
  }
}

/**
 * StickyReviewsApiEndpoints helper class is holding all static methods for sitiky reviews api endpoints based on the environment
 * @class StickyReviewsApiEndpoints
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
export class StickyReviewsApiEndpoints {
  /**
   * Method to generate api endpoint to get all sticky reviews
   * @method stickyReviews
   * @since Version 1.0.0
   * @returns String
   */
  public static get stickyReviews() : string {
    return apiBaseUrl.concat('/sticky-reviews');
  }

  /**
   * Method to generate api endpoint to add a sticky review. This has been deprecated by api service provider
   * ### *DEPRECATED* ###
   * @method addStickyReview
   * @since Version 1.0.0
   * @returns String
   */
  public static get addStickyReview() : string {
    return apiBaseUrl.concat('/save-sticky-review');
  }

  /**
   * Method to generate api endpoint to update a sticky review. This has been deprecated by api service provider
   * ### *DEPRECATED* ###
   * @method updateStickyReview
   * @since Version 1.0.0
   * @returns String
   */
  public static get updateStickyReview() : string {
    return apiBaseUrl.concat('/update-sticky-review');
  }

  /**
   * Method to generate api endpoint to delete a sticky review. This has been deprecated by api service provider
   * ### *DEPRECATED* ###
   * @method deleteStickyReview
   * @since Version 1.0.0
   * @returns String
   */
  public static get deleteStickyReview() : string {
    return apiBaseUrl.concat('/delete-sticky-review');
  }

  /**
   * Method to generate api endpoint to assign a campaign to a sticky review. This has been deprecated by api service provider
   * ### *DEPRECATED* ###
   * @method assignCampaignToStickyReview
   * @since Version 1.0.0
   * @returns String
   */
  public static get assignCampaignToStickyReview() : string {
    return apiBaseUrl.concat('/assign-campaign-to-sticky-review');
  }
}

/**
 * ReviewLinkApiEndpoints helper class is holding all static methods for review links api endpoints based on the environment
 * @class ReviewLinkApiEndpoints
 * @author Tier5 LLC `<work@tier5.us>`
 * @version 1.1.0
 * @license Proprietary
 */
export class ReviewLinkApiEndpoints {
  /**
   * Method to generate api endpoint to get all review links
   * @method reviewLinks
   * @since Version 1.0.0
   * @returns String
   */
  public static get reviewLinks(): string {
    return apiBaseUrl.concat('/review-links');
  }

  /**
   * addReviewLinks to generate api endpoint to add a review link
   * ### *DEPRECATED* ###
   * @method addReviewLinks
   * @since Version 1.0.0
   * @deprecated In version 1.1.0
   * @returns String 
   */
  public static get addReviewLinks(): string {
    return apiBaseUrl.concat('/create-review-link');
  }

  /**
   * updateReviewLinks to generate api endpoint to update a review link
   * ### *DEPRECATED* ###
   * @method updateReviewLinks
   * @since Version 1.0.0
   * @deprecated In version 1.1.0
   * @returns String 
   */
  public static get updateReviewLinks() : string {
    return apiBaseUrl.concat('/update-review-link');
  }

  /**
   * deleteReviewLinks to generate api endpoint to delete a review link
   * ### *DEPRECATED* ###
   * @method deleteReviewLinks
   * @since Version 1.0.0
   * @deprecated In version 1.1.0
   * @returns String 
   */
  public static get deleteReviewLinks() : string {
    return apiBaseUrl.concat('/delete-review-link');
  }

  /**
   * checkDuplicateUrlSlug to generate api endpoint to check duplicate url slug
   * ### *DEPRECATED* ###
   * @method checkDuplicateUrlSlug
   * @since Version 1.0.0
   * @deprecated In version 1.1.0
   * @returns String 
   */
  public static get checkDuplicateUrlSlug() : string {
    return apiBaseUrl.concat('/check-duplicate-review-link');
  }
}


/**
 * UserApiEndpoints helper class is holding all static methods for user api endpoints based on the environment
 * @class UserApiEndpoints
 * @author Tier5 LLC `<work@tier5.us>`
 * @version 1.0.0
 * @license Proprietary
 */
export class UserApiEndpoints {
  /**
   * getAuthUserInfo to generate api endpoint to get authenticated user informations
   * @method getAuthUserInfo
   * @since Version 1.0.0
   * @returns String 
   */
  public static get getAuthUserInfo() : string {
    return apiBaseUrl.concat('/user');
  }

  /**
   * This method will return the api route for update the password
   * @method updatePassword
   * @since version 1.0.0
   * @returns string
   */
  public static get changePassword() : string {
    return apiBaseUrl.concat('/user/password');
  }

  /**
   * This method will return the api route for user
   * @method user
   * @since version 1.0.0
   * @returns string
   */
  public static get user() : string {
    return apiBaseUrl.concat('/user');
  }
}


/**
 * SubscriptionApiEndpoints helper class is holding all static methods for subscription api endpoints based on the environment
 * @class SubscriptionApiEndpoints
 * @author Tier5 LLC `<work@tier5.us>`
 * @version 1.0.0
 * @license Proprietary
 */
export class SubscriptionApiEndpoints {
  /**
   * subscription to generate api endpoint to implement CRUD on a user subscription
   * @method subscription
   * @since Version 1.0.0
   * @returns String 
   */
  public static get subscription() : string {
    return apiBaseUrl.concat('/user/subscription');
  }

  /**
   * cards to generate api endpoint to implement CRUD on a user card
   * @method cards
   * @since Version 1.0.0
   * @returns String 
   */
  public static get cards() : string {
    return apiBaseUrl.concat('/user/card');
  }
}

export class ExitPopupApiEndpoints {

  public static get getUserExitPopups(): string {
    return apiBaseUrl.concat('/exit-popups');
  }

  public static get addExitPopup(): string {
    return apiBaseUrl.concat('/exit-popups');
  }

  public static get getVisualStyles(): string {
    return apiBaseUrl.concat('/exit-popups/styles');
  }

  public static get getCampaignsList(): string {
    return apiBaseUrl.concat('/campaigns/?paginate=false');
  }

  public static get getStickyReviews(): string {
    return apiBaseUrl.concat('/sticky-reviews/?paginate=false');
  }

  public static get getCampaignsStyle(): string {
    return apiBaseUrl.concat('/campaigns/sticky-review-style/');
  }

  public static get getstickyReviewInfo(): string {
    return apiBaseUrl.concat('/sticky-reviews/');
  }

  public static get deleteExitPopup(): string {
    return apiBaseUrl.concat('/exit-popups/');
  }

  public static get getEditExitPopup(): string {
    return apiBaseUrl.concat('/exit-popups/');
  }

  // public static get searchExitPopups(): string {
  //     return apiBaseUrl.concat('/exit-popups/');
  // }

}

/**
 * @class UserReviewApiEndpoints
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
export class UserReviewApiEndpoints {
  /**
   * @method userReviewLinkInfo
   * @since Version 1.0.0
   * @returns String
   */
  public static get userReviewLinkInfo(): string {
    return apiBaseUrl.concat('/user-reviews');
  }
}