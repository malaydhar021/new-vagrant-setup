import { Injectable } from '@angular/core';
import { Constants } from './constants';
import { HttpClient } from '@angular/common/http';
import {ChangePassword} from './models/changePassword';
@Injectable()
export class SettingserviceService {

  constructor(private http: HttpClient) { }

  /**
   * change password backend post
   * @param {ChangePassword} data
   * @returns {Observable<Object>}
   */
  changePassword(data: ChangePassword) {
    return this.http.post(Constants.changePasswordURL, data);
  }
}
