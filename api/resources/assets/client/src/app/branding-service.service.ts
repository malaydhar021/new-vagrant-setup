import { Injectable } from '@angular/core';
import {Constants} from './constants';
import {HttpClient} from '@angular/common/http';
import {SaveBranding} from './models/saveBranding';

@Injectable()
export class BrandingServiceService {

  constructor(private hc: HttpClient) { }

  /**
   * save branding in database
   * @param {SaveBranding} params
   * @returns {Observable<Object>}
   */
  saveBranding(params: SaveBranding) {
    return this.hc.post(Constants.saveBranding, params);
  }

  /**
   * get list of all branding
   * @returns {Observable<Object>}
   */
  getAllBranding() {
    return this.hc.get(Constants.allBrandings);
  }

  /**
   * delete a brand from database
   * @param {number} id
   * @returns {Observable<Object>}
   */
  deleteBrand(id: number) {
    return this.hc.post(Constants.deleteBrand, {'branding_id': id});
  }

  /**
   * this function updates a branding in database
   * @param {number} id
   * @returns {Observable<Object>}
   */
  updateBranding(id: number, data: any) {
    data.branding_id = id;
    return this.hc.post(Constants.updateBranding, data);
  }
}
