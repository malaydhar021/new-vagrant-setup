import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { UserReviewService } from 'src/app/services/user-review.service';
import { UserReviewModel } from 'src/app/models/user-review.model';
import { Log } from 'src/app/helpers/app.helper';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoaderService } from 'src/app/services/loader.service';

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
export class ContactComponent implements OnInit {
  @Input() slug: string = null;
  review: UserReviewModel = {};
  subscription: Subscription;
  form: FormGroup; // form to handle inputs
  isSubmitted: boolean = false; // flag to set to true if form has been submitted

  /**
   * Constructor method
   * @constructor constructor
   * @param title Title service instance
   * @param userReviewService UserReviewService service instance
   * @returns Void
   */
  constructor(
    private title: Title,
    private formBuilder: FormBuilder,
    private userReviewService: UserReviewService,
    private loaderService: LoaderService
  ) { 
    this.title.setTitle('Stickyreviews :: Contact Information');
    // subscribe to review to get the latest update data from review
    this.subscription = this.userReviewService.review$.subscribe(
      (review: UserReviewModel) => {
        Log.info(review, "Log the updated review in ContactComponent");
        this.review = review;
      }
    );
  }

  /**
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
   * Method to get all the controls for formGroup named `form`
   * @method getFormControls
   * @since Version 1.0.0
   * @returns FormControls
   */
  public get getFormControls() {
    return this.form.controls;
  }

  /**
   * @method onSubmit
   * @since Version 1.0.0
   * @returns Void
   */
  public onSubmit() {
    this.isSubmitted = true;
    if(this.form.invalid) {
      return;
    }

    this.loaderService.enableLoader();
    // creating an instance of `FormData` class
    const formData = new FormData();
    formData.append('email', this.form.value.email); // append email to formData
    if(this.form.value.phone !== null) {
      formData.append('phone_number', this.form.value.phone); // append image to formData
    }
    /* 
    // lets make an api call to validate the user data so far
    this.userReviewService.validateUserReview(this.slug, formData).subscribe(
      (response : any) => {
        Log.notice(response, "Notice the response from api");
        this.loaderService.disableLoader();
        if(response.status) {
          const data = {
            email: this.form.value.email,
            phone_number: this.form.value.phone
          }
          // update the model data
          this.userReviewService.updateReview(data);
          // set next step to thankyou
          this.userReviewService.updateCurrentStep('thankYou');
        }
      }
    );
    */
    // for debugging and UI fixing 
    this.userReviewService.updateCurrentStep('thankYou');
  }
}
