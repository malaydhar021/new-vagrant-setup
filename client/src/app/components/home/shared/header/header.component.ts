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
export class HeaderComponent implements OnInit, OnDestroy {

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

  
  constructor(
    private router: Router,
    private cookieService: CookieService,
    private authService: AuthService,
    private errorService: ErrorsService,
    private menuService: MenuService,
    private subscriptionService: SubscriptionService,
    private userService: UserService

  ) {
    // subscription to upate the error property to disaply in template
    this.subscription = this.errorService.error$.subscribe(
      errMsg => {
        this.loader = false;
        this.error = errMsg;
      }
    );
    
    this.menuSubscription = this.menuService.activeMenu$.subscribe(
      status => {
        this.isActive = status;
      }
    );

    this.userPlanSubscription = this.subscriptionService.getUserSubscription$().subscribe(userPlan => {
      this.userPlanDetails = userPlan;
      userPlan.data && userPlan.data.pricing_plan && userPlan.data.pricing_plan.alias && (this.currentPlanName =  userPlan.data.pricing_plan.alias.toUpperCase())
      if(userPlan.data && userPlan.data.pricing_plan && userPlan.data.pricing_plan.alias){
        this.currentPlanName =  userPlan.data.pricing_plan.alias.toUpperCase()
      }
    })

    this.userImageUrlSubscription = this.userService.userImageUrl$.subscribe(url =>{
      console.log(url);
      this.userImageUrl = url;
    })
    
  }

  /**
   * 
   */
  public ngOnInit() {
    this.userService.getAuthUserInfo().subscribe(
      (response:any)=>{
        if (response.data.image){
          this.userService.setUserImage(response.data.image)
        }
      }
    )
   }

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
  public tglProfileMenu() {
    this.tglProfile = !this.tglProfile;
  }
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
        this.router.navigate(['/login']);
      },
      (err: any) => {
        this.loader = false;
        Log.error(err, 'Some error occured');
      }
    );
  }

}
