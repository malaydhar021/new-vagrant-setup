import { Injectable } from '@angular/core';
import { Constants } from '../../constants';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UserReviewService {

  constructor(private http: HttpClient) { }

  /**
   * get details of a review link from url slug
   * @param {string} url_slug
   * @returns {Observable<Object>}
   */
  getReviewLinkData(url_slug: string) {
    return this.http.get(Constants.reviewLinkDetailsURL + '/' + url_slug);
  }

  /**
   * this function saves users review in db coming from review link
   * @param data
   * @returns {Observable<Object>}
   */
  saveUserReview(data: any) {
    return this.http.post(Constants.saveUserReviewURL, data);
  }
  /**
   * this function fetch the base url of amazon s3 bucket
   * @returns {Observable<Object>}
   */
  getAmazonBucketURL() {
    return this.http.get(Constants.amazonBaseURL);
  }
}
