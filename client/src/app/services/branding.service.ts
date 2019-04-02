import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BrandingApiEndpoints } from '../helpers/api.helper';
import { Router } from '@angular/router';
import { BrandingModel } from '../models/branding.model';

/**
 * Service for all branding related operations like add, edit, update and delete brandings
 * @class BrandingService
 * @author Tier5 LLC `<work@tier5.us>`
 * @version 1.0.0
 * @license Proprietery
 */
 @Injectable()
 export class BrandingService {
    constructor(private httpClient: HttpClient, private router: Router) {}

    /**
     * Method to make an api call to get all brands
     * @method getAllBrandings
     * @since Version 1.0.0
     * @returns Observable<Object>
     */
    public getAllBrandings() {
        return this.httpClient.get(BrandingApiEndpoints.brands);
    }

    /**
     * Method to make an api call to add a brand.
     * @method getAllBrandings
     * @since Version 1.0.0
     * @returns Observable<Object>
     */
    public addBranding(data: BrandingModel) {
        return this.httpClient.post(BrandingApiEndpoints.addBrand, data);
    }

    /**
     * Method to make an api call to update a brand
     * @method getAllBrandings
     * @since Version 1.0.0
     * @returns Observable<Object>
     */
    public updateBranding(data: BrandingModel) {
        return this.httpClient.post(BrandingApiEndpoints.updateBrand, data);
    }

    /**
     * Method to make an api call to delete a brand
     * @method getAllBrandings
     * @since Version 1.0.0
     * @returns Observable<Object>
     */
    public deleteBranding(data: BrandingModel) {
        return this.httpClient.post(BrandingApiEndpoints.deleteBrand, data);
    }
 }
