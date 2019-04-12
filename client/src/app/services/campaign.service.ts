import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { CampaignApiEndpoints } from '../helpers/api.helper';
import { CampaignModel } from '../models/campaign.model';

/**
 * Service for all campaigns related operations like add, edit, update and delete campaigns
 * @class CampaignService
 * @author Tier5 LLC `<work@tier5.us>`
 * @version 1.0.0
 * @license Proprietery
 */
@Injectable()
export class CampaignService {
  /**
   * Constructor method to inject HttClient module available to all other methods
   * @constructor constructor
   * @since Version 1.0.0
   * @param httpClient HttpClient module from angular
   * @returns Void
   */
  constructor(private httpClient: HttpClient) { }

  /**
   * Method to make an api call to get all campaigns
   * @method getAllCampaigns
   * @since Version 1.0.0
   * @returns Observable<Object>
   */
  public getAllCampaigns() {
    return this.httpClient.post(CampaignApiEndpoints.campaigns, null);
  }

  /**
   * Method to make an api call to add a campaign.
   * @method addCampaign
   * @since Version 1.0.0
   * @returns Observable<Object>
   */
  public addCampaign(data: CampaignModel) {
    return this.httpClient.post(CampaignApiEndpoints.addCampaign, data);
  }

  /**
   * Method to make an api call to update a campaign
   * @method updateCampaign
   * @since Version 1.0.0
   * @returns Observable<Object>
   */
  public updateCampaign(data: CampaignModel) {
    return this.httpClient.post(CampaignApiEndpoints.updateCampaign, data);
  }

  /**
   * Method to make an api call to delete a campaign
   * @method deleteCampaign
   * @since Version 1.0.0
   * @returns Observable<Object>
   */
  public deleteCampaign(data: CampaignModel) {
    return this.httpClient.post(CampaignApiEndpoints.deleteCampaign, data);
  }
}