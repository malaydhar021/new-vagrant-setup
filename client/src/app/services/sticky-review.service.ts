import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { StickyReviewsApiEndpoints } from '../helpers/api.helper';
import { StickyReviewModel } from '../models/sticky-review.model';

/**
 * Service for all sticky review related operations like add, edit, update and delete sticky reviews
 * @class StickyReviewService
 * @author Tier5 LLC `<work@tier5.us>`
 * @version 1.0.0
 * @license Proprietery
 */
@Injectable()
export class StickyReviewService {
  /**
   * Constructor method to inject HttClient module available to all other methods
   * @constructor constructor
   * @since Version 1.0.0
   * @param httpClient HttpClient module from angular
   * @returns Void
   */
  constructor(private httpClient: HttpClient) { }

  /**
   * Method to make an api call to get all sticky reviews
   * @method getAllStickyReviews
   * @since Version 1.0.0
   * @param reviewType Review type to filter reviews based on this param
   * @returns Observable<Object>
   */
  public getAllStickyReviews(reviewType?: number) {
    // check if review type is provided then append type to as last url segment
    const url = (reviewType !== undefined) ? StickyReviewsApiEndpoints.stickyReviews.concat('/' + reviewType) : StickyReviewsApiEndpoints.stickyReviews;
    return this.httpClient.get(url);
  }

  /**
   * Method to make an api call to add a sticky review
   * @method addStickyReview
   * @since Version 1.0.0
   * @param data FormData Data to send over http request 
   * @returns Observable<Object>
   */
  public addStickyReview(data: FormData) {
    return this.httpClient.post(StickyReviewsApiEndpoints.addStickyReview, data);
  }

  /**
   * Method to make an api call to update a sticky review
   * @method updateStickyReview
   * @since Version 1.0.0
   * @param data FormData Data to send over http request
   * @returns Observable<Object>
   */
  public updateStickyReview(data: FormData) {
    return this.httpClient.post(StickyReviewsApiEndpoints.updateStickyReview, data);
  }

  /**
   * Method to make an api call to delete a sticky review
   * @method deleteStickyReview
   * @since Version 1.0.0
   * @param data StickyReviewModel object params
   * @returns Observable<Object>
   */
  public deleteStickyReview(data: StickyReviewModel) {
    return this.httpClient.post(StickyReviewsApiEndpoints.deleteStickyReview, data);
  }

}