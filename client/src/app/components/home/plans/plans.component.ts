import { Component, OnInit }      from '@angular/core';
import { Subscription }           from 'rxjs';
import { SubscriptionService }    from '../../../services/subscription.service';
import {LoaderService}            from '../../../services/loader.service';
import { NgxSmartModalService }   from 'ngx-smart-modal';

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
    years:any = []

    constructor( private subscriptionService: SubscriptionService, private loaderService: LoaderService, private ngxSmartModalService:NgxSmartModalService) { 

      this.userPlanSubscription = this.subscriptionService.getUserSubscription$().subscribe(userPlan=>{
        this.userPlanDetails = userPlan;
      })
    }

    ngOnInit() {
      this.getCurrentSubscription();
      this.createYearArray();
    }

    currentPlan(plan){
      let currentplan = this.userPlanDetails.data.pricing_plan.alias;

      if(!currentplan) {
        return "ADD"
      }

      if (plan ==='Agency'){
        return 'AGENCY'
      }

      if (plan ==='Premium'){
        return 'PREMIUM'
      }

      if (plan ==='Starter'){
        return 'STARTER'
      }

    }

    buttonText(plan){
      let currentPlan = null; 
      if(this.userPlanDetails && this.userPlanDetails.data && this.userPlanDetails.data.pricing_plan){

        currentPlan = this.userPlanDetails.data.pricing_plan.alias;
      }
                          
      
      if (!currentPlan){
        return 'ADD'
      }
      if (plan == currentPlan){

        return 'CURRENT'

      } else {

        if (plan == 'Starter') {
          if(currentPlan  == 'Premium'){
            return "DOWNGRADE"
          }
          if (currentPlan == 'Agency'){
            return "DOWNGRADE"
          }
        }

        if(plan == 'Premium'){

          if (currentPlan == 'Starter'){
            return "UPGRADE"
          }
          if(currentPlan == 'Agency'){
            return "DOWNGRADE"
          }
        }

        if(plan == 'Agency'){

          if(currentPlan == 'Starter'){
            return "UPGRADE"
          }
          if (currentPlan == 'Premium'){
            return "UPGRADE"
          }
        }
      }
    }

    getCurrentSubscription(){
      this.loaderService.enableLoader()
      this.subscriptionService.getCurrentSubscription().subscribe(
        (data: any)=>{
          //console.log()
          this.loaderService.disableLoader();
          this.subscriptionService.setUserSubscription(data.subscription);
      })
    }

    addUpdatePlan(plan){
      this.pricingPlanType = plan;
      console.log(this.userPlanDetails);
      if (this.userPlanDetails.status == 'NA'){
        this.ngxSmartModalService.getModal('modal1').open();
        return
      }

    }

    createYearArray(){
      var currentDate = new Date();
      var currentYear = currentDate.getFullYear();
      for (let i = 0; i <= 25; i++){
        this.years.push(currentYear + i);
      }
    }

}
