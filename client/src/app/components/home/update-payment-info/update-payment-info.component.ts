import { Component, OnInit }            from '@angular/core';
import { NgxSmartModalService }         from 'ngx-smart-modal';
import { SubscriptionService }          from '../../../services/subscription.service';
import { LoaderService }                from '../../../services/loader.service';

@Component({
  selector: 'app-update-payment-info',
  templateUrl: './update-payment-info.component.html',
  styleUrls: ['./update-payment-info.component.scss']
})
export class UpdatePaymentInfoComponent implements OnInit {
  cards:any;
  constructor(
    public ngxSmartModalService: NgxSmartModalService,
    public subscriptionService: SubscriptionService,
    public loaderService: LoaderService
    ) { }

  ngOnInit() {
    this.getUserCardDetails()
  }

  getUserCardDetails(){
    this.subscriptionService.getCardDetails().subscribe(
      (response:any) => {
        console.log(response);
      },
      (error:any) =>{
        console.log(error);
      }
    )
  }
}
