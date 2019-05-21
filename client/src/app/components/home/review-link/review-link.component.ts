import { Component, OnInit } from '@angular/core';
import { NgxSmartModalService, NgxSmartModalComponent } from 'ngx-smart-modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ReviewLinkService } from '../../../services/review-link.service';
import { ReviewLinkModel } from '../../../models/review-link.model';
import { Log } from '../../../helpers/app.helper';
import { LoaderService } from '../../../services/loader.service';
import { Title } from '@angular/platform-browser';
import * as ValidationEngine from '../../../helpers/form.helper';

/**
 * ReviewLinkComponent is responsible for showing, adding, updating and deleting review links
 * @class ReviewLinkComponent
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@Component({
  selector: 'app-review-link',
  templateUrl: './review-link.component.html',
  styleUrls: ['./review-link.component.scss']
})
export class ReviewLinkComponent implements OnInit {
  // defining class properties
  reviewLinks:Array<ReviewLinkModel> = [] // An array of all review links
  form: FormGroup; // FormGroup to initialize step 1 of add/edit form of a review link
  form2: FormGroup; // FormGroup to initialize step 2 of add/edit form of a review link
  currentStep: number = 1; // default current step is 1 i.e first step of review link add/edit form
  choseFileCtrl: string = 'Browse from your computer';
  fileName: string = 'or drag & drop your image here';
  image: File = null; // Image file for sticky review image
  allowedMaxImageFileSize:number = 1; // max file size for sticky review image
  allowedImageFileTypes: string[] = [
    'image/jpeg',
    'image/png',
    'image/bmp',
    'image/gif'
  ];
  imagePreviewUrl: string = 'assets/images/user.png'; // default image preview url
  unit: string = "MB"; // legal values are GB|MB|KB
  reviewLinkId: string = null; // database unique id of review link
  errorMessage: string = null; // to show error messages mainly from when some exception has been caught
  successMessage: string = null; // to show success messages
  validationErrors: any = null; // for showing validation messages
  isSubmitted: boolean = false; // flag to set true if the add / edit form is submitted  
  isSubmittedReviews: boolean = false; // flag to set true if the add / edit form is submitted  
  isEditing: boolean = false; // flag to set true if user is performing some edit operation
  isDeleting: boolean = false; // flag to set true if user is performing some delete operation

  /**
   * Constructor to inject required service. It also subscribe to a observable which emits the current
   * value of defined variable. 
   * @constructor constructor
   * @since Version 1.0.0
   * @param ngxSmartModalService
   * @param loaderService 
   * @param reviewLinkService
   * @returns Void
   */
  constructor(
    private title: Title,
    private formBuilder: FormBuilder,
    private ngxSmartModalService: NgxSmartModalService,
    private reviewLinkService : ReviewLinkService,
    private loaderService: LoaderService,
  ) {}
  
   /**
   * ngOnInit method initialize angular reactive form object for add / edit form of a brand. 
   * Also it set the title of the page. Also it defines client side validations.
   * @method ngOnInit
   * @since Version 1.0.0
   * @returns Void
   */
  public ngOnInit() {
    // set the page title
    this.title.setTitle('Stickyreviews :: Review Link');
    // Initially load all the review links
    this.getAllReviewLinks();
    // initialize the form builder for add/edit action
    this.formStep1();
  }

  /**
   * Method to initialize add/edit review link form step 1
   * @method formStep1
   * @since Version 1.0.0
   * @returns Void
   */
  public formStep1() {
    this.form = this.formBuilder.group({
      myLogo: [null],
      name: [null, Validators.required],
      description: [null, Validators.required],
      url_slug: [null, Validators.required],
      logo: [null], // review link logo
      campaign_id: [null],
      auto_approve: [0],
      min_rating: [null, Validators.required],
      negative_info_review_msg_1: [null, Validators.required],
      negative_info_review_msg_2: [null, Validators.required],
      positive_review_msg: [null, Validators.required]
    });
  }

  /** 
   * Method to initialize add/edit review link form step 2
   * @method formStep2
   * @since Version 1.0.0
   * @returns Void
   */
  public formStep2() {
    this.form2 = this.formBuilder.group({
      myLogo: [null],
    });
  }

  /**
   * @method ngAfterViewInit
   */
  public ngAfterViewInit() {
    this.modalCallbacks();
  }

  /**
   * Method to perform ngx-smart-modal event callbacks
   * @method modalCallbacks
   * @since Version 1.0.0
   * @returns Void
   */
  public modalCallbacks() {
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
    this.form.reset(); // reset the form
    // set default image to preview image area
    this.imagePreviewUrl = 'assets/images/user.png';
    return;
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
   * 
   * @param slug 
   */
  public checkUrlSlug(slug: string){
    
  }

  /**
   * Method to get all reviews links from api end point
   * @method getAllReviewLinks
   * @since Version 1.0.0
   * @returns Void
   */
  public getAllReviewLinks() {
    // Enable the loader for an ajax call
    this.loaderService.enableLoader()
    // Service to to get all the Review Links
    this.reviewLinkService.getAllReviewLinks().subscribe(
      (response: any) => {
        Log.info(response, "List: response");
        if(response.status) {
          this.reviewLinks = response.data.data;
          // hide the loader
          this.loaderService.disableLoader();
        } else {
          this.errorMessage = response.messages;
          // hide the loader
          this.loaderService.disableLoader();
        }
      }
    )
  }

  /**
   * Method to open the modal when `Add Campaign` will be clicked.
   * This also `isEditing` to `false` if someone edited a review link
   * and then trying to add a review link.
   * @method onAddReviewLink
   * @since Version 1.0.0
   * @returns Void
   */
  public onAddReviewLink() {
    // set the id to null again
    this.reviewLinkId = null;
    // setting false if someone after doing the edit decide to add a review link
    this.isEditing = false;
    // setting false if someone after deleting decide to add a review link
    this.isDeleting = false;
    // now open the modal with empty form to add a sticky review link
    this.ngxSmartModalService.getModal('modal1').open();
  }

  /**
   * Method to handle the modal popup for edit the review link
   * @method onEditReviewLink
   * @param data 
   * @since Version 1.0.0
   * @returns Void
   */
  public onEditReviewLink(reviewLink: ReviewLinkModel) {
    this.reviewLinkId = reviewLink.id;
    this.form.patchValue({
      'id': reviewLink.id,
      'name': reviewLink.name,
      'description': reviewLink.description,
      'url_slug': reviewLink.url_slug,
      'logo': reviewLink.logo,
      'campaign_id': reviewLink.campaign_id,
      'auto_approve': reviewLink.auto_approve,
      'min_rating': reviewLink.min_rating,
      'negative_info_review_msg_1': reviewLink.negative_info_review_msg_1,
      'negative_info_review_msg_2': reviewLink.negative_info_review_msg_2,
      'positive_review_msg': reviewLink.positive_review_msg
    });
    this.ngxSmartModalService.getModal('modal1').open();
  }

  /**
   * Method to add a review link making an api call
   * @param data 
   */
  public storeReviewLink(data: FormData){
    this.reviewLinkService.addReviewLink(data).subscribe(
      (response: any) => {
        Log.info(response, "Response Store");
        if(response.status) {
          // perform post response activities
          this.postResponseActivities(response.message);
        } else {
          // perform post response activities in case any error occurred
          this.postResponseActivities(response.message, false, false, true, true);
        }
      }
    );
  }

  /**
   * Method to update a review link making an api call
   * @method updateReviewLink
   * @since Version 1.0.0
   * @param data FormData instance. The request payload
   * @returns Void
   */
  public updateReviewLink(data: FormData){
    this.reviewLinkService.updateReviewLink(this.reviewLinkId, data).subscribe(
      (response: any) => {
        Log.info(response, "Response Store");
        if(response.status) {
          // perform post response activities
          this.postResponseActivities(response.message);
        } else {
          // perform post response activities in case any error occurred
          this.postResponseActivities(response.message, false, false, true, true);
        }
      }
    );
  }

  /**
   * Method to delete a review link making an api call
   * @method deleteReviewLink
   * @param id Review Link Id
   * 
   */
  public deleteReviewLink(id: string){
    this.reviewLinkService.deleteReviewLink(this.reviewLinkId).subscribe(
      (response: any) => {
        Log.info(response, "Response Store");
        if(response.status) {
          // perform post response activities
          this.postResponseActivities(response.message);
        } else {
          // perform post response activities in case any error occurred
          this.postResponseActivities(response.message, false, false, true, true);
        }
      }
    );
  }

  /**
   * onSubmit method to handle submit button from Modal popup for add or edit the review link
   * @method onSubmit
   * @since Version 1.0.0
   * @returns Void
   */
  onSubmitStep1(){
    this.isSubmitted = true;
    if(this.form.invalid) {
      return;
    }
    // show the loader
    this.loaderService.enableLoader();
    // creating an instance of `FormData` class
    const formData = new FormData();
    // append request payload to formData
    formData.append('name', this.getFormControls.name.value); // append review type
    formData.append('description', this.getFormControls.description.value); // append review type
    formData.append('url_slug', this.getFormControls.url_slug.value); // append review type
    formData.append('campaign_id', this.getFormControls.campaign_id.value); // append review type
    formData.append('auto_approve', this.getFormControls.auto_approve.value); // append rating
    formData.append('min_rating', this.getFormControls.min_rating.value); // append date to show 
    formData.append('negative_info_review_msg_1', this.getFormControls.negative_info_review_msg_1.value); // append date to show 
    formData.append('negative_info_review_msg_2', this.getFormControls.negative_info_review_msg_2.value); // append date to show 
    formData.append('positive_review_msg', this.getFormControls.positive_review_msg.value); // append date to show 
    if(this.image !== null) {
      formData.append('logo', this.image, this.image.name); // append image to formData
    }
    if(this.isEditing) {
      this.updateReviewLink(formData);
    } else {
      this.storeReviewLink(formData);
    }
  }

  /**
   * Method to execute when CRUD operations is taking place
   * @method postResponseActivities
   * @since Version 1.0.0
   * @param message Message to display
   * @param closeModal True to close and false not to do anything
   * @param fetchLists True to fetch the lists
   * @param hideLoader True to hide loader
   * @param error True to show error message, false to show success message
   * @returns Void
   */
  public postResponseActivities(
    message: string, 
    closeModal: boolean = true, 
    fetchLists: boolean = true, 
    hideLoader: boolean = true, 
    error: boolean = false
  ) {
    if (closeModal) this.ngxSmartModalService.getModal('modal1').close(); // close the modal
    error ? this.errorMessage = message : this.successMessage = message; // set message
    this.isSubmitted = false; // change the flag for form submit
    this.isEditing = false; // set it to false
    this.isDeleting = false; // set it to false
    this.isSubmittedReviews = false; // set it to false
    this.reviewLinkId = null; // set campaign id to null
    if (fetchLists) {
      this.getAllReviewLinks(); // fetch campaigns
    } else if(hideLoader) {
      this.loaderService.disableLoader()
    }
  }
}