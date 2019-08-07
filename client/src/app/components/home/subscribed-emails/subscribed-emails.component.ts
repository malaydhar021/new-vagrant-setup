import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { ErrorsService } from '../../../services/errors.service';
import { BrandingService } from '../../../services/branding.service';
import { LoaderService } from '../../../services/loader.service';
import { Log } from '../../../helpers/app.helper';
import { SubscribedEmailService } from 'src/app/services/subscribed-email.service';
import { NgxSmartModalService, NgxSmartModalComponent } from 'ngx-smart-modal';
/**
 * Component to show all emails which has been subscribed emails from various exit popups. Also option to delete an email from the list.
 * @class SubscribedEmailsComponent
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@Component({
  selector: 'app-subscribed-emails',
  templateUrl: './subscribed-emails.component.html',
  styleUrls: ['./subscribed-emails.component.scss']
})
export class SubscribedEmailsComponent implements OnInit, OnDestroy {
  // declaring class properties
  loader: boolean = false; // for loader
  emails: [] = []; // holds all emails as an array
  errorMessage: string = null; // to show error messages mainly from when some exception has been caught
  successMessage: string = null; // to show success messages
  validationErrors: any = null; // for showing validation messages
  subscription: Subscription; // to get the current value updated from error interceptor
  isDeleting: boolean = false; // flag to set true if user is performing some delete operation
  subscribedEmailId: string = null; // property to hold the subscribed email id
  config: any;  // config for pagination
  errorSubscription: Subscription; // to get the current value of showError property
  showError: boolean = false; // flag to show error message
  searchKey: string = '';
  subscribedEmailIdToDelete: string = null;
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
    private title: Title,
    private errorService: ErrorsService,
    private brandingService: BrandingService,
    private loaderService: LoaderService,
    private subscribedEmailService: SubscribedEmailService,
    private ngxSmartModalService: NgxSmartModalService,
  ) {
    this.errorSubscription = this.errorService.showMessage$.subscribe(
      (status: boolean) => {
        this.showError = status;
      }
    );
  }

  /**
   * ngOnInit method calling a method to get all subscribed emails.
   * Also it set the title of the page.
   * @method ngOnInit
   * @since Version 1.0.0
   * @returns Void
   */
  public ngOnInit() {
    // show the loader as it's going to fetch records from api
    this.loaderService.enableLoader();
    // set the page title
    this.title.setTitle('Stickyreviews :: Subscribed Emails');
    // making an api call to get all branding
    this.getSubscribedEmails();
    // pagination controls
    this.config = {
      itemsPerPage: 15,
      currentPage: 1,
    };
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
  }

  /**
   * Method to get all subscribed emails as paginated data from api end point
   * @method getSubscribedEmails
   * @since Version 1.0.0
   * @returns Void
   */
  public getSubscribedEmails() {
    // making an api call to first paginated records
    this.subscribedEmailService.getAllSubscribedEmails().subscribe(
      (response: any) => {
        Log.success(response);
        if (response.status) {
          // update the emails array with latest api response data
          this.emails = response.data.data;
          this.config.totalItems = response.data.total;
          // hide the loader
          this.loaderService.disableLoader();
        }
      }
    );
  }

  /**
   * Method to show delete modal
   * @param emailId
   */
  public onDeleteSubscribedEmail(emailId: string) {
    // setting to true as user wants to delete a brand
    this.isDeleting = true;
    this.subscribedEmailIdToDelete = emailId;
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
    this.subscribedEmailService.getPaginatedSubscribedEmail(pgNum, this.searchKey).subscribe(
        (response: any) => {
          Log.success(response);
          if (response.status) {
            // update the brands array with latest api response data
            this.emails = response.data.data;
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
    this.subscribedEmailService.searchSubscribedEmail($term.target.value).subscribe(
        (response: any ) => {
          if (response.status) {
            this.emails = response.data.data;
            this.config.totalItems = response.data.total;
            this.loaderService.disableLoader();
          }
        }
    );
  }

  /**
   * Method to delete subscribe emails
   * @param emailId
   */
  public delete(emailId) {
    // show loader
    this.loaderService.enableLoader();
    // make a api call to delete the brand
    this.subscribedEmailService.deleteSubscribedEmail(emailId).subscribe(
      (response: any) => {
        Log.info(response, 'delete api response');
        this.ngxSmartModalService.getModal('deleteModal').close();
        if(response.status) {
          // show the success message to user in brand listing page
          this.errorService.setMessage({type: 'success', message: response.message});
          // making an api call to get all subscribed emails
          this.getSubscribedEmails();
        } else {
          // show the error message to user in case there is any error from api response
          this.errorService.setMessage({type: 'error', message: response.message});
          // hide the loader
          this.loaderService.disableLoader();
        }
      }
    );
  }

}
