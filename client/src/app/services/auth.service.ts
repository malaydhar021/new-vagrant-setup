import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthModel } from '../models/auth.model';
import { ForgotPasswordModel } from '../models/forgot-password.model';
import { AuthApiEndPoints } from '../helpers/api.helper';
import { Log } from '../helpers/app.helper';
import { Observable, of } from 'rxjs';
import { ResetPasswordModel } from '../models/reset-password.model';
import { UserUpdatePasswordModel } from '../models/user.model';

/**
 * This service will handle all operations related to user login and authentication
 * @class AuthService
 * @author Tier5 LLC `<work@tier5.us>`
 * @version 1.0.0
 * @license Proprietary
 */

@Injectable()
export class AuthService {
  constructor(private httpClient: HttpClient, private router: Router, private cookieService: CookieService) { }

  /**
   * This method will make an api request and authenticate a user
   *
   * @since 1.0.0
   * @param auth authModel<Object>
   * @returns Observable<Object>
   */
  public doLogin(auth: AuthModel) {
    return this.httpClient.post(AuthApiEndPoints.authenticateUser, auth);
  }

  /**
   * Function to determine whether a user is loggedIn or not
   *
   * @since 1.0.0
   * @returns boolean
   */
  public get isAuthenticated() {
    // return this.validateToken(this.getToken);
    // return of(false);
    return (this.getToken) ? true : false;
  }

  /**
   * Function to get the token from localstorage
   *
   * @since 1.0.0
   * @returns boolean
   */
  public get getToken() {
    let data = null;
    switch (this.cookieService.get('_rm')) {
      case 'on':
        data = localStorage.getItem('_sr') ? JSON.parse(localStorage.getItem('_sr')) : null;
        break;
      case 'off':
        data = sessionStorage.getItem('_sr') ? JSON.parse(sessionStorage.getItem('_sr')) : null;
        break;
      default:
        data = localStorage.getItem('_sr') ? JSON.parse(localStorage.getItem('_sr')) : null;
        break;
    }

    if (data !== null && data.token !== '' && data.token !== null && typeof data.token !== 'undefined') {
      return data.token;
    } else {
      return false;
    }
  }

  /**
   * Function that returns the api endpoing with query string to validate a token
   *
   * @since 1.0.0
   * @param token string
   * @returns Observable<Object>
   */
  public validateToken(token: string) {
    return this.httpClient.get(AuthApiEndPoints.validateToken, { params: new HttpParams().set('token', token) });
  }

  /**
   * Function to make a post request to logout the user
   * @method doLogout
   * @since versoin 1.0.0
   * @param token string
   * @returns Observable<Object>
   */
  public get doLogout() {
    return this.httpClient.post(AuthApiEndPoints.logout, null);
  }

  /**
   * Method to remove sessionStorage/localStorage data from browser
   * @method removeStorageData
   * @since version 1.0.0
   * @returns void
   */
  public removeStorageData() {
    localStorage.removeItem('_sr');
    sessionStorage.removeItem('_sr');
    this.cookieService.delete('_rm');
  }

  /**
   * This method will post the email to forgot password api
   * @method forgotPassword
   * @since 1.0.0
   * @returns Observable<Object>
   */
  public forgotPassword(data: ForgotPasswordModel) {
    return this.httpClient.post(AuthApiEndPoints.forgotPassword, data);
  }

  /**
   * This method accept the token which needs to be verified and make an api call to api route
   * @method resetPasswordValidateToken
   * @since version 1.0.0
   * @param token (string) The token to verify
   * @returns Observable<Object>
   */
  public resetPasswordValidateToken(token : string) {
    return this.httpClient.get(AuthApiEndPoints.resetPasswordVerifyToken.concat(token));
  }

  /**
   * This method accept the token which needs to be verified and make an api call to api route
   * @method resetPasswordValidateToken
   * @since version 1.0.0
   * @param token (string) The token to verify
   * @returns Observable<Object>
   */
  public resetPassword(data : ResetPasswordModel) {
    return this.httpClient.put(AuthApiEndPoints.resetPassword, data);
  }

  /**
   * This method is used to call a service for changing the password
   * @method changePassword
   * @since version 1.0.0
   * @param data (UserUpdatePasswordModel)
   * @returns Observable<Object>
   */
  public changePassword(data : UserUpdatePasswordModel) {
    return this.httpClient.put(AuthApiEndPoints.changePassword, data);
  }
}
