import { Injectable } from '@angular/core';
import {Constants} from './constants';
import {HttpClient} from '@angular/common/http';
import { CampaignListResponse } from './interfaces/CampaignListResponse';
import {SaveExitPopUp} from './models/saveExitPopUp';
import {ExitPopUpsList} from './models/exitPopUpsList';

@Injectable()
export class ExitpopupService {

  constructor(private http: HttpClient) { }
  /**
   * this function fetch list of sticky reviews from database
   * @param {string} token
   * @returns {Observable<Object>}
   */
  getAllStickReviews(review_type?: number) {
    return this.http.get(Constants.getAllStickyReviews + '/' + review_type);
  }
  /**
   * this functions helps to catch the list of campaigns from backend
   * @returns {Observable<Object>}
   */
  getAllCampaigns() {
    return this.http.post<CampaignListResponse>(Constants.getCampaigns, '');
  }

  /**
   * this function saves the exit pop up data in database
   * @param {SaveExitPopUp} data
   * @returns {Observable<Object>}
   */
  saveExitPopUp(data: SaveExitPopUp) {
    return this.http.post(Constants.saveExitPopUpURL, data);
  }

  /**
   * this functions returns list of exit pop ups for a particular user
   * @returns {Observable<Object>}
   */
  getAllExitPopUps() {
    return this.http.get(Constants.allExitPopUpsURL);
  }

  /**
   * this functions post a request to backend to delete exit pop up
   * @param data
   * @returns {Observable<Object>}
   */
  deleteExitPopUp(data: any) {
    return this.http.post(Constants.deleteExitPopUpLinkURL, data);
  }

  /**
   * updates exit pop up
   * @param {ExitPopUpsList} data
   * @returns {Observable<Object>}
   */
  updateExitPopUp(data: ExitPopUpsList) {
    return this.http.post(Constants.updateExitPopupURL, data);
  }
}
