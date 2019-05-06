import { Component, OnInit } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ErrorsService } from '../../../services/errors.service';
import { LoaderService } from '../../../services/loader.service';
import { ExitPopupModel } from '../../../models/exit-popup.model';
import { Log } from '../../../helpers/app.helper';
import { ExitPopupService } from '../../../services/exit-popup.service';


@Component({
  selector: 'app-exit-popup',
  templateUrl: './exit-popup.component.html',
  styleUrls: ['./exit-popup.component.scss']
})
export class ExitPopupComponent implements OnInit {

  isSubmitted: boolean = false; // flag to set true if the add / edit form is submitted
  form: FormGroup; // for add or edit brand form in modal
  subscription: Subscription; // to get the current value updated from error interceptor
  errorMessage: string = null;

  // selectedColor: string = 'color1';
  color1: string = '#2889e9';
  color2: string = '#e920e9';
  color3: string = '#fff500';
  color4: string = '#c77ff1';
  color5: string = '#e93e20';
  color6: string = '#252525';

  visualStyles: [] = []; // holds all visual style as an array
  campaigns: [] = []; // holds all campaigns as an array
  stickyReviews: [] = []; // holds all sticky Reviews as an array
  showStickyReviews: boolean = false; // show the sticky review names
  showEmailField: boolean = true;
  showMe: string = '1'; // show the selected exitpopup style
  showCampaign: boolean = false;
  headerTextColor: string = this.color1;
  paragraphTextColor: string = this.color5;
  buttonTextColor: string = this.color3;
  buttonBackgroundColor: string = this.color4;
  headerBackgroundColor: string = this.color2;
  bodyBackgroundColor: string = this.color6;

  constructor(
      public ngxSmartModalService: NgxSmartModalService,
      public title: Title,
      private formBuilder: FormBuilder,
      private errorService: ErrorsService,
      private loaderService: LoaderService,
      private exitPopupService: ExitPopupService) { }


  ngOnInit() {
    this.title.setTitle('Stickyreviews :: Exit pop-up(s)');
    this.form = this.formBuilder.group({
      exitPopUpName : [null, Validators.required], // exitPopUpName name
      headerTextColor : [null],
      headerBackgroundColor : [null],
      buttonTextColor : [null],
      buttonBackgroundColor : [null],
      paragraphTextColor : [null],
      bodyBackgroundColor : [null],
      exitPopupVisualStyles : ['Z0zbQjPn', Validators.required],
      hasCampaign: [false],
      campaign : [null],
      hasStickyReview: [false],
      hasEmailField: [true],
      exitPopupHeaderText: ['Take a break, TAKE A LOOK'],
      exitPopupButtonText: ['subscribe'],
      exitPopupParagraphText: ['Curabitur blandit velit non eros bibendum tincidunt. Integer tincidunt massa sed laoreet lacinia.'],
      stickyReviews: [null],
      exitPopupButtonUrl: [null],
    });
    this.getVisualStyles();
  }

  public get getFormControls() {
    return this.form.controls;
  }


  public onSubmit() {
    console.log(' some thing will happen ... ');
    this.isSubmitted = true;
    // check if the form does not pass the client side validation
    if(this.form.invalid) {
      return;
    }
    this.loaderService.enableLoader();

    if (this.form.value.hasCampaign === true) {
      this.form.value.hasCampaign = 1;
    } else {
      this.form.value.hasCampaign = 0;
    }

    if (this.form.value.hasEmailField === true) {
      this.form.value.hasEmailField = 1;
    } else {
      this.form.value.hasEmailField = 0;
    }

    if (this.form.value.hasStickyReview === true) {
      this.form.value.hasStickyReview = 1;
    } else {
      this.form.value.hasStickyReview = 0;
    }

    const data = {
      name: this.form.value.exitPopUpName,
      has_campaign: this.form.value.hasCampaign,
      campaign_id: this.form.value.campaign,
      has_sticky_reviews: this.form.value.hasStickyReview,
      sticky_reviews: this.form.value.stickyReviews,
      has_email_field: this.form.value.hasEmailField,
      header_text: this.form.value.exitPopupHeaderText,
      header_text_color: this.color1,
      header_background_color: this.color2,
      paragraph_text: this.form.value.exitPopupParagraphText,
      paragraph_text_color: this.color5,
      body_background_color: this.color6,
      popup_backdrop_color: this.color6,
      button_text: this.form.value.exitPopupButtonText,
      button_url: this.form.value.exitPopupButtonUrl,
      button_text_color: this.color3,
      button_background_color: this.color4,
      style_id: this.form.value.exitPopupVisualStyles,
    };
    this.addExitPopUp(data);
    console.log(data);
  }

  public addExitPopUp(data: ExitPopupModel) {
    // let's make an api call to add this brand
    this.exitPopupService.addExitPopup(data).subscribe(
        (response: any ) => {
          if (response.status) {
            this.loaderService.disableLoader();
            this.ngxSmartModalService.getModal('modal1').close();
          } else {
            this.errorMessage = response.message;
            this.loaderService.disableLoader();
          }
        }
    );
  }

  public getVisualStyles() {
    this.exitPopupService.getVisualStyles().subscribe(
        (response: any ) => {
          if (response.status) {
            this.visualStyles = response.data;
          }
        }
    );
  }

  public getCampaignsList() {
    this.exitPopupService.getCampaignsList().subscribe(
        (response: any ) => {
          if (response.status) {
            this.campaigns = response.data;
          }
        }
    );
  }

  public addStickeyReview() {
    if (this.form.value.hasStickyReview === true) {
        this.showStickyReviews = true;
        this.getStickyReviews();
    } else {
      this.showStickyReviews = false;
    }
  }

  public getStickyReviews() {
    this.exitPopupService.getStickyReviews().subscribe(
        (response: any ) => {
          if (response.status) {
            this.stickyReviews = response.data;
          }
        }
    );
  }

  public addEmailField() {
    if (this.form.value.hasEmailField === true) {
      this.showEmailField = true;
    } else {
      this.showEmailField = false;
    }
  }

  public setPopupVisualStyle() {
    switch (this.form.value.exitPopupVisualStyles) {
      case 'Zvz85wKy':
        return this.showMe = '3';
        break;
      case 'Z0zbQjPn':
        return this.showMe = '1';
        break;
      case 'Bow2QzJ9':
        return this.showMe = '2';
        break;
      case 'OVjr8wMG':
        return this.showMe = '4';
        break;
      case '3Aw7GwKZ':
        return this.showMe = '5';
        break;
      default:
        return this.showMe = '1';
    }
  }

  public getHeaderTextColor($e) {
    this.color1 = $e;
    this.headerTextColor = $e;
  }

  public getHeaderBackgroundColor($e) {
    this.color2 = $e;
    this.headerBackgroundColor = $e;
  }

  public getButtonTextColor($e) {
    this.color3 = $e;
    this.buttonTextColor = $e;
  }

  public getButtonBackgroundColor($e) {
    this.color4 = $e;
    this.buttonBackgroundColor = $e;
  }

  public getparagraphTextColor($e) {
    this.color5 = $e;
    this.paragraphTextColor = $e;
  }

  public getBodyBackgroundColor($e) {
    this.color6 = $e;
    this.bodyBackgroundColor = $e;
  }

  public addCampaing() {
    if (this.form.value.hasCampaign === true) {
      this.showCampaign = true;
      this.getCampaignsList();
    } else {
      this.showCampaign = false;
    }
  }

}
