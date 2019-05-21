import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ReviewLinkApiEndpoints } from '../helpers/api.helper';
import { ReviewLinkModel } from '../models/review-link.model';

/**
 * Service for all review link related operations like add, edit, update and delete a review link
 * @class ReviewLinkService
 * @author Tier5 LLC `<work@tier5.us>`
 * @version 1.0.0
 * @license Proprietary
 */
@Injectable()
export class ReviewLinkService {

  /**
   * Constructor method to load instances when this class is getting loaded
   * @constructor constructor
   * @since Version 1.0.0
   * @param httpClient HttpClient instance
   * @param router Router instance
   * @returns Void
   */
  constructor(private httpClient: HttpClient, private router: Router) { }

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
   * @param data FormData instance. 
   * @returns Observable<Object>
   */
  public addReviewLink(data: FormData) {
    return this.httpClient.post(ReviewLinkApiEndpoints.reviewLinks, data);
  }

  /**
   * Method to make an api call to update a brand
   * @method updateReviewLink
   * @since Version 1.0.0
   * @param id Review link system id
   * @param data FormData instance. Appended request payload data.
   * @returns Observable<Object>
   */
  public updateReviewLink(id: string, data: FormData) {
    data.append("_method", "PUT");
    return this.httpClient.post(ReviewLinkApiEndpoints.reviewLinks.concat("/" + id), data);
  }

  /**
   * Method to make an api call to delete a brand
   * @method deleteReviewLink
   * @since Version 1.0.0
   * @returns Observable<Object>
   */
  public deleteReviewLink(id: string) {
    return this.httpClient.delete(ReviewLinkApiEndpoints.reviewLinks.concat("/" + id));
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