import { Component, OnInit } from '@angular/core';
import {NgxSmartModalComponent, NgxSmartModalService} from 'ngx-smart-modal';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ErrorsService } from '../../../services/errors.service';
import { LoaderService } from '../../../services/loader.service';
import { ExitPopupModel } from '../../../models/exit-popup.model';
import { ExitPopupService } from '../../../services/exit-popup.service';
import {Log} from "../../../helpers/app.helper";
import * as htmlToImage from 'html-to-image';
import * as moment from 'moment';

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
  color7: string = '#d2d9e9';
  color8: string = '#e30b5d';

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
  ctaButtonTextColor: string = this.color7;
  ctaButtonBackgroundColor: string = this.color8;
  campaignStickyReviewStyleId: string = '1';
  reviewUserName: string = '';
  reviewImageUrl: string = '';
  reviewName: string = '';
  reviewDescription: string = '';
  reviewAt: string = '';
  reviewType: string = '1';
  reviewRating: string = '1';
  successMessage: string = null; // to show success messages
  styleId: string = null;
  isEditing: boolean = false;
  exitPopupId: number = null; // property to hold the exitPopUp id
  imageCode: any = null;
  exitPopupHeaderText: string = '';
  exitPopupButtonText: string = '';
  exitPopupParagraphText: string = '';
  exitPopupButtonUrl: string = '';
  exitPopupCtaButtonText: string = '';
  // modalBackgroundColor: string ='';
  modalActive: string = '';
  modalName: string = 'exitPopup1';
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
      exitPopupVisualStyles : [ this.styleId, Validators.required],
      hasCampaign: [false],
      campaign : [null],
      hasStickyReview: [false],
      hasEmailField: [true],
      exitPopupHeaderText: ['Take a break, TAKE A LOOK'],
      exitPopupButtonText: ['Subscribe'],
      exitPopupParagraphText: ['Curabitur blandit velit non eros bibendum tincidunt. Integer tincidunt massa sed laoreet lacinia.'],
      stickyReviews: [null],
      exitPopupButtonUrl: [null, Validators.required],
      ctaButtonTextColor: [null],
      ctaButtonBackgroundColor: [null],
      exitPopupCtaButtonText: ['Take me there', Validators.required],
    });
    this.getVisualStyles();
    this.getUserExitPopups();
  }

  public ngAfterViewInit() {
    this.modalCallbacks(); // modal callbacks i.e onClose, onDismiss, onEscape
  }

  public modalCallbacks() {
    // do stuffs when modal has been closed. In this case reset the form when modal is closed
    this.ngxSmartModalService.getModal('modal1').onClose.subscribe((modal: NgxSmartModalComponent) => {
      this.resetForm;
    });
    // do stuffs when modal has been dismissed i.e when the modal is closed clicking in backdrop.
    // In this case reset the form when modal is dismissed
    this.ngxSmartModalService.getModal('modal1').onDismiss.subscribe((modal: NgxSmartModalComponent) => {
      this.resetForm;
    });
    // reset form when modal has been closed by esc key
    this.ngxSmartModalService.getModal('modal1').onEscape.subscribe((modal: NgxSmartModalComponent) => {
      this.resetForm;
    });

  }

  public get resetForm() {
    this.form.reset(); // reset the form
    return;
  }

  public openAddExitPopupModal() {
    this.showStickyReviews = false;
    this.showEmailField = true;
    this.showCampaign = false;
    this.isEditing = false;
    this.form = this.formBuilder.group({
      exitPopUpName : [null, Validators.required], // exitPopUpName name
      headerTextColor : [null],
      headerBackgroundColor : [null],
      buttonTextColor : [null],
      buttonBackgroundColor : [null],
      paragraphTextColor : [null],
      bodyBackgroundColor : [null],
      exitPopupVisualStyles : [ this.styleId, Validators.required],
      hasCampaign: [false],
      campaign : [null],
      hasStickyReview: [false],
      hasEmailField: [true],
      exitPopupHeaderText: ['Take a break, TAKE A LOOK', Validators.required],
      exitPopupButtonText: ['Subscribe'],
      exitPopupParagraphText: ['Curabitur blandit velit non eros bibendum tincidunt. Integer tincidunt massa sed laoreet lacinia.', Validators.required],
      stickyReviews: [null],
      exitPopupButtonUrl: [null, Validators.required],
      ctaButtonTextColor: [null],
      ctaButtonBackgroundColor: [null],
      exitPopupCtaButtonText: ['Take me there', Validators.required],
    });
    this.getVisualStyles();
    this.ngxSmartModalService.getModal('modal1').open();
  }

  public get getFormControls() {
    return this.form.controls;
  }

  public getUserExitPopups() {
    this.loaderService.enableLoader();
    this.exitPopupService.getUserExitPopups().subscribe(
        (response: any ) => {
          if (response.status) {
            this.exitPopups = response.data.data;
            this.loaderService.disableLoader();
          }
        }
    );
  }

  public async onSubmit() {
    // console.log(' try to save/update exit popups ... ');
    this.isSubmitted = true;
    // check if the form does not pass the client side validation
    if (this.form.invalid) {
      return;
    }

    let someOp =  await this.makeImage();
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
      style_id: this.form.value.exitPopupVisualStyles.id,
      cta_button_text: this.form.value.exitPopupCtaButtonText,
      cta_button_text_color: this.color7,
      cta_button_background_color: this.color8,
      popup_preview_img: this.imageCode,
    };

    if (this.form.value.hasCampaign === true) {
      this.form.value.hasCampaign = 1;
      data.has_campaign = 1;
      data.campaign_id = this.form.value.campaign.id;
    } else {
      data.has_campaign = 0;
      delete data.campaign_id;
    }

    if (this.form.value.hasEmailField === true) {
      data.has_email_field = 1;
      data.button_text = this.form.value.exitPopupButtonText;
      data.button_text_color = this.color3;
      data.button_background_color = this.color4;
    } else {
      data.has_email_field = 0;
      delete data.button_text;
      delete data.button_text_color;
      delete data.button_background_color;
    }

    if (this.form.value.hasStickyReview === true) {
      const stickyReviewsArr = this.form.value.stickyReviews;
      const stickyReviews = stickyReviewsArr.map(obj => {
        var rObj = {};
        rObj = obj.id;
        return rObj;
      });
      data.has_sticky_reviews = 1;
      data.sticky_reviews = stickyReviews;
    } else {
      data.has_sticky_reviews = 0;
      delete data.sticky_reviews;
    }

    data.popup_preview_img = this.imageCode;
    if (this.isEditing) {
      this.updateExitPopup(data, this.exitPopupId);
    } else {
      this.addExitPopUp(data);
    }

  }

  public addExitPopUp(data: ExitPopupModel) {
    this.exitPopupService.addExitPopup(data).subscribe(
        (response: any ) => {
          if (response.status) {
            this.loaderService.disableLoader();
            this.form.reset();
            this.ngxSmartModalService.getModal('modal1').close();
            this.successMessage = response.message;
            this.getUserExitPopups();
          } else {
            this.loaderService.disableLoader();
            this.successMessage = response.message;
            this.getUserExitPopups();
          }
        }
    );
  }

  public getVisualStyles() {
    this.exitPopupService.getVisualStyles().subscribe(
        (response: any ) => {
          if (response.status) {
            this.styleId = response.data[0];
            this.form.get('exitPopupVisualStyles').setValue(this.styleId);
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
    switch (this.form.value.exitPopupVisualStyles.type) {
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

  /**
   * This function will return sticky review style id according to a campaign
   */
  public getCampaignStyles() {
    if (this.form.value.campaign !== null ) {
      this.exitPopupService.getCampaignsStyle(this.form.value.campaign.id).subscribe(
          (response: any ) => {
            if (response.status) {
              this.campaignStickyReviewStyleId = response.data;
            }
          }
      );
    }
  }

  public getStickyReviewStyle() {
    if (this.form.value.stickyReviews[0] !== undefined && this.form.value.stickyReviews[0].id !== undefined) {
      // get the [0] position of the array and trit is as the id and send data according to it.
      this.exitPopupService.getstickyReviewInfo(this.form.value.stickyReviews[0].id).subscribe(
          (response: any ) => {
            if (response.status) {
              // console.log(response.data.created_by.name);
              this.reviewUserName = response.data.created_by.name;
              this.reviewImageUrl = response.data.image_url;
              this.reviewName = response.data.name;
              this.reviewDescription = response.data.review;
              this.reviewAt = moment(response.data.reviewed_at).startOf('day').fromNow();
              this.reviewType = response.data.type;
              this.reviewRating = response.data.rating;
            }
          }
      );
    }
  }

  public getStars(rating) {
    const starts = new Array(1);
    for (let i = 1; i < rating; i++) {
      starts.push(i);
    }
    return starts;
  }

  public getCtaButtonTextColor($e) {
    this.color7 = $e;
    this.ctaButtonTextColor = $e;
  }

  public getCtaButtonBackgroundColor($e) {
    this.color8 = $e;
    this.ctaButtonBackgroundColor = $e;
  }

  public deleteExitPopup(id) {
    if (confirm('Are you sure you want to delete this item?')) {
      this.loaderService.enableLoader();
      this.exitPopupService.deleteExitPopup(id).subscribe(
          (response: any ) => {
            if (response.status) {
              this.successMessage = response.message;
              this.getUserExitPopups();
              this.loaderService.disableLoader();
            } else {
              this.successMessage = response.message;
              this.getUserExitPopups();
              this.loaderService.disableLoader();
            }
          }
      );
    }
  }

  /**
   * Create exit popup from exit pop data populate to edit modal
   * @param exitPopup
   */
  public onEditExitPopup(exitPopup) {

    this.showCampaign = false;
    this.showStickyReviews = false;
    this.showEmailField = false;

    this.exitPopupId = exitPopup.id;
    this.isEditing = true;
    if (exitPopup.has_campaign === true) {
      this.form.get('hasCampaign').setValue(exitPopup.has_campaign);
      this.getCampaignsList();
      this.showCampaign = true;
    } else {
      this.showCampaign = false;
    }

    if (exitPopup.has_sticky_reviews === true) {
      this.form.get('hasStickyReview').setValue(exitPopup.has_sticky_reviews);
      this.getStickyReviews();
      this.showStickyReviews = true;
    } else {
      this.showStickyReviews = false;
    }

    if (exitPopup.has_email_field === true) {
      this.form.get('hasEmailField').setValue(exitPopup.has_email_field);
      this.showEmailField = true;
    } else {
      this.showEmailField = false;
    }

    this.getHeaderTextColor(exitPopup.header_text_color);
    this.getHeaderBackgroundColor(exitPopup.header_background_color);
    this.getButtonTextColor(exitPopup.button_text_color);
    this.getButtonBackgroundColor(exitPopup.button_background_color);
    this.getparagraphTextColor(exitPopup.paragraph_text_color);
    this.getBodyBackgroundColor(exitPopup.body_background_color);
    this.getCtaButtonTextColor(exitPopup.cta_button_text_color);
    this.getCtaButtonBackgroundColor(exitPopup.cta_button_background_color);
    switch (exitPopup.style_id.type) {
      case 101:
        this.showMe = '1';
        break;
      case 102:
        this.showMe = '2';
        break;
      case 103:
        this.showMe = '3';
        break;
      case 104:
        this.showMe = '4';
        break;
      case 105:
        this.showMe = '5';
        break;
      default:
        this.showMe = '1';
    }
    const data = {
      exitPopUpName: exitPopup.name,
      exitPopupVisualStyles: exitPopup.style_id,
      exitPopupHeaderText: exitPopup.header_text,
      exitPopupButtonText: exitPopup.button_text,
      exitPopupParagraphText: exitPopup.paragraph_text,
      exitPopupButtonUrl: exitPopup.button_url,
      exitPopupCtaButtonText: exitPopup.cta_button_text,
      campaign: exitPopup.campaign,
      stickyReviews: exitPopup.sticky_reviews,
    };
    this.form.patchValue(data);
    this.ngxSmartModalService.getModal('modal1').open();
  }

  /**
   * Update Exit popup
   * @param data
   * @param exitPopupId
   */
  public updateExitPopup(data, exitPopupId) {
    this.exitPopupService.updateExitPopup(data, exitPopupId).subscribe(
        (response: any ) => {
          if (response.status) {
            this.loaderService.disableLoader();
            this.form.reset();
            this.ngxSmartModalService.getModal('modal1').close();
            this.successMessage = response.message;
            this.getUserExitPopups();
          } else {
            this.loaderService.disableLoader();
            this.successMessage = response.message;
            this.getUserExitPopups();
          }
        }
    );
  }

  /**
   * Function for showing selected options
   * @param optionOne
   * @param optionTwo
   */
  compareFn( optionOne, optionTwo ): boolean {
    if (optionOne && optionTwo) {
      return optionOne.id === optionTwo.id;
    }
  }

  /**
   * Function to make Image with the exit popup
   */
  async makeImage() {
    // console.log('trying to make an Image ');
    return new  Promise((resolve, reject) => {
      const node = document.getElementById('canvas');
      htmlToImage.toPng(node).then((dataUrl) => {
        this.imageCode =  dataUrl;
        resolve(dataUrl) ;
      }).catch((error) => {
        console.error('oops, something went wrong!', error);
      });
    });
  }

  public openExitpopUpPreview(exitPopup) {
    this.getHeaderTextColor(exitPopup.header_text_color);
    this.getHeaderBackgroundColor(exitPopup.header_background_color);
    this.getButtonTextColor(exitPopup.button_text_color);
    this.getButtonBackgroundColor(exitPopup.button_background_color);
    this.getparagraphTextColor(exitPopup.paragraph_text_color);
    this.getBodyBackgroundColor(exitPopup.body_background_color);
    this.getCtaButtonTextColor(exitPopup.cta_button_text_color);
    this.getCtaButtonBackgroundColor(exitPopup.cta_button_background_color);
    switch (exitPopup.style_id.type) {
      case 101:
        this.showMe = '1';
        break;
      case 102:
        this.showMe = '2';
        break;
      case 103:
        this.showMe = '3';
        break;
      case 104:
        this.showMe = '4';
        break;
      case 105:
        this.showMe = '5';
        break;
      default:
        this.showMe = '1';
    }
        this.exitPopupHeaderText = exitPopup.header_text;
        this.exitPopupButtonText = exitPopup.button_text;
        this.exitPopupParagraphText = exitPopup.paragraph_text;
        this.exitPopupButtonUrl = exitPopup.button_url;
        this.exitPopupCtaButtonText = exitPopup.cta_button_text;
  if (exitPopup.has_email_field === true) {
    this.showEmailField = true;
    } else {
    this.showEmailField = false;
  }
    if (exitPopup.has_campaign === true) {
      this.campaignStickyReviewStyleId = exitPopup.campaign.style_id;
    } else {
      this.campaignStickyReviewStyleId = '1';
    }
    if(exitPopup.has_sticky_reviews === true) {
      this.showStickyReviews = true;
      // take the 1st sticky review from [0] position
      this.reviewUserName = exitPopup.sticky_reviews[0].created_by.name;
      this.reviewImageUrl = exitPopup.sticky_reviews[0].image_url;
      this.reviewName = exitPopup.sticky_reviews[0].name;
      this.reviewDescription = exitPopup.sticky_reviews[0].review;
      this.reviewAt = moment(exitPopup.sticky_reviews[0].reviewed_at).startOf('day').fromNow();
      this.reviewType = exitPopup.sticky_reviews[0].type;
      this.reviewRating = exitPopup.sticky_reviews[0].rating;
    } else {
      this.showStickyReviews = false;
    }
    let modalName = 'exitPopup' + this.showMe;
    this.ngxSmartModalService.getModal(modalName).onOpen.subscribe((modal: NgxSmartModalComponent) => {
      this.modalActive = modalName;
    });

    this.onModalClose(modalName);

    this.ngxSmartModalService.getModal(modalName).open();
  }


  public onModalClose(modalName) {
    this.ngxSmartModalService.getModal(modalName).onClose.subscribe((modal: NgxSmartModalComponent) => {
      this.modalActive = 'false';
    });

    this.ngxSmartModalService.getModal(modalName).onDismiss.subscribe((modal: NgxSmartModalComponent) => {
      this.modalActive = 'false';
    });

    this.ngxSmartModalService.getModal(modalName).onEscape.subscribe((modal: NgxSmartModalComponent) => {
      this.modalActive = 'false';
    });
  }

}
