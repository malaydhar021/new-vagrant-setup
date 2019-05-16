import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserReviewService } from '../../../services/user-review.service';
import { UserReviewModel } from '../../../models/user-review.model';
import { Log } from '../../../helpers/app.helper';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';

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
  subscription: Subscription;
  constructor(private userReviewService: UserReviewService, private title: Title) {
    this.title.setTitle('Stickyreviews :: Recommendation');
    // subscribe to review to get the latest update data from review
    this.subscription = this.userReviewService.review$.subscribe(
      (review: UserReviewModel) => {
        Log.info(review, "Log the updated review in RecommendationComponent");
      }
    );
  }

  /**
   * @method ngOnInit
   */
  public ngOnInit() {}

  /**
   * @method ngOnDestroy
   */
  public ngOnDestroy() {}

  /**
   * Method to capture the value of first screen from user
   * @method isRecommended
   * @param value Recommended value from user
   * @returns Void
   */
  public isRecommended(value: boolean) {
    Log.info(value, "log value in Recommendation component");
    const data = {
      recommendation: value
    };
    this.userReviewService.updateReview(data);
    this.userReviewService.updateCurrentStep('review');
  }
}