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
   * @returns Observable<Object>
   */
  public getAllStickyReviews() {
    return this.httpClient.get(StickyReviewsApiEndpoints.stickyReviews);
  }

  /**
   * Method to make an api call to add a sticky review
   * @method addStickyReview
   * @since Version 1.0.0
   * @param data FormData Data to send over http request 
   * @returns Observable<Object>
   */
  public addStickyReview(data: FormData) {
    return this.httpClient.post(StickyReviewsApiEndpoints.stickyReviews, data);
  }

  /**
   * Method to make an api call to update a sticky review
   * @method updateStickyReview
   * @since Version 1.0.0
   * @param data FormData Data to send over http request
   * @returns Observable<Object>
   */
  public updateStickyReview(data: FormData, id: number) {
    return this.httpClient.post(StickyReviewsApiEndpoints.stickyReviews.concat('/' + id), data);
  }

  /**
   * Method to make an api call to delete a sticky review
   * @method deleteStickyReview
   * @since Version 1.0.0
   * @param data StickyReviewModel object params
   * @param id Sticky review system id
   * @returns Observable<Object>
   */
  public deleteStickyReview(id: string) {
    return this.httpClient.delete(StickyReviewsApiEndpoints.stickyReviews.concat("/" + id));
  }

  /**
   * Function for getting all sticky review in paginated manner
   * @param pgNum
   */
  public getAllPaginatedStickyReviews(pgNum, searchKey) {
    return this.httpClient.get(StickyReviewsApiEndpoints.stickyReviews.concat('?page=' + pgNum + '&searchParams=' + searchKey));
  }

  /**
   * Method for search sticky review
   * @param term
   */
  public searchStickyReview(term) {
    return this.httpClient.get(StickyReviewsApiEndpoints.stickyReviews.concat('?searchParams=' + term));
  }

}