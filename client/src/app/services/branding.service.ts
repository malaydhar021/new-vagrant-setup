import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { ApiEndPoint } from '../helpers/api.helper';

/**
 * Service for all branding related operations
 * @package BrandingService
 * @author Tier5 LLC `<work@tier5.us>`
 * @version 1.0.0
 * @license Proprietery
 */

 @Injectable()

 export class BrandingService
 {
    constructor(private httpClient : HttpClient){}
    
    /**
     * Function to return all brandings using api endpoint
     * @returns Observable<Object>
     */
    public getAllBrandings()
    {
        return this.httpClient.get(ApiEndPoint.brandings);
    }
 }