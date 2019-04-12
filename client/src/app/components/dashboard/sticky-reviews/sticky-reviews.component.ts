import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ErrorsService } from '../../../services/errors.service';
import { StickyReviewService } from '../../../services/sticky-review.service';
import { StickyReviewModel } from '../../../models/sticky-review.model';
import * as ValidationEngine from '../../../helpers/form.helper';
import { Log } from '../../../helpers/app.helper';

/**
 * StickyReviewsComponent class will handle all required action to meet the functionalities of 
 * sticky review feature. It includes CRUD operation
 * @class StickyReviewsComponent
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@Component({
  selector: 'app-sticky-reviews',
  templateUrl: './sticky-reviews.component.html',
  styleUrls: ['./sticky-reviews.component.scss']
})
export class StickyReviewsComponent implements OnInit, OnDestroy {
  // defining class properties
  rate: number = 5;
  choseFileCtrl: string = 'Browse from your computer';
  fileName: string = 'or drag & drop your image here';
  image: File = null;
  reviewId: any = null;
  form: FormGroup; // for add or edit review form in modal
  loader: boolean = false; // for loader
  reviews: [] = []; // holds all reviews as an array
  errorMessage: string = null; // to show error messages mainly from when some exception has been caught
  successMessage: string = null; // to show success messages
  validationErrors: any = null; // for showing validation messages
  subscription: Subscription; // to get the current value updated from error interceptor
  isSubmitted: boolean = false; // flag to set true if the add / edit form is submitted  
  isEditing: boolean = false; // flag to set true if user is performing some edit operation
  isDeleting: boolean = false; // flag to set true if user is performing some delete operation
  // allowed file types for sticky review image
  allowedFileTypes: string[] = [
    'image/jpeg',
    'image/png',
    'image/bmp',
    'image/gif'
  ];

  constructor(
    public ngxSmartModalService: NgxSmartModalService,
    private title: Title,
    private formBuilder: FormBuilder,
    private errorService: ErrorsService,
    private stickyReviewService: StickyReviewService
  ) { 
    // update errorMessage if anything caught by our error interceptor
    this.subscription = this.errorService.error$.subscribe(
      errMsg => {
        this.loader = false;
        this.errorMessage = errMsg;
      }
    );
    // update validationErrors if anything has been caught by our error interceptor
    this.subscription = this.errorService.validationErrors$.subscribe(
      validationErrMsg => {
        Log.info(validationErrMsg, 'validation errors');
        this.loader = false;
        this.validationErrors = validationErrMsg;
      }
    );
  }

  /**
   * ngOnInit method initialize angular reactive form object for add / edit sticky review. 
   * Also it set the title of the page. Also it defines all client side validation for add 
   * or edit form of sticky reviews
   * @method ngOnInit
   * @since Version 1.0.0
   * @returns Void
   */
  public ngOnInit() {
    // show the loader as it's going to fetch records from api
    this.loader = true;
    // set the page title
    this.title.setTitle('Stickyreviews :: Sticky Reviews');
    // make an api call to get all sticky reviews
    this.getStickyReviews();
    // initialize the fombuilder for add / edit a sticky review form
    this.form = this.formBuilder.group({
      srName : [null, [Validators.required, Validators.maxLength(25)]], // sticky review name
      srTags : [null], // sticky review tags
      srComment : [null, [Validators.required, Validators.maxLength(80)]], // sticky review
      srRating : [null, Validators.required], // sticky review rating
      srDateTime : [null], // sticky review date and time
      srImage : [null], // sticky review image
    });
  }

  /**
   * Function to execute when this component is going to destroy by the browser.
   * This will unsubscribe the subscription when this component will be destroyed.
   * @method ngOnDestroy
   * @since Version 1.0.0
   * @returns Void
   */
  public ngOnDestroy() {
    this.subscription.unsubscribe();
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
   * resetForm method is just reset the form after successfully
   * submission of add or edit form
   * @method resetForm
   * @since Version 1.0.0
   * @returns Void
   */
  public get resetForm() {
    return this.form.reset();
  }

  /**
   * Method to get all sticky reviews from api end point
   * @method getStickyReviews
   * @since Version 1.0.0
   * @returns Void
   */
  public getStickyReviews() {
    // making an api call to get all sticky reviews and update `reviews` array which is a class property
    this.stickyReviewService.getAllStickyReviews().subscribe(
      (response: any) => {
        Log.success(response);
        if (response.status) {
          // update the brands array with latest api response data
          this.reviews = response.data;
          Log.debug(this.reviews.length, "Checking the length of the reviews property");
          // hide the loader
          this.loader = false;
        }
      }
    );
  }

  /**
   * This method is setting client side validators dynamically based on whether
   * a review is being added or edited. If adding then sticky review image is required
   * and if editing then image is optional.
   * @method isImageRequired
   * @since Version 1.0.0
   * @todo Max image size will be called from some constants which will yet to be defined
   * @returns Void
   */
  public validateImage() {
    if(!this.isEditing) {
      Log.notice("check in if it coming here");
      this.getFormControls.srImage.setValidators(Validators.required);
      this.getFormControls.srImage.updateValueAndValidity();
      
    }
    // setting validation if file is uploaded and it's not an image
    if(this.image !== null) {
      this.form.setValidators(ValidationEngine.FileType('srImage', this.image, this.allowedFileTypes));
      this.form.updateValueAndValidity();
      this.form.setValidators(ValidationEngine.FileSize('srImage', this.image, 1, 'MB'));
      this.form.updateValueAndValidity();
    }
    // !this.isEditing ? this.getFormControls.srImage.setValidators(Validators.required) : '';
  }

  /**
   * Method to open the modal when `Add Review` will be clicked.
   * This also `isEditing` to `false` if someone edited a sticky review
   * and then trying to add a sticky review.
   * @method onAddStickyReview
   * @since Version 1.0.0
   * @returns Void
   */
  public onAddStickyReview() {
    // reset the form if someone click on edit and close the modal and decide to add one
    this.resetForm;
    // set the id to null again
    this.reviewId = null;
    // setting false if someone after doing the edit decide to add a review
    this.isEditing = false;
    // setting false if someone after deleting decide to add a review
    this.isDeleting = false;
    // now open the modal with empty form to add a sticky review
    this.ngxSmartModalService.getModal('modal1').open();
  }

  /**
   * Method to be called when someone clicks on edit review icon
   * @method onEditStickyReview
   * @since Version 1.0.0
   * @returns Void
   */
  public onEditStickyReview(review : StickyReviewModel) {
    // set review id which is currently being edited
    this.reviewId = review.id;
    // set `isEditing` to true once the edit icon has been clicked
    this.isEditing = true;
    const patchDateTime = new Date(review.created_at);
    // prepare data object with the selected sticky review row
    const data = {
      srName: review.name,
      srTags: review.tags,
      srComment: review.description,
      srRating: review.rating,
      srDateTime: new Date(
        patchDateTime.getFullYear(),
        patchDateTime.getMonth(),
        patchDateTime.getDate(),
        patchDateTime.getHours(),
        patchDateTime.getMinutes(),
        patchDateTime.getSeconds()
      ),
      srImageUrl: review.image_url
    };
    // set values into the form of currently selected row
    this.form.patchValue(data);
    // now open the model to show the form into the model to user
    this.ngxSmartModalService.getModal('modal1').open();
  }

  /**
   * Method to change the text in file upload box
   * @method onChangeFile
   * @since Version 1.0.0
   * @param event HTMl DOM event
   * @returns Void
   */
  public onChangeFile(event: any) {
    if (event.target.files.length > 0) {
      // show the filename into file upload area
      this.fileName = event.target.files[0].name;
      // show this take into file upload area
      this.choseFileCtrl = 'Change file';
      // set the image file data to `image` property
      this.image = event.target.files[0];
      // this.form.get('srImage').setValue(file);
    }
  }

  /**
   * Method will be executed at the time of add or update a review. This responsible for
   * handling client and server side validations. At the same time this method is responsible
   * for storing new or updated data to database and handle the response accordingly.
   * @method onSubmit
   * @since Version 1.0.0
   * @returns Void
   */
  public onSubmit() {
    Log.info(this.form, "Checking form data");
    // make `isSubmitted` to true
    this.isSubmitted = true;
    // adding validation for image for checking file type and file size
    this.validateImage();
    // check if `form` is valid or not
    if(this.form.invalid) {
      return;
    }
    // showing the loader
    this.loader = true;
    // creating an instance of `FormData` class
    const formData = new FormData();
    // appending request body params to formData object
    formData.append('name', this.form.value.srName); // adding name
    formData.append('tags', this.form.value.srTags); // adding tags
    formData.append('description', this.form.value.srComment); // adding review
    formData.append('rating', this.form.value.srRating); // adding rating
    formData.append('myDateString', this.form.value.srDateTime); // adding date to show 
    if(this.image !== null) {
      formData.append('image', this.image, this.image.name);
    }
    // checking if user is editing
    if(this.isEditing) {
      // adding id to selected row to update
      formData.append('id', this.reviewId); 
      // calling this member function to make an api call to update the data 
      // and handle response including exceptions if any
      this.updateStickyReview(formData);
    } else {
      // calling this member function to make an api call to store the data 
      // and handle response including exceptions if any
      this.addStickyReview(formData);
    }
  }

  /**
   * Method to update a sticky review making an api call and handle the response
   * @method editStickyReview
   * @since Version 1.0.0
   * @param data FormData Data to send over http request
   */
  public updateStickyReview(data: FormData) {
    // make the api call to add a sticky review
    this.stickyReviewService.updateStickyReview(data).subscribe(
      (response: any) => {
        // log the response
        Log.notice(response, "Response for add a sticky review");
        if(response.status) {
          // once getting the response and status is true close the modal
          this.ngxSmartModalService.getModal('modal1').close();
          // show the success message to user
          this.successMessage = response.message;
          // change the flag for form submit
          this.isSubmitted = false;
          // reset the form
          this.resetForm;
          // making an api call to get all sticky reviews along with the newly added review
          this.getStickyReviews(); 
        } else {
          // show the error message to user
          this.errorMessage = response.message;
          // hide the loader
          this.loader = false;
        }
      } 
    );
  }

  /**
   * Method to add a sticky review and store in into database using api
   * @method addStickyReview
   * @since Version 1.0.0
   * @param data FormData Data to send over http request
   * @returns Void
   */
  public addStickyReview(data: FormData) {
    // make the api call to add a sticky review
    this.stickyReviewService.addStickyReview(data).subscribe(
      (response: any) => {
        // log the response
        Log.notice(response, "Response for add a sticky review");
        if(response.status) {
          // once getting the response and status is true close the modal
          this.ngxSmartModalService.getModal('modal1').close();
          // show the success message to user
          this.successMessage = response.message;
          // change the flag for form submit
          this.isSubmitted = false;
          // reset the form
          this.resetForm;
          // making an api call to get all sticky reviews along with the newly added review
          this.getStickyReviews(); 
        } else {
          // show the error message to user
          this.errorMessage = response.message;
          // hide the loader
          this.loader = false;
        }
      } 
    );
  }

  /**
   * Method to delete a sticky review. It also handles the response from api and act accordingly
   * @method onDeleteStickyReview
   * @since Version 1.0.0
   * @param reviewId (Number) Sticky review id
   * @returns Void
   */
  public onDeleteStickyReview(reviewId: number) {
    // setting to true as user wants to delete a brand
    this.isDeleting = true;
    // lets get the confirmation from user. if user cancel it then it's not doing anything
    if(!confirm("Are you sure want to delete it?")) {
      return;
    }
    // show loader
    this.loader = true;
    // prepare data to make a delete request
    const data = {id: reviewId};
    // make a api call to delete the brand
    this.stickyReviewService.deleteStickyReview(data).subscribe(
      (response: any) => {
        Log.info(response, 'delete api response');
        if(response.status) {
          // show the success message to user in review listing page
          this.successMessage = response.message;
          // making an api call to get all reviews along with the newly added sticky review
          this.getStickyReviews(); 
        } else {
          // show the error message to user in case there is any error from api response
          this.errorMessage = response.message;
          // hide the loader
          this.loader = false;
        }
      }
    );
  }
}
