import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { BrandingService } from '../branding.service';

@Injectable()
export class BrandingResolver implements Resolve<any> {
    constructor(private brandingService: BrandingService) { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this.brandingService.getAllBrandings();
    }
}