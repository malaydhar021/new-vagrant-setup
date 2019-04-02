/**
 * SignupModel set request object for signing up a user
 * @class SignupModel
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
export class SignupModel {
  name: string;
  email: string;
  password: string;
  card_number: number;
  cvc_number: number;
  expiry_month: number;
  expiry_year: number;
  affiliate_id: any;
}

/**
 * SignupValidateEmailPasswordModel set request object for validating email and password
 * @class SignupValidateEmailPasswordModel
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
export class SignupValidateEmailPasswordModel {
  email: string;
  password: string;
}