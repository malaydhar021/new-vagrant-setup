import { Component, OnInit, OnDestroy }         from '@angular/core';
import { Router }                               from '@angular/router';
import { CookieService }                        from 'ngx-cookie-service';
import { Subscription }                         from 'rxjs';
import { AuthService }                          from '../../../../services/auth.service';
import { ErrorsService }                        from '../../../../services/errors.service';
import { MenuService }                          from '../../../../services/menu.service';
import { Log }                                  from '../../../../helpers/app.helper';
import { SubscriptionService}                   from '../../../../services/subscription.service';
import { UserService }                          from 'src/app/services/user.service';

/**
 * This component is responsible for handling all sort of operations in application header
 * after user is logged in including logout functionality.
 * @class HeaderComponent
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  // defining class properties
  loader = false;
  tglFlag = false;
  tglProfile = false;
  tglSide = false;
  isActive = false;
  subscription: Subscription;  
  menuSubscription: Subscription; 
  error: string = null;
  userPlanSubscription: Subscription;
  userPlanDetails:any;
  currentPlanName:string = '';
  userImageUrlSubscription: Subscription;
  userImageUrl: string 

  /**
   * Constructor method to load services first so that those can be used as required
   * @constructor constructor
   * @since Version 1.0.0
   * @param router Router instance
   * @param authService AuthService instance
   * @param errorService ErrorService Instance
   * @param menuService MenuService Instance
   * @param subscriptionService SubscriptionService instance
   * @param userService UserService instance
   * @returns Void
   */
  constructor(
    private router: Router,
    private authService: AuthService,
    private errorService: ErrorsService,
    private menuService: MenuService,
    private cookieService: CookieService,
    private subscriptionService: SubscriptionService,
    private userService: UserService
  ) {
    // subscription to update the error property to display in template
    // this.subscription = this.errorService.error$.subscribe(
    //   errMsg => {
    //     this.loader = false;
    //     this.error = errMsg;
    //   }
    // );

    // subscription to menu to service active menu to enable or disable a class
    this.menuSubscription = this.menuService.activeMenu$.subscribe(
      status => {
        this.isActive = status;
      }
    );
    // User subscription service for get the user plan info
    this.userPlanSubscription = this.subscriptionService.getUserSubscription$().subscribe(userPlan => {
      this.userPlanDetails = userPlan;
      Log.info(this.userPlanDetails, "Lets check user in header");
      // userPlan.data && userPlan.data.pricing_plan && userPlan.data.pricing_plan.alias && (this.currentPlanName =  userPlan.data.pricing_plan.alias.toUpperCase())
      if(userPlan.data && userPlan.data.pricing_plan && userPlan.data.pricing_plan.alias){
        this.currentPlanName =  userPlan.data.pricing_plan.alias.toUpperCase()
      }
    })
    // subscription to user profile image url and update it once the url got updated from profile section
    // else default or current profile image url will be returned
    this.userImageUrlSubscription = this.userService.userImageUrl$.subscribe(url => {
      this.userImageUrl = url;
    })
  }

  /**
   * Method to close membership box when someone clicks on outside of the div
   * @method closeBox
   * @since Version 1.0.0
   * @param event Mouse event
   * @returns Void
   */
  public closeMembershipBox(event) {
    this.tglFlag = false;
  }

  /**
   * Method to close profile box when someone clicks on outside of the div
   * @method closeProfileBox
   * @since Version 1.0.0
   * @param event Mouse event
   * @returns Void
   */
  public closeProfileBox(event) {
    this.tglProfile = false;
  }

  /**
   * Method to execute when this component got initialized
   * @method ngOnInit
   * @since Version 1.0.0
   * @returns Void
   */
  public ngOnInit() {
    this.userService.getAuthUserInfo().subscribe(
      (response:any) => {
        if (response.data.image){
          this.userService.setUserImage(response.data.image)
        }
      }
    )
   }

   /**
    * 
    */
  public ngOnDestroy() {
    this.subscription.unsubscribe();
    this.menuSubscription.unsubscribe();
    this.userPlanSubscription.unsubscribe();
  }

  /**
   * 
   */
  public tglSetting() {
    this.tglFlag = !this.tglFlag;
  }

  /**
   * 
   */
  public tglProfileMenu() {
    this.tglProfile = !this.tglProfile;
  }

  /**
   * 
   */
  public tglSideMenu() {
    // this.isActive = !this.isActive;
    this.menuService.updateStatus(!this.isActive);
    this.tglSide = !this.tglSide;
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
        // delete cookie from main domain,
        if (this.cookieService.get('_loginUser')) {
          this.cookieService.delete('_loginUser', '/', 'usestickyreviews.com');
        }
        this.router.navigate(['/login']);
      },
      (err: any) => {
        this.loader = false;
        Log.error(err, 'Some error occured');
      }
    );
  }

}
