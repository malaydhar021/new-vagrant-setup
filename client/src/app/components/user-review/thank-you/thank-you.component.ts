import { Component, OnInit } from '@angular/core';
import { UserReviewModel } from 'src/app/models/user-review.model';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { UserReviewService } from 'src/app/services/user-review.service';
import { Log } from 'src/app/helpers/app.helper';

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
    this.title.setTitle('Stickyreviews :: Contact Information');
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
