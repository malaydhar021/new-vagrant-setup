import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserReviewService } from '../../services/user-review.service';
import { Log } from '../../helpers/app.helper';
import { LoaderService } from '../../services/loader.service';
import { UserReviewLinkInfo } from '../../interfaces/user-review.interface';
import { UserReviewModel } from 'src/app/models/user-review.model';

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
    private route: ActivatedRoute
  ) {
    this.title.setTitle('Stickyreviews :: User Review');
    // subscribe to the step builder to get the update step builder object
    this.subscription = this.userReviewService.currentStep$.subscribe(
      (step: any) => {
        this.stepBuilder = step;
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
    // get the route params
    this.route.params.subscribe(params => {
      this.slug = params.slug;
      this.getURLInfo(params.slug);
    });
  }

  /**
   * @method ngOnDestroy
   * @since Version 1.0.0
   * @returns Void
   */
  public ngOnDestroy() {
    this.subscription.unsubscribe();
    this.reviewSubscription.unsubscribe();
  }

  /**
   * Method to fetch all information regarding the user review link based on slug.
   * URL stands for `User Review Link`
   * @method getURLInfo
   * @since Version 1.0.0
   * @returns Void
   */
  public getURLInfo(slug: string) {
    // this.loaderService.enableLoader();
    this.userReviewService.getUserReviewLinkInfo(slug).subscribe(
      (response: any) => {
        // Log.info(response, "Log the api response");
        this.urlInfo = response.data;
        const data = {
          review_link_id: response.data.id
        }
        this.userReviewService.updateReview(data);
        // Log.debug(this.urlInfo, "log the url info");
        this.loaderService.disableLoader();
      }
    );
  }
}
