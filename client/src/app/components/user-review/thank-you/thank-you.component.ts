import { Component, OnInit, OnDestroy }      from '@angular/core';
import { Title }                  from '@angular/platform-browser';
import { Subscription }           from 'rxjs';
import { UserReviewService }      from '../../../services/user-review.service';
import { UserReviewModel }        from '../../../models/user-review.model';
import { Log }                    from '../../../helpers/app.helper';
import { ErrorsService }          from '../../../services/errors.service';

/**
 * Component to show the thank you screen in user review and it will save the user
 * review data making an api call
 * @class ThankYouComponent
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@Component({
  selector: 'app-thank-you',
  templateUrl: './thank-you.component.html',
  styleUrls: ['./thank-you.component.scss']
})
export class ThankYouComponent implements OnInit, OnDestroy {
  // review property to hold the entire review data provided by user
  review: UserReviewModel = {};
  // subscription to get the latest review data into this class
  subscription: Subscription;
  errorSubscription: Subscription; // to get the current value of showError property
  showError: boolean = false; // flag to show error message

  /**
   * Constructor method to load required services at the very first
   * @constructor constructor
   * @since Version 1.0.0
   * @param title Title service instance
   * @param userReviewService UserReviewService service instance
   * @returns Void
   */
  constructor(
    private title: Title,
    private userReviewService: UserReviewService,
    private errorService: ErrorsService
  ) { 
    this.title.setTitle('Stickyreviews :: Thank you');
    // subscribe to review to get the latest update data from review
    this.subscription = this.userReviewService.review$.subscribe(
      (review: UserReviewModel) => {
        this.review = review;
      }
    );
    // error service subscription to catch api side error and show it into template
    this.errorSubscription = this.errorService.showMessage$.subscribe(
      (status: boolean) => {
        this.showError = status;
      }
    );
  }

  /**
   * @method ngOnInit
   * @since Version 1.0.0
   * @returns Void
   */
  public ngOnInit() {}

  /**
   * @method ngOnDestroy
   * @since Version 1.0.0
   * @returns Void
   */
  public ngOnDestroy() {
    this.errorSubscription.unsubscribe();
  }
}