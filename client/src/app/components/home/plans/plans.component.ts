import { Component, OnInit, OnDestroy }           from '@angular/core';
import { Subscription }                           from 'rxjs';
import { NgxSmartModalService }                   from 'ngx-smart-modal';
import { FormGroup, FormBuilder, Validators }     from '@angular/forms';
import { SubscriptionService }                    from '../../../services/subscription.service';
import { LoaderService }                          from '../../../services/loader.service';
import { ErrorsService }                          from '../../../services/errors.service';
import { Log }                                    from '../../../helpers/app.helper';
import { PricingPlanService }                     from '../../../services/pricing-plan.service';
import { Title } from '@angular/platform-browser';

/**
 * PlansComponent is responsible for handling user subscriptions 
 * @class PlansComponent
 * @version 2.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss']
})
export class PlansComponent implements OnInit, OnDestroy {
  scrollTrigger: any = false;
  userPlanSubscription: Subscription;
  userPlanDetails: any;
  pricingPlanType: string = null;
  years: any = [];
  cardForm: FormGroup;
  currentYear: Number;
  successMessage: string = null; // property to hold the success message
  errorSubscription: Subscription; // to get the current value of showError property
  showError: boolean = false; // flag to show error message
  errorMessage: string = null; // flag for error message
  hasCard: boolean = false; // flag to set true if the user is having card details store into db
  pricingPlans: any; // holds all plans with pricing and individual feature restrictions
  currency: string = "$"; // default currency is US dollar  

/**
 * Constructor to inject required service. It also subscribe to a observable which emits the current
 * value of defined variable
 * @constructor constructor
 * @since Version 1.0.0
 * @param subscriptionService SubscriptionService instance
 * @param loaderService LoaderService instance
 * @param ngxSmartModalService NgxSmartModalService instance
 * @param formBuilder FormBuilder instance
 * @returns Void
 */
  constructor(
    private subscriptionService: SubscriptionService,
    private title: Title,
    private loaderService: LoaderService,
    private ngxSmartModalService: NgxSmartModalService,
    private formBuilder: FormBuilder,
    private errorService: ErrorsService,
    private pricingPlanService: PricingPlanService
  ) {
    this.userPlanSubscription = this.subscriptionService.getUserSubscription$().subscribe(userPlan => {
      this.userPlanDetails = userPlan;
    });
    this.subscriptionService.getCardDetails().subscribe(
      (response: any) => {
        if(response.status && response.card.number) {
          this.hasCard = true;          
        }
      }
    );
    this.errorSubscription = this.errorService.showMessage$.subscribe(
      (status: boolean) => {
        this.showError = status;
      }
    );
    // get all plans with price  
    this.getPricingPlans();
  }

  /**
   * @method ngOnInit
   * @since Version 1.0.0
   * @returns Void
   */
  public ngOnInit() {
    this.title.setTitle("Stickyreviews :: Plans");
    this.getCurrentSubscription();
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
   * 
   * @param reset 
   */
  public createCardForm(reset = false) {
    this.cardForm = this.formBuilder.group({
      pricing_plan_type: [this.pricingPlanType],
      card_number: [null, Validators.compose([Validators.required, Validators.minLength(14)])],
      cvc_number: [null, Validators.compose([Validators.required, Validators.minLength(3)])],
      expiry_month: [1, Validators.required],
      expiry_year: [this.currentYear, Validators.required],
      affiliate_id: []
    })
    reset && this.cardForm.reset();
  }

  /**
   * Method to fetch all plans and respective prices and assign those into pricingPlans also get the currency as well
   * @method getPricingPlans
   * @since Version 2.0.0
   * @returns Void
   */
  public getPricingPlans() {
    this.pricingPlanService.getAllPricingPlans().subscribe(
      (response: any) => {
        Log.info(response);
        this.pricingPlans = response.data;
        this.currency = response.currency_symbol;
      }
    );
  }

  /**
   * 
   * @param plan 
   */
  public buttonText(plan) {
    let currentPlan = null, text = null;
    if (this.userPlanDetails && this.userPlanDetails.data && this.userPlanDetails.data.pricing_plan) {
      currentPlan = (this.userPlanDetails.status !== "ACTIVE" && this.userPlanDetails.status !== "NA") ? null : this.userPlanDetails.data.pricing_plan.alias;
    }
    if (!currentPlan) { return "ADD" };
    if (plan == currentPlan) { return 'CURRENT' };

    plan == 'Starter' ? text = "DOWNGRADE" : null;
    plan == 'Premium' ? currentPlan == 'Starter' ? text = 'UPGRADE' : text = 'DOWNGRADE' : null;
    plan == 'Enterprise' ? text = "UPGRADE" : null
    return text;
  }

  /**
   * 
   */
  public getCurrentSubscription() {
    this.loaderService.enableLoader()
    this.subscriptionService.getCurrentSubscription().subscribe(
      (data: any) => {
        this.loaderService.disableLoader();
        this.subscriptionService.setUserSubscription(data.subscription);
      })
  }

  /**
   * 
   * @param plan 
   */
  public addUpdatePlan(plan) {
    this.errorService.clearMessage();
    this.pricingPlanType = plan;
    if(!this.hasCard) {
      this.loaderService.enableLoader();
      let data = {pricing_plan_type: this.pricingPlanType};
      this.subscriptionService.validateSubscription(data).subscribe(
        (response: any) => {
          Log.info(response, "during downgrade");
          this.loaderService.disableLoader();
          this.ngxSmartModalService.getModal('modal1').open(); 
        }
      );
    } else {
      this.update();
    }
  }

  /**
   * 
   */
  public createYearArray() {
    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    this.currentYear = currentYear
    for (let i = 0; i <= 25; i++) {
      this.years.push(currentYear + i);
    }
  }

  /**
   * 
   */
  public add() {
    this.loaderService.enableLoader();
    let value = this.cardForm.value;
    value.pricing_plan_type = this.pricingPlanType;
    this.subscriptionService.addSubscription(value).subscribe(
      (response: any) => {
        this.loaderService.disableLoader();
        this.subscriptionService.setUserSubscription(response.subscription);
        this.ngxSmartModalService.getModal('modal1').close();
        this.createCardForm(true);
      }
    )
  }

  /**
   * Method to update a user subscription plan
   * @method update
   * @returns Void
   */
  public update() {
    this.loaderService.enableLoader()
    Log.info("under update() method");
    this.subscriptionService.updateSubscription({ pricing_plan_type: this.pricingPlanType }).subscribe(
      (response: any) => {
        this.loaderService.disableLoader();
        this.subscriptionService.setUserSubscription(response.subscription);
      }
    )
  }
}