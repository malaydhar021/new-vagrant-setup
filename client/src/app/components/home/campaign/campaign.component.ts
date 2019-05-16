import { Component, OnInit, ElementRef, ViewChild, HostListener, OnDestroy, AfterViewInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, Form } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgxSmartModalService, NgxSmartModalComponent } from 'ngx-smart-modal';
import { CampaignService } from '../../../services/campaign.service';
import { LoaderService } from '../../../services/loader.service';
import { CampaignModel } from '../../../models/campaign.model';
import { Log } from '../../../helpers/app.helper';
import { CampaignStylesInterface } from '../../../interfaces/campaign-styles.interface';
import { CampaignInterface } from '../../../interfaces/campaign.interface';
import { MinimumCheckedCheckboxes } from '../../../helpers/form.helper';
import { WidgetUrl } from '../../../helpers/api.helper';

/**
 * Component to handle all sort of functionalities related to campaign. It's mostly handles
 * CRUD operations for campaign
 * @class CampaignComponent
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.scss']
})
export class CampaignComponent implements OnInit, OnDestroy, AfterViewInit {
  // defining class properties
  form: FormGroup; // for add or edit review form in modal
  reviewForm: FormGroup; // for update reviews from listing page for each campaign
  loader: boolean = false; // for loader
  campaignId: string = null; // database id of selected campaign for edit / delete
  campaigns: [] = []; // holds all reviews as an array
  errorMessage: string = null; // to show error messages mainly from when some exception has been caught
  successMessage: string = null; // to show success messages
  validationErrors: any = null; // for showing validation messages
  subscription: Subscription; // to get the current value updated from error interceptor
  isSubmitted: boolean = false; // flag to set true if the add / edit form is submitted  
  isSubmittedReviews: boolean = false; // flag to set true if the add / edit form is submitted  
  isEditing: boolean = false; // flag to set true if user is performing some edit operation
  isDeleting: boolean = false; // flag to set true if user is performing some delete operation
  isSelectingReview: boolean = false; // to show the sticky review box to select reviews
  rowIndex: number = null; // set row index to show / hide some class
  // checkedStickyReviews: any = null; // holds the data of selected sticky reviews a campaign
  defaultWidgetStyle: number = 100; // default widget style is set to rounded
  styles: CampaignStylesInterface[] = [];
  selectedStyle: any = this.styles[0]; // default selected style, Rounded
  stickyReviews: any = [];
  brands: any = [];
  selectedBrands: any = this.brands[0]; // default selected brand, the first one

  /**
   * Constructor method
   * @constructor constructor
   * @param ngxSmartModalService 
   * @param title 
   * @param router 
   * @param formBuilder 
   * @param campaignService 
   * @param loaderService 
   */
  constructor(
    public ngxSmartModalService: NgxSmartModalService,
    private title: Title,
    private router: Router,
    private formBuilder: FormBuilder,
    private campaignService: CampaignService,
    private loaderService: LoaderService
  ) {
    this.getAllStyles(); // fetch all campaign styles
    this.getStickyReviews(); // fetch all sticky reviews
    this.getBrands(); // fetch all brands
  }

  /*
  public windowHeight: any;
  public scrollTrigger = false;
  viewHeight: number;

  @ViewChild('mainScreen') elementView: ElementRef;
  @HostListener('window:resize', ['$event'])
  */

  /**
   * Method to fetch campaign lists and display into the listing page. Also
   * initialize the form to add/edit a campaign. Please find the reference to
   * work with FormArray for sticky reviews.
   * @method ngOnInit
   * @since Version 1.0.0
   * @see https://coryrylan.com/blog/creating-a-dynamic-checkbox-list-in-angular
   * @returns Void
   */
  public ngOnInit() {
    // set the page title
    this.title.setTitle('Stickyreviews :: Campaigns');
    // this.windowHeight = window.innerHeight - 280;
    // show the loader as it's going to fetch records from api
    this.loaderService.enableLoader();
    // make an api call to get all sticky reviews
    this.getCampaigns();
    // initialize the form builder for add / edit a edit form
    this.form = this.formBuilder.group({
      campaignName: [null, Validators.required], // campaign name
      campaignDomainName: [null, [Validators.required, Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$')]], // domain name
      campaignVisualStyle: [null, Validators.required], // visual style. default is Rounded
      campaignReviews: new FormArray([]), // array form field for sticky reviews
      campaignDelayBeforeStart: [null, Validators.required], // delay before time
      campaignStayTime: [null, Validators.required], // delay before time
      campaignDelayBetweenTwoReview: [null, Validators.required], // delay between next appearance
      isBrandingSelected: [false], // add branding
      campaignBrand: [{ value: this.brands[0], disabled: true }], // campaign brand drop down, disabled by default
      isExitPopupSelected: [false], // add exit popup
      campaignExitPopup: [{ value: null, disabled: true }], // // campaign brand drop down, disabled by default
      campaignLoop: [true], // checkbox to set true or false
    });

    // initialize the form builder for update sticky reviews for a certain campaign from campaign listing page
    this.reviewForm = this.formBuilder.group({
      campaignReviews: new FormArray([], MinimumCheckedCheckboxes(1)), // array form field for sticky reviews
    });
  }

  /**
   * Method will be executed when this component will be destroyed
   * @method ngOnDestroy
   * @since Version 1.0.0
   * @returns Void
   */
  public ngOnDestroy() { }

  /**
   * Method to execute when dom document is ready
   * @method ngAfterViewInit
   * @since Version 1.0.0
   * @returns Void
   */
  public ngAfterViewInit() {
    this.onChangeVisualStyle(); // display the widget style onchange of style
    this.onToggleBrand(); // enable / disable brands 
    this.onToggleExitPopup(); // enable / disable exit popup
    this.modalCallbacks(); // modal callbacks i.e onClose, onDismiss, onEscape
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
   * @method onChangeVisualStyle
   */
  public onChangeVisualStyle() {
    this.getFormControls.campaignVisualStyle.valueChanges.subscribe(
      (campaignVisualStyle: any) => {
        this.selectedStyle = campaignVisualStyle;
      }
    );
  }

  /**
   * @method onToggleBrand
   */
  public onToggleBrand() {
    this.getFormControls.isBrandingSelected.valueChanges.subscribe(
      (isBrandingSelected: boolean) => {
        // if add branding is checked/unchecked then enable/disable select brands drop down
        if (isBrandingSelected) { // if add brand is checked
          // set default value to brand drop down
          this.getFormControls.campaignBrand.setValue(this.brands[0], { onlySelf: true });
          // enable the brand drop down attribute
          this.formControlAction('campaignBrand', 'enable');
        } else { // if add brand is not checked
          // unset default value to brands drop down and set it to null
          this.getFormControls.campaignBrand.setValue(null, { onlySelf: true });
          // disable the brand drop down attribute
          this.formControlAction('campaignBrand', 'disable');
        }
      }
    );
  }

  /**
   * @method onToggleExitPopup
   */
  public onToggleExitPopup() {
    this.getFormControls.isExitPopupSelected.valueChanges.subscribe(
      (isExitPopupSelected: boolean) => {
        // if add exit popup is checked/unchecked then enable/disable select exit popup drop down
        if (isExitPopupSelected) { // if add exit popup is checked
          // set default value to exit popup drop down
          this.getFormControls.campaignExitPopup.setValue(null, { onlySelf: true });
          // enable the exit popup drop down attribute
          this.formControlAction('campaignExitPopup', 'enable');
        } else { // if add exit popup is not checked
          // unset default value to exit popup drop down and set it to null
          this.getFormControls.campaignExitPopup.setValue(null, { onlySelf: true });
          // disable the exit popup drop down attribute
          this.formControlAction('campaignExitPopup', 'disable');
        }
      }
    );
  }

  /**
   * Method to enable or disable form control. See the reference
   * @method enableOrDisableFormControl
   * @since Version 1.0.0
   * @param formControlName Form Control name
   * @param action Action to perform. Two legal values are enable | disable
   * @see https://stackoverflow.com/questions/42840136/disable-input-fields-in-reactive-form
   * @returns Void
   */
  public formControlAction(formControlName: string, action: string) {
    switch (action) {
      case 'enable':
        this.form.get(formControlName).enable({ onlySelf: true })
        break;
      case 'disable':
        this.form.get(formControlName).disable({ onlySelf: true })
        break;
      default:
        break;
    }
  }

  /**
   * @method onResize
   * @param event JS event
   */
  /*
  public onResize(event) {
    this.viewHeight = this.elementView.nativeElement.offsetHeight;
    this.windowHeight = window.innerHeight - 280;
    // Log.info(this.windowHeight);

    if (this.viewHeight > this.windowHeight) {
      this.scrollTrigger = true;
    } else {
      this.scrollTrigger = false;
    }
  }
*/
  /**
   * @method clickMe
   */
  /*
  public clickMe() {
    this.viewHeight = this.elementView.nativeElement.offsetHeight;

    if (this.viewHeight > this.windowHeight) {
      this.scrollTrigger = true;
    } else {
      this.scrollTrigger = false;
    }
  }
  */

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
    this.getFormControls.campaignVisualStyle.setValue(this.styles[0]); // again set default value to visual style i.e Rounded
    this.getFormControls.isBrandingSelected.setValue(false); // set default value to add brand checkbox
    this.getFormControls.isExitPopupSelected.setValue(false); // set default value to add exit popup checkbox
    return;
  }

  /**
   * Method to get all campaigns from api end point
   * @method getCampaigns
   * @since Version 1.0.0
   * @returns Void
   */
  public getCampaigns() {
    // making an api call to get all campaigns and update `campaigns` array which is a class property
    this.campaignService.getAllCampaigns().subscribe(
      (response: any) => {
        Log.success(response);
        if (response.status) {
          // update the campaign array with latest api response data
          // if there is no data object then assign empty array i.e no records found
          this.campaigns = response.data.data;
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
   * This also `isEditing` to `false` if someone edited a campaign
   * and then trying to add a campaign.
   * @method onAddCampaign
   * @since Version 1.0.0
   * @returns Void
   */
  public onAddCampaign() {
    // set the id to null again
    this.campaignId = null;
    // setting false if someone after doing the edit decide to add a campaign
    this.isEditing = false;
    // setting false if someone after deleting decide to add a campaign
    this.isDeleting = false;
    // now open the modal with empty form to add a sticky campaign
    this.ngxSmartModalService.getModal('modal1').open();
  }

  /**
   * Method to be called when someone clicks on edit campaign icon
   * @method onEditCampaign
   * @since Version 1.0.0
   * @returns Void
   */
  public onEditCampaign(campaign: CampaignInterface) {
    Log.debug(campaign, "Current Campaign");
    // set review id which is currently being edited
    this.campaignId = campaign.id;
    // set `isEditing` to true once the edit icon has been clicked
    this.isEditing = true;
    // prepare data object with the selected sticky review row
    const data = {
      campaignName: campaign.campaign_name,
      campaignDomainName: campaign.domain_name,
      campaignDelayBetweenTwoReview: campaign.delay / 1000,
      campaignDelayBeforeStart: campaign.delay_before_start / 1000,
      campaignStayTime: campaign.stay_timing / 1000,
      isExitPopupSelected: (campaign.exit_pop_up !== null) ? true : false,
      campaignExitPopup: (campaign.exit_pop_up !== null) ? campaign.exit_pop_up : null,
      isBrandingSelected: (campaign.branding !== null) ? true : false,
      campaignBrand: (campaign.branding !== null) ? campaign.branding : null,
      campaignLoop: campaign.loop,
      campaignVisualStyle: campaign.style,
      campaignReviews: this.checkedReviews(campaign.sticky_reviews)
    };
    // set values into the form of currently selected row
    this.form.patchValue(data);
    // now open the model to show the form into the model to user
    this.ngxSmartModalService.getModal('modal1').open();
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
   * Method will be executed when `Copy Snippet` button will be clicked
   * @method onCopySnippet
   * @returns Void
   */
  public onCopySnippet() {
    this.successMessage = "Script has been copied to clipboard";
    setTimeout(() => {
      this.successMessage = null;
    }, 2000);
  }

  /**
   * Method to toggle selecting sticky reviews popup on the same button click
   * @method onClickStickyReviews
   * @since Version 1.0.0
   * @param index The current row index which has been clicked to show sticky reviews
   * @returns Void
   */
  public onClickStickyReviews(index: number, campaign: CampaignInterface) {
    // toggle review popup to show and hide alternatively on the same button click
    this.isSelectingReview = !this.isSelectingReview;
    // set index of the current row to `rowIndex` property which is used in template
    this.rowIndex = index;
    this.campaignId = campaign.id; // assign campaignId to campaignId property
    // show reviews popup with selected reviews
    this.reviewForm.patchValue({
      campaignReviews: this.checkedReviews(campaign.sticky_reviews)
    });
  }

  /**
   * Method to delete a campaign. It also handles the response from api and act accordingly
   * @method onDeleteCampaign
   * @since Version 1.0.0
   * @param reviewId (Number) Sticky review id
   * @returns Void
   */
  public onDeleteCampaign(campaignId: string) {
    // setting to true as user wants to delete a brand
    this.isDeleting = true;
    // lets get the confirmation from user. if user cancel it then it's not doing anything
    if (!confirm("Are you sure want to delete?")) {
      return;
    }
    // show loader
    this.loaderService.enableLoader();
    // make a api call to delete the brand
    this.campaignService.deleteCampaign(campaignId).subscribe(
      (response: any) => {
        Log.info(response, 'delete api response');
        if (response.status) {
          this.postResponseActivities(response.message, false);
        } else {
          this.postResponseActivities(response.message, false, false, true, true);
        }
      }
    );
  }

  /**
   * Method to get the selected reviews and bind from the actual reviews to get the values
   * @method selectedStickyReviews
   * @since Version 1.0.0
   * @returns Array
   */
  public selectedStickyReviews(form: FormGroup) {
    const selectedReviews = form.value.campaignReviews.map(
      (value: any, index: number) => (
        value ? this.stickyReviews[index].id : null
      )
    ).filter((value: any) => value !== null);
    return selectedReviews;
  }

  /**
   * This method handles form request data when someone is performing add / edit actions.
   * This handles client side form validations along with making api calls to add / update
   * data and also handles the api response.
   * @method onSubmit
   * @since Version 1.0.0
   * @returns Void
   */
  public onSubmit() {
    // set it to true
    this.isSubmitted = true;
    // check if the form is valid or not. if invalid then do nothing
    if (this.form.invalid) {
      return;
    }
    // show the loader to user
    this.loaderService.enableLoader();
    // preparing data for sending request to api
    const data = {
      campaign_name: this.form.value.campaignName,
      domain_name: this.form.value.campaignDomainName,
      delay: this.form.value.campaignDelayBetweenTwoReview * 1000,
      delay_before_start: this.form.value.campaignDelayBeforeStart * 1000,
      stay_timing: this.form.value.campaignStayTime * 1000,
      exit_pop_up: this.form.value.isExitPopupSelected,
      exit_pop_up_id: (this.form.value.campaignExitPopup !== undefined) ? this.form.value.campaignExitPopup : null,
      branding: this.form.value.isBrandingSelected,
      branding_id: (this.form.value.campaignBrand !== undefined) ? this.form.value.campaignBrand.id : null,
      loop: this.form.value.campaignLoop,
      style_id: this.form.value.campaignVisualStyle.id,
      is_active: 1
    };
    Log.info(this.form.value.campaignVisualStyle.id, "Style id in onSubmit() method");
    if(this.isEditing) {
      // method that will validate and on success it will update the campaign
      // also this will update campaign with selected reviews
      this.updateCampaign(data, this.selectedStickyReviews(this.form));
    } else {
      // method that will validate and on success it will store the campaign
      // also this will update campaign with selected reviews
      this.storeCampaign(data, this.selectedStickyReviews(this.form));
    }
  }

  /**
   * Method to call store campaign api and store the data it data passes the validation
   * @method storeCampaign
   * @since Version 1.0.0
   * @param data Data to store
   * @param reviews Array of all selected sticky reviews
   * @returns Void
   */
  public storeCampaign(data: CampaignModel, reviews: string[] = []) {
    // lets make an api call to save the data in database
    this.campaignService.addCampaign(data).subscribe(
      (response: any) => {
        // console log the response
        Log.debug(response, "Log the response in storeCampaign()");
        if (response.status) {
          if (reviews.length > 0) {
            this.campaignId = response.data.id;
            // update campaign with selected sticky reviews
            this.syncStickyReviews(reviews, response.message);
          } else {
            // perform post response activities like closing modal, show message etc
            this.postResponseActivities(response.message);
          }
        }
      }
    );
  }

  /**
   * Method to call store campaign api and store the data it data passes the validation
   * @method updateCampaign
   * @since Version 1.0.0
   * @param data Data to store
   * @param reviews Array of all selected sticky reviews
   * @returns Void
   */
  public updateCampaign(data: CampaignModel, reviews: string[] = []) {
    // lets make an api call to save the data in database
    this.campaignService.updateCampaign(this.campaignId, data).subscribe(
      (response: any) => {
        // console log the response
        Log.debug(response, "Response in updateCampaign()");
        if (response.status) {
          if (reviews.length > 0) {
            this.campaignId = response.data.id;
            // update campaign with selected sticky reviews
            this.syncStickyReviews(reviews, response.message);
          } else {
            // perform post response activities like closing modal, show message etc
            this.postResponseActivities(response.message);
          }
        }
      }
    );
  }

  /**
   * Method to update campaign with selected sticky reviews
   * @method syncStickyReviews
   * @since Version 1.0.0
   * @param data Review data to sync with campaign
   * @param message Optional message if don't want to show the message from the syncStickyReviews response
   * @returns Void
   */
  public syncStickyReviews(data: string[], message: string = null) {
    // lets make an api call
    this.campaignService.syncStickyReviews(this.campaignId, data).subscribe(
      (response: any) => {
        const displayMessage = (message !== null) ? message : response.message;
        this.postResponseActivities(displayMessage);
      }
    );
  }

  /**
   * Method to execute when CRUD operations is taking place
   * @method postResponseActivities
   * @since Version 1.0.0
   * @param message Message to display
   * @param closeModal True to close and false not to do anything
   * @param fetchCampaigns True to fetch
   * @param hideLoader True to hide loader
   * @param error True to show error message, false to show success message
   * @returns Void
   */
  public postResponseActivities(
    message: string, 
    closeModal: boolean = true, 
    fetchCampaigns: boolean = true, 
    hideLoader: boolean = true, 
    error: boolean = false
  ) {
    if (closeModal) this.ngxSmartModalService.getModal('modal1').close(); // close the modal
    error ? this.errorMessage = message : this.successMessage = message; // set message
    this.isSubmitted = false; // change the flag for form submit
    this.isEditing = false; // set it to false
    this.isDeleting = false; // set it to false
    this.isSubmittedReviews = false; // set it to false
    this.campaignId = null; // set campaign id to null
    this.isSelectingReview = false; // set review popup in listing page to false to disable
    if (fetchCampaigns) {
      this.getCampaigns(); // fetch campaigns
    } else if(hideLoader) {
      this.loaderService.disableLoader()
    }
  }

  /**
   * Method to fetch all available styles with making a api call to server
   * @method getAllStyles
   * @since Version 1.0.0
   * @returns Void
   */
  public getAllStyles() {
    this.campaignService.getStyles().subscribe(
      (response: any) => {
        // Log.info(response, "Print the all available styles in console");
        this.styles = response.data;
        this.getFormControls.campaignVisualStyle.setValue(this.styles[0]);
      }
    );
  }

  /**
   * Method to fetch all sticky reviews with making a api call to server.
   * Check the link for reference.
   * @method getStickyReviews
   * @since Version 1.0.0
   * @see https://coryrylan.com/blog/creating-a-dynamic-checkbox-list-in-angular
   * @returns Void
   */
  public getStickyReviews() {
    this.campaignService.getStickyReviews().subscribe(
      (response: any) => {
        this.stickyReviews = response.data;
        this.stickyReviewsControls(this.form); // set formArray controls for add/edit form
        this.stickyReviewsControls(this.reviewForm); // set forArray controls for sticky reviews
      }
    );
  }

  /**
   * Method to find sticky reviews inside campaign reviews and make an array of boolean values. This function is mainly being used
   * when we need to pre checked the sticky review check boxes in campaign edit section.
   * @example
   * ```
   * var stickyReviews = [
   * {id: '123', name: 'some name', review: 'blah blah'}, 
   * {id: '321', name: 'another name', review: 'another review'}, 
   * {id: '231', name: 'again another review', review: 'review name'}
   * ];
   * var selectedReviews = [{id: '321', name: 'another name', review: 'another review'}];
   * ```
   * Then this function will return an array like ``` [false, true, false] ```
   * If `selectedReviews` is null or empty array then it will return an array ``` [false, false, false] ```
   * @method checkedReviews
   * @since Version 1.0.0
   * @param selectedReviews Array of campaign reviews
   * @returns Array
   */
  public checkedReviews(selectedReviews: any = null) {
    let arr = [];
    return this.stickyReviews.reduce((acc, cur, index) => { // loop through all sticky reviews
      if(selectedReviews === null || selectedReviews.length == 0) {
        arr[index] = false; // set all elements are to false
      } else {
        selectedReviews.find((o, i) => { // find each review value in campaign reviews array
          if (o.id === cur.id) {
            arr[index] = true; // update the arr with boolean element
            return true; // stop searching more as the data matched
          } else {
            arr[index] = false; // update the arr with boolean element
          }
        });
      }
      return arr;
      }, {}
    )
  }

  /**
   * @method stickyReviewsControls
   * @since Version 1.0.0
   * @returns Void
   */
  public stickyReviewsControls(form: FormGroup) {
    this.stickyReviews.map((review, index) => {
      const control = new FormControl(null); // if first item set to true, else false
      (form.controls.campaignReviews as FormArray).push(control);
    });
  }

  /**
   * Method to fetch all brands with making a api call to server
   * @method getBrands
   * @since Version 1.0.0
   * @returns Void
   */
  public getBrands() {
    this.campaignService.getBrands().subscribe(
      (response: any) => {
        this.brands = response.data;
      }
    );
  }

  /**
   * @method onSubmitReviews
   * @since Version 1.0.0
   * @returns Void
   */
  public onSubmitReviews() {
    this.isSubmittedReviews = true;
    if(this.reviewForm.invalid) {
      return;
    }
    this.loaderService.enableLoader();
    const reviews = this.selectedStickyReviews(this.reviewForm);
    Log.debug(reviews, "Reviews");
    this.syncStickyReviews(reviews);
    Log.info(this.reviewForm, "Review form submitted");
  }

  /**
   * Method to prepare the script to copy into clipboard
   * @method prepareContext
   * @since Version 1.0.0
   * @param campaign CampaignInterface instance
   * @returns String
   */
  public prepareContext(campaign: CampaignInterface) {
    return '<script src="' + WidgetUrl  + '" data-token="' +  campaign.unique_script_id  + '" data-name="_emv" async></script>';
  }
}