import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { UserReviewService } from '../../../services/user-review.service';
import { UserReviewModel } from '../../../models/user-review.model';
import { Log } from '../../../helpers/app.helper';

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
export class ThankYouComponent implements OnInit {
  // review property to hold the entire review data provided by user
  review: UserReviewModel = {};
  // subscription to get the latest review data into this class
  subscription: Subscription;

  /**
   * Constructor method
   * @constructor constructor
   * @param title Title service instance
   * @param userReviewService UserReviewService service instance
   * @returns Void
   */
  constructor(
    private title: Title,
    private userReviewService: UserReviewService
  ) 
  { 
    this.title.setTitle('Stickyreviews :: Thank you');
    // subscribe to review to get the latest update data from review
    this.subscription = this.userReviewService.review$.subscribe(
      (review: UserReviewModel) => {
        Log.info(review, "Log the updated review in ThankYouComponent");
        this.review = review;
      }
    );
  }

  public ngOnInit() {}

}
