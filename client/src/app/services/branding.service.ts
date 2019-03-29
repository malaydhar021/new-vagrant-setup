import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BrandingApiEndpoints } from '../helpers/api.helper';
import { Router } from '@angular/router';
import { Log } from '../helpers/app.helper';
import { tap } from 'rxjs/operators';

/**
 * Service for all branding related operations
 * @package BrandingService
 * @author Tier5 LLC `<work@tier5.us>`
 * @version 1.0.0
 * @license Proprietery
 */

 @Injectable()
 export class BrandingService {
    constructor(private httpClient: HttpClient, private router: Router) {}

    /**
     * Function to return all brandings using api endpoint
     * @returns Observable<Object>
     */
    public getAllBrandings() {
        return this.httpClient.get(BrandingApiEndpoints.brandings);
    }
 }
