import { Component, OnInit, ElementRef, ViewChild, HostListener, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ErrorsService } from '../../../services/errors.service';
import { CampaignService } from '../../../services/campaign.service';
import { LoaderService } from '../../../services/loader.service';
import { CampaignModel } from '../../../models/campaign.model';
import { Log } from '../../../helpers/app.helper';

@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.scss']
})
export class CampaignComponent implements OnInit, OnDestroy {
  // defining class properties
  form: FormGroup; // for add or edit review form in modal
  loader: boolean = false; // for loader
  campaignId: number = null; // database id of selected campaign for edit / delete
  campaigns: [] = []; // holds all reviews as an array
  errorMessage: string = null; // to show error messages mainly from when some exception has been caught
  successMessage: string = null; // to show success messages
  validationErrors: any = null; // for showing validation messages
  subscription: Subscription; // to get the current value updated from error interceptor
  isSubmitted: boolean = false; // flag to set true if the add / edit form is submitted  
  isEditing: boolean = false; // flag to set true if user is performing some edit operation
  isDeleting: boolean = false; // flag to set true if user is performing some delete operation
  isSelectingReview: boolean = false; // to show the sticky review box to select reviews
  rowIndex: number = null; // set row index to show / hide some class
  stickyReviewsTemp: any = [
    {
      'name': 'Sticky review 1',
      'description': 'Sample desc',
      'tags': 'some tag'
    },
    {
      'name': 'Sticky review 2',
      'description': 'Sample desc',
      'tags': 'some tag'
    },
    {
      'name': 'Sticky review 3',
      'description': 'Sample desc',
      'tags': 'some tag'
    },
    {
      'name': 'Sticky review 4',
      'description': 'Sample desc',
      'tags': 'some tag'
    }
];

  styles: [] = [];

  constructor(
    public ngxSmartModalService: NgxSmartModalService,
    private title: Title,
    private router: Router,
    private formBuilder: FormBuilder,
    private errorService: ErrorsService,
    private campaignService: CampaignService,
    private loaderService: LoaderService
  ) {
    // update errorMessage if anything caught by our error interceptor
    this.subscription = this.errorService.error$.subscribe(
      errMsg => {
        this.loaderService.disableLoader();
        this.errorMessage = errMsg;
      }
    );
    // update validationErrors if anything has been caught by our error interceptor
    this.subscription = this.errorService.validationErrors$.subscribe(
      validationErrMsg => {
        Log.info(validationErrMsg, 'validation errors');
        this.loaderService.disableLoader();
        this.validationErrors = validationErrMsg;
      }
    );
    // get all styles from api
    this.getAllStyles();
  }

  public windowHeight: any;
  public scrollTrigger = false;
  viewHeight: number;

  @ViewChild('mainScreen') elementView: ElementRef;
  @HostListener('window:resize', ['$event'])

  public ngOnInit() {
    this.windowHeight = window.innerHeight - 280;
    // show the loader as it's going to fetch records from api
    this.loaderService.enableLoader();
    // set the page title
    this.title.setTitle('Stickyreviews :: Campaigns');
    // make an api call to get all sticky reviews
    this.getCampaigns();
    // Create a FormControl for each available sticky reviews, initialize them as unchecked, and put them in an array
    // const stickyReviewsFormControls = this.stickyReviewsTemp.map(control => new FormControl(false));
    // Log.debug(stickyReviewsFormControls);
    // initialize the fombuilder for add / edit a edit form
    this.form = this.formBuilder.group({
      campaignName : [null, Validators.required], // campaign name
      campaignDomainName : [null, [Validators.required, Validators.pattern('^(http|https):\/\/[^ "]+$')]], // domain name
      campaignVisualStyle : [null], // visual style
      // campaignReviews : this.formBuilder.array(stickyReviewsFormControls), // array form field for sticky reviews
      campaignDelayBeforeStart : [null], // delay before time
      campaignStayTime : [null], // delay before time
      campaignDelayBetweenTwoReview : [null], // delay between next appearance
      isBrandingSelected : [0], // add branding
      campaignBrand : [null], // campaign brand
      isExitPopupSelected : [0], // add exit popup
      campaignExitPopup : [null], // add exit popup
      campaignLoop: [1], // radio to check 
    });
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * @method onResize
   * @param event JS event
   */
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

  /**
   * @method clickMe
   */
  public clickMe() {
    this.viewHeight = this.elementView.nativeElement.offsetHeight;

    if (this.viewHeight > this.windowHeight) {
      this.scrollTrigger = true;
    } else {
      this.scrollTrigger = false;
    }
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
          this.campaigns = (response.data !== undefined) ? response.data : [];
          Log.debug(this.campaigns.length, "Checking the length of the campaigns");
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
    // reset the form if someone click on edit and close the modal and decide to add one
    this.resetForm;
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
  public onEditCampaign(review : CampaignModel) {
    // set review id which is currently being edited
    this.campaignId = review.id;
    // set `isEditing` to true once the edit icon has been clicked
    this.isEditing = true;
    // prepare data object with the selected sticky review row
    const data = {};
    // set values into the form of currently selected row
    this.form.patchValue(data);
    // now open the model to show the form into the model to user
    this.ngxSmartModalService.getModal('modal1').open();
  }

  /**
   * Method will be executed when `Copy Snippet` button will be clicked
   * @method onCopySnippet
   * @returns Void
   */
  public onCopySnippet() {
    Log.debug('click on copy snippet');
  }

  /**
   * Method to toggle selecting sticky reviews popup on the same button click
   * @method onClickStickyReviews
   * @since Version 1.0.0
   * @param index The current row index which has been clicked to show sticky reviews
   * @returns Void
   */
  public onClickStickyReviews(index: number) {
    // toogle review popup to show and hide alternatively on the same button click
    this.isSelectingReview = !this.isSelectingReview;
    // set index of the current row to `rowIndex` property which is used in template
    this.rowIndex = index;
  }

  /**
   * Method to delete a campaign. It also handles the response from api and act accordingly
   * @method onDeleteCampaign
   * @since Version 1.0.0
   * @param reviewId (Number) Sticky review id
   * @returns Void
   */
  public onDeleteCampaign(campaignId: number) {
    // setting to true as user wants to delete a brand
    this.isDeleting = true;
    // lets get the confirmation from user. if user cancel it then it's not doing anything
    if(!confirm("Are you sure want to delete?")) {
      return;
    }
    // show loader
    this.loader = true;
    // make a api call to delete the brand
    this.campaignService.deleteCampaign(campaignId).subscribe(
      (response: any) => {
        Log.info(response, 'delete api response');
        if(response.status) {
          // show the success message to user in campaign listing page
          this.successMessage = response.message;
          // making an api call to get all campaign along with the newly added campaign
          this.getCampaigns(); 
        } else {
          // show the error message to user in case there is any error from api respose
          this.errorMessage = response.message;
          // hide the loader
          this.loaderService.disableLoader();
        }
      }
    );
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
    // log the formGroup object
    Log.info(this.form);
    this.isSubmitted = true;
    if(this.form.invalid) {
      return;
    }
    // show the loader to user
    this.loaderService.enableLoader(); 
    // preparing data for sending request to api
    const data = {
      campaign_name: this.form.value.campaignName,
      domain_name: this.form.value.campaignDomainName,
      delay: this.form.value.campaignDelayBetweenTwoReview,
      delay_before_start: this.form.value.campaignDelayBeforeStart,
      exit_pop_up: this.form.value.isExitPopupSelected,
      exit_pop_up_id: this.form.value.campaignExitPopup,
      branding: this.form.value.isBrandingSelected,
      branding_id: this.form.value.campaignBrand,
      loop: this.form.value.campaignLoop,
      style_id: this.form.value.campaignVisualStyle,
      is_active: 1
    };
    // lets make an api call to save the data in database
    this.campaignService.addCampaign(data).subscribe(
      (response: any ) => {
        // console log the response
        Log.debug(response); 
      }
    );
  }

  /**
   * Method to fetch all available styles with making a api call to server
   * @method getAllStyles
   * @since Version 1.0.0
   * @returns Void
   */
  public getAllStyles() {
    this.campaignService.getStyles().subscribe(
      (response : any) => {
        Log.info(response, "Print the all available styles in console");
        this.styles = response.data;
      }
    );
  }
}
