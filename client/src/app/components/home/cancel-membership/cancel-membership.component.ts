import { Component, OnInit, OnDestroy }                  from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


import { SubscriptionService }                from '../../../services/subscription.service';
import { LoaderService }                      from '../../../services/loader.service';
import { UserService }                        from '../../../services/user.service';
import { Subscription } from 'rxjs';
import { ErrorsService } from 'src/app/services/errors.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

/**
 * CancelMembershipComponent is responsible for cancelling user membership
 * @class CancelMembershipComponent
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@Component({
  selector: 'app-cancel-membership',
  templateUrl: './cancel-membership.component.html',
  styleUrls: ['./cancel-membership.component.scss']
})
export class CancelMembershipComponent implements OnInit, OnDestroy {
  // defining class properties
  showCancellationForm: boolean = true;
  cancellationForm: FormGroup
  showDescription: boolean = false;
  userInfo: any;
  name: string = '';
  plan: string = '';
  subscriptionStatus:string;
  listOfReasons: string[] = ['Bad Onboarding', 'Buggy Product', 'Bad Support', 'Not A Right Fit', 'Price Is Too High', 'Others'];
  errorSubscription: Subscription; // to get the current value of showError property
  showError: boolean = false; // flag to show error message
  errorMessage: string;

   /**
   * Constructor to inject required service. It also subscribe to a observable which emits the current
   * value of defined variable
   * @constructor constructor
   * @since Version 1.0.0
   * @param subscriptionService SubscriptionService instance
   * @param loaderService LoaderService instance
   * @param formBuilder FormBuilder instance
   * @param userService UserService instance
   * @param errorService ErrorService instance
   * @returns Void
   */
  constructor(
    private subscriptionService: SubscriptionService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private errorService: ErrorsService,
    private authService: AuthService,
    private router: Router
  ) { 
    this.errorSubscription = this.errorService.showMessage$.subscribe(
      (status: boolean) => {
        this.showError = status;
      }
    );
  }

  /**
   * @method onChangeReason
   * @since Version 1.0.0
   * @returns Void
   */
  public onChangeReason(){
    if (this.cancellationForm.get('reason').value == "Others"){
      this.cancellationForm.get('description').setValidators(Validators.required);
      this.cancellationForm.get('description').updateValueAndValidity();
      this.showDescription = true;
    } else {
      this.showDescription = false;
      this.cancellationForm.get('description').clearValidators();
      this.cancellationForm.get('description').updateValueAndValidity();
    }
  }
  
  /**
   * @method ngOnInit
   * @since Version 1.0.0
   * @returns Void
   */
  public ngOnInit() {
    this.createCancellationForm();
    this.getAuthUserInfo();
  }

  /**
   * Method to destroy the error subscription
   * @method ngOnDestroy
   * @since Version 1.0.0
   * @returns Void
   */
  public ngOnDestroy() {
    this.errorSubscription.unsubscribe();
    this.errorService.clearMessage();
  }

  /**
   * @method getAuthUserInfo
   * @since Version 1.0.0
   * @returns Void
   */
  public getAuthUserInfo() {
    this.loaderService.enableLoader();
    this.userService.getAuthUserInfo().subscribe(
      (response: any) => {
        this.loaderService.disableLoader();
        this.userInfo = response.data;
        this.name = response.data.name;
        if (response.data && response.data.subscription && response.data.subscription.data && response.data.subscription.data.pricing_plan){
          this.plan = response.data.subscription.data.pricing_plan.alias
        }
        this.subscriptionStatus = response.data.subscription.status;
      }
    )
  }

  /**
   * @method getUserSubscription
   * @since Version 1.0.0
   * @returns Void
   */
  public getUserSubscription() {
    this.subscriptionService.getCurrentSubscription().subscribe(
      (response:any)=> {
        this.loaderService.disableLoader();
        this.subscriptionService.setUserSubscription(response.subscription);
      }
    )
  }

  /**
   * @method cancelMembership
   * @since Version 1.0.0
   * @returns Void
   */
  public cancelMembership(){
    let value = this.cancellationForm.value;
    value['_method'] = "DELETE"
    this.loaderService.enableLoader()
    this.subscriptionService.deleteSubscription(value).subscribe(
      (response : any)=> {
        // this.showCancellationForm = false;
        // this.getUserSubscription();
        if(response.status) {
          this.authService.removeStorageData();
          this.errorService.updateMessage(response.message);
          this.router.navigate(['/login']);
        } else {
          this.errorService.setMessage(null);
        }
      }
    )
  }

  /**
   * @method createCancellationForm
   * @since Version 1.0.0
   * @returns Void
   */
  public createCancellationForm(){
    this.cancellationForm = this.formBuilder.group({
      reason: ['Bad Onboarding',Validators.required ],
      description: [null]
    })
  }
}