import { Injectable } from '@angular/core';
import { Constants } from './constants';
import { HttpClient } from '@angular/common/http';
import { CampaignListResponse } from './interfaces/CampaignListResponse';
import { SaveCampaign } from './models/saveCampaign';
import { UpdateCampaign } from './models/updateCampaign';
import { AssignCampaignSticky } from './models/assignCampaignSticky';

@Injectable()
export class CampaignServiceService {

  constructor(private http: HttpClient) { }

  /**
   * this functions helps to catch the list of campaigns from backend
   * @returns {Observable<Object>}
   */
  getAllCampaigns() {
    return this.http.post<CampaignListResponse>(Constants.getCampaigns, '');
  }

  /**
   * this function saves campaign in database
   * @param {string} token
   * @param {SaveCampaign} campaign
   * @returns {Observable<Object>}
   */
  saveCampaign(campaign: SaveCampaign) {
    return this.http.post(Constants.saveCampaign, campaign);
  }

  /**
   * this function toggles between status of a campaign
   * @param {string} token
   * @param {number} id
   * @returns {Observable<Object>}
   */
  changeStatus(campaign_id: number) {
    return this.http.post(Constants.changeStatus, {'campaign_id': campaign_id});
  }

  /**
   * this function update campaign details
   * @param {string} token
   * @param {UpdateCampaign} dataset
   * @returns {Observable<Object>}
   */
  updateCampaign(dataset: SaveCampaign) {
    return this.http.post(Constants.updateCampaign, dataset);
  }

  /**
   * this function soft delete the campaign
   * @param {string} token
   * @param {number} campaign_id
   * @returns {Observable<Object>}
   */
  deleteCampaign(campaign_id: any) {
    return this.http.post(Constants.deleteCampaign, campaign_id);
  }

  /**
   * this function assign campaign to sticky reviews and vice versa
   * @param {AssignCampaignSticky} dataSet
   * @returns {Observable<Object>}
   */
  assignStickyReviews(dataSet: AssignCampaignSticky) {
    return this.http.post(Constants.assignCampaignToStickyReviewsURL, dataSet);
  }
}
