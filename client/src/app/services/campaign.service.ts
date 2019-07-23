import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { BrandingApiEndpoints, CampaignApiEndpoints, ExitPopupApiEndpoints, StickyReviewsApiEndpoints } from '../helpers/api.helper';
import { CampaignModel } from '../models/campaign.model';

/**
 * Service for all campaigns related operations like add, edit, update and delete campaigns
 * @class CampaignService
 * @author Tier5 LLC `<work@tier5.us>`
 * @version 1.0.0
 * @license Proprietary
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
    return this.httpClient.get(CampaignApiEndpoints.campaigns);
  }

  /**
   * Method to make an api call to add a campaign.
   * @method addCampaign
   * @since Version 1.0.0
   * @returns Observable<Object>
   */
  public addCampaign(data: CampaignModel) {
    return this.httpClient.post(CampaignApiEndpoints.campaigns, data);
  }

  /**
   * Method to make an api call to update a campaign
   * @method updateCampaign
   * @since Version 1.0.0
   * @returns Observable<Object>
   */
  public updateCampaign(id: string, data: CampaignModel) {
    data._method = "PUT";
    return this.httpClient.post(CampaignApiEndpoints.campaigns.concat("/" + id), data);
  }

  /**
   * Method to make an api call to delete a campaign
   * @method deleteCampaign
   * @since Version 1.0.0
   * @returns Observable<Object>
   */
  public deleteCampaign(id: string) {
    return this.httpClient.delete(CampaignApiEndpoints.campaigns.concat('/' + id));
  }

  /**
   * Method to make an api call to update
   * @method syncStickyReviews
   * @since Version 1.0.0
   * @returns Observable<Object>
   */
  public syncStickyReviews(id: string, data: string[]) {
    return this.httpClient.post(CampaignApiEndpoints.campaigns.concat('/' + id + '/sticky-reviews'), {_method: "PATCH", sticky_reviews: data});
  }

  /**
   * Method to make an api call to fetch all campaign styles
   * @method getStyles
   * @since Version 1.0.0
   * @returns Observable<Object>
   */
  public getStyles() {
    return this.httpClient.get(CampaignApiEndpoints.styles);
  }

  /**
   * Method to make an api call to fetch all sticky reviews
   * @method getStickyReviews
   * @since Version 1.0.0
   * @returns Observable<Object>
   */
  public getStickyReviews() {
    const params = new HttpParams().set('paginate', 'false');
    return this.httpClient.get(StickyReviewsApiEndpoints.stickyReviews, {params: params});
  }

  /**
   * Method to make an api call to fetch all exit popups
   * @method getExitPopups
   * @since Version 1.0.0
   * @returns Observable<Object>
   */
  public getExitPopups() {
    const params = new HttpParams().set('paginate', 'false');
    return this.httpClient.get(ExitPopupApiEndpoints.getUserExitPopups, {params: params});
  }

  /**
   * Method to make an api call to fetch all brands
   * @method getBrands
   * @since Version 1.0.0
   * @returns Observable<Object>
   */
  public getBrands() {
    const params = new HttpParams().set('paginate', 'false');
    return this.httpClient.get(BrandingApiEndpoints.brands, {params: params});
  }

  /**
   * Method for getting all the campaigns with pagination
   * @param pgNum
   */
  public getAllPaginatedCampaigns(pgNum, searchKey) {
    return this.httpClient.get(CampaignApiEndpoints.campaigns.concat('?page=' + pgNum + '&searchParams=' + searchKey));
  }

  /**
   * Method for searching a campaign
   * @param term
   */
  public searchCampaign(term)  {
    return this.httpClient.get(CampaignApiEndpoints.campaigns.concat('?searchParams=' + term));
  }

  /**
   * Method to update campaign status to active/inactive
   * @method updateActiveStatus
   * @since Version 1.0.0
   * @param id Campaign Id
   * @param data Request payload data object
   * @returns Observable<Object>
   */
  public updateActiveStatus(id: string, data: any) {
    return this.httpClient.patch(CampaignApiEndpoints.campaigns.concat('/' + id + '/status'), data);
  }
}