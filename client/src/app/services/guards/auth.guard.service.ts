
import { Injectable } from '@angular/core';
import { Router, CanLoad, Route } from '@angular/router';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';
import { Log } from 'src/app/helpers/app.helper';

/**
 * AuthGuard service will prevent access to protected routes for unauthenticated users
 * 
 * @package AuthGuard
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietery
 */

@Injectable()

export class AuthGuard implements CanLoad {
    constructor(private router : Router, private authService : AuthService){}

    canLoad(route : Route): Observable<boolean> | Promise<boolean> | boolean {
        if(!this.authService.isAuthenticated){
            this.router.navigate(['/login']);
            return false;
        }
        return true;

        /**
        * DO NOT REMOVE THE BELOW COMMENTED OUT CODE
         
        this.authService.isAuthenticated.subscribe(
            (authenticated : any) => {
                if(authenticated){
                    Log.success(authenticated, 'valid token');
                    return true;
                }
                else
                {
                    this.router.navigate(['/login']);
                    return false;
                }
            }
        );
        return false;
        
        * DO NOT REMOVE THE ABOVE COMMENTED OUT CODE
        */
    }
}