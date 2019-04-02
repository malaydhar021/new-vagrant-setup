import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../services/auth.service';
import { ErrorsService } from '../../../../services/errors.service';
import { Log } from '../../../../helpers/app.helper';

/**
 * This component is responsible for handling all sort of operations in application header
 * after user is logged in including logout functionlity.
 * @class HeaderComponent
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

  loader = false;
  tglFlag = false;
  subscription: Subscription;
  error: string = null;

  constructor(
    private router: Router,
    private cookieService: CookieService,
    private authService: AuthService,
    private errorService: ErrorsService
  ) {
    // subscription to upate the error property to disaply in template
    this.subscription = this.errorService.error$.subscribe(
      errMsg => {
        this.loader = false;
        this.error = errMsg;
      }
    );
  }

  /**
   * 
   */
  public ngOnInit() { }

  /**
   * 
   */
  public tglSetting() {
    this.tglFlag = !this.tglFlag;
  }

  /**
   * Function to logout the user from the application by removing logcalStorage and sessionStorage 
   * data and redirect user to login page
   * @method onLogout
   * @since Version 1.0.0
   * @returns Void
   */
  public onLogout() {
    this.loader = true;
    Log.info('I am in onLogout method');
    this.authService.doLogout.subscribe(
      (response: any) => {
        this.authService.removeStorageData();
        this.loader = false;
        this.errorService.updateMessage(response.message);
        this.router.navigate(['/login']);
      },
      (err: any) => {
        this.loader = false;
        Log.error(err, 'Some error occured');
      }
    );
  }
}
