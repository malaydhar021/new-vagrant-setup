import { Component, OnInit, OnDestroy }       from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxSmartModalService }               from 'ngx-smart-modal';
import { Subscription }                       from 'rxjs';
import { SubscriptionService }                from '../../../services/subscription.service';
import { LoaderService }                      from '../../../services/loader.service';
import { ErrorsService }                      from '../../../services/errors.service';

/**
 * Component to update user card details
 * @class UpdatePaymentInfoComponent
 * @version 1.0.0
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
  createCardForm(reset= false) {
    this.cardForm = this.formBuilder.group({
      card_number: [null, Validators.compose([Validators.required, Validators.minLength(14)])],
      cvc_number:[null, Validators.compose([Validators.required, Validators.minLength(3)])],
      expiry_month:[1, Validators.required],
      expiry_year: [this.currentYear, Validators.required]
    })
    reset && this.cardForm.reset();
  }

  /**
   * @method add
   * @since Version 1.0.0
   * @returns Void
   */
  add() {
    this.loaderService.enableLoader();
    this.subscriptionService.updateCardDetails(this.cardForm.value).subscribe(
      (response: any)=> {
        this.loaderService.disableLoader();
        this.card = response.card;
        this.ngxSmartModalService.getModal('modal1').close();
        this.createCardForm(true);
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