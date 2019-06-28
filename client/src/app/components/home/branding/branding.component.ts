import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgxSmartModalService, NgxSmartModalComponent } from 'ngx-smart-modal';
import { BrandingService } from '../../../services/branding.service';
import { ErrorsService } from '../../../services/errors.service';
import { LoaderService } from '../../../services/loader.service';
import { BrandingModel } from '../../../models/branding.model';
import { Log } from '../../../helpers/app.helper';

/**
 * BrandingComponent is responsible for showing, adding, updating and deleting brands
 * @class BrandingComponent
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@Component({
  selector: 'app-branding',
  templateUrl: './branding.component.html',
  styleUrls: ['./branding.component.scss']
})
export class BrandingComponent implements OnInit, OnDestroy, AfterViewInit {
  // declaring class properties
  form: FormGroup; // for add or edit brand form in modal
  loader: boolean = false; // for loader
  brands: [] = []; // holds all brands as an array
  errorMessage: string = null; // to show error messages mainly from when some exception has been caught
  successMessage: string = null; // to show success messages
  validationErrors: any = null; // for showing validation messages
  subscription: Subscription; // to get the current value updated from error interceptor
  isSubmitted: boolean = false; // flag to set true if the add / edit form is submitted  
  isEditing: boolean = false; // flag to set true if user is performing some edit operation
  isDeleting: boolean = false; // flag to set true if user is performing some delete operation
  brandId: number = null; // property to hold the brand id
  config: any;  // config for pagination
  errorSubscription: Subscription; // to get the current value of showError property
  showError: boolean = false; // flag to show error message
  searchKey: string = '';
  isModalOpened: boolean = false; // set to true if the modal is opened

  /**
   * Constructor to inject required service. It also subscribe to a observable which emits the current
   * value of defined variable.
   * @constructor constructor
   * @since Version 1.0.0
   * @param ngxSmartModalService
   * @param title
   * @param router
   * @param formBuilder
   * @param errorService
   * @param brandingService
   * @returns Void
   */
  constructor(
    private ngxSmartModalService: NgxSmartModalService,
    private title: Title,
    private formBuilder: FormBuilder,
    private errorService: ErrorsService,
    private brandingService: BrandingService,
    private loaderService: LoaderService,
  ) {
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
    // show the loader as it's going to fetch records from api
    this.loaderService.enableLoader();
    // set the page title
    this.title.setTitle('Stickyreviews :: Branding');
    // making an api call to get all branding
    this.getBrandings();
    // initialize the form builder for add / edit a brand form
    this.form = this.formBuilder.group({
      brandName : [null, Validators.required], // brand name
      brandUrl : [null, Validators.required] // brand url
    });
    // pagination controls
    this.config = {
      itemsPerPage: 15,
      currentPage: 1,
    };
  }

  /**
   * Method to call modal callback events when add/edit modal will be closed or opened
   * @method ngAfterViewInit
   * @since Version 1.0.0
   * @returns Void
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
    // set showError to false when the modal is being opened
    this.ngxSmartModalService.getModal('modal1').onOpen.subscribe((modal: NgxSmartModalComponent) => {
      this.isModalOpened = true;
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
   * Function to execute when this component is going to destroy by the browser.
   * This will unsubscribe the subscription when this component will be destroyed.
   * @method ngOnDestroy
   * @since Version 1.0.0
   * @returns Void
   */
  public ngOnDestroy() {
    this.errorSubscription.unsubscribe();
  }

  /**
   * resetForm method is just reset the form after successfully
   * submission of add or edit form
   * @method resetForm
   * @since Version 1.0.0
   * @returns Void
   */
  public get resetForm() {
    this.errorService.updateShowMessageStatus(false);
    this.isModalOpened = false;
    this.form.reset();
    return;
  }

  /**
   * Method to get all brands from api end point
   * @method getBrandings
   * @since Version 1.0.0
   * @returns Void
   */
  public getBrandings() {
    // making an api call to get all brands and update `brands` class property
    this.brandingService.getAllBrandings().subscribe(
      (response: any) => {
        Log.success(response);
        if (response.status) {
          // update the brands array with latest api response data
          this.brands = response.data.data;
          this.config.totalItems = response.data.total;
          Log.info("before closing the loader");
          // hide the loader
          this.loaderService.disableLoader();
        }
      }
    );
  }

  /**
   * Method to open the modal when `Add Brand` will be clicked.
   * This also `isEditing` to `false` if someone edited a brand
   * and then trying to add a brand.
   * @method onAddBrand
   * @since Version 1.0.0
   * @returns Void
   */
  public onAddBrand() {
    // reset the form if someone click on edit and close the modal and decide to add one
    this.resetForm;
    // set the id to null again
    this.brandId = null;
    // setting false if someone after doing the edit click on add brand
    this.isEditing = false;
    // setting false if someone after deleting click on add brand
    this.isDeleting = false;
    // now open the modal with empty form to add a brand
    this.ngxSmartModalService.getModal('modal1').open();
  }

  /**
   * onSubmit method as the name suggests it will handle all sort of operations
   * once the add a brand form is submitted. It checks the client side as well as server
   * side validation and display errors to user. On successful submission it will create a brand
   * using create brand api endpoint and update the listing of all brands with newly added brand.
   * @method onSubmit
   * @since Version 1.0.0
   * @returns Void
   */
  public onSubmit() {
    Log.info(this.form, 'Add branding form submit');
    // set the flag to true if the form has been submitted
    this.isSubmitted = true;
    // check if the form does not pass the client side validation
    if(this.form.invalid) {
      return;
    }
    // show the loader
    this.loaderService.enableLoader();
    // prepare the data as request body
    const data = {
      name: this.form.value.brandName,
      url: this.form.value.brandUrl
    };
    if(this.isEditing) {
      // edit brand
      data['branding_id'] = this.brandId;
      this.editBrand(data, this.brandId);
    } else {
      // add a brand
      this.addBrand(data);
    }
  }

  /**
   * Method to add a brand to database using api endpoint and handle the response
   * @method addBrand
   * @since Version 1.0.0
   * @param data BrandingModel class object
   * @returns Void
   */
  public addBrand(data: BrandingModel) {
    // let's make an api call to add this brand
    this.brandingService.addBranding(data).subscribe(
      (response : any ) => {
        Log.info(response, 'add a brand response');
        if(response.status) {
          // once getting the response and status is true close the modal
          this.ngxSmartModalService.getModal('modal1').close();
          // show the success message to user in brand listing page
          this.successMessage = response.message;
          // change the flag for form submit
          this.isSubmitted = false;
          // reset the form
          this.resetForm;
          // making an api call to get all brandings along with the newly added branding
          this.getBrandings();
        } else {
          // show the error message to user in case there is any error from api response
          this.errorMessage = response.message;
          // hide the loader
          this.loaderService.disableLoader();
        }
      }
    );
  }

  /**
   * Method to update a brand to database using api endpoint and handle the response
   * @method editBrand
   * @since Version 1.0.0
   * @param data BrandingModel class object
   * @returns Void
   */
  public editBrand(data: BrandingModel, id: number) {
    // let's make an api call to add this brand
    this.brandingService.updateBranding(data, id).subscribe(
      (response: any ) => {
        Log.info(response, 'edit a brand response');
        if(response.status) {
          // once getting the response and status is true close the modal
          this.ngxSmartModalService.getModal('modal1').close();
          // show the success message to user in brand listing page
          this.successMessage = response.message;
          // change the flag for form submit
          this.isSubmitted = false;
          // reset the form
          this.resetForm;
          // making an api call to get all brandings along with the newly added branding
          this.getBrandings();
        } else {
          // show the error message to user in case there is any error from api response
          this.errorMessage = response.message;
          // hide the loader
          this.loaderService.disableLoader();
        }
      }
    );
  }

  /**
   * onEditBranding method will display currently selected row information into
   * the modal form so that user can update those
   * @method onEditBranding
   * @since Version 1.0.0
   * @param brand BrandingModel
   * @returns Void
   */
  public onEditBrand(brand: BrandingModel) {
    // set the brand id
    this.brandId = brand.id;
    // set `isEditing` to true once the edit icon has been clicked
    this.isEditing = true;
    // prepare data object with the selected brand row
    const data = {
      brandName: brand.name,
      brandUrl: brand.url
    };
    // set values into the form of currently selected row
    this.form.patchValue(data);
    // now open the model to show the form into the model to user
    this.ngxSmartModalService.getModal('modal1').open();
  }

  /**
   * Method to delete a brand. It also handles the response from api and act accordingly
   * @method onDeleteBrand
   * @since Version 1.0.0
   * @param brandId (Number) Brand id
   * @returns Void
   */
  public onDeleteBrand(brandId: number) {
    // setting to true as user wants to delete a brand
    this.isDeleting = true;
    // lets get the confirmation from user. if user cancel it then it's not doing anything
    if(!confirm("Are you sure want to delete it?")) {
      return;
    }
    // show loader
    this.loaderService.enableLoader();
    // make a api call to delete the brand
    this.brandingService.deleteBranding(brandId).subscribe(
      (response: any) => {
        Log.info(response, 'delete api response');
        if(response.status) {
          // show the success message to user in brand listing page
          this.successMessage = response.message;
          // making an api call to get all brandings along with the newly added branding
          this.getBrandings();
        } else {
          // show the error message to user in case there is any error from api response
          this.errorMessage = response.message;
          // hide the loader
          this.loaderService.disableLoader();
        }
      }
    );
  }

  /**
   * Function for handle pagination
   * @param pgNum
   */
  pageChanged(pgNum: number) {
    this.config.currentPage = pgNum;
    this.loaderService.enableLoader();
    this.brandingService.getPaginatedBrands(pgNum, this.searchKey).subscribe(
        (response: any) => {
          Log.success(response);
          if (response.status) {
            // update the brands array with latest api response data
            this.brands = response.data.data;
            // hide the loader
            this.loaderService.disableLoader();
          }
        }
    );
  }

  /**
   * Function to search from branding list
   * @param $term
   */
  public onSearch($term) {
    this.config.currentPage = 1;
    this.loaderService.enableLoader();
    this.brandingService.searchBrands($term.target.value).subscribe(
        (response: any ) => {
          if (response.status) {
            this.brands = response.data.data;
            this.config.totalItems = response.data.total;
            this.loaderService.disableLoader();
          }
        }
    );
  }


}