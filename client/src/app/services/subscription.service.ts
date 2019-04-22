import { Injectable }                 from '@angular/core';
import { Router }                     from '@angular/router';
import { HttpClient }                 from '@angular/common/http';
import { Observable, Subject }        from 'rxjs';

import { SubscriptionApiEndpoints }   from '../helpers/api.helper';

@Injectable()
export class SubscriptionService {

  private userSubscription = new Subject<any>();
  constructor(private router: Router, private httpClient: HttpClient) { }


  /**
   * checkSubscription method will check the user subscription has subscription
   *  @method checkSubscription
   * @since 1.0.0
   * @returns void
   */
  checkSubscription(){
    this.getCurrentSubscription().subscribe(
      (response: any) => {
        this.setUserSubscription(response.subscription)
        if (!response.subscription.data || response.subscription.status === 'NA'){
          this.router.navigate(['/home/plans'])
        }
    })
  }

  /**
   * getUserSubscription$ method will get the user subscription
   *  @method setUserSubscription$
   * @since 1.0.0
   * @returns void
   */
  public getUserSubscription$(){
    return this.userSubscription.asObservable();
  }

  /**
   * setUserSubscription method will set the user subscription
   *  @method setUserSubscription
   * @since 1.0.0
   * @returns void
   */
  setUserSubscription(data:any) {
    this.userSubscription.next(data);
  }


  /**
   * getCurrentSubscription method will make an api request get a user subscription information
   *  @method getCurrentSubscription
   * @since 1.0.0
   * @returns Observable<Object>
   */
  getCurrentSubscription(){
    
    return this.httpClient.get(SubscriptionApiEndpoints.subscription);
  }
}
