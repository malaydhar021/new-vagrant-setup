import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MenuService } from '../../../../services/menu.service';
import { CookieService } from 'ngx-cookie-service';
import { ErrorsService } from '../../../../services/errors.service';
import { Log } from 'src/app/helpers/app.helper';

/**
 * Component to show left panel menus and their actions
 * @class LeftPanelComponent
 * @version 2.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@Component({
  selector: 'app-left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.scss']
})
export class LeftPanelComponent implements OnInit, OnDestroy {
  allRoute: any = {};
  subscription: Subscription;
  isActive: boolean = false;
  showCookie: boolean = false;
  errorSubscription: Subscription; // to get the current value of showError property
  showError: boolean = false; // flag to show error message

  constructor(private menuService: MenuService, private cookieService: CookieService, private errorService: ErrorsService) {
    this.allRoute = {
      '' : ['/home'],
      'dashboard' : ['/home/dashboard'],
      'branding' : ['/home/branding'],
      'campaign' : ['/home/campaign'],
      'sticky-reviews' : ['/home/sticky-reviews'],
      'review-link' : ['/home/review-link'],
      'exit-popup' : ['/home/exit-popup'],
      'update-payment-info' : ['/home/update-payment-info'],
    };

    this.subscription = this.menuService.activeMenu$.subscribe(
      status => {
        Log.info(status, "checking status in left panel component");
        this.isActive = status;
      }
    );

    this.errorSubscription = this.errorService.showMessage$.subscribe(
      (status: boolean) => {
        this.showError = status;
      }
    );
   }

  ngOnInit() {
    if (!this.cookieService.get('_readSite')) {
      this.showCookie = true;
    }
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * Function to  set cookie and close the cookie notification
   */
  public closeCookie() {
    this.cookieService.set('_readSite', '1', 450, '/', 'usestickyreviews.com');
    this.showCookie = false;
  }

  /**
   * Method to open / close a menu drawer for responsive
   * @method closeDrawer
   * @since Version 2.0.0
   * @returns Void
   */
  public closeDrawer() {
    this.menuService.updateStatus(false);
  }

}
