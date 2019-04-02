import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { SignupApiEndpoints } from '../helpers/api.helper';
import { SignupValidateEmailPasswordModel, SignupModel } from '../models/signup.model';

/**
 * SignupService 
 * @class SignupService
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@Injectable()
export class SignupService {

  constructor(private httpClient: HttpClient) { }

  /**
   * checkSignupEmail will make an api call to check user provided email if already exists in database or not
   * @method checkSignupEmail
   * @since Version 1.0.0
   * @param email User input email
   * @returns Observable<Object>
   */
  public checkSignupEmail(email: string) {
    return this.httpClient.get(SignupApiEndpoints.checkEmailIfExists, { params: new HttpParams().set('email', email) });
  }

  /**
   * checkSignupEmail will make an api call to check user provided email if already exists in database or not
   * @method checkSignupEmail
   * @since Version 1.0.0
   * @param email User input email
   * @returns Observable<Object>
   */
  public validateEmailPassword(data: SignupValidateEmailPasswordModel) {
    return this.httpClient.post(SignupApiEndpoints.valdiateEmailPassword, data);
  }

  /**
   * doSignup method will make an api call to signup the user if request passed the validation
   * @method doSignup
   * @since Version 1.0.0
   * @returns Observable<Object> 
   */
  public doSignup(data: SignupModel) {
    return this.httpClient.post(SignupApiEndpoints.signup, data);
  }
}