import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { NgxSmartModalService, NgxSmartModalComponent } from 'ngx-smart-modal';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ErrorsService } from '../../../services/errors.service';
import { LoaderService } from '../../../services/loader.service';
import { Log } from '../../../helpers/app.helper';
import { CustomDomainService } from '../../../services/custom-domain.service';
import { CustomDomainModel } from '../../../models/custom-domain.model';
import { cnameDomainName } from '../../../helpers/api.helper';
import { CookieService } from 'ngx-cookie-service';

/**
 * Component to create, show, update and delete custom domains from a user account
 * @class CustomDomainComponent
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@Component({
  selector: 'app-custom-domain',
  templateUrl: './custom-domain.component.html',
  styleUrls: ['./custom-domain.component.scss']
})
export class CustomDomainComponent implements OnInit, OnDestroy, AfterViewInit {
  // declaring class properties
  form: FormGroup; // for add or edit brand form in modal
  loader: boolean = false; // for loader
  customDomains: [] = []; // holds all brands as an array
  errorMessage: string = null; // to show error messages mainly from when some exception has been caught
  successMessage: string = null; // to show success messages
  validationErrors: any = null; // for showing validation messages
  subscription: Subscription; // to get the current value updated from error interceptor
  isSubmitted: boolean = false; // flag to set true if the add / edit form is submitted
  isEditing: boolean = false; // flag to set true if user is performing some edit operation
  isDeleting: boolean = false; // flag to set true if user is performing some delete operation
  brandId: number = null; // property to hold the brand id
  customDomainId: string = null; // property to hold the brand id
  config: any;  // config for pagination
  errorSubscription: Subscription; // to get the current value of showError property
  showError: boolean = false; // flag to show error message
  searchKey: string = '';
  isModalOpened: boolean = false; // set to true if the modal is opened
  cnameDomainName: string = null; // property which will hold the cname domain name based on environment
  dontShowMessage: boolean = false; // Instruction to add/edit a custom domain will be shown if it's set to false
  customDomainIdToDelete: string = null;
  noRecordsFoundSubscription: Subscription; // to get the current value of no records found template
  showNoRecordsFoundTemplate: boolean = false; // flag to show no records found template
  showClearSearch: boolean = false;
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
   * @param customDomainService
   * @returns Void
   */
  constructor(
    private ngxSmartModalService: NgxSmartModalService,
    private title: Title,
    private formBuilder: FormBuilder,
    private errorService: ErrorsService,
    private customDomainService: CustomDomainService,
    private loaderService: LoaderService,
    private cookieService: CookieService
  ) {
    this.cnameDomainName = cnameDomainName;
    this.errorSubscription = this.errorService.showMessage$.subscribe(
      (status: boolean) => {
        this.showError = status;
      }
    );

    // subscription for no records found template
    this.noRecordsFoundSubscription = this.errorService.showNoRecordsFoundTemplate$.subscribe(
      (status: boolean) => {
        this.showNoRecordsFoundTemplate = status;
        Log.info(this.showNoRecordsFoundTemplate, "check the show template status in custom domain component");
      }
    );
  }

  /**
   * ngOnInit method initialize angular reactive form object for add / edit form of a custom domain.
   * Also it set the title of the page. Also it defines client side validations.
   * @method ngOnInit
   * @since Version 1.0.0
   * @returns Void
   */
  public ngOnInit() {
    // show the loader as it's going to fetch records from api
    this.loaderService.enableLoader();
    // set the page title
    this.title.setTitle('Stickyreviews :: Custom Domains');
    // making an api call to get all custom domains
    this.getCustomDomains();
    // initialize the form builder for add / edit a custom domain form
    this.form = this.formBuilder.group({
      name: [null, Validators.required], // custom domain name
      // domain: [null, [Validators.required, Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z0-9]{2,})+$')]] // custom domain url
      domain: [null, [Validators.required, Validators.pattern('^([a-zA-Z0-9][a-zA-Z0-9-_]*\.)*[a-zA-Z0-9]*[a-zA-Z0-9-_]*[[a-zA-Z0-9]+$')]] // custom domain url
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
      this.resetForm();
    });
    // do stuffs when modal has been dismissed i.e when the modal is closed clicking in backdrop.
    // In this case reset the form when modal is dismissed
    this.ngxSmartModalService.getModal('modal1').onDismiss.subscribe((modal: NgxSmartModalComponent) => {
      this.resetForm();
    });
    // reset form when modal has been closed by esc key
    this.ngxSmartModalService.getModal('modal1').onEscape.subscribe((modal: NgxSmartModalComponent) => {
      this.resetForm();
    });
    // set showError to false when the modal is being opened
    this.ngxSmartModalService.getModal('modal1').onOpen.subscribe((modal: NgxSmartModalComponent) => {
      this.errorService.clearMessage();
      this.isModalOpened = true;
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
    this.errorService.clearMessage();
    this.errorService.updateShowNoRecordsFoundTemplate(false);
    this.noRecordsFoundSubscription.unsubscribe();
  }

  /**
   * resetForm method is just reset the form after successfully
   * submission of add or edit form
   * @method resetForm
   * @since Version 1.0.0
   * @returns Void
   */
  public resetForm() {
    this.form.reset();
    this.isModalOpened = false;
    this.isSubmitted = false;
    this.errorService.clearMessage();
  }

  /**
   * Method to get all custom domains from api end point
   * @method getCustomDomains
   * @since Version 1.0.0
   * @returns Void
   */
  public getCustomDomains() {
    // making an api call to get all custom domains and update `customDomains` class property
    this.customDomainService.getAllCustomDomains().subscribe(
      (response: any) => {
        // hide the loader
        this.loaderService.disableLoader();
        if (response.status) {
          // update the customDomains array with latest api response data
          this.customDomains = response.data.data;
          this.config.totalItems = response.data.total;
          this.errorService.updateShowNoRecordsFoundTemplate(response.data.data.length > 0 ? false : true);
          Log.info("before closing the loader");
        }
      }
    );
  }

  /**
   * Method to open the modal when `Add Custom Domain` will be clicked.
   * This also `isEditing` to `false` if someone edited a custom domain
   * and then trying to add a custom domain.
   * @method onAddCustomDomain
   * @since Version 1.0.0
   * @returns Void
   */
  public onAddCustomDomain() {
    // reset the form if someone click on edit and close the modal and decide to add one
    this.resetForm();
    // set the id to null again
    this.customDomainId = null;
    // setting false if someone after doing the edit click on add custom domain
    this.isEditing = false;
    // setting false if someone after deleting click on add custom domain
    this.isDeleting = false;
    // now open the modal with empty form to add a custom domain
    // this.ngxSmartModalService.getModal('customDomainInfo').open();
    this.customDomainShowModal(); // decides which modal is gonna open
  }

  /**
   * onSubmit method as the name suggests it will handle all sort of operations
   * once the add/edit a custom domain form is submitted. It checks the client side as well as server
   * side validation and display errors to user. On successful submission it will create a custom domain
   * using create custom domain api endpoint and update the listing of all custom domains with newly added custom domain.
   * @method onSubmit
   * @since Version 1.0.0
   * @returns Void
   */
  public onSubmit() {
    // set the flag to true if the form has been submitted
    this.isSubmitted = true;
    this.searchKey = '';
    // check if the form does not pass the client side validation
    if (this.form.invalid) {
      return;
    }
    // show the loader
    this.loaderService.enableLoader();
    // prepare the data as request body
    const data = {
      name: this.form.value.name,
      domain: this.form.value.domain
    };
    if (this.isEditing) {
      // edit custom domain
      data['custom_domain_id'] = this.customDomainId;
      this.editCustomDomain(data, this.customDomainId);
    } else {
      // add a custom domain
      this.addCustomDomain(data);
    }
  }

  /**
   * Method to add a custom domain to database using api endpoint and handle the response
   * @method addCustomDomain
   * @since Version 1.0.0
   * @param data CustomDomainModel class object
   * @returns Void
   */
  public addCustomDomain(data: CustomDomainModel) {
    // let's make an api call to add this custom domain
    this.customDomainService.addCustomDomain(data).subscribe(
      (response: any) => {
        Log.info(response, 'Response Add');
        if (response.status) {
          // once getting the response and status is true close the modal
          this.ngxSmartModalService.getModal('modal1').close();
          // show the success message to user in custom domain listing page
          setTimeout(() => { this.errorService.setMessage({ type: 'success', message: response.message }) }, 100);
          // change the flag for form submit
          this.isSubmitted = false;
          // reset the form
          this.resetForm();
          // making an api call to get all custom domains along with the newly added custom domain
          this.getCustomDomains();
        } else {
          // show the error message to user in case there is any error from api response
          setTimeout(() => { this.errorService.setMessage({ type: 'error', message: response.message }) }, 100);
          // hide the loader
          this.loaderService.disableLoader();
        }
      }
    );
  }

  /**
   * Method to update a custom domain to database using api endpoint and handle the response
   * @method editCustomDomain
   * @since Version 1.0.0
   * @param data CustomDomainModel class object
   * @returns Void
   */
  public editCustomDomain(data: CustomDomainModel, id: string) {
    // let's make an api call to add this brand
    this.customDomainService.updateCustomDomain(data, id).subscribe(
      (response: any) => {
        Log.info(response, 'Response Update');
        if (response.status) {
          // once getting the response and status is true close the modal
          this.ngxSmartModalService.getModal('modal1').close();
          // show the success message to user in custom domain listing page
          setTimeout(() => { this.errorService.setMessage({ type: 'success', message: response.message }) }, 100);
          // change the flag for form submit
          this.isSubmitted = false;
          // reset the form
          this.resetForm();
          // making an api call to get all custom domains along with the newly added branding
          this.getCustomDomains();
        } else {
          // show the error message to user in case there is any error from api response
          setTimeout(() => { this.errorService.setMessage({ type: 'error', message: response.message }) }, 100);
          // hide the loader
          this.loaderService.disableLoader();
        }
      }
    );
  }

  /**
   * onEditCustomDomain method will display currently selected row information into
   * the modal form so that user can update those
   * @method onEditCustomDomain
   * @since Version 1.0.0
   * @param brand CustomDomainModel instance
   * @returns Void
   */
  public onEditCustomDomain(customDomain: CustomDomainModel) {
    // set the custom domain id
    this.customDomainId = customDomain.id;
    // set `isEditing` to true once the edit icon has been clicked
    this.isEditing = true;
    // prepare data object with the selected custom domain row
    const data = {
      name: customDomain.name,
      domain: customDomain.domain
    };
    // set values into the form of currently selected row
    this.form.patchValue(data);
    // now open the model to show the form into the model to user
    // this.ngxSmartModalService.getModal('modal1').open();
    this.customDomainShowModal(); // decides which modal is gonna open
  }

  /**
   * Method to open delete modal from delete a custom domain
   * @param customDomainId
   */
  public onDeleteCustomDomain(customDomainId: string) {
    this.isDeleting = true;
    this.customDomainIdToDelete = customDomainId;
    // lets get the confirmation from user. if user cancel it then it's not doing anything
    this.ngxSmartModalService.getModal('deleteModal').open();
  }

  /**
   * Function for handle pagination
   * @param pgNum
   */
  pageChanged(pgNum: number) {
    this.config.currentPage = pgNum;
    this.loaderService.enableLoader();
    this.customDomainService.getPaginatedCustomDomain(pgNum, this.searchKey).subscribe(
      (response: any) => {
        Log.success(response);
        if (response.status) {
          // update the custom domain array with latest api response data
          this.customDomains = response.data.data;
          // hide the loader
          this.loaderService.disableLoader();
        }
      }
    );
  }

  /**
   * Function to search from custom domain list
   * @param $term
   */
  public onSearch($term) {
    this.config.currentPage = 1;
    if ($term.target.value == '') {
      this.clearSearch();
      return;
    }
    this.loaderService.enableLoader();
    this.customDomainService.searchCustomDomains($term.target.value).subscribe(
      (response: any) => {
        if (response.status) {
          this.customDomains = response.data.data;
          this.config.totalItems = response.data.total;
          this.showClearSearch = true;
          this.loaderService.disableLoader();
        }
      }
    );
  }

  /**
   * Method to clear search text and reload the list
   */
  public clearSearch() {
    this.showClearSearch = false;
    this.searchKey = '';
    this.loaderService.enableLoader();
    this.config.currentPage = 1;
    this.customDomainService.searchCustomDomains('').subscribe(
      (response: any ) => {
        this.loaderService.disableLoader();
        if (response.status) {
          this.customDomains = response.data.data;
          this.config.totalItems = response.data.total;
        }
      }
    );
  }

  /**
   * Method to decide what modal will be shown when a user clicks on add / edit a custom domain
   * @method customDomainShowModal
   * @since Version 1.0.0
   * @returns Void
   */
  public customDomainShowModal() {
    if (this.cookieService.get('_cdi') && this.cookieService.get('_cdi') === '1') {
      // if _cdi is available and value of _cdi is equal to 1 then show the add/edit modal
      this.ngxSmartModalService.getModal('modal1').open();
    } else {
      // if not then show custom domain info modal
      this.ngxSmartModalService.getModal('customDomainInfo').open();
    }
  }

  /**
   * Method to check or uncheck don't show message checkbox
   * @method showCustomDomainInstruction
   * @since Version 1.0.0
   * @returns Void
   */
  public showCustomDomainInstruction() {
    this.dontShowMessage = !this.dontShowMessage;
  }

  /**
   * Method to show and hide respective modal based on user selection
   * @method onClickGotIt
   * @since Version 1.0.0
   * @returns Void
   */
  public onClickGotIt() {
    if(this.dontShowMessage) {
      // set _cdi value to 1 if user checked the checkbox for don't show the message again
      this.cookieService.set('_cdi', '1'); // _cdi => Custom Domain Instructions
    }
    // close the customDomainInfo modal
    this.ngxSmartModalService.getModal('customDomainInfo').close();
    // now open the model to show the form into the model to user
    this.ngxSmartModalService.getModal('modal1').open();
  }

  /**
   * Method to delete a custom domain
   * @param customDomainId
   */
  public delete(customDomainId) {
    this.loaderService.enableLoader();
    // make a api call to delete the brand
    this.customDomainService.deleteCustomDomain(customDomainId).subscribe(
      (response: any) => {
        Log.info(response, 'Response Delete');
        this.ngxSmartModalService.getModal('deleteModal').close();
        this.loaderService.disableLoader();
        if (response.status) {
          // show the success message to user in custom domain listing page
          this.errorService.setMessage({ type: 'success', message: response.message });
          // making an api call to get all custom domains along with the newly added branding
          this.getCustomDomains();
        } else {
          // show the error message to user in case there is any error from api response
          this.errorService.setMessage({ type: 'error', message: response.message });
        }
      }
    );
  }

}
