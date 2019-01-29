import { Injectable } from '@angular/core';
import {Constants} from './constants';
import {HttpClient} from '@angular/common/http';
@Injectable()
export class ReviewlinkserviceService {

  constructor(private http: HttpClient) { }

  /**
   * this function returns all the review links created by authenticated user
   * @returns {Observable<Object>}
   */
  fetchAllReviewLinks() {
    return this.http.get(Constants.allReviewLinksURL);
  }

  /**
   * this function checks one url slug actually exists in db or not
   * @param data
   * @returns {Observable<Object>}
   */
  checkDuplicateURLSlug(data: any) {
    return this.http.post(Constants.checkDuplicateUrlSlugURL, data);
  }

  /**
   * save review link to the database
   * @param data
   * @returns {Observable<Object>}
   */
  saveReviewLink(data: any) {
    return this.http.post(Constants.saveReviewLinkURL, data);
  }
  /**
   * this function fetch the base url of amazon s3 bucket
   * @returns {Observable<Object>}
   */
  getAmazonBucketURL() {
    return this.http.get(Constants.amazonBaseURL);
  }

  /**
   * this function deletes a review link from db
   * @param data
   * @returns {Observable<Object>}
   */
  deleteReviewLink(data: any) {
    return this.http.post(Constants.deleteReviewLinkURL, data);
  }

  /**
   * this function updates review link in db
   * @param data
   * @returns {Observable<Object>}
   */
  updateReviewLink(data: any) {
    return this.http.post(Constants.updateReviewLinkURL, data);
  }
}
