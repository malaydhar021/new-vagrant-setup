import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { Observable } from 'rxjs';
import { SubscriptionService } from '../subscription.service';
import { Log } from 'src/app/helpers/app.helper';

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
  /**
   * Constructor method to load services at the very fast when this class got initialized
   * @constructor constructor
   * @since Version 1.0.0
   * @param router Router instance
   * @param subscriptionService SubscriptionService instance
   * @returns Void
   */
  constructor(private router: Router, private subscriptionService: SubscriptionService) { }

  /**
   * Interface to check whether current user is under some plan or not and that user is under an active subscription
   * @interface canLoad
   * @since Version 1.0.0
   * @param route Route instance
   * @returns Boolean
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let status = this.subscriptionService.getUserSubscriptionStatus();
    Log.info(status, "checking status in subscription guard");
    if(status && (status === 'ACTIVE' || status === 'NA')) {
      return true;
    } else {
      this.router.navigate(['/home/plans']);
      return false;
    }
    // this.loaderService.enableLoader();
    // return this.subscriptionService.getCurrentSubscription().pipe(map((plan: any) => {
    //   this.subscriptionService.isSubscribed$.next(plan);
    //   this.loaderService.disableLoader();
    //   if (plan.subscription.status === 'ACTIVE' || plan.subscription.status === 'NA') {
    //     return true;
    //   } else {
    //     this.router.navigate(['/home/plans']);
    //     return false;
    //   }
    // }));
  }
}