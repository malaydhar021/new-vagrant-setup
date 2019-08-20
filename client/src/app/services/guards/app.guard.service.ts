import { Injectable } from '@angular/core';
import { CanLoad, Route } from '@angular/router';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';
import { AppBaseUrl } from '../../helpers/api.helper';

/**
 * AppGuard service will prevent access to public routes for authenticate users
 * @package AppGuard
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@Injectable()
export class AppGuard implements CanLoad {
    constructor(private authService: AuthService) {}

    canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
        if (this.authService.isAuthenticated) {
            window.location.href = AppBaseUrl + '/home/dashboard';
            return false;
        }
        return true;
    }
}
