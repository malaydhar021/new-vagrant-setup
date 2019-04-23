
import { Injectable } from '@angular/core';
import { Router, CanLoad, Route, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { SubscriptionService } from '../subscription.service';
import { Observable,Subscription } from 'rxjs';
import { Log } from 'src/app/helpers/app.helper';

/**
 * AuthGuard service will prevent access to protected routes for unauthenticated users
 *
 * @package AuthGuard
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietery
 */

@Injectable()

export class SubscriptionGuard implements CanActivate {
    userPlanSubscription: Subscription;
    userPlanDetails:any = {
        data: null
    }
    constructor(private router: Router, private subscriptionService: SubscriptionService) {
        this.userPlanSubscription = this.subscriptionService.getUserSubscription$().subscribe(userPlan=>{
            this.userPlanDetails = userPlan;
          })
    }
    canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (this.userPlanDetails.status !== "ACTIVE") {
            this.router.navigate(['/home/plans']);
            return false;
        }
        return true;
    }
}
