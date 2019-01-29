import { Injectable } from '@angular/core';
import {Constants} from './constants';
import {HttpClient} from '@angular/common/http';
@Injectable()
export class StickyReviewsService {

  constructor(private http: HttpClient) { }

  /**
   * this function saves sticky note in database
   * @param {string} token
   * @param {FormData} data
   * @returns {Observable<Object>}
   */
  saveStickyReviews(data: FormData) {
    return this.http.post(Constants.saveStickyReviews, data);
  }

  /**
   * this function fetch list of sticky reviews from database
   * @param {string} token
   * @returns {Observable<Object>}
   */
  getAllStickReviews(review_type?: number) {
    return this.http.get(Constants.getAllStickyReviews + '/' + review_type);
  }

  /**
   * this function fetch the base url of amazon s3 bucket
   * @returns {Observable<Object>}
   */
  getAmazonBucketURL() {
    return this.http.get(Constants.amazonBaseURL);
  }

  /**
   * this function post params to backend to delete a sticky review
   * @param {number} id
   * @returns {Observable<Object>}
   */
  deleteStickyReview(id: number) {
    return this.http.post(Constants.deleteStickyReviewURL, {'id': id});
  }

  /**
   * this function post params to backend to update a sticky review
   * @param data
   * @returns {Observable<Object>}
   */
  updateStickyReview(data: any) {
    return this.http.post(Constants.updateStickyReviewURL, data);
  }
}
