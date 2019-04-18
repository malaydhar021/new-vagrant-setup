import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserApiEndpoints } from '../helpers/api.helper';
import { UserUpdatePasswordModel } from '../models/user.model';

/**
 * This service will handle all operations related to user after login
 * @class AuthService
 * @author Tier5 LLC `<work@tier5.us>`
 * @version 1.0.0
 * @license Proprietary
 */

@Injectable()
export class UserService {

  constructor(
    private httpClient: HttpClient,
  ) { }

  /**
   * This method will make an api request and authenticate a user
   *
   * @since 1.0.0
   * @returns Observable<Object>
   */
  public getAuthUserInfo() {
    return this.httpClient.get(UserApiEndpoints.getAuthUserInfo);
  }


  /**
   * This method is used to call a service for changing the password
   * @method changePassword
   * @since version 1.0.0
   * @param data (UserUpdatePasswordModel)
   * @returns Observable<Object>
   */
  public changePassword(data : UserUpdatePasswordModel) {
    return this.httpClient.put(UserApiEndpoints.changePassword, data);
  }


  /**
   * This method is used to call a service for changing the profile
   * @method changeProfile
   * @since version 1.0.0
   * @param data (UserUpdatePasswordModel)
   * @returns Observable<Object>
   */
  public changeProfile(data : FormData) {
    return this.httpClient.post(UserApiEndpoints.user, data);
  }
}
