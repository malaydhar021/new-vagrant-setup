import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title }                        from '@angular/platform-browser';
import { ActivatedRoute }               from '@angular/router';
import { Subscription }                 from 'rxjs';
import { UserReviewService }            from '../../services/user-review.service';
import { Log }                          from '../../helpers/app.helper';
import { LoaderService }                from '../../services/loader.service';
import { UserReviewLinkInfo }           from '../../interfaces/user-review.interface';
import { UserReviewModel }              from '../../models/user-review.model';
import { ErrorsService }                from '../../services/errors.service';
import { AppBaseUrl }                   from '../../helpers/api.helper';

/**
 * Component to load the first screen of user review link with proper info
 * @class UserReviewComponent
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@Component({
  selector: 'app-user-review',
  templateUrl: './user-review.component.html',
  styleUrls: ['./user-review.component.scss']
})
export class UserReviewComponent implements OnInit, OnDestroy {
  // step builder for each step
  stepBuilder: any
  // review property to hold the entire review data provided by user
  review: UserReviewModel = {};
  // property to hold the current slug of the review link
  slug: any = null;
  step: boolean = null;
  subscription: Subscription;
  reviewSubscription: Subscription;
  urlInfo: UserReviewLinkInfo = {
    name: null,
    logo: null,
    description: null,
    page_background: null,
    modal_background: null,
    text_color: null,
    copyright_text: null
  };
  errorSubscription: Subscription; // to get the current value of showError property
  notFoundSubscription: Subscription; // to get the current value of showError property
  showError: boolean = false; // flag to show error message
  successMessage: string = null; // holds the success message and displays the message to user
  show404: boolean = false; // set to true to show 404 page

  /**
   * Constructor method of UserReviewComponent
   * @constructor constructor
   * @since Version 1.0.0
   * @param userReviewService UserReviewService instance
   * @returns Void
   */
  constructor(
    private title: Title,
    private userReviewService: UserReviewService,
    private loaderService: LoaderService,
    private errorService: ErrorsService,
    private route: ActivatedRoute
  ) {
    this.title.setTitle('Stickyreviews :: User Review');
    // subscribe to review to get the latest update data from review
    this.reviewSubscription = this.userReviewService.review$.subscribe(
      (review: UserReviewModel) => {
        Log.info(review, "Log the updated review in UserReviewComponent");
        this.review = review;
      }
    );
    // subscribe to the step builder to get the update step builder object
    this.subscription = this.userReviewService.currentStep$.subscribe(
      (step: any) => {
        this.stepBuilder = step;
      }
    );
    // error subscription for catching all error messages
    this.errorSubscription = this.errorService.showMessage$.subscribe(
      (status: boolean) => {
        this.showError = status;
      }
    );

    //
    this.notFoundSubscription = this.errorService.show404$.subscribe(
      (status: boolean) => {
        this.show404 = status;
      }
    );
  }

  /**
   * @method ngOnInit
   * @since Version 1.0.0
   * @returns Void
   */
  public ngOnInit() {
    this.loaderService.enableLoader();
    this.route.data.subscribe(
      (response: any) => {
        // if there url slug is wrong then stop executing rest of the code
        if(typeof response.reviewLink === 'undefined') {
          this.loaderService.disableLoader();
          return;
        }
        // checking custom domain validation
        if(response.reviewLink.data.custom_domain !== null && response.reviewLink.data.custom_domain.domain !== window.location.host) {
          this.errorService.update404Status(true);
          this.loaderService.disableLoader();
          return;
        }
        // checking without custom domain validation
        if(response.reviewLink.data.custom_domain === null && 'https://' + window.location.host !== AppBaseUrl) {
          Log.info("it's coming here");
          this.errorService.update404Status(true);
          this.loaderService.disableLoader();
          return;
        }

        this.urlInfo = response.reviewLink.data;
        this.slug = response.reviewLink.data.url_slug;
        const data: UserReviewModel = {
          review_link_id: response.reviewLink.data.id,
          review_link_slug: response.reviewLink.data.url_slug,
          negative_review_message_1: response.reviewLink.data.negative_info_review_message_1,
          negative_review_message_2: response.reviewLink.data.negative_info_review_message_2,
          positive_review_message: response.reviewLink.data.positive_review_message,
          pricing_plan_id: response.reviewLink.data.subscription.data.pricing_plan,
          allow_video_review: response.reviewLink.data.allow_video_review
        }
        this.userReviewService.updateReview(data);
        this.loaderService.disableLoader();
      }
    )
    // get the route params
    // this.route.params.subscribe(params => {
    //   this.slug = params.slug;
    //   this.getURLInfo(params.slug);
    // });
  }

  /**
   * @method ngOnDestroy
   * @since Version 1.0.0
   * @returns Void
   */
  public ngOnDestroy() {
    this.subscription.unsubscribe();
    this.reviewSubscription.unsubscribe();
    this.errorSubscription.unsubscribe();
    this.notFoundSubscription.unsubscribe();
  }

  /**
   * Method to fetch all information regarding the user review link based on slug.
   * URL stands for `User Review Link`
   * ### *DEPRECATED* ###
   * @method getURLInfo
   * @since Version 1.0.0
   * @returns Void
   */
  public getURLInfo(slug: string = null) {
    // this.loaderService.enableLoader();
    this.userReviewService.getUserReviewLinkInfo(slug).subscribe(
      (response: any) => {
        Log.info(response, "Review Link data");
        this.urlInfo = response.data;
        const data: UserReviewModel = {
          review_link_id: response.data.id,
          review_link_slug: slug,
          negative_review_message_1: response.data.negative_info_review_message_1,
          negative_review_message_2: response.data.negative_info_review_message_2,
          positive_review_message: response.data.positive_review_message,
          pricing_plan_id: response.data.subscription.data.pricing_plan,
          allow_video_review: response.data.allow_video_review
        }
        this.userReviewService.updateReview(data);
        // Log.debug(this.urlInfo, "log the url info");
        this.loaderService.disableLoader();
      }
    );
  }
}
