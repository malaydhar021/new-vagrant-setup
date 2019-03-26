import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../../services/auth.service';
import { Log } from '../../../helpers/app.helper';
import { Subscription } from 'rxjs';
import { ErrorsService } from '../../../services/errors.service';

/**
 * This component is responsible for handling all sort of operations in application header
 * after user is logged in
 * 
 * @package HeaderComponent
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    
    loader : boolean = false;
    tglFlag : boolean = false;
    subscription : Subscription;
    error : string = null;
    
    constructor(
        private router : Router, 
        private cookieService : CookieService, 
        private authService : AuthService,
        private errorService : ErrorsService
    ) 
    {
        this.subscription = this.errorService.error$.subscribe(
            errMsg => {
                this.loader = false;
                this.error = errMsg;
            }
        );
    }

    ngOnInit() {}

    
    tglSetting() {
        this.tglFlag = !this.tglFlag;
    }

    /**
     * Function to logout the user from the application by removing logcalStorage and sessionStorage data and redirect user to login page
     * 
     * @since 1.0.0
     * @returns void
     */
    onLogout()
    {
        this.loader = true;
        Log.info("I am in onLogout method");
        this.authService.doLogout(this.authService.getToken).subscribe(
            (response : any) => {
                localStorage.removeItem('_sr');
                sessionStorage.removeItem('_sr');
                this.cookieService.delete('_rm');
                this.loader = false;
                this.errorService.updateMessage("You are successfully logged out !");
                this.router.navigate(['/login']);
            },
            (err : any) => {
                this.loader = false;
                Log.error(err, "Some error occured");
            }
        );
    }
}
