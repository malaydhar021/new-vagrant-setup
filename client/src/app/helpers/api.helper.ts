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
 * @version 1.0.0
 * @license Proprietery
 */
export class BrandingApiEndpoints {
  /**
   * Method to generate api endpoint to get all brandings
   * @method brands
   * @since Version 1.0.0
   * @returns String
   */
  public static get brands(): string {
    return apiBaseUrl.concat('/get-all-branding');
  }

  /**
   * addBrand to generate api endpoint to add a brand
   * @method addBrand
   * @since Version 1.0.0
   * @returns String 
   */
  public static get addBrand(): string {
    return apiBaseUrl.concat('/post-add-branding');
  }

  /**
   * updateBrand to generate api endpoint to update a brand
   * @method updateBrand
   * @since Version 1.0.0
   * @returns String 
   */
  public static get updateBrand() : string {
    return apiBaseUrl.concat('/update-branding');
  }

  /**
   * deleteBrand to generate api endpoint to delete a brand
   * @method deleteBrand
   * @since Version 1.0.0
   * @returns String 
   */
  public static get deleteBrand() : string {
    return apiBaseUrl.concat('/delete-branding');
  }
}

<<<<<<< HEAD
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
    return apiBaseUrl.concat('/get-all-campaigns');
  }

  /**
   * Method to generate api endpoint to add a campaign
   * @method addCampaign
   * @since Version 1.0.0
   * @returns String
   */
  public static get addCampaign() : string {
    return apiBaseUrl.concat('/add-campaign');
  }

  /**
   * Method to generate api endpoint to update a campaign
   * @method updateCampaign
   * @since Version 1.0.0
   * @returns String
   */
  public static get updateCampaign() : string {
    return apiBaseUrl.concat('/update-campaign-details');
  }

  /**
   * Method to generate api endpoint to delete a campaign
   * @method deleteCampaign
   * @since Version 1.0.0
   * @returns String
   */
  public static get deleteCampaign() : string {
    return apiBaseUrl.concat('/delete-campaign');
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
    return apiBaseUrl.concat('/get-all-sticky-reviews');
  }

  /**
   * Method to generate api endpoint to add a sticky review
   * @method addStickyReview
   * @since Version 1.0.0
   * @returns String
   */
  public static get addStickyReview() : string {
    return apiBaseUrl.concat('/save-sticky-review');
  }

  /**
   * Method to generate api endpoint to update a sticky review
   * @method updateStickyReview
   * @since Version 1.0.0
   * @returns String
   */
  public static get updateStickyReview() : string {
    return apiBaseUrl.concat('/update-sticky-review');
  }

  /**
   * Method to generate api endpoint to delete a sticky review
   * @method deleteStickyReview
   * @since Version 1.0.0
   * @returns String
   */
  public static get deleteStickyReview() : string {
    return apiBaseUrl.concat('/delete-sticky-review');
  }

  /**
   * Method to generate api endpoint to assign a campaign to a sticky review
   * @method assignCampaignToStickyReview
   * @since Version 1.0.0
   * @returns String
   */
  public static get assignCampaignToStickyReview() : string {
    return apiBaseUrl.concat('/assign-campaign-to-sticky-review');
  }
}
=======
>>>>>>> adbb90e72d4e8f287797be7eccef985a90669c15

/**
 * ReviewLinkApiEndpoints helper class is holding all static methods for review links api endpoints based on the environment
 * @class ReviewLinkApiEndpoints
 * @author Tier5 LLC `<work@tier5.us>`
 * @version 1.0.0
 * @license Proprietery
 */
export class ReviewLinkApiEndpoints {
  /**
   * Method to generate api endpoint to get all review links
   * @method reviewLinks
   * @since Version 1.0.0
   * @returns String
   */
  public static get reviewLinks(): string {
    return apiBaseUrl.concat('/get-all-review-link');
  }

  /**
   * addReviewLinks to generate api endpoint to add a review link
   * @method addReviewLinks
   * @since Version 1.0.0
   * @returns String 
   */
  public static get addReviewLinks(): string {
    return apiBaseUrl.concat('/create-review-link');
  }

  /**
   * updateReviewLinks to generate api endpoint to update a review link
   * @method updateReviewLinks
   * @since Version 1.0.0
   * @returns String 
   */
  public static get updateReviewLinks() : string {
    return apiBaseUrl.concat('/update-review-link');
  }

  /**
   * deleteReviewLinks to generate api endpoint to delete a review link
   * @method deleteReviewLinks
   * @since Version 1.0.0
   * @returns String 
   */
  public static get deleteReviewLinks() : string {
    return apiBaseUrl.concat('/delete-review-link');
  }
}
