import { Component, OnInit, OnDestroy, AfterViewInit, Input } from '@angular/core';
import { UserReviewModel } from 'src/app/models/user-review.model';
import { Subscription } from 'rxjs';
import { Log } from 'src/app/helpers/app.helper';
import { UserReviewService } from 'src/app/services/user-review.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StickyReviewTypesModel } from 'src/app/models/sticky-review.model';
import { Title } from '@angular/platform-browser';
import { LoaderService } from 'src/app/services/loader.service';
import { MediaService } from 'src/app/services/media.service';
import * as ValidationEngine from '../../../helpers/form.helper';

/**
 * Component to handle all sort of operations regarding video / audio / textual review and rating.
 * @class ReviewComponent
 * @version 1.0.0
 * @author Tier LLC `<work@tier5.us>`
 * @license Proprietary
 */
@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() slug: string;
  subscription: Subscription;
  recordedFileSubscription: Subscription;
  review: UserReviewModel = {};
  form: FormGroup;
  errorMessage: string = null; // to show error messages mainly from when some exception has been caught
  successMessage: string = null; // to show success messages
  validationErrors: any = null; // for showing validation messages
  isSubmitted: boolean = false; // flag to set true if the add / edit form is submitted  
  allowedMaxReviewTitle: number = 25; // max chars for text review
  allowedMaxAudioFileSize:number = 20; // max file size for review type audio
  allowedMaxVideoFileSize:number = 30; // max file size for review type video
  unit: string = "MB";
  allowedMaxTextReviewChars: number = 60; // max chars for text review
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
  // default selected value to show which review field will be shown
  selectedReviewType: number = 2; // 1. Textual 2. Audio 3. Video
  //default selected value to show which action will be selected 
  selectedReviewTypeAction: number = 1; // 1. Upload 2. Record
  // review file name
  reviewFileName: string = 'or drag & drop your image here';
  reviewChoseFileCtrl: string = 'Browse from your computer';
  reviewAsFile: File = null;
  showMedia: boolean = false;
  reviewFileAsBlob: Blob = null;

  /**
   * @constructor constructor
   * @param userReviewService UserReviewService instance
   * @returns Void
   */
  constructor(
    private userReviewService: UserReviewService,
    private title: Title,
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    private mediaService: MediaService,
  ) { 
    this.title.setTitle('Stickyreviews :: Review');
    // subscribe to review to get the latest update data from review
    this.subscription = this.userReviewService.review$.subscribe(
      (review: UserReviewModel) => {
        // Log.info(review, "Log the updated review in ReviewComponent");
        this.review = review;
      }
    );
    // subscribe to recordedFile observable to get the latest recorded audio|video file
    this.recordedFileSubscription = this.mediaService.recordedFile$.subscribe(
      (recordedFile : File) => {
        if(recordedFile !== null) {
          this.reviewAsFile = recordedFile;
        }
      }
    );
  }

  /**
   * Method to initialize the form and listen when any form value got changed
   * @method ngOnInit
   * @since Version 1.0.0
   * @returns Void
   */
  public ngOnInit() {
    // initialize the form builder for add / edit a user review form
    this.form = this.formBuilder.group({
      name : [null, [Validators.required, Validators.maxLength(this.allowedMaxReviewTitle)]], // user review name
      review : [null], // formControl for text / audio / video review type file upload
      reviewType : [2], // Review type 1. Textual 2. Audio 3. Video
      reviewTypeAction : [1], // Review type action for audio / video review 1. Upload 2. Record
      rating : [null, Validators.required], // User review rating
    });
  }

  /**
   * @method ngAfterViewInit
   */
  public ngAfterViewInit() {
    // Listen to the valueChanges observable
    this.onFormValueChanges();
  }

  /**
   * Method to listen when any value of the form is got changed
   * @method onFormValueChanges
   * @since Version 1.0.0
   * @returns Void
   */
  public onFormValueChanges() {
    // subscribing to valueChanges observable
    this.form.valueChanges.subscribe(
      (fields: any) => {
        // this.mediaService.disposePlayer();
        // Log.debug(fields, "Log field in review component");
        // compare previous and current value of review type textual | audio | video
        if(this.selectedReviewType != fields.reviewType) {
          // check if audio | video option is selected or not
          if(fields.reviewType != 2 || fields.reviewType != 3) {
            this.mediaService.disposePlayer(); // if not then destroy the player
          }
          // update previous value with current value
          this.selectedReviewType = fields.reviewType;
        }
        // compare previous and current value of review type action (for audio or video only) upload | record
        if(this.selectedReviewTypeAction != fields.reviewTypeAction) {
          // check if record option is selected or not
          if(fields.reviewTypeAction != 2) {
            this.mediaService.disposePlayer(); // if not then destroy the player
          }
          // update previous value with current value
          this.selectedReviewTypeAction = fields.reviewTypeAction;
        }
      }
    );
  }

  /**
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
   * Method to change the text in audio / video file upload box. Also assign uploaded file to
   * `reviewAsFile` filetype property for future use. There is a bug with angular file upload 
   * with reactive form approach which is handled by a hidden field here.
   * @method onChangeReviewFile
   * @since Version 1.0.0
   * @param event HTMl DOM event
   * @see https://stackoverflow.com/questions/44072909/using-reactive-form-validation-with-input-type-file-for-an-angular-app/44238894
   * @see https://github.com/angular/angular.io/issues/3466
   * @todo Need check audio / video preview is not working after encountering a validation error. Called runtimeValidations() method two times
   * to temporarily fix the issue. But the main issue is still there. Have to be fixed in next release.
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

      // Log.debug(this.reviewAsFile, "Log file in on change");
      // set filename to hidden field to handle angular ractive form HTMLInputElement error
      this.getFormControls.review.setValue(this.reviewAsFile !== null ? this.reviewAsFile.name : '');
      // runtime validation for review files / text review based on review type
      this.runtimeValidations();
      // check whether `review` formControl has got any error or not
      if(this.getFormControls.review.invalid) {
        this.mediaService.disposePlayer();
        return;
      }
      // create an instance of FileReader
      let reader = new FileReader();
      // read file as data url
      reader.readAsDataURL(this.reviewAsFile); 
      // called once when readAsDataURL is completed
      reader.onload = (e) => {
        if(this.selectedReviewType == 2) {
          this.mediaService.updateVideoSrc(null);
          this.mediaService.updateAudioSrc(reader.result.toString());
        } else if(this.selectedReviewType == 3) {
          this.mediaService.updateAudioSrc(null);
          this.mediaService.updateVideoSrc(reader.result.toString());
        }   
        
        // runtime validation for review files / text review based on review type
        this.runtimeValidations();
        // check whether `review` formControl has got any error or not
        if(this.getFormControls.review.invalid) {
          this.mediaService.disposePlayer();
          return;
        }
      }
    }
  }

  /**
   * This method is setting client side validators dynamically based on whether
   * a review is being added or edited. If adding then sticky review image is required
   * and if editing then image is optional.
   * @method runtimeValidations
   * @since Version 1.0.0
   * @todo Clean up the code
   * @returns Void
   */
  public runtimeValidations() {
    // Textual review validations for add / edit sticky review
    if(this.selectedReviewType == 1) {
      // set validation for textual review type when it's created / updated 
      this.getFormControls.review.setValidators([Validators.required, Validators.maxLength(this.allowedMaxTextReviewChars)]);
      this.getFormControls.review.updateValueAndValidity();
    }
    // Audio review validations for adding
    if(this.selectedReviewType == 2) {
      // if file has been selected/changed
      if(this.reviewAsFile !== null) {
        // file mime type and file size validation
        this.form.setValidators([
          ValidationEngine.FileType('review', this.reviewAsFile, this.allowedAudioFileTypes),
          ValidationEngine.FileSize('review', this.reviewAsFile, this.allowedMaxAudioFileSize, this.unit)
        ]);
        this.form.updateValueAndValidity();
      } else {
        // if no file has been set then make it required
        this.getFormControls.review.setValidators(Validators.required);
        this.getFormControls.review.updateValueAndValidity();
      }
    }
    // Video review validations for adding a review
    if(this.selectedReviewType == 3) {
      // if file has been uploaded
      if(this.reviewAsFile !== null) { 
        // file mime type and file size validation.
        this.form.setValidators([
          ValidationEngine.FileType('review', this.reviewAsFile, this.allowedVideoFileTypes), 
          ValidationEngine.FileSize('review', this.reviewAsFile, this.allowedMaxVideoFileSize, this.unit)
        ]);
        this.form.updateValueAndValidity();
      } else {
        // if no file has been set then make it required
        this.getFormControls.review.setValidators(Validators.required);
        this.getFormControls.review.updateValueAndValidity();
      }
    }
  }

  /**
   * Method to handle form submission of review form and set the next step from here
   * if every thing goes right
   * @method onSubmit
   * @since Version 1.0.0
   * @returns Void
   */
  public onSubmit() {
    // set it to true
    this.isSubmitted = true;
    // call the validations for text | audio | video based on type
    this.runtimeValidations();
    // don't do anything if the form does not pass client side validations
    if(this.form.invalid) return;

    // showing the loader.
    /**
     * uncomment below line for final release
     */
    // this.loaderService.enableLoader();

    // creating an instance of `FormData` class
    const formData = new FormData();
    // add request payload to formData object
    formData.append('review_title', this.form.value.name); // append review title
    formData.append('review_type', this.form.value.reviewType); // append review type
    formData.append('rating', this.form.value.rating); // append rating
    
    // append review to formData based on review type
    if(this.selectedReviewType == 1) { // textual
      formData.append('review_text', this.form.value.review);
    } else if(this.selectedReviewType == 2 && this.reviewAsFile !== null) { // audio
      formData.append('review_audio', this.reviewAsFile, this.reviewAsFile.name);
    } else if(this.selectedReviewType == 3 && this.reviewAsFile !== null) { // video
      formData.append('review_video', this.reviewAsFile, this.reviewAsFile.name);
    }

    /**
     * Below block of commented code will be enabled for final release
     */

    /*
    // lets make an api call to validate the user data so far
    this.userReviewService.validateUserReview(this.slug, formData).subscribe(
      (response : any) => {
        Log.notice(response, "Notice the response from api");
        this.loaderService.disableLoader();
        
        if(response.status) {
          const data = {
            review_title: this.form.value.name,
            review_type: this.form.value.reviewType,
            rating: this.form.value.rating
          }
          if(this.selectedReviewType == 1) { // textual
            data['review_text'] = this.form.value.review;
          } else if(this.selectedReviewType == 2 && this.reviewAsFile !== null) { // audio
            data['review_audio'] = this.reviewAsFile;
          } else if(this.selectedReviewType == 3 && this.reviewAsFile !== null) { // video
            data['review_video'] = this.reviewAsFile;
          }
          this.userReviewService.updateReview(data);
          // set the next step based on recommendation
          if(this.review.recommendation) {
            // if recommended
            this.userReviewService.nextStep('permission');
          } else {
            // if not recommended
            this.userReviewService.nextStep('contact');
          }
        }
      }
    );
    */

    // for debugging and UI fixing 
    if(this.review.recommendation) {
      // if recommended
      this.userReviewService.nextStep('permission');
    } else {
      // if not recommended
      this.userReviewService.nextStep('contact');
    }
    
  }
}
