import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CustomDomainApiEndpoints } from '../helpers/api.helper';
import { CustomDomainModel } from '../models/custom-domain.model';

/**
 * Service for all custom domain related operations like add, edit, update and delete a custom domain
 * @class CustomDomainService
 * @author Tier5 LLC `<work@tier5.us>`
 * @version 1.0.0
 * @license Proprietary
 */
@Injectable()
export class CustomDomainService {
  /**
   * Constructor method to inject HttClient module available to all other methods
   * @constructor constructor
   * @since Version 1.0.0
   * @param httpClient HttpClient module from angular
   * @returns Void
   */
  constructor(private httpClient: HttpClient) { }

  /**
   * Method to make an api call to get all custom domains with paginated or without paginated data
   * @method getAllCustomDomains
   * @since Version 1.0.0
   * @returns Observable<Object>
   */
  public getAllCustomDomains(paginate: boolean = false) {
    if(paginate) {
      const params = new HttpParams().set('paginate', 'false');
      return this.httpClient.get(CustomDomainApiEndpoints.customDomains, {params: params});
    }
    return this.httpClient.get(CustomDomainApiEndpoints.customDomains);
  }

  /**
   * Method to make an api call to add a custom domain
   * @method addCustomDomain
   * @since Version 1.0.0
   * @returns Observable<Object>
   */
  public addCustomDomain(data: CustomDomainModel) {
    return this.httpClient.post(CustomDomainApiEndpoints.customDomains, data);
  }

  /**
   * Method to make an api call to update a custom domain
   * @method updateCustomDomain
   * @since Version 1.0.0
   * @returns Observable<Object>
   */
  public updateCustomDomain(data: CustomDomainModel, id: string) {
    return this.httpClient.put(CustomDomainApiEndpoints.customDomains.concat('/' + id), data);
  }

  /**
   * Method to make an api call to delete a custom domain
   * @method deleteCustomDomain
   * @since Version 1.0.0
   * @returns Observable<Object>
   */
  public deleteCustomDomain(id: string) {
    return this.httpClient.delete(CustomDomainApiEndpoints.customDomains.concat('/' + id));
  }

  /**
   * Method for getting the paginated data of custom domain listing
   * @param pgNum
   */
  public getPaginatedCustomDomain(pgNum, searchKey) {
    return this.httpClient.get(CustomDomainApiEndpoints.customDomains.concat('?page=' + pgNum + '&searchParams=' + searchKey));
  }

  /**
   * Method to search a brand from the custom domain list
   * @method searchCustomDomains
   * @since Version 1.0.0
   * @param term
   * @returns Observable<Object>
   */
  public searchCustomDomains(term) {
    return this.httpClient.get(CustomDomainApiEndpoints.customDomains.concat('?searchParams=' + term));
  }
}
