import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { of as observableOf } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Constants } from './constants';

import { AuthResponse } from './interfaces/authResponse';

import { Login } from './models/user';

@Injectable()
export class AuthenticateserviceService {

  constructor(private http: HttpClient) { }

  /**
   * this function authenticate one user
   * @param {User} user
   * @returns {Observable<Object>}
   */
  doLogin(login: Login) {
    return this.http.post<AuthResponse>(Constants.authenticateUser, login);
  }

  /**
   * this function authenticate one user
   * @param {User} user
   * @returns {Observable<Object>}
   */
  doSignup(user: any) {
    return this.http.post(Constants.signupUser, user);
  }

  /**
   * this function get logged in user details from backend api call to put it in localstorage
   * @param {string} token
   * @returns {Observable<Object>}
   */
  getUserDetails(token: string) {
    return this.http.get(Constants.getUserDetails + '?token=' + token);
  }

  /**
   * this function logs user out
   * @param {string} token
   * @returns {Observable<Object>}
   */
  doLogout(token: string) {
    return this.http.post(Constants.signOutUser + '?token=' + token, null);
  }

  /**
   * this function refreshs Auth Token in exchange of expired Auth token
   * @param {string} token
   * @returns {Observable<Object>}
   */
  refreshToken(token: string) {
    /**
     * The call that goes in here will use the existing refresh token to call
     * a method on the oAuth server (usually called refreshToken) to get a new
     * authorization token for the API calls.
     */
    return this.http.post(Constants.refreshAuthToken + '?token=' + token, null).pipe(
      switchMap((resp: { status: boolean, token: string }) => {
        return observableOf(resp.token).pipe();
      }
    ));
  }

  /**
   * this function used by auth guard to check if user is actually logged in or not (middleware)
   * @returns {boolean}
   */
  checkLogin(): boolean {
    if (localStorage.getItem('_cu')) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * this function fetch all the stripe plans
   * @returns {Observable<Object>}
   */
  getStripePlans() {
    return this.http.get(Constants.getStripePlans);
  }
}
