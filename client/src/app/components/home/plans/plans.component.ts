import { Component, OnInit }      from '@angular/core';
import { Subscription }           from 'rxjs';
import { SubscriptionService }    from '../../../services/subscription.service';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss']
})
export class PlansComponent implements OnInit {
    scrollTrigger: any = false;
    userPlanSubscription: Subscription;
    userPlanDetails:any

    constructor( private subscriptionService: SubscriptionService) { 

      this.userPlanSubscription = this.subscriptionService.getUserSubscription$().subscribe(userPlan=>{
        this.userPlanDetails = userPlan;
        console.log(this.userPlanDetails);
      })
    }

    ngOnInit() {

    }

    currentPlan(plan){
      return 'STARTER'
    }


}
