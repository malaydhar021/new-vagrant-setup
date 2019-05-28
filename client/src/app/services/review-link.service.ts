import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ReviewLinkApiEndpoints, CampaignApiEndpoints } from '../helpers/api.helper';
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
   * @returns Void
   */
  constructor(private httpClient: HttpClient) { }

  /**
   * Method to make an api call to get all review links
   * @method getAllReviewLinks
   * @since Version 1.0.0
   * @returns Observable<Object>
   */
  public getAllReviewLinks() {
    return this.httpClient.get(ReviewLinkApiEndpoints.reviewLinks);
  }

  /**
   * Method to make an api call to add a review link.
   * @method addReviewLink
   * @since Version 1.0.0
   * @param data FormData instance. 
   * @returns Observable<Object>
   */
  public addReviewLink(data: FormData) {
    return this.httpClient.post(ReviewLinkApiEndpoints.reviewLinks, data);
  }

  /**
   * Method to make an api call to update a review link
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
   * Method to make an api call to delete a review link
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
  public checkDuplicateUrlSlug(slug: string) {
    const params = new HttpParams().set('url_slug', slug);
    return this.httpClient.get(ReviewLinkApiEndpoints.reviewLinks.concat("/slug-status"), {params: params});
  }

  /**
   * Method to make an api call to validate first step data
   * @method validateData
   * @since Version 1.0.0
   * @param data FormData request payload
   * @returns Observable<Object>
   */
  public validateData(data: FormData) {
    return this.httpClient.post(ReviewLinkApiEndpoints.reviewLinks.concat("/validate"), data);
  }

  /**
   * Method to make an api call to get all campaigns without pagination
   * @method campaigns
   * @since Version 1.0.0
   * @returns Observable<Object>
   */
  public get campaigns() {
    const params = new HttpParams().set('paginate', 'false');
    return this.httpClient.get(CampaignApiEndpoints.campaigns, {params: params});
  }
  
  /**
   * Method to make an api call to update auto approve status of a review link
   * @method updateAutoApproveStatus
   * @since Version 1.0.0
   * @param id Review link system id
   * @param data Request payload data
   * @returns Observable<Object>
   */
  public updateAutoApproveStatus(id: string, data: ReviewLinkModel) {
    data._method = "PUT";
    return this.httpClient.post(ReviewLinkApiEndpoints.reviewLinks.concat("/" + id + '/auto-approve-status'), data);
  }
}