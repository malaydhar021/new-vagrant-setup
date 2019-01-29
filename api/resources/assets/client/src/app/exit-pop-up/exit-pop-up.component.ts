import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExitpopupService } from '../exitpopup.service';
import { StickyReviewsList } from '../models/StickyReviewsList';
import {Observable} from 'rxjs/Observable';
import {CampaignList} from '../models/CampaignList';
import {ExitPopUpsList} from '../models/exitPopUpsList';
import {Constants} from '../constants';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-exit-pop-up',
  templateUrl: './exit-pop-up.component.html',
  styleUrls: ['./exit-pop-up.component.css']
})
export class ExitPopUpComponent implements OnInit, OnDestroy {

  constructor(private fb: FormBuilder, private eps: ExitpopupService, private router: Router) {
    this.navigationSubscription = this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.init();
      }
    });
  }

  errFlg: boolean;
  errString: string;
  saveExitPopUp: FormGroup;
  savingData: boolean;
  myStickyReviews: StickyReviewsList[];
  stickyReviewsResp: Observable<any>;
  campaignListResp: Observable<any>;
  myCampaigns: CampaignList[];
  term: string;
  saveExitPopUpResp: Observable<any>;
  getAllExitPopUpResp: Observable<any>;
  myExitPopUps: ExitPopUpsList[];
  paginate: number;
  p: number;
  addExitPopUp: boolean;
  exitPopUpDeleteResp: Observable<any>;
  preSelectedStickyReviews: any;
  preSelectedCampaign: any;
  isEdit: boolean;
  updatableID: number;
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
    this.errFlg = false;
    this.errString = null;
    this.createExitPopUpSave();
    this.savingData = false;
    this.getAllStickyReviews();
    this.getAllCampaigns();
    this.getAllExitPopUp();
    this.paginate = Constants.paginateCampaignRecordPerPage;
    this.p = 1;
    this.addExitPopUp = false;
    this.preSelectedStickyReviews = [];
    this.preSelectedCampaign = '';
    this.isEdit = false;
    this.term = '';
  }

  /**
   * this function closes the error div
   */
  closeDiv(): void {
    this.errFlg = false;
    this.errString = null;
  }

  /**
   * create the reactive form for exit pop up
   */
  createExitPopUpSave() {
    this.saveExitPopUp = this.fb.group({
      name: ['', Validators.required],
      header_text: ['', Validators.required],
      header_text_color: ['', Validators.required],
      header_background_color: ['', Validators.required],
      semi_header_text: [''],
      semi_header_text_color: [''],
      body_background_color: ['', Validators.required],
      select_sticky_reviews: ['', Validators.required],
      select_active_campaign: ['', Validators.required],
      cta_link_url: [''],
      btn_size: [''],
      btn_text: [''],
      btn_color: [''],
      btn_text_color: ['']
    });
  }

  /**
   * on create exit pop up save this function sends data to backend to store in database
   */
  onSubmit() {
    if (this.saveExitPopUp.valid) {
        this.saveExitPopUp.value.created_by = JSON.parse(localStorage.getItem('_cu')).id;
        // console.log(this.saveExitPopUp.value);
        if (this.isEdit) {
          this.saveExitPopUp.value.id = this.updatableID;
          this.saveExitPopUpResp = this.eps.updateExitPopUp(this.saveExitPopUp.value);
        } else {
          this.saveExitPopUpResp = this.eps.saveExitPopUp(this.saveExitPopUp.value);
        }
        this.saveExitPopUpResp.subscribe(data => {
          console.log(data);
          if (data.status) {
            this.getAllExitPopUp();
            this.addExitPopUp = false;
          } else {
            this.errFlg = true;
            this.errString =  'Something went wrong, Please try again later!';
          }
        }, err => {
          this.errFlg = true;
          this.errString = err.error.response;
        });
    } else {
      this.errFlg = true;
      this.errString = 'Please fill up the form correctly!';
    }
  }

  /**
   * fetches the list of valid sticky reviews from database
   */
  getAllStickyReviews() {
    this.stickyReviewsResp = this.eps.getAllStickReviews(1);
    this.stickyReviewsResp.subscribe(
      data => {
        if (data.status) {
          this.myStickyReviews = data.response;
        } else  {
          this.errFlg = true;
          this.errString = data.response;
        }
      },
      err => {
        this.errFlg = true;
        this.errString = err.error.response;
      }
    );
  }

  /**
   * fetchs the list of active campaigns
   */
  getAllCampaigns() {
    this.campaignListResp = this.eps.getAllCampaigns();
    this.campaignListResp.subscribe(data => {
      if (data.status) {
        this.myCampaigns = data.response;
        // console.log(this.myCampaigns);
      } else {
        this.errFlg = true;
        this.errString = data.response;
      }
    }, err => {
      this.errFlg = true;
      this.errString = err.error.response;
    });
  }

  /**
   * fetchs the list of exit pop ups
   */
  getAllExitPopUp() {
    this.getAllExitPopUpResp = this.eps.getAllExitPopUps();
    this.getAllExitPopUpResp.subscribe(data => {
      if (data.status) {
        this.myExitPopUps = data.response;
      } else {
        this.errFlg = true;
        this.errString = 'Something went wrong. Please try again later!';
      }
    }, err => {
        this.errFlg = true;
        this.errString = err.error.response;
    });
  }

  /**
   * open up the exit pop up form
   */
  addExitPopUpFunc() {
    this.addExitPopUp = !this.addExitPopUp;
    this.isEdit = false;
    this.saveExitPopUp = this.fb.group({
      name: ['', Validators.required],
      header_text: ['', Validators.required],
      header_text_color: ['', Validators.required],
      header_background_color: ['', Validators.required],
      semi_header_text: [''],
      semi_header_text_color: [''],
      body_background_color: ['', Validators.required],
      select_sticky_reviews: ['', Validators.required],
      select_active_campaign: ['', Validators.required],
      cta_link_url: [''],
      btn_size: [''],
      btn_text: [''],
      btn_color: [''],
      btn_text_color: ['']
    });
  }

  /**
   * delete exit pop up
   * @param {ExitPopUpsList} exitPopUpData
   */
  deleteExitPopUp(exitPopUpData: ExitPopUpsList) {
    if (confirm('Are you sure?')) {
      // console.log(exitPopUpData);
      this.exitPopUpDeleteResp = this.eps.deleteExitPopUp({id: exitPopUpData.id});
      this.exitPopUpDeleteResp.subscribe(data => {
        if (data.status) {
          this.getAllExitPopUp();
        } else {
          this.errFlg = true;
          this.errString = 'Something went wrong, Please try again later!';
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
  }

  /**
   * edit the exit pop up form
   * @param {ExitPopUpsList} exitPopUpData
   */
  editExitPopUp(exitPopUpData: ExitPopUpsList) {
    // console.log(exitPopUpData.btn_text_color);
    this.isEdit = true;
    this.addExitPopUp = true;
    this.updatableID = exitPopUpData.id;
    this.saveExitPopUp.patchValue({
      name: exitPopUpData.name,
      header_text: exitPopUpData.header_text,
      header_text_color: exitPopUpData.header_text_color,
      header_background_color: exitPopUpData.header_background_color,
      semi_header_text: exitPopUpData.semi_header_text !== null ? exitPopUpData.semi_header_text : null,
      semi_header_text_color: exitPopUpData.semi_header_text !== null ? exitPopUpData.semi_header_text_color : null,
      body_background_color: exitPopUpData.body_background_color,
      cta_link_url: exitPopUpData.cta_link_url,
      btn_color: exitPopUpData.btn_color,
      btn_text_color: exitPopUpData.btn_text_color,
      btn_size: exitPopUpData.btn_size,
      btn_text: exitPopUpData.btn_text
    });
    // assign sticky reviews data
    const instance = this;
    if (exitPopUpData.sticky_reviews !== null) {
      exitPopUpData.sticky_reviews.filter(function (elem, index) {
        instance.preSelectedStickyReviews.push(elem.id);
      });
    }
    this.preSelectedCampaign = exitPopUpData.campaign_id;
  }
}
