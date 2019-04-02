import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { BrandingService } from '../../../services/branding.service';
import { ErrorsService } from '../../../services/errors.service';
import { BrandingModel } from '../../../models/branding.model';
import { Log } from '../../../helpers/app.helper';

/**
 * BrandingComponent is reponsible for showing, adding, updating and deleting brands
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
export class BrandingComponent implements OnInit, OnDestroy {
  // declaring class properties
  form: FormGroup; // for add or edit brand form in modal
  loader: boolean = false; // for loader
  brands: [] = []; // holds all brands
  errorMessage: string = null; // to show error messages mainly from when some exception has been caught
  successMessage: string = null; // to show success messages
  validationErrors: any = null; // for showing validation messgaes
  subscription: Subscription; // to get the current value updated from error interceptor
  isSubmitted: boolean = false; // flag to set true if the add / edit form is submitted  
  isEditing: boolean = false; // flag to set true if user is perfoming some edit operation
  isDeleting: boolean = false; // flag to set true if user is perfoming some delete operation
  brandId: number = null; // property to hold the brand id

  /**
   * 
   * @param ngxSmartModalService 
   * @param title 
   * @param router 
   * @param formBuilder 
   * @param errorService 
   * @param brandingService 
   */
  constructor(
    private ngxSmartModalService: NgxSmartModalService,
    private title: Title,
    private router: Router,
    private formBuilder: FormBuilder,
    private errorService: ErrorsService,
    private brandingService: BrandingService,
  ) {
    // update errorMessage if anything caught by our error interceptor
    this.subscription = this.errorService.error$.subscribe(
      errMsg => {
        this.loader = false;
        this.errorMessage = errMsg;
      }
    );
    // update validationErrors if anything caught by our error interceptor
    this.subscription = this.errorService.validationErrors$.subscribe(
      validationErrMsg => {
        Log.info(validationErrMsg, 'validation errors');
        this.loader = false;
        this.validationErrors = validationErrMsg;
      }
    );
  }

  /**
   * ngOnInit method initialize angular reactive form object for sign up form step 1 and step 2. 
   * Also it set the title of the page. It has some guard checking at the very top if the user is
   * logged in then redirect user to dashboard page. Also it handles some sort of custom validations
   * specially for signup form step 2.
   * @method ngOnInit
   * @since Version 1.0.0
   * @returns Void
   */
  public ngOnInit() {
    // show the loader as it's going to fetch records from api
    this.loader = true;
    // set the page title
    this.title.setTitle('Stickyreviews :: Branding');
    // making an api call to get all brandings  
    this.getBrandings();
    // initialize the fombuilder for add / edit a brand form
    this.form = this.formBuilder.group({
      brandName : [null, Validators.required], // brand name
      brandUrl : [null, Validators.required] // brand url
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
   * @since Versoin 1.0.0
   * @returns Void
   */
  public ngOnDestroy() {
    this.subscription.unsubscribe();
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
          this.brands = response.data;
          // hide the loader
          this.loader = false;
        }
      }
    );
  }

  /**
   * Method to open the modal when `Add Brand` will be clicked.
   * This also `isEditing` to `false` if someone eiditted a brand
   * and then trying to add a brand.
   * @method onAddBrand
   * @since Version 1.0.0
   * @returns Void
   */
  public onAddBrand() {
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
   * once the add a brand form is submitted. It checkes the client side as well as server
   * side validation and display erros to user. On successful submission it will create a brand
   * using create brand api endpoing and update the listing of all brands with newly added brand.
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
    this.loader = true;
    // preare the data as request body
    const data = {
      brand_name: this.form.value.brandName,
      url: this.form.value.brandUrl
    };
    if(this.isEditing) {
      // edit brand
      data['branding_id'] = this.brandId;
      this.editBrand(data);
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
          // show the error message to user in case there is any error from api respose
          this.errorMessage = response.message;
          // hide the loader
          this.loader = false;
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
  public editBrand(data: BrandingModel) {
    // let's make an api call to add this brand
    this.brandingService.updateBranding(data).subscribe(
      (response : any ) => {
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
          // show the error message to user in case there is any error from api respose
          this.errorMessage = response.message;
          // hide the loader
          this.loader = false;
        }
      }
    );
  }

  /**
   * onEditBranding method will display currently selected row informatoin into
   * the modal form so that user can update thsoe
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
      brandName: brand.brand_name,
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
    this.loader = true;
    // prepare data to make a delete request
    const data = {branding_id: brandId};
    // make a api call to delete the brand
    this.brandingService.deleteBranding(data).subscribe(
      (response: any) => {
        Log.info(response, 'delete api response');
        if(response.status) {
          // show the success message to user in brand listing page
          this.successMessage = response.message;
          // making an api call to get all brandings along with the newly added branding
          this.getBrandings(); 
        } else {
          // show the error message to user in case there is any error from api respose
          this.errorMessage = response.message;
          // hide the loader
          this.loader = false;
        }
      }
    );
  }
}