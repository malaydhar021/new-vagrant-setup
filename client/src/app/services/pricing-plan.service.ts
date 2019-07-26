import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PricingPlansApiEndpoints } from '../helpers/api.helper';

/**
 * Service for get all plans with respective pricing and features for each plans
 * @class PricingPlanService
 * @author Tier5 LLC `<work@tier5.us>`
 * @version 1.0.0
 * @license Proprietary
 */
@Injectable()
export class PricingPlanService {
  /**
   * Constructor method to inject HttClient module available to all other methods
   * @constructor constructor
   * @since Version 1.0.0
   * @param httpClient HttpClient module from angular
   * @returns Void
   */
  constructor(private httpClient: HttpClient) { }

  /**
   * Method to make an api call to get all plans
   * @method getAllPricingPlans
   * @since Version 1.0.0
   * @returns Observable<Object>
   */
  public getAllPricingPlans() {
    return this.httpClient.get(PricingPlansApiEndpoints.pricingPlans);
  }
}