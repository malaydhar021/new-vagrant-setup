import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title }                        from '@angular/platform-browser';
import { ActivatedRoute }               from '@angular/router';
import { Subscription }                 from 'rxjs';
import { UserReviewService }            from '../../services/user-review.service';
import { LoaderService }                from '../../services/loader.service';
import { ErrorsService }                from '../../services/errors.service';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, Form } from '@angular/forms';
import { ReviewDataInterface } from '../../interfaces/review-data.interface';
import { NgxSmartModalComponent, NgxSmartModalService } from 'ngx-smart-modal';

/**
 * Component to load the first screen of show user review with proper info
 * @class ShowUserReviewComponent
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */

@Component({
    selector: 'app-show-user-review',
    templateUrl: './show-user-review.component.html',
    styleUrls: ['./show-user-review.component.scss']
})

export class ShowUserReviewComponent implements OnInit, OnDestroy {

    subscription: Subscription;
    id: any = null;
    token: any = null;
    showMe: boolean = true;
    reviewStatus: string = '';
    showReview: boolean = false;
    reviewStyle: string = '';
    message: string = '';
    showMessage: boolean = false;
    reviewData: [] = [];
    setModalText: string = '';
    typeOfUserAction: string = '';
    // do something
    constructor(
        private title: Title,
        private userReviewService: UserReviewService,
        private loaderService: LoaderService,
        private errorService: ErrorsService,
        private route: ActivatedRoute,
        public ngxSmartModalService: NgxSmartModalService,
    ) {
        this.title.setTitle('Stickyreviews :: Show User Review');
    }

    public ngOnInit() {
        this.route.params.subscribe(params => {
            this.id = params.id;
            this.token = params.token;
        });
        this.getReviewInfo();
    }

    public ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    /**
     * Function to get a review information
     */
    public getReviewInfo() {
        const formData = new FormData();
            formData.append('stickyId', this.id); // append tags
            formData.append('reviewToken', this.token); // append tags
        this.loaderService.enableLoader();
        this.userReviewService.checkPasskey(formData).subscribe(
            (response: any) => {
                if (response.status && response.data) {
                    this.loaderService.disableLoader();
                    this.reviewData = response.data;
                    this.reviewStatus = response.data.is_accept;
                    if (response.data.review_link.campaign.style_id !== 0) {
                        this.reviewStyle = response.data.review_link.campaign.style_id;
                    } else {
                        this.reviewStyle = '1'; // defualt sticky review style
                    }
                } else {
                    this.loaderService.disableLoader();
                    this.showMessage = true;
                    this.message = 'This link is expired !';
                }
            });
    }

  /**
   * Open confirm modal for taking user input
   * @param type
   */
  public openConfirmModal(type) {
      if (type === 1) {
        this.setModalText = 'Are you sure you want to accept this review ?';
      } else {
        this.setModalText = 'Are you sure you want to reject this review ?';
      }
      this.typeOfUserAction = type;
      this.ngxSmartModalService.getModal('confirmModal').open();
    }

  /**
   * Method to capture the user action for accept/reject a sticky review
   * @param typeOfUserAction
   */
  public userAction(typeOfUserAction) {
    this.ngxSmartModalService.getModal('confirmModal').close();
      if (typeOfUserAction === 1) {
        this.acceptReview();
      } else {
        this.rejectReview();
      }
    }

    /**
     * Function to accept a review
     */
    public acceptReview() {
        const formData = new FormData();
        formData.append('reviewAction', '1');
        formData.append('stickyId', this.id);
        this.reviewAction(formData);
    }

    /**
     * Function to reject a review
     */
    public rejectReview() {
            const formData = new FormData();
            formData.append('reviewAction', '0');
            formData.append('stickyId', this.id);
            this.reviewAction(formData);
    }

    /**
     * Function to assign an action (accept/reject) to a review
     * @param formData
     */
    public reviewAction(formData) {
      this.loaderService.enableLoader();
        this.userReviewService.reviewAction(formData).subscribe(
            (response: any) => {
                if (response.status) {
                    this.loaderService.disableLoader();
                    this.showMessage = true;
                    this.message = response.message;
                    this.showMe = false;
                } else {
                    this.showMessage = true;
                    this.loaderService.disableLoader();
                    this.message = response.message;
                }
            });
    }


}
