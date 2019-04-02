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
