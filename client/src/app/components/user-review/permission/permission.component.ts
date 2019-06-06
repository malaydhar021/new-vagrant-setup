import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Log } from 'src/app/helpers/app.helper';
import { UserReviewService } from 'src/app/services/user-review.service';
import { Subscription } from 'rxjs';
import { UserReviewModel } from 'src/app/models/user-review.model';
import { ErrorsService } from 'src/app/services/errors.service';

/**
 * Component to handle user permission input to show this review into user's website or not
 * @class PermissionComponent
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.scss']
})
export class PermissionComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  errorSubscription: Subscription; // to get the current value of showError property
  showError: boolean = false; // flag to show error message

  /**
   * Constructor method to load required services at the very first
   * @constructor constructor
   * @since Version 1.0.0
   * @param title Instance of Title service
   * @param userReviewService UserReviewService instance
   * @param errorService ErrorsService instance
   * @returns Void
   */
  constructor(private title: Title, private userReviewService: UserReviewService, private errorService: ErrorsService) {
    this.title.setTitle('Stickyreviews :: Permission');
    // subscribe to review to get the latest update data from review
    this.subscription = this.userReviewService.review$.subscribe(
      (review: UserReviewModel) => {
        Log.info(review, "Log the updated review in RecommendationComponent");
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

  /**
   * Method to update the review data based on user selection for permission screen
   * @method isPermitted
   * @since Version 1.0.0
   * @param value Boolean Yes|No|Skip
   * @returns Void
   */
  public isPermitted(value: boolean) {
    // prepare the data based on the input
    const data = {
      grant_review_use: value
    };
    // update review data
    this.userReviewService.updateReview(data);
    if(value) {
      // ask user to provide the dp which will be used to show their review
      this.userReviewService.updateCurrentStep('displayPicture');
    } else {
      // store the data and show the thank you message
      this.userReviewService.storeUserReview();
    }
  }
}