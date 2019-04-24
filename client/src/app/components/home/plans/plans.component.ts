import { Component, OnInit }                  from '@angular/core';
import { Subscription }                       from 'rxjs';
import { NgxSmartModalService }               from 'ngx-smart-modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { SubscriptionService }                from '../../../services/subscription.service';
import { LoaderService }                      from '../../../services/loader.service';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss']
})
export class PlansComponent implements OnInit {
    scrollTrigger: any = false;
    userPlanSubscription: Subscription;
    userPlanDetails:any
    pricingPlanType: string = null;
    years:any = [];
    cardForm: FormGroup;
    currentYear: Number;


    constructor( 
      private subscriptionService: SubscriptionService,
      private loaderService: LoaderService,
      private ngxSmartModalService:NgxSmartModalService,
      private formBuilder: FormBuilder) { 

      this.userPlanSubscription = this.subscriptionService.getUserSubscription$().subscribe(userPlan=>{
        this.userPlanDetails = userPlan;
      })
    }

    ngOnInit() {
      this.getCurrentSubscription();
      this.createYearArray();
      this.createCardForm();
    }

    createCardForm(reset= false){
      this.cardForm = this.formBuilder.group({
        pricing_plan_type: [this.pricingPlanType],
        card_number: [null, Validators.compose([Validators.required, Validators.minLength(14)])],
        cvc_number:[null, Validators.compose([Validators.required, Validators.minLength(3)])],
        expiry_month:[1, Validators.required],
        expiry_year: [this.currentYear, Validators.required],
        affiliate_id: []
      })
      reset && this.cardForm.reset();
    }

    buttonText(plan){
      let currentPlan = null , text = null; 
      if(this.userPlanDetails && this.userPlanDetails.data && this.userPlanDetails.data.pricing_plan){
        currentPlan = this.userPlanDetails.data.pricing_plan.alias;
      }
      if (!currentPlan) {return "ADD"} ;
      if (plan == currentPlan) {return 'CURRENT'};

      plan == 'Starter' ? text = "DOWNGRADE" : null;
      plan == 'Premium' ? currentPlan == 'Starter' ? text = 'UPGRADE' : text = 'DOWNGRADE' : null;
      plan == 'Agency' ? text = "UPGRADE"  : null 
      return text;

    }

    getCurrentSubscription(){
      this.loaderService.enableLoader()
      this.subscriptionService.getCurrentSubscription().subscribe(
        (data: any)=>{
          this.loaderService.disableLoader();
          this.subscriptionService.setUserSubscription(data.subscription);
      })
    }

    addUpdatePlan(plan){
      this.pricingPlanType = plan;
      if (this.userPlanDetails.status !== "ACTIVE"){
        this.ngxSmartModalService.getModal('modal1').open();
        return
      }
      this.update();

    }

    createYearArray(){
      var currentDate = new Date();
      var currentYear = currentDate.getFullYear();
      this.currentYear = currentYear
      for (let i = 0; i <= 25; i++){
        this.years.push(currentYear + i);
      }
    }

    add(){
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

    update(){
      this.loaderService.enableLoader()

      this.subscriptionService.updateSubscription({ pricing_plan_type : this.pricingPlanType}).subscribe(
        (response:any)=>{
          this.loaderService.disableLoader();
          //this.subscriptionService.setUserSubscription(response.subscription);
        }
      )
    }

}
