import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { UserReviewApiEndpoints } from '../helpers/api.helper';
import { BehaviorSubject, Observable } from 'rxjs';
import { Log } from '../helpers/app.helper';
import { UserReviewLinkInfo } from '../interfaces/user-review.interface';
import { UserReviewModel } from '../models/user-review.model';

/**
 * Service to deal with all sort of actions for user review
 * @class UserReviewService
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@Injectable()
export class UserReviewService {
  // default step builder
  stepBuilder: any = {
    recommendation: false,
    review: true,
    permission: false,
    displayPicture: false,
    contact: false,
    thankYou: false
  }
  // declare review model
  review: UserReviewModel = {};
  // declare current step i.e first screen of user review
  currentStep: string = 'recommendation';
  // declare next step which will be updated in current step itself
  _nextStep: string = null;
  // declaring variant of Subject for current step with step builder
  currentStepSubject: BehaviorSubject<any> = new BehaviorSubject<any>(this.stepBuilder);
  currentStep$: Observable<any> = this.currentStepSubject.asObservable();
  // review modal to hold the review data
  // declaring variant of Subject for current step with step builder
  reviewSubject: BehaviorSubject<UserReviewModel> = new BehaviorSubject<UserReviewModel>({});
  review$: Observable<UserReviewModel> = this.reviewSubject.asObservable();

  /**
   * Constructor method
   * @constructor constructor
   * @param httpClient HttpClient instance
   */
  constructor(private httpClient: HttpClient) {}

  /**
   * Method to get all details of a user review link like modal color, backdrop color, text, short description etc
   * @method getUserReviewLinkInfo
   * @since Version 1.0.0
   * @param slug Slug of review link
   * @returns Observable<any>
   */
  public getUserReviewLinkInfo(slug: string): Observable<UserReviewLinkInfo> {
    return this.httpClient.get<UserReviewLinkInfo>(UserReviewApiEndpoints.userReviewLinkInfo.concat('/' + slug));
  }

  /**
   * Method to validate review file data into the current screen itself
   * @method getUserReviewLinkInfo
   * @since Version 1.0.0
   * @param slug Slug of review link
   * @param data FormData object to validate data
   * @returns Observable<any>
   */
  public validateUserReview(slug: string, data: FormData) {
    return this.httpClient.post(UserReviewApiEndpoints.userReviewLinkInfo.concat('/' + slug + '/validate'), data);
  }

  /**
   * Method to set next step from current step. This will be deprecated soon
   * Use `nextStep()` instead of this.
   * @method updateCurrentStep
   * @since Version 1.0.0
   * @param step Name of the step
   * @returns Void
   */
  public updateCurrentStep(step: string) {
    this.currentStep = step; 
    this.currentStepSubject.next(this.updateStepBuilder);   
  }

  /**
   * Method to set next step from current step
   * @method nextStep
   * @since Version 1.0.0
   * @param step Name of the step
   * @returns Void
   */
  public nextStep(step: string) {
    this._nextStep = step; 
    this.currentStepSubject.next(this.updateStepBuilder);   
  }

  /**
   * Method to read all keys of stepBuilder and return all keys as an array
   * @method stepBuilderSteps
   * @since Version 1.0.0
   * @returns Array
   */
  public get stepBuilderSteps() {
    return Object.keys(this.stepBuilder);
  }

  /**
   * @method updateStepBuilder
   */
  public get updateStepBuilder() {
    return this.stepBuilderSteps.reduce((acc, elem) => {
        // set all properties to false except to the current step
        acc[elem] = (elem === this.currentStep) ? true : false
        return acc
      }, {}
    )
  }

  /**
   * Method to update review model with updated review data after getting user input from different screens
   * @method updateReview
   * @since Version 1.0.0
   * @param data UserReviewModel instance
   * @returns Void
   */
  public updateReview(data: UserReviewModel) {
    Object.assign(this.review, data);
    this.reviewSubject.next(this.review);
  }
}