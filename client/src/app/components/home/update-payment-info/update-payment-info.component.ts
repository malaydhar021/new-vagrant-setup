import { Component, OnInit }                  from '@angular/core';
import { NgxSmartModalService }               from 'ngx-smart-modal';
import { SubscriptionService }                from '../../../services/subscription.service';
import { LoaderService }                      from '../../../services/loader.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-update-payment-info',
  templateUrl: './update-payment-info.component.html',
  styleUrls: ['./update-payment-info.component.scss']
})
export class UpdatePaymentInfoComponent implements OnInit {
  card:any;
  years:any = [];
  cardForm: FormGroup;
  currentYear: Number;
  constructor(
    private ngxSmartModalService: NgxSmartModalService,
    private subscriptionService:  SubscriptionService,
    private loaderService:        LoaderService,
    private formBuilder :         FormBuilder
    ) { }

  ngOnInit() {
    this.getUserCardDetails();
    this.createYearArray();
  }

  getUserCardDetails(){
    this.loaderService.enableLoader();
    this.subscriptionService.getCardDetails().subscribe(
      (response:any) => {
        this.loaderService.disableLoader();
        this.card = response.card;
      }
    )
  }

  createYearArray(){
    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    this.currentYear = currentYear
    for (let i = 0; i <= 25; i++){
      this.years.push(currentYear + i);
    }
  }

  createCardForm(reset= false){
    this.cardForm = this.formBuilder.group({
      card_number: [null, Validators.compose([Validators.required, Validators.minLength(14)])],
      cvc_number:[null, Validators.compose([Validators.required, Validators.minLength(3)])],
      expiry_month:[1, Validators.required],
      expiry_year: [this.currentYear, Validators.required]
    })
    reset && this.cardForm.reset();
  }

}
