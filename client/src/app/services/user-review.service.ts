import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import {StickyReviewsApiEndpoints, UserReviewApiEndpoints} from '../helpers/api.helper';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserReviewLinkInfo } from '../interfaces/user-review.interface';
import { UserReviewModel } from '../models/user-review.model';
import { LoaderService } from './loader.service';
import { Log } from '../helpers/app.helper';
import { ErrorsService } from './errors.service';

/**
 * Service to deal with all sort of actions for user review including client / server side
 * validations handling. It also enable / disable steps with stepBuilder object which is 
 * very easy to work with.
 * @class UserReviewService
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@Injectable()
export class UserReviewService {
  // default step builder
  stepBuilder: any = {
    recommendation: true,
    review: false,
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
   * Constructor method to initialize internal/external services 
   * when this class is loaded for the first time
   * @constructor constructor
   * @since Version 1.0.0
   * @param httpClient HttpClient instance
   * @returns Void
   */
  constructor(private httpClient: HttpClient, private loaderService: LoaderService, private errorsService: ErrorsService) {}

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
   * Method to store all data of provided by user if the data passes validation.
   * This also handles errors if anything returned from api request
   * @method storeUserReviewLinkInfo
   * @since Version 1.0.0
   * @param slug Slug of review link
   * @param data FormData instance, request payload
   * @returns Observable<any>
   */
  public storeUserReviewLinkInfo(slug: string, data: FormData) {
    return this.httpClient.post(UserReviewApiEndpoints.userReviewLinkInfo.concat('/' + slug), data);
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
    this.errorsService.updateMessage('');
    this.errorsService.updateValidationMessage('');
    this._nextStep = step;
    this.currentStepSubject.next(this.updateDefaultStepBuilder);
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
   * Method to update current step to true and all other steps to false. This method will be deprecated soon.
   * Use `updateDefaultStepBuilder()` method instead.
   * @method updateStepBuilder
   * @since Version 1.0.0
   * @returns Object
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
   * Method to update next step to true and all other steps to false in order to show the
   * next step screen to user.
   * @method updateDefaultStepBuilder
   * @since Version 1.0.0
   * @returns Object
   */
  public get updateDefaultStepBuilder() {
    return this.stepBuilderSteps.reduce((acc, elem) => {
        // set all properties to false except to the current step
        acc[elem] = (elem === this._nextStep) ? true : false
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

  /**
   * Method to store user provided review data with making an api call
   * @method storeUserReview
   * @since Version 1.0.0
   * @param slug Slug of the user review link
   * @returns Void
   */
  public storeUserReview() {
    // show the loader to user
    this.loaderService.enableLoader();
    // prepare request payload from review property
    // creating an instance of `FormData` class
    const formData = new FormData();
    // add request payload to formData object
    // append recommendation to form data if it exists in review object
    if(this.review.recommendation !== undefined) formData.append('recommendation', this.review.recommendation);
    // append review title if it exists in review object
    if(this.review.review_title !== undefined) formData.append('review_title', this.review.review_title);
    // append review rating if it exists in review object
    if(this.review.rating !== undefined) formData.append('rating', this.review.rating);
    // append review link system id if it exists in review object
    if(this.review.review_link_id !== undefined) formData.append('review_link_id', this.review.review_link_id);
    // append review type if it exists in review object
    if(this.review.review_type !== undefined) formData.append('review_type', this.review.review_type);
    // append review text if it exists in review object
    if(this.review.review_text !== undefined) formData.append('review_text', this.review.review_text);
    // append review audio to form data if it exists in review object
    if(this.review.review_audio !== undefined) formData.append('review_audio', this.review.review_audio, this.review.review_audio.name);
    // append review video to form data if it exists in review object
    if(this.review.review_video !== undefined) formData.append('review_video', this.review.review_video, this.review.review_video.name);
    // append email if it exists in review object
    if(this.review.email !== undefined) formData.append('email', this.review.email);
    // append phone number to form data if it exists in review object
    if(this.review.phone_number !== undefined) formData.append('phone_number', this.review.phone_number);
    // append grant review use to form data if it exists in review object
    if(this.review.grant_review_use !== undefined) formData.append('grant_review_use', this.review.grant_review_use);
    // append grant review use to form data if it exists in review object
    if(this.review.profile_picture !== undefined) formData.append('profile_picture', this.review.profile_picture, this.review.profile_picture.name);

    // lets make an api call to store the review data if it passes the validation. Validation errors will be handled automatically.
    this.storeUserReviewLinkInfo(this.review.review_link_slug, formData).subscribe(
      (response: any) => {
        Log.info(response, "Response from store user review api");
        // hide the loader
        this.loaderService.disableLoader();
        // show the last step i.e thankYou once review data has been stored successfully
        this.nextStep('thankYou');
      }
    );
  }

  public checkPasskey(data: FormData) {
    return this.httpClient.post(UserReviewApiEndpoints.checkPasskey, data);
  }

  public reviewAction(data: FormData) {
    return this.httpClient.post(UserReviewApiEndpoints.reviewAction, data);
  }

}