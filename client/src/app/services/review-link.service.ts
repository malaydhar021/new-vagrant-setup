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
     * @method getAllReviewLinks
     * @since Version 1.0.0
     * @returns Observable<Object>
     */
    public getAllReviewLinks() {
      return this.httpClient.get(ReviewLinkApiEndpoints.reviewLinks);
  }

  /**
   * Method to make an api call to add a brand.
   * @method addReviewLink
   * @since Version 1.0.0
   * @returns Observable<Object>
   */
  public addReviewLink(data: ReviewLinkModel) {
      return this.httpClient.post(ReviewLinkApiEndpoints.addReviewLinks, data);
  }

  /**
   * Method to make an api call to update a brand
   * @method updateReviewLink
   * @since Version 1.0.0
   * @returns Observable<Object>
   */
  public updateReviewLink(data: ReviewLinkModel) {
      return this.httpClient.post(ReviewLinkApiEndpoints.updateReviewLinks, data);
  }

  /**
   * Method to make an api call to delete a brand
   * @method deleteReviewLink
   * @since Version 1.0.0
   * @returns Observable<Object>
   */
  public deleteReviewLink(data: ReviewLinkModel) {
      return this.httpClient.post(ReviewLinkApiEndpoints.deleteReviewLinks, data);
  }

  /**
   * Method to make an api call to check duplicate url slug
   * @method checkDuplicateUrlSlug
   * @since Version 1.0.0
   * @returns Observable<Object>
   */
  public checkDuplicateUrlSlug(data: any) {
    return this.httpClient.post(ReviewLinkApiEndpoints.checkDuplicateUrlSlug, data);
  }
}
