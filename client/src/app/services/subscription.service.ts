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
        if (response.subscription.status !== 'ACTIVE'){
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

  /**
   * addSubscription method will make an api request add a user subscription
   *  @method addSubscription
   * @since 1.0.0
   * @returns Observable<Object>
   */
  addSubscription(data: any){
    
    return this.httpClient.post(SubscriptionApiEndpoints.subscription, data);
  }

  /**
   * updateSubscription method will make an api request update a user subscription
   *  @method addSubscription
   * @since 1.0.0
   * @returns Observable<Object>
   */
  updateSubscription(data: any){
    
    return this.httpClient.put(SubscriptionApiEndpoints.subscription, data);
  }


  /**
   * deleteSubscription method will make an api request delete a user subscription
   *  @method addSubscription
   * @since 1.0.0
   * @returns Observable<Object>
   */
  deleteSubscription(data: any){
    
    return this.httpClient.post(SubscriptionApiEndpoints.subscription, data);
  }


  /**
   * getCardDetails method will make an api request delete a user subscription
   *  @method getCardDetails
   * @since 1.0.0
   * @returns Observable<Object>
   */
  getCardDetails(){
    return this.httpClient.get(SubscriptionApiEndpoints.cards);
  }

  /**
   * updateCardDetails method will make an api request delete a user subscription
   *  @method updateCardDetails
   * @since 1.0.0
   * @returns Observable<Object>
   */
  updateCardDetails(data: any){
    return this.httpClient.put(SubscriptionApiEndpoints.cards, data);
  }

}
