import { Component, OnInit, OnDestroy }       from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxSmartModalService, NgxSmartModalComponent }               from 'ngx-smart-modal';
import { Subscription }                       from 'rxjs';
import { SubscriptionService }                from '../../../services/subscription.service';
import { LoaderService }                      from '../../../services/loader.service';
import { ErrorsService }                      from '../../../services/errors.service';

/**
 * Component to update user card details
 * @class UpdatePaymentInfoComponent
 * @version 2.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@Component({
  selector: 'app-update-payment-info',
  templateUrl: './update-payment-info.component.html',
  styleUrls: ['./update-payment-info.component.scss']
})
export class UpdatePaymentInfoComponent implements OnInit, OnDestroy {
  card:any;
  years:any = [];
  cardForm: FormGroup;
  currentYear: Number;
  successMessage: string = null; // property to hold the success message
  errorSubscription: Subscription; // to get the current value of showError property
  showError: boolean = false; // flag to show error message
  isModalOpened: boolean = false; // set to true if the modal is opened
  
  /**
   * Constructor to load required services at the very first
   * @constructor constructor
   * @since Version 1.0.0
   * @param ngxSmartModalService NgxSmartModalService instance
   * @param subscriptionService SubscriptionService instance
   * @param loaderService LoaderService instance
   * @param formBuilder FormBuilder instance
   * @param errorService ErrorsService instance
   * @returns Void
   */
  constructor(
    private ngxSmartModalService: NgxSmartModalService,
    private subscriptionService:  SubscriptionService,
    private loaderService:        LoaderService,
    private formBuilder :         FormBuilder,
    private errorService: ErrorsService
  ) {
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
    this.getUserCardDetails();
    this.createYearArray();
    this.createCardForm();
  }

  /**
   * @method ngOnDestroy
   * @since Version 1.0.0
   * @returns Void
   */
  public ngOnDestroy() {
    this.errorSubscription.unsubscribe();
    this.errorService.clearMessage();
  }

  /**
   * Method to execute when dom document is ready
   * @method ngAfterViewInit
   * @since Version 2.0.0
   * @returns Void
   */
  public ngAfterViewInit() {
    this.modalCallbacks(); // modal callbacks i.e onClose, onDismiss, onEscape
  }

  /**
   * Method to perform ngx-smart-modal event callbacks
   * @method modalCallbacks
   * @since Version 2.0.0
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
      this.isModalOpened = true; // set it to true as modal is about to open. This is form show server side messages into modal but not in listing page
    });
  }

  /**
   * Method to reset card update form which will be called once the modal is closed or escaped or dismissed
   * @method resetForm
   * @since Version 1.0.0
   * @returns Void
   */
  public resetForm() {
    this.cardForm.reset();
    this.isModalOpened = false;
    this.errorService.clearMessage();
  }

  /**
   * @method getUserCardDetails
   * @since Version 1.0.0
   * @returns Void
   */
  public getUserCardDetails() {
    this.loaderService.enableLoader();
    this.subscriptionService.getCardDetails().subscribe(
      (response:any) => {
        this.loaderService.disableLoader();
        this.card = response.card;
      }
    )
  }

  /**
   * Method to generate next 20 years from current year
   * @method createYearArray
   * @since Version 1.0.0
   * @returns Void
   */
  public createYearArray() {
    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    this.currentYear = currentYear
    for (let i = 0; i < 20; i++) {
      this.years.push(currentYear + i);
    }
  }

  /**
   * @method createCardForm
   * @since Version 1.0.0
   * @param reset 
   * @returns Void
   */
  public createCardForm(reset = false) {
    this.cardForm = this.formBuilder.group({
      card_number: [null, Validators.compose([Validators.required, Validators.minLength(14)])],
      cvc_number:[null, Validators.compose([Validators.required, Validators.minLength(3)])],
      expiry_month:[1, Validators.required],
      expiry_year: [this.currentYear, Validators.required]
    })
  }

  /**
   * @method add
   * @since Version 1.0.0
   * @returns Void
   */
  public add() {
    this.loaderService.enableLoader();
    this.subscriptionService.updateCardDetails(this.cardForm.value).subscribe(
      (response: any)=> {
        // hide the loader
        this.loaderService.disableLoader();
        if(response.status) {
          this.card = response.card;
          this.ngxSmartModalService.getModal('modal1').close();
          // set the success message to show to user. 100 ms delay has been set as the onClose modal event should execute first
          setTimeout(() => {this.errorService.setMessage({type: 'success', message: response.message})}, 100);
        } else {
          // if the any error occurred the show the error message to user as well with 100 ms delay
          setTimeout(() => {this.errorService.setMessage({type: 'error', message: response.message})}, 100);
        }
      }
    )
  }

  /**
   * Method to open the modal when add/edit card modal has been clicked
   * @method onClickCardInfo
   * @since Version 1.0.0
   * @returns Void
   */
  public onClickCardInfo() {
    this.ngxSmartModalService.getModal('modal1').open();
  }
}