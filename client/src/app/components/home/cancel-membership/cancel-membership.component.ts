import { Component, OnInit }                  from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


import { SubscriptionService }                from '../../../services/subscription.service';
import { LoaderService }                      from '../../../services/loader.service';
import { UserService }                        from '../../../services/user.service';

@Component({
  selector: 'app-cancel-membership',
  templateUrl: './cancel-membership.component.html',
  styleUrls: ['./cancel-membership.component.scss']
})
export class CancelMembershipComponent implements OnInit {

  showCancelationForm: boolean = true;
  cancellationForm: FormGroup
  showDescription: boolean = false;
  userInfo: any;
  name: string = '';
  plan: string = '';
  subscriptionStatus:string;
  listOfReasons: Array<string>=['Bad Onboarding', 'Buggy Product', 'Bad Support', 'Not A Right Fit', 'Price Is Too High', 'Others']
  constructor(
    private subscriptionService: SubscriptionService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private userService: UserService
  ) { 
    
  }
  onChangeReason(){
    
    if (this.cancellationForm.get('reason').value == "Others"){
      this.cancellationForm.get('description').setValidators(Validators.required);
      this.cancellationForm.get('description').updateValueAndValidity();
      this.showDescription = true
    } else {
      this.showDescription = false
      this.cancellationForm.get('description').clearValidators();
      this.cancellationForm.get('description').updateValueAndValidity();
    }
  }
  ngOnInit() {

    this.cancellationForm = this.formBuilder.group({
      reason: ['Bad Onboarding',Validators.required ],
      description: [null]
    })
    this.loaderService.enableLoader();
    this.userService.getAuthUserInfo().subscribe(
      (response: any)=>{
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
  getUserSubscribtion(){
    // this.loaderService.enableLoader();
    this.subscriptionService.getCurrentSubscription().subscribe(
      (response:any)=> {
        this.loaderService.disableLoader();
        this.subscriptionService.setUserSubscription(response.subscription);
      }
    )
  }
  cancelMembership(){
    let value = this.cancellationForm.value;
    value['_method'] = "DELETE"
    this.loaderService.enableLoader()
    this.subscriptionService.deleteSubscription(value).subscribe(
      (response : any)=>{
        this.showCancelationForm = false;
        this.getUserSubscribtion();
      }
    )
  }

}
