/**
 * ResetPasswordModel set request post data for making post request to api
 *
 * @package ResetPasswordModel
 * @author Tier5 LLC `<work@tier5.us>`
 * @version 1.0.0
 * @license Proprietary
 */

export class ResetPasswordModel {
  public email: string;
  public password : string;
  public password_confirmation : string;
  public token : string;
}
