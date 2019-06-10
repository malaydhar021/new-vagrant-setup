import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgxSmartModalService, NgxSmartModalComponent } from 'ngx-smart-modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReviewLinkService } from '../../../services/review-link.service';
import { ReviewLinkModel } from '../../../models/review-link.model';
import { Log, Utilities } from '../../../helpers/app.helper';
import { LoaderService } from '../../../services/loader.service';
import { Title } from '@angular/platform-browser';
import * as ValidationEngine from '../../../helpers/form.helper';
import { Subscription } from 'rxjs';
import { ErrorsService } from 'src/app/services/errors.service';

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
export class ReviewLinkComponent implements OnInit, OnDestroy {
  // defining class properties
  reviewLinks: Array<ReviewLinkModel> = [] // An array of all review links
  campaigns: any = []; // all campaigns array
  selectedCampaign: any = this.campaigns[0]; // default selected campaign array
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
  imagePreviewUrl: any = 'assets/images/default_logo_image_sr.png'; // default image preview url
  unit: string = "MB"; // legal values are GB|MB|KB
  reviewLinkId: string = null; // database unique id of review link
  errorMessage: string = null; // to show error messages mainly from when some exception has been caught
  successMessage: string = null; // to show success messages
  validationErrors: any = null; // for showing validation messages
  isSubmittedStep1: boolean = false; // flag to set true if the add / edit form is submitted for step 1
  isSubmittedStep2: boolean = false; // flag to set true if the add / edit form is submitted for step 2
  isSubmittedStep1Reviews: boolean = false; // flag to set true if the add / edit form is submitted
  isEditing: boolean = false; // flag to set true if user is performing some edit operation
  isDeleting: boolean = false; // flag to set true if user is performing some delete operation
  isValidSlug: boolean = false; // true if url slug is unique, false if not
  hasUrlSlugChanged: boolean = null // true if url slug got changed. default value is null
  pageBackground: string = '#B8CBEB'; // Backdrop color of modal or page background. Default is #B8CBEB
  modalBackground: string = '#FFFFFF'; // Backdrop color of modal or page background
  textColor: string = '#268BFF'; // Backdrop color of modal or page background
  showMore: boolean = false; // flag to set true to show more and false to show less
  rowIndex: number = null; // row index of each row for review link list page
  config: any;  // config for pagination
  errorSubscription: Subscription; // to get the current value of showError property
  showError: boolean = false; // flag to show error message
  /**
   * Constructor to inject required service. It also subscribe to a observable which emits the current
   * value of defined variable.
   * @constructor constructor
   * @since Version 1.0.0
   * @param title Title service instance
   * @param formBuilder FormBuilder instance
   * @param ngxSmartModalService Modal service instance
   * @param loaderService Loader service instance
   * @param reviewLinkService Review link service instance
   * @returns Void
   */
  constructor(
    private title: Title,
    private formBuilder: FormBuilder,
    private ngxSmartModalService: NgxSmartModalService,
    private reviewLinkService : ReviewLinkService,
    private loaderService: LoaderService,
    private errorService: ErrorsService
  ) {
    // first fetch all campaigns for add or edit page
    this.getCampaigns();
    this.errorSubscription = this.errorService.showMessage$.subscribe(
      (status: boolean) => {
        this.showError = status;
      }
    );
  }

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
    // initialize the form builder for add/edit action for step 1
    this.formStep1();
    // initialize the form builder for add/edit action for step 2
    this.formStep2();
     this.config = {
       itemsPerPage: 15,
       currentPage: 1,
     };
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
      auto_approve: [false],
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
      page_background: [null], // modal backdrop color
      modal_background: [null], // modal body background color
      text_color: [null], // modal text color
      copyright_text: [null] // copyright text
    });
  }

  /**
   * Method to fetch all campaigns from api
   * @method getCampaigns
   * @since Version 1.0.0
   * @returns Void
   */
  public getCampaigns() {
    this.reviewLinkService.campaigns.subscribe(
      (response: any) => {
        this.campaigns = response.data;
      }
    );
  }

  /**
   * @method ngAfterViewInit
   */
  public ngAfterViewInit() {
    this.modalCallbacks();
    this.onUrlSlugChange();
  }

  /**
   * Method to generate the slug on review name change
   * @method onUrlSlugChange
   * @since Version 1.0.0
   * @returns Void
   */
  public onUrlSlugChange() {
    // when url slug field value is changed set flag true or false to minimize the http calls to server
    this.getFormControls.url_slug.valueChanges.subscribe(
      (value: string) => {
        // set to true if value got changed else false
        this.hasUrlSlugChanged = (this.form.value.url_slug !== value) ? true : false;
      }
    );
  }

  /**
   * Method to change the auto approve status from the listing page
   * @method onChangeAutoApproveStatus
   * @since Version 1.0.0
   * @param id Review link system id
   * @returns Void
   */
  public onChangeAutoApproveStatus(id: string, autoApproveStatus) {
    // set the review link id property
    this.reviewLinkId = id;
    const data: ReviewLinkModel = {
      auto_approve: (autoApproveStatus.value) ? 1 : 0
    };
    this.loaderService.enableLoader();
    this.updateAutoApproveStatus(data);
  }

  /**
   * Method to change value of `pageBackground` when user picks a color from color picker
   * @method onChangePageBackgroundColor
   * @since Version 1.0.0
   * @returns Void
   */
  public onChangePageBackgroundColor($event) {
    this.pageBackground = $event;
  }

  /**
   * Method to change value of `modalBackground` when user picks a color from color picker
   * @method onChangeModalBackgroundColor
   * @since Version 1.0.0
   * @returns Void
   */
  public onChangeModalBackgroundColor($event) {
    this.modalBackground = $event;
  }

  /**
   * Method to change value of `textColor` when user picks a color from color picker
   * @method onChangeTextColor
   * @since Version 1.0.0
   * @returns Void
   */
  public onChangeTextColor($event) {
    this.textColor = $event;
  }

  /**
   * Method will be execute when previous step will be clicked from last step.
   * It will enable the step 1 form for review link add/edit
   * @method onClickPreviousStep
   * @since Version 1.0.0
   * @returns Void
   */
  public onClickPreviousStep() {
    // show step 1 form to user
    this.currentStep = 1;
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
   * Method to get all the controls for formGroup named `form2`
   * @method getForm2Controls
   * @since Version 1.0.0
   * @returns FormControls
   */
  public get getForm2Controls() {
    return this.form2.controls;
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
   * Method to toggle selecting sticky reviews popup on the same button click
   * @method showMoreOptions
   * @since Version 1.0.0
   * @param index The current row index which has been clicked to show sticky reviews
   * @returns Void
   */
  public showMoreOptions(index: number) {
    // toggle review popup to show and hide alternatively on the same button click
    this.showMore = !this.showMore;
    // set index of the current row to `rowIndex` property which is used in template
    this.rowIndex = index;
  }

  /**
   * Method to compare value for select box options and default / current value
   * @method compareValue
   * @since Version 1.0.0
   * @param option Option value object for select options
   * @param current Current value object
   * @see https://github.com/angular/angular/pull/13349
   * @returns Boolean
   */
  public compareValue(option, current) {
    if((option !== null && option !== undefined) && ( current !== null && current !== undefined)) {
        return option.id === current.id;
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
      this.getFormControls.logo.setValidators(Validators.required);
      this.getFormControls.logo.updateValueAndValidity();
    } else {
      this.getFormControls.logo.clearValidators();
      this.getFormControls.logo.updateValueAndValidity();
    }
    // if file has been selected
    if(this.image !== null) {
      // file mime type validation
      this.form.setValidators([
        ValidationEngine.FileType('logo', this.image, this.allowedImageFileTypes), // file type validation
        ValidationEngine.FileSize('logo', this.image, this.allowedMaxImageFileSize, this.unit) // file size validation
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
      let reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url
      // called once readAsDataURL is completed
      reader.onload = (e) => {
        this.imagePreviewUrl = reader.result.toString();
      }
    }
  }

  /**
   * Method to get the slug from review link name and show it URL Slug field
   * @method slug
   * @since Version 1.0.0
   * @returns Void
   */
  public get slug() {
    if(this.getFormControls.name.value == '' || this.getFormControls.name.value === null) return;
    // this.isValidSlug = false;
    const slug = (this.getFormControls.url_slug.value !== null) ? this.getFormControls.url_slug.value : Utilities.generateSlug(this.getFormControls.name.value);
    Log.info(this.hasUrlSlugChanged, "Has slug changed?");
    this.getFormControls.url_slug.patchValue(slug);
    if(this.hasUrlSlugChanged) {
      this.checkUrlSlug(slug);
    }
    return;
  }

  /**
   * Method to validate the slug when URL Slug field value got changed
   * @method onChangeSlug
   * @since Version 1.0.0
   * @returns Void
   */
  public onChangeSlug() {
    const slug = (this.getFormControls.url_slug.value !== null) ? this.getFormControls.url_slug.value : Utilities.generateSlug(this.getFormControls.name.value);
    Log.info(this.hasUrlSlugChanged, "Has slug changed?");
    if(this.hasUrlSlugChanged) {
      this.checkUrlSlug(slug);
    }
    return;
  }

  /**
   * @method checkUrlSlug
   * @since Version 1.0.0
   * @param slug Slug to check
   */
  public checkUrlSlug(slug: string) {
    this.reviewLinkService.checkDuplicateUrlSlug(slug).subscribe(
      (response: any) => {
        Log.info(response, "Response from slug checker");
        if(response.status) {
          this.getFormControls.url_slug.setErrors(null);
          this.isValidSlug = true;
        } else if (!response.status) {
          this.getFormControls.url_slug.setErrors({isSlugExits: true});
          this.isValidSlug = false;
        }
      }
    );
  }

  /**
   * Method to get all reviews links from api end point
   * @method getAllReviewLinks
   * @since Version 1.0.0
   * @returns Void
   */
  public getAllReviewLinks() {
    // Enable the loader for an ajax call
    this.loaderService.enableLoader();
    // Service to to get all the Review Links
    this.reviewLinkService.getAllReviewLinks().subscribe(
      (response: any) => {
        Log.info(response, "List: response");
        if(response.status) {
          this.config.totalItems = response.data.total;
          this.reviewLinks = response.data.data;
          // hide the loader
          this.loaderService.disableLoader();
        } else {
          this.errorMessage = response.messages;
          // hide the loader
          this.loaderService.disableLoader();
        }
      }
    );
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
   * @param reviewLink  ReviewLinkModel instance
   * @since Version 1.0.0
   * @returns Void
   */
  public onEditReviewLink(reviewLink: ReviewLinkModel) {
    // set the edit flag to true
    this.isEditing = true;
    // set the review link id
    this.reviewLinkId = reviewLink.id;
    // set form fields values to respective fields for step 1
    this.form.patchValue({
      id: reviewLink.id,
      name: reviewLink.name,
      description: reviewLink.description,
      url_slug: reviewLink.url_slug,
      campaign_id: (reviewLink.campaign !== null) ? reviewLink.campaign : null,
      auto_approve: reviewLink.auto_approve,
      min_rating: reviewLink.min_rating,
      negative_info_review_msg_1: reviewLink.negative_info_review_message_1,
      negative_info_review_msg_2: reviewLink.negative_info_review_message_2,
      positive_review_msg: reviewLink.positive_review_message
    });
    // set form fields values to respective fields for step 2
    this.form2.patchValue({
      copyright_text: reviewLink.copyright_text
    });
    // set page background color in step 2 form field
    this.pageBackground = reviewLink.page_background;
    // set modal background color in step 2 form field
    this.modalBackground = reviewLink.modal_background;
    // set text color in step 2 form field
    this.textColor = reviewLink.text_color;
    // show the existing logo to user
    this.imagePreviewUrl = reviewLink.logo;
    // open the modal with set values
    this.ngxSmartModalService.getModal('modal1').open();
  }

  /**
   * Method to delete a review link making an api call
   * @method onDeleteReviewLink
   * @since Version 1.0.0
   * @returns Void
   */
  public onDeleteReviewLink(id: string) {
    // set the flag to true
    this.isDeleting = true;
    // set the id
    this.reviewLinkId = id;
    // get the confirmation from user before we delete
    if (!confirm("Are you sure want to delete?")) {
      return;
    }
    // let's show the loader
    this.loaderService.enableLoader();
    // delete the selected review link
    this.deleteReviewLink();
  }

  /**
   * Method to validate review link step 1 form data and on success it shows the next step for to user
   * @method validateReviewLinkStep1
   * @since Version 1.0.0
   * @param data Data to validate
   * @returns Void
   */
  public validateReviewLinkStep1(data: FormData) {
    this.reviewLinkService.validateData(data).subscribe(
      (response: any) => {
        Log.info(response, "Response Validate Params");
        if(response.status) {
          // show the next step form
          this.currentStep = 2;
          this.loaderService.disableLoader();
        }
      }
    );
  }

  /**
   * Method to add a review link making an api call
   * @method storeReviewLink
   * @since Version 1.0.0
   * @param data Form data request payload
   * @returns Void
   */
  public storeReviewLink(data: FormData) {
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
  public updateReviewLink(data: FormData) {
    this.reviewLinkService.updateReviewLink(this.reviewLinkId, data).subscribe(
      (response: any) => {
        Log.info(response, "Response Update");
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
   * Method to update a review link auto approve status
   * @method updateAutoApproveStatus
   * @since Version 1.0.0
   * @param data ReviewLinkModel instance. The request payload
   * @returns Void
   */
  public updateAutoApproveStatus(data: ReviewLinkModel) {
    this.reviewLinkService.updateAutoApproveStatus(this.reviewLinkId, data).subscribe(
      (response: any) => {
        Log.info(response, "Response Update");
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
   * @since Version 1.0.0
   * @param id Review Link Id
   * @returns Void
   */
  public deleteReviewLink() {
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
   * onSubmitStep1 method to handle submit button from Modal popup for add or edit the review link for the first step
   * @method onSubmitStep1
   * @since Version 1.0.0
   * @returns Void
   */
  public onSubmitStep1(){
    Log.notice(this.form, "log the request");
    this.isSubmittedStep1 = true;
    this.runtimeValidations();
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
    formData.append('campaign_id', this.getFormControls.campaign_id.value !== null ? this.getFormControls.campaign_id.value.id : null); // append review type
    formData.append('auto_approve', this.getFormControls.auto_approve.value ? '1' : '0'); // append rating
    formData.append('min_rating', this.getFormControls.min_rating.value); // append date to show
    formData.append('negative_info_review_message_1', this.getFormControls.negative_info_review_msg_1.value); // append date to show
    formData.append('negative_info_review_message_2', this.getFormControls.negative_info_review_msg_2.value); // append date to show
    formData.append('positive_review_message', this.getFormControls.positive_review_msg.value); // append date to show
    if(this.image !== null) {
      formData.append('logo', this.image, this.image.name); // append image to formData
    }
    // if is_editing false then logo is not required else required
    if(this.isEditing) {
      formData.append('is_editing', '1'); // in case of edit review link
    } else {
      formData.append('is_editing', '0'); // in case of add review link
    }
    this.validateReviewLinkStep1(formData);
  }

  /**
   * onSubmit method to handle submit button from Modal popup for add or edit the review link
   * @method onSubmitStep2
   * @since Version 1.0.0
   * @returns Void
   */
  public onSubmitStep2(){
    Log.notice(this.form2, "Form 2 data on submit");
    this.isSubmittedStep1 = true;
    if(this.form.invalid || this.form2.invalid) {
      return;
    }
    // show the loader
    this.loaderService.enableLoader();
    // creating an instance of `FormData` class
    const formData = new FormData();
    // append request payload to formData
    formData.append('name', this.getFormControls.name.value); // append name
    formData.append('description', this.getFormControls.description.value); // append description
    formData.append('url_slug', this.getFormControls.url_slug.value); // append url slug
    formData.append('campaign_id', this.getFormControls.campaign_id.value !== null ? this.getFormControls.campaign_id.value.id : null); // append campaign id
    formData.append('auto_approve', this.getFormControls.auto_approve.value ? '1' : '0'); // append auto approve
    formData.append('min_rating', this.getFormControls.min_rating.value); // append min rating to form data
    formData.append('negative_info_review_message_1', this.getFormControls.negative_info_review_msg_1.value); // append negative review message 1
    formData.append('negative_info_review_message_2', this.getFormControls.negative_info_review_msg_2.value); // append negative review message 2
    formData.append('positive_review_message', this.getFormControls.positive_review_msg.value); //append positive review message
    formData.append('page_background', this.pageBackground); // append page back ground
    formData.append('modal_background', this.modalBackground); // append modal background
    formData.append('text_color', this.textColor); // append text color
    formData.append('copyright_text', this.getForm2Controls.copyright_text.value); // append copy write text
    if(this.image !== null) {
      formData.append('logo', this.image, this.image.name); // append logo to formData
    }
    // add / update review link
    if(this.isEditing) {
      this.updateReviewLink(formData); // update review link
    } else {
      this.storeReviewLink(formData); // create review link
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
    setTimeout(() => {
      this.errorMessage = null;
      this.successMessage = null;
    }, 3000);
    this.isSubmittedStep1 = false; // change the flag for form submit
    this.isSubmittedStep2 = false; // change the flag for form submit
    this.isEditing = false; // set it to false
    this.isDeleting = false; // set it to false
    this.isSubmittedStep1Reviews = false; // set it to false
    this.reviewLinkId = null; // set campaign id to null
    if (fetchLists) {
      this.getAllReviewLinks(); // fetch campaigns
    } else if(hideLoader) {
      this.loaderService.disableLoader()
    }
  }

  public pageChanged(pgNum) {
    this.config.currentPage = pgNum;
    // Enable the loader for an ajax call
    this.loaderService.enableLoader();
    // Service to to get all the Review Links
    this.reviewLinkService.getAllPaginatedReviewLinks(pgNum).subscribe(
        (response: any) => {
          Log.info(response, "List: response");
          if (response.status) {
            this.reviewLinks = response.data.data;
            // hide the loader
            this.loaderService.disableLoader();
          } else {
            this.errorMessage = response.messages;
            // hide the loader
            this.loaderService.disableLoader();
          }
        }
    );
  }

}
