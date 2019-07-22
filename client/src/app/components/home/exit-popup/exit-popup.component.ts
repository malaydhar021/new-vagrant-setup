import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgxSmartModalComponent, NgxSmartModalService } from 'ngx-smart-modal';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ErrorsService } from '../../../services/errors.service';
import { LoaderService } from '../../../services/loader.service';
import { ExitPopupModel } from '../../../models/exit-popup.model';
import { ExitPopupService } from '../../../services/exit-popup.service';
import * as htmlToImage from 'html-to-image';
import * as moment from 'moment';
import { Log } from 'src/app/helpers/app.helper';
import { $ } from 'protractor';

/**
 * Component to deal with all sort of functionalities related to exit popup create, update, delete and listing.
 * @class ExitPopupComponent
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@Component({
  selector: 'app-exit-popup',
  templateUrl: './exit-popup.component.html',
  styleUrls: ['./exit-popup.component.scss']
})
export class ExitPopupComponent implements OnInit, OnDestroy {
  // defining class properties
  isSubmitted: boolean = false; // flag to set true if the add / edit form is submitted
  form: FormGroup; // for add or edit brand form in modal
  subscription: Subscription; // to get the current value updated from error interceptor
  errorMessage: string = null;
  // Default colors for the default them
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
  modalActive: string = '';
  showCtaField: boolean = false;
  config: any;  // config for pagination
  errorSubscription: Subscription; // to get the current value of showError property
  showError: boolean = false; // flag to show error message
  searchKey: string = '';
  isModalOpened: boolean = false; // set to true if the modal is opened
  reviewBrandName: string = '';
  openModalName: string ='';
  /**
   * 
   * @param ngxSmartModalService 
   * @param title 
   * @param formBuilder 
   * @param errorService 
   * @param loaderService 
   * @param exitPopupService 
   */
  constructor(
    public ngxSmartModalService: NgxSmartModalService,
    public title: Title,
    private formBuilder: FormBuilder,
    private errorService: ErrorsService,
    private loaderService: LoaderService,
    private exitPopupService: ExitPopupService
  ) {
    this.errorSubscription = this.errorService.showMessage$.subscribe(
      (status: boolean) => {
        this.showError = status;
      }
    );
  }

  /**
   * @method ngOnInit
   * @since Version 1.0.0
   * @returns Void
   */
  public ngOnInit() {
    this.title.setTitle('Stickyreviews :: Exit pop-up(s)');
    this.isSubmitted = false;
    this.form = this.formBuilder.group({
      exitPopUpName: [null, Validators.required], // exitPopUpName name
      headerTextColor: [null],
      headerBackgroundColor: [null],
      buttonTextColor: [null],
      buttonBackgroundColor: [null],
      paragraphTextColor: [null],
      bodyBackgroundColor: [null],
      exitPopupVisualStyles: [this.styleId, Validators.required],
      hasCampaign: [false],
      campaign: [''],
      hasStickyReview: [false],
      hasEmailField: [false],
      exitPopupHeaderText: ['Take a break, TAKE A LOOK', Validators.compose([Validators.required, Validators.maxLength(25)])],
      exitPopupButtonText: ['Subscribe', Validators.compose([Validators.required, Validators.maxLength(15)])],
      exitPopupParagraphText: ['Curabitur blandit velit non eros bibendum tincidunt. Integer tincidunt massa sed laoreet lacinia.', [Validators.required, Validators.maxLength(100)]],
      stickyReviews: [null],
      exitPopupButtonUrl: [null],
      ctaButtonTextColor: [null],
      ctaButtonBackgroundColor: [null],
      exitPopupCtaButtonText: ['Take me there'],
      exitPopupAction: ['1', Validators.required],
    });
    this.getVisualStyles();
    this.getUserExitPopups();
    // pagination controls
    this.config = {
      itemsPerPage: 15,
      currentPage: 1,
    };
  }

  /**
   * @method ngOnDestroy
   * @since Version 1.0.0
   * @returns Void
   */
  public ngOnDestroy() {
    this.errorSubscription.unsubscribe();
    this.errorService.clearMessage();
  }

  /**
   * @method ngAfterViewInit
   * @since Version 1.0.0
   * @returns Void
   */
  public ngAfterViewInit() {
    this.modalCallbacks(); // modal callbacks i.e onClose, onDismiss, onEscape
  }

  /**
   * Method to reset form and clear messages when the add/edit modal has been opened or closed
   * @method modalCallbacks
   * @since Version 1.0.0
   * @returns Void
   */
  public modalCallbacks() {
    // do stuffs when modal has been closed. In this case reset the form when modal is closed
    this.ngxSmartModalService.getModal('modal1').onClose.subscribe((modal: NgxSmartModalComponent) => {
      this.resetForm();
    });
    // do stuffs when modal has been dismissed i.e when the modal is closed clicking in backdrop.
    // In this case reset the form when modal is dismissed
    this.ngxSmartModalService.getModal('modal1').onDismiss.subscribe((modal: NgxSmartModalComponent) => {
      this.resetForm();
    });
    // reset form when modal has been closed by esc key
    this.ngxSmartModalService.getModal('modal1').onEscape.subscribe((modal: NgxSmartModalComponent) => {
      this.resetForm();
    });
    // set showError to false when the modal is being opened
    this.ngxSmartModalService.getModal('modal1').onOpen.subscribe((modal: NgxSmartModalComponent) => {
      this.errorService.clearMessage();
      this.isModalOpened = true; // set it to true as modal is about to open. This is form show server side messages into modal but not in listing page
    });
  }

  /**
   * Reset the exitpopup form
   */
  public resetForm() {
    this.form.reset(); // reset the form
    this.isModalOpened = false; // set to false as modal has been closed
    this.errorService.clearMessage();
  }

  /**
   * Function for open add Exit popup modal
   */
  public openAddExitPopupModal() {
    this.showStickyReviews = false;
    this.showEmailField = true;
    this.showCtaField = false;
    this.showCampaign = false;
    this.isEditing = false;
    this.isSubmitted = false;
    this.showMe = '1';  // show default modal for the pop up preview
    this.form = this.formBuilder.group({
      exitPopUpName: [null, Validators.required], // exitPopUpName name
      headerTextColor: [null],
      headerBackgroundColor: [null],
      buttonTextColor: [null],
      buttonBackgroundColor: [null],
      paragraphTextColor: [null],
      bodyBackgroundColor: [null],
      exitPopupVisualStyles: [this.styleId, Validators.required],
      hasCampaign: [false],
      campaign: [''],
      hasStickyReview: [false],
      hasEmailField: [false],
      exitPopupHeaderText: ['Take a break, TAKE A LOOK', Validators.compose([Validators.required, Validators.maxLength(25)])],
      exitPopupButtonText: ['Subscribe', Validators.compose([Validators.required, Validators.maxLength(15)])],
      exitPopupParagraphText: ['Curabitur blandit velit non eros bibendum tincidunt. Integer tincidunt massa sed laoreet lacinia.', Validators.compose([Validators.required, Validators.maxLength(100)])],
      stickyReviews: [null],
      exitPopupButtonUrl: [null],
      ctaButtonTextColor: [null],
      ctaButtonBackgroundColor: [null],
      exitPopupCtaButtonText: ['Take me there'],
      exitPopupAction: ['1', Validators.required],
    });
    this.getVisualStyles();
    // setting default colors for the defualt (theme 1) exit popup theme
    this.getHeaderTextColor('#252525');
    this.getHeaderBackgroundColor('#47e3bd');
    this.getButtonTextColor('#d2d9e9');
    this.getButtonBackgroundColor('#3a2a98');
    this.getparagraphTextColor('#252525');
    this.getBodyBackgroundColor('#252525');
    this.getCtaButtonTextColor('#d2d9e9');
    this.getCtaButtonBackgroundColor('#e30b5d');
    // Open add exit popup modal
    this.ngxSmartModalService.getModal('modal1').open();
  }

  public get getFormControls() {
    return this.form.controls;
  }

  public getUserExitPopups() {
    this.loaderService.enableLoader();
    this.exitPopupService.getUserExitPopups().subscribe(
      (response: any) => {
        if (response.status) {
          this.exitPopups = response.data.data;
          this.config.totalItems = response.data.total;
          this.loaderService.disableLoader();
        }
      }
    );
  }

  /**
   * @method onSubmit
   * @since Version 1.0.0
   * @returns Void
   */
  public async onSubmit() {
    Log.info(' try to save/update exit popups ... ');
    this.isSubmitted = true;
    // check if the form does not pass the client side validation
    if (this.form.invalid) {
      Log.info('Get a validation error ');
      return;
    }
    this.isSubmitted = false;
    let someOp = await this.makeImage();
    this.loaderService.enableLoader();
    const data = {
      name: this.form.value.exitPopUpName,
      has_campaign: this.form.value.hasCampaign,
      campaign_id: '',
      has_sticky_reviews: this.form.value.hasStickyReview,
      sticky_reviews: this.form.value.stickyReviews,
      has_email_field: false,
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
      popup_action: this.form.value.exitPopupAction,
    };

    if (this.form.value.hasCampaign === true) {
      this.form.value.hasCampaign = 1;
      data.has_campaign = 1;
      data.campaign_id = this.form.value.campaign.id;
    } else {
      data.has_campaign = 0;
      delete data.campaign_id;
    }
    if (this.form.value.exitPopupAction === '1') {
      data.has_email_field = true;
      data.button_text = this.form.value.exitPopupButtonText;
      data.button_text_color = this.color3;
      data.button_background_color = this.color4;
    } else {
      data.has_email_field = false;
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

  /**
   * Method to create an exit popup
   * @method addExitPopUp
   * @since Version 1.0.0
   * @param data ExitPopupModel instance
   * @returns Void
   */
  public addExitPopUp(data: ExitPopupModel) {
    this.exitPopupService.addExitPopup(data).subscribe(
      (response: any) => {
        this.loaderService.disableLoader();
        if (response.status) {
          this.ngxSmartModalService.getModal('modal1').close();
          setTimeout(() => {this.errorService.setMessage({type: 'success', message: response.message})}, 100);
          this.getUserExitPopups();
        } else {
          setTimeout(() => {this.errorService.setMessage({type: 'error', message: response.message})}, 100);
          this.getUserExitPopups();
        }
      }
    );
  }

  public getVisualStyles() {
    this.exitPopupService.getVisualStyles().subscribe(
      (response: any) => {
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
      (response: any) => {
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
      this.form.controls['stickyReviews'].setValidators([Validators.required]);
    } else {
      this.form.controls['stickyReviews'].clearValidators();
      this.showStickyReviews = false;
    }
    this.form.controls['stickyReviews'].updateValueAndValidity();
  }

  public getStickyReviews() {
    this.exitPopupService.getStickyReviews().subscribe(
      (response: any) => {
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

  /**
   * Function to add the campaign to a exit popup
   */
  public addCampaing() {
    if (this.form.value.hasCampaign === true) {
      this.form.controls['campaign'].setValidators([Validators.required]);
      this.getCampaignsList();
      this.showCampaign = true;
    } else {
      this.form.controls['campaign'].clearValidators();
      this.showCampaign = false;
    }
    this.form.controls['campaign'].updateValueAndValidity();
  }

  /**
   * This function will return sticky review style id according to a campaign
   */
  public getCampaignStyles() {
    if (this.form.value.campaign !== null) {
      this.exitPopupService.getCampaignsStyle(this.form.value.campaign.id).subscribe(
        (response: any) => {
          if (response.status) {
            this.campaignStickyReviewStyleId = response.data.style_id;
            this.reviewBrandName = response.data.brand_name;
          }
        }
      );
    }
  }

  /**
   * Function to get a sticky review style
   */
  public getStickyReviewStyle() {
    if (this.form.value.stickyReviews[0] !== undefined && this.form.value.stickyReviews[0].id !== undefined) {
      // get the [0] position of the array and trit is as the id and send data according to it.
      this.exitPopupService.getstickyReviewInfo(this.form.value.stickyReviews[0].id).subscribe(
        (response: any) => {
          if (response.status) {
            if (response.data.has_brand && response.data.has_brand === 1) {
              this.reviewUserName = response.data.brands.name;
            } else {
              this.reviewUserName = this.reviewBrandName;
            }
            this.reviewImageUrl = response.data.image_url;
            this.reviewName = response.data.name;
            this.reviewDescription = response.data.review;
            this.reviewAt = moment.utc(response.data.reviewed_at).local().startOf('day').fromNow();
            this.reviewType = response.data.type;
            this.reviewRating = response.data.rating;
          }
        }
      );
    }
  }

  /**
   * Function to fetch count of review stars
   * @param rating
   */
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

  /**
   * Function for delete a exit popup
   * @param id
   */
  public deleteExitPopup(id) {
    if (confirm('Are you sure you want to delete this item?')) {
      this.loaderService.enableLoader();
      this.exitPopupService.deleteExitPopup(id).subscribe(
        (response: any) => {
          this.loaderService.disableLoader();
          if (response.status) {
            setTimeout(() => {this.errorService.setMessage({type: 'success', message: response.message})}, 100);
            this.getUserExitPopups();
          } else {
            setTimeout(() => {this.errorService.setMessage({type: 'error', message: response.message})}, 100);
            this.getUserExitPopups();
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
    this.showCtaField = false;
    this.isSubmitted = false;
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
      this.setStickyReviewStyle(exitPopup);
    } else {
      this.showStickyReviews = false;
    }

    if (exitPopup.has_email_field === true) {
      this.form.get('hasEmailField').setValue(exitPopup.has_email_field);
      this.showEmailField = true;
      this.showCtaField = false;
    } else {
      this.showEmailField = false;
      this.showCtaField = true;
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
      exitPopupAction: exitPopup.popup_action
    };
    this.form.patchValue(data);
    this.ngxSmartModalService.getModal('modal1').open();
    this.addExitpopupAction();
    this.addCampaing();
    this.addStickeyReview();
  }


  public setStickyReviewStyle(exitPopup) {
    // show the 1st selected review in the exitpopup preview
    if (exitPopup.sticky_reviews && exitPopup.sticky_reviews[0].has_brand === 1) {
      this.reviewUserName = exitPopup.sticky_reviews[0].brands.name;
    }
    if(exitPopup.campaign && exitPopup.campaign.has_branding === 1) {
      this.reviewUserName = exitPopup.campaign.branding.name;
    }
    this.reviewImageUrl = exitPopup.sticky_reviews[0].image_url;
    this.reviewName = exitPopup.sticky_reviews[0].name;
    this.reviewDescription = exitPopup.sticky_reviews[0].review;
    this.reviewAt = moment.utc(exitPopup.sticky_reviews[0].reviewed_at).local().startOf('day').fromNow();
    this.reviewType = exitPopup.sticky_reviews[0].type;
    this.reviewRating = exitPopup.sticky_reviews[0].rating;
  }

  /**
   * Update Exit popup
   * @param data
   * @param exitPopupId
   */
  public updateExitPopup(data, exitPopupId) {
    this.exitPopupService.updateExitPopup(data, exitPopupId).subscribe(
      (response: any) => {
        this.loaderService.disableLoader();
        if (response.status) {
          this.ngxSmartModalService.getModal('modal1').close();
          setTimeout(() => {this.errorService.setMessage({type: 'success', message: response.message})}, 100);
          this.getUserExitPopups();
        } else {
          setTimeout(() => {this.errorService.setMessage({type: 'error', message: response.message})}, 100);
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
  compareFn(optionOne, optionTwo): boolean {
    if (optionOne && optionTwo) {
      return optionOne.id === optionTwo.id;
    }
  }

  /**
   * Function to make Image with the exit popup
   */
  async makeImage() {
    return new Promise((resolve, reject) => {
      const node = document.getElementById('canvas');
      htmlToImage.toPng(node).then((dataUrl) => {
        this.imageCode = dataUrl;
        resolve(dataUrl);
      }).catch((error) => {
        Log.info('oops, something went wrong!', error);
      });
    });
  }

  /**
   * Function for create a exit popup view
   * @param exitPopup
   */
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
      this.showCtaField = false;
    } else {
      this.showEmailField = false;
      this.showCtaField = true;
    }
    if (exitPopup.has_campaign === true) {
      this.campaignStickyReviewStyleId = exitPopup.campaign.style_id;
    } else {
      this.campaignStickyReviewStyleId = '1';
    }
    if (exitPopup.has_sticky_reviews === true) {
      this.showStickyReviews = true;
      this.setStickyReviewStyle(exitPopup);
    } else {
      this.showStickyReviews = false;
    }
    const modalName = 'exitPopup' + this.showMe;
    this.openModalName = 'exitPopup' + this.showMe;
    this.ngxSmartModalService.getModal(modalName).onOpen.subscribe((modal: NgxSmartModalComponent) => {
      this.modalActive = modalName;
    });
    this.onModalClose(modalName);
    this.ngxSmartModalService.getModal(modalName).open();
  }

  /**
   *
   * @param modalName
   */
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

  /**
   * Function to search from exit popup list
   * @param $term
   */
  public onSearch($term) {
    this.config.currentPage = 1;
    this.loaderService.enableLoader();
    this.exitPopupService.searchExitPopups($term.target.value).subscribe(
      (response: any) => {
        if (response.status) {
          this.exitPopups = response.data.data;
          this.config.totalItems = response.data.total;
          this.loaderService.disableLoader();
        }
      }
    );
  }

  /**
   * Function to add remove Email field and CTA button.
   * Add and remove the validation.
   */

  public addExitpopupAction() {
    if (this.form.value.exitPopupAction === '1') {
      this.showEmailField = true;
      this.showCtaField = false;
      this.form.controls['exitPopupButtonText'].setValidators([Validators.required, Validators.maxLength(15)]);
      this.form.controls['exitPopupButtonUrl'].clearValidators();
      this.form.controls['exitPopupCtaButtonText'].clearValidators();
    } else {
      this.showEmailField = false;
      this.showCtaField = true;
      this.form.controls['exitPopupButtonText'].clearValidators();
      this.form.controls['exitPopupButtonUrl'].setValidators([
        Validators.required,
        Validators.pattern('https?://.+')
      ]);
      this.form.controls['exitPopupCtaButtonText'].setValidators([Validators.required, Validators.maxLength(40)]);
    }
    this.form.controls['exitPopupButtonUrl'].updateValueAndValidity();
    this.form.controls['exitPopupCtaButtonText'].updateValueAndValidity();
    this.form.controls['exitPopupButtonText'].updateValueAndValidity();
  }

  pageChanged(pgNum: number) {
    this.config.currentPage = pgNum;
    this.loaderService.enableLoader();
    this.exitPopupService.getUserPaginatedExitPopups(pgNum, this.searchKey).subscribe(
      (response: any) => {
        if (response.status) {
          this.exitPopups = response.data.data;
          this.loaderService.disableLoader();
        }
      }
    );
  }

  public forColor(headerBackgroundColor: any) {
    let thisName = this.openModalName;
    let exitPopup = document.querySelectorAll('.exitPopup');
    let modalButton = document.querySelectorAll('.nsm-dialog-btn-close');

    setTimeout(() => {
      for(var i=0; i< exitPopup.length; i++) {
        if(exitPopup[i].getAttribute('identifier') === thisName) {
          let inElement = exitPopup[i].children[0].children[0].children[0].children[1];
          (inElement as HTMLElement).style.backgroundColor = headerBackgroundColor;
        }
      }
    }, 100);
  }
}