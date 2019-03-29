import { environment } from '../../environments/environment';

export const apiBaseUrl: string = environment.API_BASE_URL;

/**
 * AuthApiEndPoints helper is holding all auth related api endpoints based on the environment
 * @class AuthApiEndPoints
 * @author Tier5 LLC `<work@tier5.us>`
 * @version 1.0.0
 * @license Proprietery
 */

export class AuthApiEndPoints {
  /**
   * Function to generate api endpoint for user authentication
   *
   * @since 1.0.0
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
 * BrandingApiEndpoints helper class is holding all static methods for branding api endpoints based on the environment
 * @class BrandingApiEndpoints
 * @author Tier5 LLC `<work@tier5.us>`
 * @version 1.0.0
 * @license Proprietery
 */
export class BrandingApiEndpoints {
  /**
   * Function to generate api endpoint to get all brandings
   *
   * @since 1.0.0
   * @returns string
   */
  public static get brandings(): string {
    return apiBaseUrl.concat('/get-all-branding');
  }
}
