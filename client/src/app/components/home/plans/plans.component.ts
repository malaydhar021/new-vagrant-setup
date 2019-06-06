import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SubscriptionService } from '../../../services/subscription.service';
import { LoaderService } from '../../../services/loader.service';
import { ErrorsService } from 'src/app/services/errors.service';

/**
 * PlansComponent is responsible for handling user subscriptions 
 * @class PlansComponent
 * @version 1.0.0
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
  errorSubscription: Subscription; // to get the current value of showError property
  showError: boolean = false; // flag to show error message

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
    private loaderService: LoaderService,
    private ngxSmartModalService: NgxSmartModalService,
    private formBuilder: FormBuilder,
    private errorService: ErrorsService
  ) {
    this.userPlanSubscription = this.subscriptionService.getUserSubscription$().subscribe(userPlan => {
      this.userPlanDetails = userPlan;
    });
    this.errorSubscription = this.errorService.showMessage$.subscribe(
      (status: boolean) => {
        this.showError = status;
      }
    );
  }

  /**
   * 
   */
  public ngOnInit() {
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
   * 
   * @param plan 
   */
  public buttonText(plan) {
    let currentPlan = null, text = null;
    if (this.userPlanDetails && this.userPlanDetails.data && this.userPlanDetails.data.pricing_plan) {
      currentPlan = this.userPlanDetails.data.pricing_plan.alias;
    }
    if (!currentPlan) { return "ADD" };
    if (plan == currentPlan) { return 'CURRENT' };

    plan == 'Starter' ? text = "DOWNGRADE" : null;
    plan == 'Premium' ? currentPlan == 'Starter' ? text = 'UPGRADE' : text = 'DOWNGRADE' : null;
    plan == 'Agency' ? text = "UPGRADE" : null
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
    this.pricingPlanType = plan;
    if (this.userPlanDetails.status !== "ACTIVE") {
      this.ngxSmartModalService.getModal('modal1').open();
      return
    }
    this.update();

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
   * 
   */
  public update() {
    this.loaderService.enableLoader()

    this.subscriptionService.updateSubscription({ pricing_plan_type: this.pricingPlanType }).subscribe(
      (response: any) => {
        this.loaderService.disableLoader();
        this.subscriptionService.setUserSubscription(response.subscription);
      }
    )
  }
}