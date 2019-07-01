import { Component, OnInit, OnDestroy }     from '@angular/core';
import { Title }                            from '@angular/platform-browser';
import { Subscription }                     from 'rxjs';
import { UserReviewService }                from '../../../services/user-review.service';
import { UserReviewModel }                  from '../../../models/user-review.model';
import { Log }                              from '../../../helpers/app.helper';
import { ErrorsService }                    from '../../../services/errors.service';

/**
 * Class to capture whether user wants to recommend or not and store that data into a model
 * and redirect user to next screen.
 * @class RecommendationComponent
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@Component({
  selector: 'app-recommendation',
  templateUrl: './recommendation.component.html',
  styleUrls: ['./recommendation.component.scss']
})
export class RecommendationComponent implements OnInit, OnDestroy {
  // defining class properties
  subscription: Subscription;
  errorSubscription: Subscription; // to get the current value of showError property
  showError: boolean = false; // flag to show error message

  /**
   * Constructor method to load required services at the very first
   * @constructor constructor
   * @since Version 1.0.0
   * @param userReviewService UserReviewService instance
   * @param title Title service instance
   * @param errorService ErrorService instance
   * @returns Void
   */
  constructor(private userReviewService: UserReviewService, private title: Title, private errorService: ErrorsService) {
    this.title.setTitle('Stickyreviews :: Recommendation');
    // subscribe to review to get the latest update data from review
    this.subscription = this.userReviewService.review$.subscribe(
      (review: UserReviewModel) => {}
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
    this.errorService.clearMessage();
  }

  /**
   * Method to capture the value of first screen from user
   * @method isRecommended
   * @param value Recommended value from user
   * @returns Void
   */
  public isRecommended(value: boolean) {
    Log.info(value, "log value in Recommendation component");
    const data = {
      recommendation: value? '1' : '0'
    };
    this.userReviewService.updateReview(data);
    this.userReviewService.nextStep('review');
  }
}