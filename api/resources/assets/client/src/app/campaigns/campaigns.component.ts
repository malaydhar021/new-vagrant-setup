import {Component, OnInit, TemplateRef, OnDestroy} from '@angular/core';
import {CampaignServiceService} from '../campaign-service.service';
import {CampaignList} from '../models/CampaignList';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Constants} from '../constants';
import {Router, ActivatedRoute , Params, NavigationEnd } from '@angular/router';
import {CustomValidator} from '../validator/customValidator';
import {Brandings} from '../models/brandings';
import {BrandingServiceService} from '../branding-service.service';
import {Observable} from 'rxjs/Observable';
import {User} from '../models/user';
import {SaveCampaign} from '../models/saveCampaign';
import {StickyReviewsService} from '../sticky-reviews.service';
import {StickyReviewsList} from '../models/StickyReviewsList';
import {StoreStickyReviews} from '../interfaces/storeStickyReviews';
import {ExitpopupService} from '../exitpopup.service';
import {ExitPopUpsList} from '../models/exitPopUpsList';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-campaigns',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.css']
})

export class CampaignsComponent implements OnInit, OnDestroy {

  constructor(
   private camService: CampaignServiceService,
   private modalService: BsModalService,
   private router: Router,
   private activatedRoute: ActivatedRoute,
   private fb: FormBuilder,
   private bService: BrandingServiceService,
   private stickyService: StickyReviewsService,
   private eps: ExitpopupService
  ) {
    this.navigationSubscription = this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.init();
      }
    });
  }

  campaignListResponse: any;
  token: string;
  errFlg: boolean;
  errString: string;
  campaignListArray: CampaignList[];
  modalRef: BsModalRef;
  campaign_name: string;
  domain_name: string;
  saveCampaignDB: any;
  term: string;
  paginate: number;
  toggleStatus: any;
  confirmedDeleteID: number;
  campaignDeleteResponse: any;
  isParameterized: boolean;
  paramValue: any;
  code: string;
  p: number;
  saveCampaignForm: FormGroup;
  savingData: boolean;
  addCampaign: boolean;
  selectBranding: boolean;
  brandingArr: Brandings[];
  brandingResp: Observable<any>;
  usrObj: User;
  isEdit: boolean;
  campaignId: number;
  roundedCornerFlg: boolean;
  squareCornerFlg: boolean;
  stickyReviewsListResp: Observable<any>;
  stickyReviewListData: StickyReviewsList[];
  assignSticky: number;
  toggleSticky: boolean;
  stickyReviewsArr: Array<StoreStickyReviews>;
  saveToCampId: number;
  assignStickyToCamp: Observable<any>;
  isBranded: boolean;
  brandDetails: Brandings[];
  suggestionCounter: number;
  myInterval: any;
  loop_reviews_value: any;
  selectExitPopUp: boolean;
  exitPopUpsList: ExitPopUpsList[];
  exitPopUpsListResp: Observable<any>;
  appBaseURL: string;
  navigationSubscription: Subscription;

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
       this.navigationSubscription.unsubscribe();
    }
  }

  init() {
    this.isParameterized = false;
    this.errFlg = false;
    this.errString = null;
    this.token = localStorage.getItem('_tok');
    this.usrObj = JSON.parse(localStorage.getItem('_cu'));
    this.getCampaignList();
    this.getAllStickyReviews();
    this.paginate = Constants.paginateCampaignRecordPerPage;
    this.p = 1;
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params.id) {
        this.isParameterized = true;
        this.paramValue = Number(params.id);
      }
    });
    this.createSaveCampaignForm();
    this.savingData = false;
    this.addCampaign = false;
    this.selectBranding = false;
    this.getBrandings();
    this.isEdit = false;
    this.roundedCornerFlg = false;
    this.squareCornerFlg = false;
    this.toggleSticky = false;
    this.stickyReviewsArr = [];
    this.isBranded = false;
    this.suggestionCounter = 0;
    this.loop_reviews_value = '1';
    this.selectExitPopUp = false;
    this.getAllExitPopUps();
    this.appBaseURL = Constants.appBaseURL || window.location.host;
    this.term = '';
  }

  /**
   * this function get the list of all campaigns according to the user logged in
   */
  getCampaignList(): void {
    if (this.token.length) {
      this.campaignListResponse = this.camService.getAllCampaigns();
      this.campaignListResponse.subscribe(
        data => {
          if (data.status) {
            // if parameterized then only show according to the campaign id
            if (this.isParameterized) {
              this.campaignListArray = data.response;
              this.campaignListArray.forEach(i => {
                if (i.id === this.paramValue) {
                  this.campaignListArray = this.campaignListArray.filter(item => item.id === this.paramValue);
                }
              });
            } else {
              // else show 'em all
              this.campaignListArray = data.response;
            }
          } else {
            this.errFlg = true;
            this.errString = 'Something went wrong. Please try again after some time.';
          }
        },
        error => {
          this.errFlg = true;
          if (error.hasOwnProperty('error')) {
            if (error.error.hasOwnProperty('response')) {
              this.errString = error.error.response;
            }
          }
        });
    } else {
      this.errFlg = true;
      this.errString = 'Please login again to continue session expired!';
    }
  }

  /**
   * this function opens up modal to add campaigns
   * @param {TemplateRef<any>} template
   */
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  /**
   * this function closes the error div
   */
  closeDiv(): void {
    this.errFlg = false;
    this.errString = null;
  }

  /**
   * this function saves the campaign in database
   */
  onSubmit() {
    if (this.saveCampaignForm.valid || this.isEdit) {
      this.savingData = true;
      this.saveCampaignForm.value.branding   = this.selectBranding === true ? 1 : 0;
      this.saveCampaignForm.value.created_by = this.usrObj.id;
      this.saveCampaignForm.value.is_active = '0';
      this.saveCampaignForm.value.delay *= 1000;
      this.saveCampaignForm.value.delay_before_start *= 1000;
      if (this.isEdit) {
        this.saveCampaignForm.value.id = this.campaignId;
        this.saveCampaignDB = this.camService.updateCampaign(this.saveCampaignForm.value);
      } else {
        this.saveCampaignDB = this.camService.saveCampaign(this.saveCampaignForm.value);
      }
      this.saveCampaignDB.subscribe(data => {
        if (data.status) {
          this.savingData = false;
          this.getCampaignList();
          this.saveCampaignForm.reset();
          this.selectBranding = false;
          this.addCampaign = false;
          this.isEdit =  !this.isEdit;
        } else {
          this.savingData = false;
          this.errFlg = true;
          this.errString = 'Something went wrong while saving campaign.';
        }
      }, error => {
        this.savingData = false;
        this.errFlg = true;
        if (error.error.errors === null || error.error.errors === undefined) {
          if (error.hasOwnProperty('error')) {
            if (error.error.hasOwnProperty('response')) {
              this.errString = error.error.response;
            }
          }
        } else {
          const err = error.error.errors;
          if (err.hasOwnProperty('branding_id')) {
            this.errString = 'Please select one of the brandings or switch off the option!';
          } else if (err.hasOwnProperty('exit_pop_up_ids_arr')) {
            this.errString = 'Please select one of the exit popups or switch off the option!';
          } else {
            this.errString = JSON.stringify(error.error.errors);
          }
        }
      });
    } else {
      this.savingData = false;
      this.errFlg = true;
      this.errString = 'Please fill up the form correctly.';
    }
  }

  /**
   * this function toggle between the status of the campaign
   * @param {number} id
   * @returns {any}
   */
  changeStatus(id: number): any {
    if (id.toString().length) {
      this.toggleStatus = this.camService.changeStatus(id);
      this.toggleStatus.subscribe(
        data => {
          if (data.status) {
            this.getCampaignList();
          } else {
            this.errFlg = true;
            this.errString = data.response;
          }
        },
        error => {
          this.errFlg = true;
          if (error.hasOwnProperty('error')) {
            if (error.error.hasOwnProperty('response')) {
              this.errString = error.error.response;
            }
          }
        }
      );
    } else {
      this.errFlg = true;
      this.errString = 'No id found!';
    }
  }

  /**
   * this function sets value for edit in campaign
   * @param {SaveCampaign} campaign
   */
  editRecord(campaign: SaveCampaign) {
    this.campaignId = campaign.id;
    this.addCampaign = true;
    this.isEdit =  true;
    if (campaign.branding === 1) {
      this.selectBranding = true;
    } else {
      this.selectBranding = false;
    }
    if (campaign.exit_pop_up === '1') {
      this.selectExitPopUp = true;
    } else {
      this.selectExitPopUp = false;
    }
    this.saveCampaignForm.patchValue({
      campaign_name: campaign.campaign_name,
      domain_name: campaign.domain_name,
      styles: campaign.styles,
      delay: campaign.delay / 1000,
      delay_before_start: campaign.delay_before_start / 1000,
      branding: campaign.branding === 1 ? 1 : 0,
      branding_id: campaign.branding === 1 ? campaign.branding_id : null,
      exit_pop_up: campaign.exit_pop_up === '0' ? false : true,
      exit_pop_up_ids_arr: campaign.exit_pop_up === '1' ? campaign.exit_pop_up_id : null
    });
    this.loop_reviews_value = campaign.loop;
  }

  /**
   * this function open confirm pop up before delete and set some attributes
   * @param {number} id
   * @param {TemplateRef<any>} templateDelete
   */
  deleteRecordConfirm(id: number) {
    const isSure = confirm('Are you sure?');
    if (isSure) {
      this.confirmedDeleteID = id;
      this.deleteConfirmation(this.confirmedDeleteID);
    }
  }

  /**
   * this function fired when delete is getting confirmed for campaign and soft deletes the record
   * @param {boolean} identifier
   * @param {number} confirmDeleteID
   */
  deleteConfirmation(confirmDeleteID: number): void {
    this.campaignDeleteResponse = this.camService.deleteCampaign({'campaign_id': confirmDeleteID});
    this.campaignDeleteResponse.subscribe(
      data => {
        if (data.status) {
          this.getCampaignList();
        } else {
          this.errFlg = true;
          this.errString = data.response;
        }
      },
      error => {
        this.errFlg = true;
        if (error.hasOwnProperty('error')) {
          if (error.error.hasOwnProperty('response')) {
            this.errString = error.error.response;
          }
        }
      }
    );
  }

  /**
   * this function create the reactive form for adding campaign
   */
  createSaveCampaignForm(): void {
    this.saveCampaignForm = this.fb.group({
      campaign_name: ['', [Validators.required, Validators.maxLength(100)]],
      domain_name: ['', [Validators.required, Validators.pattern('^(http|https):\/\/[^ "]+$')]],
      styles: ['', Validators.required],
      delay: ['', [Validators.required, CustomValidator.numberValidate]],
      branding: ['', [CustomValidator.numberValidate]],
      branding_id: ['', [CustomValidator.numberValidate]],
      delay_before_start: ['', [CustomValidator.numberValidate]],
      loop: [1, [CustomValidator.numberValidate]],
      exit_pop_up: [0, [CustomValidator.numberValidate]],
      exit_pop_up_ids_arr: ['', [CustomValidator.numberValidate]]
    });
  }

  /**
   * this shows branding dropdown
   * @param event
   */
  handleBranding(event): void {
    if (event.source._checked) {
      this.selectBranding = true;
    } else {
      this.selectBranding = false;
    }
  }

  /**
   * this shows exit pop up dropdowns
   * @param event
   */
  handleExitPopUp(event): void {
    if (event.source._checked) {
      this.selectExitPopUp = true;
    } else {
      this.selectExitPopUp = false;
    }
  }

  /**
   * get the list of all branding for campaign assignments
   */
  getBrandings() {
    this.brandingResp = this.bService.getAllBranding();
    this.brandingResp.subscribe(data => {
      if (data.status) {
        this.brandingArr = data.response;
      } else {
        this.errFlg = true;
        this.errString = 'Something went wrong while fetching brandings!';
      }
    }, err => {
      this.errFlg = true;
      this.errString = err.error.response;
    });
  }

  /**
   * this function show add form
   */
  showAddForm() {
    this.addCampaign = !this.addCampaign;
    this.isEdit = false;
    this.saveCampaignForm.patchValue({
      campaign_name : '',
      domain_name : '',
      styles : '',
      delay : '',
      delay_before_start: '',
      branding: 0,
      branding_id: '',
      exit_pop_up: 0,
      exit_pop_up_ids_arr: '',
      loop: 0,
    });
  }

  /**
   * this function shows what is the pop is for demo
   * @param {string} style_type
   * @param {number} brandingF
   * @param {number} brandingId
   * @param {number} delay
   */
  showDemoStyle(style_type: string, brandingF: number, brandingId: number, delay: number) {
    if (brandingF === 1) {
      this.isBranded = true;
      this.brandDetails = this.getBrandDetailsFromBrandId(brandingId);
    } else {
      this.isBranded = false;
    }
    const ang =  this;
    if (style_type === 'square') {
      this.suggestionCounter = 0;
      this.myInterval = setInterval(function () {
        ang.squareCornerFlg = !ang.squareCornerFlg;
        ang.roundedCornerFlg = false;
        ang.suggestionCounter++;
        if (ang.suggestionCounter > 10) {
          ang.clearDemoInterval(ang.myInterval);
        }
      }, delay);
    } else {
      this.suggestionCounter = 0;
      this.myInterval = setInterval(function () {
        ang.squareCornerFlg = false;
        ang.roundedCornerFlg = !ang.roundedCornerFlg;
        ang.suggestionCounter++;
        if (ang.suggestionCounter > 10) {
          ang.clearDemoInterval(ang.myInterval);
        }
      }, delay);
    }
  }

  /**
   * this function stops the demo
   * @param intervalInstance
   */
  clearDemoInterval(intervalInstance: any) {
    window.clearInterval(intervalInstance);
    this.squareCornerFlg = false;
    this.roundedCornerFlg = false;
  }

  /**
   * this functions close the pop up which appears on click of that question mark in campaign list beside style(s)
   * @param {string} style_type
   */
  closePopUp(style_type: string) {
    if (style_type === 'square') {
      this.squareCornerFlg = false;
    } else {
      this.roundedCornerFlg = false;
    }
  }

  /**
   * fetch all the sticky reviews from database
   */
  getAllStickyReviews() {
    this.stickyReviewsListResp = this.stickyService.getAllStickReviews();
    this.stickyReviewsListResp.subscribe(data => {
      if (data.status) {
        this.stickyReviewListData = data.response;
      } else {
        this.errFlg = true;
        this.errString = 'Something went wrong. Please try again after some time.';
      }
    }, err => {
      this.errFlg = true;
      this.errString = err.error.response;
    });
  }

  /**
   * fetches the list of exit pop ups
   */
  getAllExitPopUps() {
    this.exitPopUpsListResp = this.eps.getAllExitPopUps();
    this.exitPopUpsListResp.subscribe(
      data => {
        if (data.status) {
          this.exitPopUpsList = data.response;
        } else {
          this.errFlg = true;
          this.errString = 'Something went wrong, Please try again later!';
        }
      },
      err => {
        this.errFlg = true;
        this.errString = err.error.response;
      }
    );
  }

  /**
   * toggles the list of sticky reviews
   * @param {SaveCampaign} campaign
   */
  showAssignStickyReviews(event: any, campaign: SaveCampaign) {
    this.toggleSticky = !this.toggleSticky;
    this.assignSticky = campaign.id;
    if (!this.toggleSticky) {
      if (this.stickyReviewsArr.length > 0 && this.saveToCampId !== undefined || this.saveToCampId !== 0) {
        if (this.stickyReviewsArr.length === 0) {
          this.assignStickyToCamp = this.camService.assignStickyReviews({'campaign_ids': this.saveToCampId,
            'sticky_review_ids': this.stickyReviewsArr, 'assign_to': 'C', 'detach': true});
        } else {
          this.assignStickyToCamp = this.camService.assignStickyReviews({'campaign_ids': this.saveToCampId,
            'sticky_review_ids': this.stickyReviewsArr, 'assign_to': 'C'});
        }
        this.assignStickyToCamp.subscribe(data => {
          if (data.status) {
            this.getCampaignList();
          } else {
            this.errFlg = true;
            this.errString = 'Something went wrong while assigning sticky reviews. Please try again later!';
          }
        }, error => {
          this.errFlg = true;
          if (error.hasOwnProperty('error')) {
            if (error.error.hasOwnProperty('response')) {
              this.errString = error.error.response;
            }
          }
        });
      }
    } else {
      this.stickyReviewsArr = [];
      this.saveToCampId =  0;
    }
  }

  /**
   * this function saves data of mapping in database
   * @param event
   */
  handleStickySelect(event: any, campaign_id: number) {
    this.stickyReviewsArr = event;
    this.saveToCampId = campaign_id;
  }

  /**
   * this function sets the value up for sticky reviews drop down from pivot table database
   * @param object1
   * @param object2
   * @returns {boolean}
   */
  compareObj(object1: any, object2: any): boolean {
    if (object1 === object2.id) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * this function serches for a particular branding in array of branding
   * @param key
   * @returns {Brandings[]}
   */
  getBrandDetailsFromBrandId(key): Brandings[] {
    if (key !== undefined) {
      if (key !== null) {
        if (key) {
          return this.brandingArr.filter(x => x.id === key);
        }
      }
    }
  }

  /**
   * this function shows code snippet for the campaign
   * @param {CampaignList} campaign
   * @param {TemplateRef<any>} templateShowCode
   */
  showCodeSnippet(campaign: CampaignList, templateShowCode: TemplateRef<any>) {
    this.modalRef = this.modalService.show(templateShowCode);
    this.code = `<script src="${this.appBaseURL}lib/v1.1/dist/build.js" `
      + `data-token="${campaign.unique_script_id}" data-name="_emv" async></script>`;
  }
}
