import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DashboardApiEndpoints } from '../helpers/api.helper';

/**
 * This service will handle all api calls for a user dashboard
 * @class DashboardService
 * @author Tier5 LLC `<work@tier5.us>`
 * @version 2.0.0
 * @license Proprietary
 */
@Injectable()
export class DashboardService {
  constructor(private httpClient: HttpClient) { }

  /**
   * This method will make an api request to fetch analytics data
   * @method getAnalytics
   * @since Version 1.0.0
   * @returns Observable<Object>
   */
  public getAnalytics() {
    return this.httpClient.get(DashboardApiEndpoints.analytics);
  }
}