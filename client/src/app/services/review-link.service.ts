import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReviewLinkApiEndpoints } from '../helpers/api.helper';
import { Router } from '@angular/router';

import { ReviewLinkModel } from '../models/review-link.model';
/**
 * Service for all branding related operations like add, edit, update and delete brandings
 * @class BrandingService
 * @author Tier5 LLC `<work@tier5.us>`
 * @version 1.0.0
 * @license Proprietery
 */
@Injectable()
export class ReviewLinkService {

  constructor(private httpClient: HttpClient, private router: Router) {}

 
    /**
     * Method to make an api call to get all brands
     * @method getAllBrandings
     * @since Version 1.0.0
     * @returns Observable<Object>
     */
    public getAllReviewLinks() {
      return this.httpClient.get(ReviewLinkApiEndpoints.reviewLinks);
  }

  /**
   * Method to make an api call to add a brand.
   * @method getAllBrandings
   * @since Version 1.0.0
   * @returns Observable<Object>
   */
  public addReviewLink(data: ReviewLinkModel) {
      return this.httpClient.post(ReviewLinkApiEndpoints.addReviewLinks, data);
  }

  /**
   * Method to make an api call to update a brand
   * @method getAllBrandings
   * @since Version 1.0.0
   * @returns Observable<Object>
   */
  public updateReviewLink(data: ReviewLinkModel) {
      return this.httpClient.post(ReviewLinkApiEndpoints.updateReviewLinks, data);
  }

  /**
   * Method to make an api call to delete a brand
   * @method getAllBrandings
   * @since Version 1.0.0
   * @returns Observable<Object>
   */
  public deleteReviewLink(data: ReviewLinkModel) {
      return this.httpClient.post(ReviewLinkApiEndpoints.deleteReviewLinks, data);
  }
}
