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
  color1: string = '#252525';
  color2: string = '#47e3bd';
  color3: string = '#d2d9e9';
  color4: string = '#3a2a98';
  color5: string = '#252525';
  color6: string = '#252525';

  visualStyles: [] = []; // holds all visual style as an array
  campaigns: [] = []; // holds all campaigns as an array
  stickyReviews: [] = []; // holds all sticky Reviews as an array
  exitPopups: [] = []; // holds all the user exit popups
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
      exitPopupButtonText: ['Subscribe'],
      exitPopupParagraphText: ['Curabitur blandit velit non eros bibendum tincidunt. Integer tincidunt massa sed laoreet lacinia.'],
      stickyReviews: [null],
      exitPopupButtonUrl: [null],
    });
    this.getVisualStyles();
    this.getUserExitPopups();
  }

  public get getFormControls() {
    return this.form.controls;
  }

  public getUserExitPopups() {
    this.exitPopupService.getUserExitPopups().subscribe(
        (response: any ) => {
          if (response.status) {
            this.exitPopups = response.data.data;
          }
        }
    );
  }

  public onSubmit() {
    console.log(' some thing will happen ... ');
    this.isSubmitted = true;
    // check if the form does not pass the client side validation
    if (this.form.invalid) {
      return;
    }
    this.loaderService.enableLoader();

    const data = {
      name: this.form.value.exitPopUpName,
      has_campaign: this.form.value.hasCampaign,
      campaign_id: '',
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

    if (this.form.value.hasCampaign === true) {
      this.form.value.hasCampaign = 1;
      data.has_campaign = 1;
      data.campaign_id = this.form.value.campaign;
    } else {
      data.has_campaign = 0;
      delete data.campaign_id;
    }

    if (this.form.value.hasEmailField === true) {
      data.has_email_field = 1;
      data.button_text = this.form.value.exitPopupButtonText;
      data.button_url = this.form.value.exitPopupButtonUrl;
      data.button_text_color = this.color3;
      data.button_background_color = this.color4;
    } else {
      data.has_email_field = 0;
      delete data.button_text;
      delete data.button_url;
      delete data.button_text_color;
      delete data.button_background_color;
    }

    if (this.form.value.hasStickyReview === true) {
      data.has_sticky_reviews = 1;
      data.sticky_reviews = this.form.value.stickyReviews;
    } else {
      data.has_sticky_reviews = 0;
      delete data.sticky_reviews;
    }
    this.addExitPopUp(data);
  }

  public addExitPopUp(data: ExitPopupModel) {
    // let's make an api call to add this brand
    this.exitPopupService.addExitPopup(data).subscribe(
        (response: any ) => {
          console.log(response);
          if (response.status) {
            this.loaderService.disableLoader();
            this.form.reset();
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
      case 101:
        return this.showMe = '1';
        break;
      case 102:
        return this.showMe = '2';
        break;
      case 103:      
        return this.showMe = '3';
      break;
      case 104:
        return this.showMe = '4';
        break;
      case 105:
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
      this.getCampaignsList();
      this.showCampaign = true;
    } else {
      this.showCampaign = false;
    }
  }

}
