import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SubscribedEmailApiEndpoints } from '../helpers/api.helper';

/**
 * Service for all subscribed email related operations like show and delete a subscribed email
 * @class SubscribedEmailService
 * @author Tier5 LLC `<work@tier5.us>`
 * @version 1.0.0
 * @license Proprietary
 */
@Injectable()
export class SubscribedEmailService {
  /**
   * Constructor method to inject HttClient module available to all other methods
   * @constructor constructor
   * @since Version 1.0.0
   * @param httpClient HttpClient module from angular
   * @returns Void
   */
  constructor(private httpClient: HttpClient) { }

  /**
   * Method to make an api call to get all subscribed emails
   * @method getAllSubscribedEmails
   * @since Version 1.0.0
   * @returns Observable<Object>
   */
  public getAllSubscribedEmails() {
    return this.httpClient.get(SubscribedEmailApiEndpoints.subscribedEmails);
  }

  /**
   * Method to make an api call to delete a subscribed email
   * @method deleteSubscribedEmail
   * @since Version 1.0.0
   * @param id System id of the subscribed email which is going to be deleted
   * @returns Observable<Object>
   */
  public deleteSubscribedEmail(id: string) {
    return this.httpClient.delete(SubscribedEmailApiEndpoints.subscribedEmails.concat('/' + id));
  }

  /**
   * Method for getting the paginated data of subscribed emails
   * @param pgNum
   */
  public getPaginatedSubscribedEmail(pgNum, searchKey) {
    return this.httpClient.get(SubscribedEmailApiEndpoints.subscribedEmails.concat('?page=' + pgNum + '&searchParams=' + searchKey));
  }

  /**
   * Method to search a brand from the subscribed email list
   * @param term
   */
  public searchSubscribedEmail(term) {
    return this.httpClient.get(SubscribedEmailApiEndpoints.subscribedEmails.concat('?searchParams=' + term));
  }
}
