import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { NgxSmartModalComponent, NgxSmartModalService } from 'ngx-smart-modal';
import { Subscription } from 'rxjs';
import * as ValidationEngine from '../../../helpers/form.helper';
import { StickyReviewModel, StickyReviewTypesModel } from '../../../models/sticky-review.model';
import { LoaderService } from '../../../services/loader.service';
import { StickyReviewService } from '../../../services/sticky-review.service';
import { MediaService } from '../../../services/media.service';
import { Log } from '../../../helpers/app.helper';
import { ErrorsService } from 'src/app/services/errors.service';

/**
 * StickyReviewsComponent class will handle all required action to meet the functionalities of 
 * sticky review feature. It includes CRUD operation
 * @class StickyReviewsComponent
 * @version 2.0.0
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
  reviewChoseFileCtrl: string = 'Browse from your computer';
  reviewFileName: string = 'or drag & drop your image here';
  image: File = null; // Image file for sticky review image
  reviewAsFile: File = null; // File for audio / video upaloads
  reviewId: any = null;
  form: FormGroup; // for add or edit review form in modal
  reviews: [] = []; // holds all reviews as an array
  errorMessage: string = null; // to show error messages mainly from when some exception has been caught
  successMessage: string = null; // to show success messages
  validationErrors: any = null; // for showing validation messages
  subscription: Subscription; // to get the current value updated from error interceptor
  errorSubscription: Subscription; // to get the current value of showError property
  isSubmitted: boolean = false; // flag to set true if the add / edit form is submitted  
  isEditing: boolean = false; // flag to set true if user is performing some edit operation
  isDeleting: boolean = false; // flag to set true if user is performing some delete operation
  allowedMaxImageFileSize:number = 1; // max file size for sticky review image
  allowedMaxAudioFileSize:number = 20; // max file size for review type audio
  allowedMaxVideoFileSize:number = 30; // max file size for review type video
  unit: string = "MB"; // legal values are GB|MB|KB
  allowedMaxTextReviewChars: number = 60; // max chars for text review
  // allowed file types for sticky review image
  allowedImageFileTypes: string[] = [
    'image/jpeg',
    'image/png',
    'image/bmp',
    'image/gif'
  ];
  // allowed file types for audio file
  allowedAudioFileTypes: string[] = [
    'application/ogg',
    'audio/mp3',
    'audio/mpeg',
    'audio/mp4',
    'audio/ogg',
    'audio/webm',
    'audio/vorbis',
    'audio/vnd.wav',
    'audio/x-mpegurl'
  ];
  // allowed file types for video file
  allowedVideoFileTypes: string[] = [
    'application/ogg',
    'application/x-mpegURL',
    'video/x-matroska',
    'video/3gpp',
    'video/mp4',
    'video/MP2T',
    'video/ogg',
    'video/quicktime',
    'video/webm',
    'video/x-msvideo',
    'video/x-ms-wmv'
  ];
  // array of all review types
  reviewTypes: StickyReviewTypesModel[] = [
    {
      id: 1,
      name: 'Textual',
      slug: 'textual'
    },
    {
      id: 2,
      name: 'Audio',
      slug: 'audio'
    },
    {
      id: 3,
      name: 'Video',
      slug: 'video'
    }
  ];
  selectedReivewType: number = 1; // default selected value to show which review field will be shown
  imagePreviewUrl: string = 'assets/images/user.png'; // default image preview url
  showError: boolean = false; // flag to show error message

  constructor(
    public ngxSmartModalService: NgxSmartModalService,
    private title: Title,
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    private stickyReviewService: StickyReviewService,
    private mediaService: MediaService,
    private errorService: ErrorsService
  ) {
    this.errorSubscription = this.errorService.showMessage$.subscribe(
      (status: boolean) => {
        this.showError = status;
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
  public ngOnInit(): void {
    // show the loader as it's going to fetch records from api
    this.loaderService.enableLoader();
    // set the page title
    this.title.setTitle('Stickyreviews :: Sticky Reviews');
    // make an api call to get all sticky reviews
    this.getStickyReviews();
    // initialize the form builder for add / edit a sticky review form
    this.form = this.formBuilder.group({
      srName : [null, [Validators.required, Validators.maxLength(25)]], // sticky review name
      srTags : [null], // sticky review tags
      sr : [null], // formControl for text / audio / video review type file upload // Validators.required, Validators.maxLength(80)
      srRating : [null, Validators.required], // sticky review rating
      srDateTime : [null], // sticky review date and time
      srImage : [null], // sticky review image
      srType: [1], // sticky review type textual | audio | video
    });
    // subscribe to `valueChanges` method which emits current value of formControlName.
    // In this case onchange of review type `selectedReivewType` propety value has been
    // changed to current selected value of review type select box
    this.getFormControls.srType.valueChanges.subscribe(
      (value : number) => {
        this.reviewChoseFileCtrl = 'Browse from your computer';
        this.reviewFileName = 'or drag & drop your image here';
        this.reviewAsFile = null;
        // assign current value of review type a class property
        this.selectedReivewType = value;       
        Log.debug(this.selectedReivewType);
      }
    );
  }

  /**
   * Function to execute when this component is going to destroy by the browser.
   * This will unsubscribe the subscription when this component will be destroyed.
   * @method ngOnDestroy
   * @since Version 1.0.0
   * @returns Void
   */
  public ngOnDestroy(): void {
    this.errorSubscription.unsubscribe();
  }

  /**
   * Method that executes once the dom is loaded to browser
   * @method ngAfterViewInit
   * @since Version 2.0.0
   * @returns Void
   */
  public ngAfterViewInit() {
    // do stuffs when modal has been closed. In this case reset the form when modal is closed
    this.ngxSmartModalService.getModal('modal1').onClose.subscribe((modal: NgxSmartModalComponent) => {
      this.resetForm;
    });
    // do stuffs when modal has been dismissed i.e when the modal is closed clicking in backdrop.
    // In this case reset the form when modal is dismissed
    this.ngxSmartModalService.getModal('modal1').onDismiss.subscribe((modal: NgxSmartModalComponent) => {
      this.resetForm;
    });
    // reset form when modal has been closed by esc key
    this.ngxSmartModalService.getModal('modal1').onEscape.subscribe((modal: NgxSmartModalComponent) => {
      this.resetForm;
    });
    // set showError to false when the modal is being opened
    this.ngxSmartModalService.getModal('modal1').onOpen.subscribe((modal: NgxSmartModalComponent) => {
      this.errorService.updateShowMessageStatus(false);
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
   * resetForm method is just reset the form after successfully
   * submission of add or edit form. Also set default value to
   * review type as `textual`
   * @method resetForm
   * @since Version 1.0.0
   * @returns Void
   */
  public get resetForm() {
    // reset the form
    this.form.reset();
    // set default image to preview image area
    this.imagePreviewUrl = 'assets/images/user.png';
    // set review type dropdown default value to `textual`
    this.getFormControls.srType.setValue(1);
    this.mediaService.updateAudioSrc(null);
    this.mediaService.updateVideoSrc(null);
    return;
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
          // update the reviews array with latest api response data
          this.reviews = response.data.data;
          Log.debug(this.reviews.length, "Checking the length of the reviews property");
          // hide the loader
          this.loaderService.disableLoader();
        }
      }
    );
  }

  /**
   * This method is setting client side validators dynamically based on whether
   * a review is being added or edited. If adding then sticky review image is required
   * and if editing then image is optional.
   * ### *DEPRECATED* ###
   * @method validateImage
   * @since Version 1.0.0
   * @deprecated In version 2.0.0
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
      this.form.setValidators(ValidationEngine.FileType('srImage', this.image, this.allowedImageFileTypes));
      this.form.updateValueAndValidity();
      this.form.setValidators(ValidationEngine.FileSize('srImage', this.image, 1, 'MB'));
      this.form.updateValueAndValidity();
    }
  }

  /**
   * This method is setting client side validators dynamically based on whether
   * a review is being added or edited. If adding then sticky review image is required
   * and if editing then image is optional.
   * @method runtimeValidations
   * @since Version 2.0.0
   * @returns Void
   */
  public runtimeValidations() {
    /**
     * Image file validations for add / edit sticky review form
     */
    if(!this.isEditing) {
      this.getFormControls.srImage.setValidators(Validators.required);
      this.getFormControls.srImage.updateValueAndValidity();
    } else {
      this.getFormControls.srImage.clearValidators();
      this.getFormControls.srImage.updateValueAndValidity();
    }
    // if file has been selected
    if(this.image !== null) {
      // file mime type validation
      this.form.setValidators(ValidationEngine.FileType('srImage', this.image, this.allowedImageFileTypes));
      this.form.updateValueAndValidity();
      // file size validation. Max 1 MB image is allowed to upload
      this.form.setValidators(ValidationEngine.FileSize('srImage', this.image, this.allowedMaxImageFileSize, this.unit));
      this.form.updateValueAndValidity();
    }
    /**
     * Textual review validations for add / edit sticky review
     */
    if(this.selectedReivewType == 1) {
      // set validation for textual review type when it's created / updated 
      this.getFormControls.sr.setValidators([Validators.required, Validators.maxLength(this.allowedMaxTextReviewChars)]);
      this.getFormControls.sr.updateValueAndValidity();
    }
    /**
     * Audio review validations for add / edit a review
     */
    if(this.selectedReivewType == 2) {
      if(!this.isEditing) {
        // set validation for audio review type when it's being created 
        this.getFormControls.sr.setValidators([Validators.required]);
        this.getFormControls.sr.updateValueAndValidity();
      }
      // if file has been selected/changed
      if(this.reviewAsFile !== null) {
        // file mime type validation
        this.form.setValidators(ValidationEngine.FileType('sr', this.reviewAsFile, this.allowedAudioFileTypes));
        this.form.updateValueAndValidity();
        // file size validation. Max 20 MB file audio file is allowed to upload
        this.form.setValidators(ValidationEngine.FileSize('sr', this.reviewAsFile, this.allowedMaxAudioFileSize, this.unit));
        this.form.updateValueAndValidity();
      }
    }
    /**
     * Video review validations for add /edit a review
     */
    if(this.selectedReivewType == 3) {
      if(!this.isEditing) {
        // set validation for video review type when it's being created 
        this.getFormControls.sr.setValidators([Validators.required]);
        this.getFormControls.sr.updateValueAndValidity();
      }
      // if file has been uploaded
      if(this.reviewAsFile !== null) { 
        // file mime type validation.
        this.form.setValidators(ValidationEngine.FileType('sr', this.reviewAsFile, this.allowedVideoFileTypes));
        this.form.updateValueAndValidity();
        // file size validation. Max 30 MB is allowed to upload
        this.form.setValidators(ValidationEngine.FileSize('sr', this.reviewAsFile, this.allowedMaxVideoFileSize, this.unit));
        this.form.updateValueAndValidity();
      }
    }
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
    Log.info(review);
    Log.debug(review.review);
    // set review id which is currently being edited
    this.reviewId = review.id;
    // set `isEditing` to true once the edit icon has been clicked
    this.isEditing = true;
    const patchDateTime = new Date(review.created_at);
    // prepare data object with the selected sticky review row
    const data = {
      srName: review.name,
      srTags: review.tags,
      sr: (review.type == 1) ? review.review : '',
      srRating: review.rating,
      srType: review.type,
      srImageUrl: review.image_url,
      srDateTime: new Date(
        patchDateTime.getFullYear(),
        patchDateTime.getMonth(),
        patchDateTime.getDate(),
        patchDateTime.getHours(),
        patchDateTime.getMinutes(),
        patchDateTime.getSeconds()
      )
    };
    // let update media player src based on reivew type
    if(review.type == 2) {
      this.mediaService.updateAudioSrc(null);
      // update audio player scr to play the audio
      this.mediaService.updateAudioSrc(review.review);  
    } else if (review.type == 3) {
      this.mediaService.updateVideoSrc(null);
      // update video player scr to play the video
      this.mediaService.updateVideoSrc(review.review);
    }
    // set image preview for existing image
    this.imagePreviewUrl = review.image_url;
    // set values into the form of currently selected row
    this.form.patchValue(data);
    // now open the model to show the form into the model to user
    this.ngxSmartModalService.getModal('modal1').open();
  }

  /**
   * Method to change the text in file upload box. Also assign uploaded file object
   * to `image` filetype property for future use. See the url of you are facing problem
   * with FileReader
   * @method onChangeFile
   * @since Version 1.0.0
   * @param event Event
   * @see https://stackoverflow.com/questions/35789498/new-typescript-1-8-4-build-error-build-property-result-does-not-exist-on-t
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
      let reader = new FileReader();
      
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      // called once readAsDataURL is completed
      reader.onload = (e) => { 
        this.imagePreviewUrl = reader.result.toString();
      }
    }
  }

  /**
   * Method to change the text in audio / video file upload box. Also assign uploaded file to
   * `reviewAsFile` filetype property for future use. There is a bug with angular file upload 
   * with reactive form approach which is handled by a hidden field here.
   * @method onChangeReviewFile
   * @since Version 1.0.0
   * @param event HTMl DOM event
   * @see https://stackoverflow.com/questions/44072909/using-reactive-form-validation-with-input-type-file-for-an-angular-app/44238894
   * @see https://github.com/angular/angular.io/issues/3466
   * @returns Void
   */
  public onChangeReviewFile(event: any) {
    if (event.target.files.length > 0) {
      // show the filename into file upload area
      this.reviewFileName = event.target.files[0].name;
      // show this take into file upload area
      this.reviewChoseFileCtrl = 'Change file';
      // set the image file data to `image` property
      this.reviewAsFile = event.target.files[0];
      // set filename to hidden field to handle angular ractive form HTMLInputElement error
      this.getFormControls.sr.setValue(this.reviewAsFile !== null ? this.reviewAsFile.name : '');
      let reader = new FileReader();
      
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      // called once readAsDataURL is completed
      reader.onload = (e) => { 
        if(this.selectedReivewType == 2) {
          this.mediaService.updateVideoSrc(null);
          this.mediaService.updateAudioSrc(reader.result.toString());
        } else if(this.selectedReivewType == 3) {
          this.mediaService.updateAudioSrc(null);
          this.mediaService.updateVideoSrc(reader.result.toString());
        }        
      }
    }
  }

  /**
   * Method will be executed at the time of add or update a review. This responsible for
   * handling client and server side validations. At the same time this method is responsible
   * for storing new or updated data to database and handle the response accordingly. If any issue
   * came regarding audio / video file upload and if you are getting 413 HTTP error response then you
   * might look into following link to solve it.
   * @method onSubmit
   * @since Version 1.0.0
   * @see https://serverfault.com/questions/814767/413-request-entity-too-large-in-nginx-with-client-max-body-size-set
   * @returns Void
   */
  public onSubmit() {
    Log.info(this.form, "Checking form data");
    // make `isSubmitted` to true
    this.isSubmitted = true;
    // adding validation for image for checking file type and file size
    this.runtimeValidations();
    // check if `form` is valid or not
    if(this.form.invalid) {
      return;
    }
    // showing the loader
    this.loaderService.enableLoader();
    // creating an instance of `FormData` class
    const formData = new FormData();
    // add request payload to formData object
    formData.append('name', this.form.value.srName); // append name
    formData.append('tags', this.form.value.srTags); // append tags
    formData.append('type', this.form.value.srType); // append review type
    formData.append('rating', this.form.value.srRating); // append rating
    formData.append('reviewd_at', this.form.value.srDateTime); // append date to show 
    if(this.image !== null) {
      formData.append('image', this.image, this.image.name); // append image to formData
    }
    // append review to formData based on review type
    if(this.selectedReivewType == 1) { // textual
      formData.append('review_text', this.form.value.sr);
    } else if(this.selectedReivewType == 2 && this.reviewAsFile !== null) { // audio
      formData.append('review_audio', this.reviewAsFile, this.reviewAsFile.name);
    } else if(this.selectedReivewType == 3 && this.reviewAsFile !== null) { // video
      formData.append('review_video', this.reviewAsFile, this.reviewAsFile.name);
    }
    // checking if user is editing
    if(this.isEditing) {
      formData.append('is_creating', '0'); 
      // adding id to selected row to update
      formData.append('id', this.reviewId); 
      // set _method to PUT
      formData.append('_method', 'PUT');
      // calling this member function to make an api call to update the data 
      // and handle response including exceptions if any
      this.updateStickyReview(formData, this.reviewId);
    } else {
      formData.append('is_creating', '1'); 
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
  public updateStickyReview(data: FormData, id: number) {
    // make the api call to add a sticky review
    this.stickyReviewService.updateStickyReview(data, id).subscribe(
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
          // making an api call to get all sticky reviews along with the newly added review
          this.getStickyReviews(); 
          // hide the success message after 3 seconds
          setTimeout(() => {
            this.successMessage = null;
          }, 3000)
        } else {
          // show the error message to user
          this.errorMessage = response.message;
          // hide the loader
          this.loaderService.disableLoader();
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
          // making an api call to get all sticky reviews along with the newly added review
          this.getStickyReviews();
          // hide the success message after 3 seconds
          setTimeout(() => {
            this.successMessage = null;
          }, 3000);
        } else {
          // show the error message to user
          this.errorMessage = response.message;
          // hide the loader
          this.loaderService.disableLoader();
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
  public onDeleteStickyReview(reviewId: string) {
    // setting to true as user wants to delete a brand
    this.isDeleting = true;
    // lets get the confirmation from user. if user cancel it then it's not doing anything
    if(!confirm("Are you sure want to delete it?")) {
      return;
    }
    // show loader
    this.loaderService.enableLoader();
    // make a api call to delete the brand
    this.stickyReviewService.deleteStickyReview(reviewId).subscribe(
      (response: any) => {
        Log.info(response, 'delete api response');
        if(response.status) {
          // show the success message to user in review listing page
          this.successMessage = response.message;
          // making an api call to get all reviews along with the newly added sticky review
          this.getStickyReviews();
          // hide the success message after 3 seconds
          setTimeout(() => {
            this.successMessage = null;
          }, 3000) 
        } else {
          // show the error message to user in case there is any error from api response
          this.errorMessage = response.message;
          // hide the loader
          this.loaderService.disableLoader();
        }
      }
    );
  }
}