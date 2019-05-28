import { Injectable } from '@angular/core';
import { Router, CanLoad, Route, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SubscriptionService } from '../subscription.service';
import { Observable, Subscription } from 'rxjs';
import { Log } from 'src/app/helpers/app.helper';
import { map } from 'rxjs/operators';

/**
 * SubscriptionGuard service will prevent access to protected routes for unauthenticated users
 * @class SubscriptionGuard
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @see https://stackoverflow.com/questions/37948068/angular-2-routing-canactivate-work-with-observable
 * @license Proprietary
 */

@Injectable()

export class SubscriptionGuard implements CanActivate {
  userPlanSubscription: Subscription;
  userPlanDetails: any = {
    data: null
  }
  
  constructor(private router: Router, private subscriptionService: SubscriptionService) {
    // this.userPlanSubscription = this.subscriptionService.getUserSubscription$().subscribe(userPlan => {
    //   Log.info(userPlan, "check user plan in constructor");
    //   this.userPlanDetails = userPlan;
    // })
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // Log.info(this.userPlanDetails, "check user plan details");
    // if (this.userPlanDetails.status !== "ACTIVE") {
    //   Log.info("inside if ");
    //   this.router.navigate(['/home/plans']);
    //   return false;
    // }
    // return true;
    return true;

    // return this.subscriptionService.getCurrentSubscription().pipe(map(plan => {
    //   Log.debug(plan, "check plan data");
    //   if (plan.status !== 'ACTIVE') {
    //     this.router.navigate(['/home/plans']);
    //     return false;
    //   } else {
    //     return true;
    //   }
    // }));
  }
}
