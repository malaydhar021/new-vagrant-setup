import { Component, OnInit, Input, OnDestroy }  from '@angular/core';
import { Title }                                from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators }   from '@angular/forms';
import { Subscription }                         from 'rxjs';
import { UserReviewService }                    from '../../../services/user-review.service';
import { UserReviewModel }                      from '../../../models/user-review.model';
import { Log }                                  from '../../../helpers/app.helper';
import * as ValidationEngine                    from '../../../helpers/form.helper';
import { ErrorsService }                        from '../../../services/errors.service';

/**
 * Component class to handle and validate the user display picture during user review
 * @class DisplayPictureComponent
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@Component({
  selector: 'app-display-picture',
  templateUrl: './display-picture.component.html',
  styleUrls: ['./display-picture.component.scss']
})
export class DisplayPictureComponent implements OnInit, OnDestroy {
  // define class properties
  @Input() slug: string = null;
  subscription: Subscription;
  fileName: string = null;
  choseFileCtrl: string = "Browse from your <em>Computer</em> or Drag-and-drop here";
  image: File = null; // Image file for sticky review image
  form: FormGroup; // for add or edit review form in modal
  errorMessage: string = null; // to show error messages mainly from when some exception has been caught
  successMessage: string = null; // to show success messages
  validationErrors: any = null; // for showing validation messages
  isSubmitted: boolean = false; // flag to set true if the add / edit form is submitted  
  allowedMaxImageFileSize:number = 1; // max file size for sticky review image
  unit: string = "MB"; // legal values are GB|MB|KB
  // allowed file types for sticky review image
  allowedImageFileTypes: string[] = [
    'image/jpeg',
    'image/png',
    'image/bmp',
    'image/gif'
  ];
  imagePreviewUrl: string = 'assets/images/user.png'; // default image preview url
  errorSubscription: Subscription; // to get the current value of showError property
  showError: boolean = false; // flag to show error message

  /**
   * Constructor method
   * @constructor constructor
   * @since Version 1.0.0
   * @param title Instance of Title service
   * @param formBuilder Instance of FormBuilder
   * @param userReviewService Instance of UserReviewService
   * @param errorService Instance of ErrorsService
   * @returns Void
   */
  constructor(
    private title: Title,
    private formBuilder: FormBuilder,
    private userReviewService: UserReviewService,
    private errorService: ErrorsService,
  ) { 
    this.title.setTitle('Stickyreviews :: Display Picture');
    // subscribe to review to get the latest update data from review
    this.subscription = this.userReviewService.review$.subscribe(
      (review: UserReviewModel) => {
        Log.info(review, "Log the updated review in DisplayPictureComponent");
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
   * @method ngOnInit
   * @since Version 1.0.0
   * @returns Void
   */
  public ngOnInit() {
    // initialize the form builder for user display picture
    this.form = this.formBuilder.group({
      dp : [null, Validators.required], // display picture 
    });
  }

  public ngOnDestroy() {
    this.errorSubscription.unsubscribe();
    this.errorService.clearMessage();
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
   * This method is setting client side validations for user display picture (image)
   * when any image has been chosen.
   * @method runtimeValidateImage
   * @since Version 1.0.0
   * @returns Void
   */
  public runtimeValidateImage() {
    // setting validation if file is uploaded and it's not an image
    if(this.image !== null) {
      this.form.setValidators([
        ValidationEngine.FileSize('dp', this.image, this.allowedMaxImageFileSize, this.unit),
        ValidationEngine.FileType('dp', this.image, this.allowedImageFileTypes)
      ]);
      this.form.updateValueAndValidity();
    }
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

      // validate the image file type and size
      this.runtimeValidateImage();
      if(this.getFormControls.dp.invalid) return;

      // lets make a FileReader object to read the file as data url
      let reader = new FileReader();
      // read file as data url
      reader.readAsDataURL(event.target.files[0]); 
      // called once readAsDataURL is completed
      reader.onload = (e) => { 
        this.imagePreviewUrl = reader.result.toString();
      }
    }
  }

  /**
   * Method to handle store review api response if review data passes the 
   * validation.
   * @method onSubmit
   * @since Version 1.0.0
   * @returns Void
   */
  public onSubmit() {
    // set this flag to true
    this.isSubmitted = true;
    // don't do anything if the data does not pass the client side validation
    if(this.form.invalid) {
      return;
    }
    // add profile to review data if the picture has been updated
    if(this.image !== null) {
      // add profile picture if it has been provided
      const data: UserReviewModel = {
        profile_picture: this.image
      }
      // update the review model data
      this.userReviewService.updateReview(data);
    }
    // store the review data
    this.userReviewService.storeUserReview();
  }
}