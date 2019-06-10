import { Component, OnInit, Input, OnDestroy }    from '@angular/core';
import { Title }                                  from '@angular/platform-browser';
import { Subscription }                           from 'rxjs';
import { FormGroup, FormBuilder, Validators }     from '@angular/forms';
import { UserReviewService }                      from '../../../services/user-review.service';
import { UserReviewModel }                        from '../../../models/user-review.model';
import { ErrorsService }                          from '../../../services/errors.service';

/**
 * Component to handle user contact details with client side and server side validations
 * @class ContactComponent
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit, OnDestroy {
  @Input() slug: string = null;
  review: UserReviewModel = {};
  subscription: Subscription;
  form: FormGroup; // form to handle inputs
  isSubmitted: boolean = false; // flag to set to true if form has been submitted
  errorSubscription: Subscription; // to get the current value of showError property
  showError: boolean = false; // flag to show error message

  /**
   * Constructor method to load required services at the very first
   * @constructor constructor
   * @param title Title service instance
   * @param userReviewService UserReviewService instance
   * @param errorService ErrorsService instance
   * @returns Void
   */
  constructor(
    private title: Title,
    private formBuilder: FormBuilder,
    private userReviewService: UserReviewService,
    private errorService: ErrorsService
  ) { 
    this.title.setTitle('Stickyreviews :: Contact Information');
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
   * Method to initialize the form to take contact information
   * @method ngOnInit
   * @since Version 1.0.0
   * @returns Void
   */
  public ngOnInit() {
    // initialize the form builder for user display picture
    this.form = this.formBuilder.group({
      email : [null, [Validators.required, Validators.email]], // email input // 
      phone: [null] // phone number input
    });
  }

  /**
   * @method ngOnDestroy
   * @since Version 1.0.0
   * @returns Void
   */
  public ngOnDestroy() {
    this.errorSubscription.unsubscribe();
  }

  /**
   * Method to get all the controls for formGroup named `form`
   * @method getFormControls
   * @since Version 1.0.0
   * @returns FormControls
   */
  public get getFormControls() {
    return this.form.controls;
  }

  /**
   * Method to execute when contact form has been submitted
   * @method onSubmit
   * @since Version 1.0.0
   * @returns Void
   */
  public onSubmit() {
    this.isSubmitted = true;
    if(this.form.invalid) {
      return;
    }
    // prepare data to store into review
    const data: UserReviewModel = {
      email: this.form.value.email
    }
    // add phone_number to data if the value is not null
    if(this.form.value.phone !== null) {
      data.phone_number = this.form.value.phone
    }
    // update the model data
    this.userReviewService.updateReview(data);
    // store the review data
    this.userReviewService.storeUserReview();
  }
}
