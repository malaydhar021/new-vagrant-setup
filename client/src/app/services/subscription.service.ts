import { Injectable } from '@angular/core';
import { Router, Resolve } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { SubscriptionApiEndpoints } from '../helpers/api.helper';
import { Log } from '../helpers/app.helper';

/**
 * Service to manage all sort of operation for user subscriptions
 * @class SubscriptionService
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@Injectable()
export class SubscriptionService {
  // declare properties
  private userSubscription = new Subject<any>();
  public isSubscribed$: BehaviorSubject<any> = new BehaviorSubject<any>(null); // true if user is subscribed, false if not

  /**
   * Constructor method to load instances of different services when this class got initialized
   * @constructor constructor
   * @since Version 1.0.0
   * @param router Router instance
   * @param httpClient HttpClient instance
   * @returns Void
   */
  constructor(private router: Router, private httpClient: HttpClient) { }

  /**
   * checkSubscription method will check the user subscription has subscription
   * @method checkSubscription
   * @since Version 1.0.0
   * @returns Void
   */
  public checkSubscription() {
    this.getCurrentSubscription().subscribe(
      (response: any) => {
        this.setUserSubscription(response.subscription);
        this.isSubscribed$.next(response);
        if (response.subscription.status !== 'ACTIVE' && response.subscription.status !== 'NA') {
          this.router.navigate(['/home/plans']);
        }
      }
    )
  }

  /**
   * getUserSubscription$ method will get the user subscription
   * @method getUserSubscription$
   * @since Version 1.0.0
   * @returns void
   */
  public getUserSubscription$() {
    return this.userSubscription.asObservable();
  }

  /**
   * setUserSubscription method will set the user subscription
   * @method setUserSubscription
   * @since Version 1.0.0
   * @param data Subscription data
   * @returns void
   */
  public setUserSubscription(data: any) {
    this.userSubscription.next(data);
  }

  /**
   * getCurrentSubscription method will make an api request get a user subscription information
   * @method getCurrentSubscription
   * @since Version 1.0.0
   * @returns Observable<Object>
   */
  public getCurrentSubscription() {
    return this.httpClient.get(SubscriptionApiEndpoints.subscription);
  }

  /**
   * addSubscription method will make an api request add a user subscription
   * @method addSubscription
   * @since Version 1.0.0
   * @param data Request payload data to add subscription
   * @returns Observable<Object>
   */
  public addSubscription(data: any) {
    return this.httpClient.post(SubscriptionApiEndpoints.subscription, data);
  }

  /**
   * addSubscription method will make an api request add a user subscription
   * @method validateSubscription
   * @since Version 1.0.0
   * @param data Request payload data to validate subscription
   * @returns Observable<Object>
   */
  public validateSubscription(data: any) {
    return this.httpClient.post(SubscriptionApiEndpoints.subscription.concat("/validate"), data);
  }

  /**
   * updateSubscription method will make an api request update a user subscription
   * @method updateSubscription
   * @since Version 1.0.0
   * @param data Request payload data to update subscription
   * @returns Observable<Object>
   */
  public updateSubscription(data: any) {
    return this.httpClient.put(SubscriptionApiEndpoints.subscription, data);
  }

  /**
   * deleteSubscription method will make an api request delete a user subscription
   * @method deleteSubscription
   * @since Version 1.0.0
   * @param data Request payload
   * @returns Observable<Object>
   */
  public deleteSubscription(data: any) {
    return this.httpClient.post(SubscriptionApiEndpoints.subscription, data);
  }

  /**
   * getCardDetails method will make an api request delete a user subscription
   * @method getCardDetails
   * @since Version 1.0.0
   * @returns Observable<Object>
   */
  public getCardDetails() {
    return this.httpClient.get(SubscriptionApiEndpoints.cards);
  }

  /**
   * updateCardDetails method will make an api request delete a user subscription
   * @method updateCardDetails
   * @since Version 1.0.0
   * @param data Request payload data to update card details
   * @returns Observable<Object>
   */
  public updateCardDetails(data: any) {
    return this.httpClient.put(SubscriptionApiEndpoints.cards, data);
  }
}