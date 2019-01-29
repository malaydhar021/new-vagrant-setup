import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs';

import { Constants } from '../constants';

import { CampaignList } from '../models/CampaignList';
import { ReviewLink } from '../models/ReviewLink';

import { ReviewlinkserviceService } from '../reviewlinkservice.service';
import { CampaignServiceService } from '../campaign-service.service';

import { CustomValidator} from '../validator/customValidator';
import { ImageValidationService } from '../validator/image-validation.service';

@Component({
  selector: 'app-review-link',
  templateUrl: './review-link.component.html',
  styleUrls: ['./review-link.component.css']
})
export class ReviewLinkComponent implements OnInit, OnDestroy {

  constructor(
    private reviewLinkService: ReviewlinkserviceService,
    private camService: CampaignServiceService,
    private fb: FormBuilder,
    private router: Router,
    private imageValidatior: ImageValidationService
  ) {
    this.navigationSubscription = this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.init();
      }
    });
  }

  errFlg: boolean;
  errString: string;
  allReviewLinksResp: Observable<any>;
  myReviewLinks: ReviewLink[];
  p: number;
  paginate: number;
  term: string;
  getAllCampaignResp: Observable<any>;
  allCampaigns: CampaignList[];
  myCampaigns: any;
  newArray: any;
  campaignArr: any;
  saveReviewLinkForm: FormGroup;
  ratingInput: number;
  savingData: boolean;
  checkDuplicacyOrBlankBool: boolean;
  urlSlugDuplicacyResp: Observable<any>;
  addReviewLink: boolean;
  saveReviewLinkDB: Observable<any>;
  myDomain: string;
  auto_approve_value: any;
  formData: FormData;
  logoImage: File;
  imageBaseURLResp: Observable<any>;
  imageBaseURL: string;
  deleteReviewLinkResp: Observable<any>;
  isEdit: boolean;
  previewImageLink: string;
  idToUpdate: any;
  isInvalidImage: boolean;
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
    this.getAllReviewlinks();
    this.p = 1;
    this.paginate = Constants.paginateCampaignRecordPerPage;
    this.getAllCampaigns();
    this.myCampaigns = [];
    this.newArray = [];
    this.campaignArr = [];
    this.createAddReviewLinkForm();
    this.savingData = false;
    this.checkDuplicacyOrBlankBool = false;
    this.addReviewLink = false;
    this.myDomain = window.location.origin;
    this.isEdit = false;
    this.isInvalidImage = false;
    this.term = '';
  }

  /**
   * this function gets all the records of generated review links from backend
   */
  getAllReviewlinks() {
    this.allReviewLinksResp = this.reviewLinkService.fetchAllReviewLinks();
    this.allReviewLinksResp.subscribe(
      data => {
        if (data.status) {
            this.getBucketURL();
            this.myReviewLinks = data.response;
        } else {
          this.errFlg = true;
          this.errString = 'Something went wrong. Please try again later!';
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
   * get all the campaigns to show in the table under campaign column
   */
  getAllCampaigns() {
    this.getAllCampaignResp = this.camService.getAllCampaigns();
    this.getAllCampaignResp.subscribe(data => {
      if (data.status) {
        this.allCampaigns = data.response;
      } else {
        this.errFlg = true;
        this.errString = 'Something went wrong. Please try again later!';
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

  /**
   * this function closes the error div
   */
  closeDiv(): void {
    this.errFlg = false;
    this.errString = null;
  }

  /**
   * create the reactive form for adding review link
   */
  createAddReviewLinkForm() {
    this.saveReviewLinkForm = this.fb.group({
      myLogo: ['', [Validators.required, CustomValidator.imageValidate]],
      name: ['', Validators.required],
      description: ['', Validators.required],
      url_slug: [Math.random().toString(36).substr(2, 9), Validators.required],
      campaign_id: [''],
      auto_approve: [''],
      min_rating: [''],
      negative_info_review_msg_1: ['', Validators.required],
      negative_info_review_msg_2: ['', Validators.required],
      positive_review_msg: ['', Validators.required]
    });
  }

  /**
   * this function saves the record in database
   */
  onSubmit() {
    if (this.saveReviewLinkForm.valid) {
      this.savingData = true;
      this.saveReviewLinkForm.value.created_by = JSON.parse(localStorage.getItem('_cu')).id;
      // console.log(this.saveReviewLinkForm.value);
      this.formData = new FormData();
      if (this.isEdit) {
        if (this.saveReviewLinkForm.value.myLogo !== null) {
          if (this.saveReviewLinkForm.value.myLogo.length !== 0) {
            this.formData.append('myLogo', this.logoImage, this.logoImage.name);
          }
        }
      } else {
        this.formData.append('myLogo', this.logoImage, this.logoImage.name);
      }
      this.formData.append('name', this.saveReviewLinkForm.value.name);
      this.formData.append('description', this.saveReviewLinkForm.value.description);
      this.formData.append('url_slug', this.saveReviewLinkForm.value.url_slug);
      if (this.saveReviewLinkForm.value.auto_approve !== undefined) {
        if (this.saveReviewLinkForm.value.auto_approve !== null) {
          if (this.auto_approve_value === 1) {
            this.formData.append('auto_approve', this.saveReviewLinkForm.value.auto_approve);
            this.formData.append('min_rating', this.saveReviewLinkForm.value.min_rating);
          } else {
            this.formData.append('auto_approve', this.saveReviewLinkForm.value.auto_approve);
          }
        }
      }
      this.formData.append('negative_info_review_msg_1', this.saveReviewLinkForm.value.negative_info_review_msg_1);
      this.formData.append('negative_info_review_msg_2', this.saveReviewLinkForm.value.negative_info_review_msg_2);
      this.formData.append('positive_review_msg', this.saveReviewLinkForm.value.positive_review_msg);
      this.formData.append('created_by', this.saveReviewLinkForm.value.created_by);
      if (this.saveReviewLinkForm.value.campaign_id !== undefined) {
        if (this.saveReviewLinkForm.value.campaign_id) {
          this.formData.append('campaign_id',  this.saveReviewLinkForm.value.campaign_id);
        }
      }
      if (this.isEdit) {
        this.formData.append('id', this.idToUpdate);
        this.saveReviewLinkDB = this.reviewLinkService.updateReviewLink(this.formData);
      } else {
        this.saveReviewLinkDB = this.reviewLinkService.saveReviewLink(this.formData);
      }
      this.saveReviewLinkDB.subscribe(data => {
        if (data.status) {
          this.savingData = false;
          this.getAllReviewlinks();
          this.getAllCampaigns();
          this.saveReviewLinkForm.reset();
          this.addReviewLink = false;
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
          this.errString = JSON.stringify(error.error.errors);
        }
      });
    } else {
      this.savingData = false;
      this.errFlg = true;
      this.errString = 'Please fill up the form correctly.';
    }
  }

  /**
   * checks for duplicate url slug
   * @param {string} url_slug
   */
  checkDuplicacy(url_slug: string): void {
    if (url_slug) {
      this.urlSlugDuplicacyResp = this.reviewLinkService.checkDuplicateURLSlug({url_slug: url_slug});
      this.urlSlugDuplicacyResp.subscribe(data => {
        if (!data.status) {
          this.checkDuplicacyOrBlankBool = true;
        } else {
          this.checkDuplicacyOrBlankBool = false;
        }
      }, error => {
        this.checkDuplicacyOrBlankBool = true;
        this.errFlg = true;
        if (error.hasOwnProperty('error')) {
          if (error.error.hasOwnProperty('response')) {
            this.errString = error.error.response;
          }
        }
      });
    } else {
      this.checkDuplicacyOrBlankBool = true;
    }
  }

  /**
   * this function handle image upload on change event on input type file in view
   * @param event
   */
  handleImageUpload(event) {
    const imageFile = event.target.files[0];
    if (this.imageValidatior.validateByMimeType(imageFile)) {
      this.logoImage = imageFile;
      this.isInvalidImage = false;
    } else {
      this.isInvalidImage = true;
    }
  }

  /**
   * this function shows the add review link form and toggles between it
   */
  showAddForm() {
    this.addReviewLink = !this.addReviewLink;
    this.saveReviewLinkForm = this.fb.group({
      myLogo: ['', [Validators.required, CustomValidator.imageValidate]],
      name: ['', Validators.required],
      description: ['', Validators.required],
      url_slug: [Math.random().toString(36).substr(2, 9), Validators.required],
      campaign_id: [''],
      auto_approve: [''],
      min_rating: [''],
      negative_info_review_msg_1: ['', Validators.required],
      negative_info_review_msg_2: ['', Validators.required],
      positive_review_msg: ['', Validators.required]
    });
  }

  /**
   * this function gets the image base url based on amazon s3 defined in backend
   */
  getBucketURL() {
    this.imageBaseURLResp = this.reviewLinkService.getAmazonBucketURL();
    this.imageBaseURLResp.subscribe(data => {
      if (data.status) {
        this.imageBaseURL = data.response;
      } else {
        this.errFlg = true;
        this.errString = 'Failed to get Amazon s3 Bucket URL. Please try in a  while, if images do not show';
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

  /**
   * this function deletes a review link
   * @param {ReviewLink} reviewLinkData
   */
  deleteReviewLink(reviewLinkData: ReviewLink) {
    const conf = confirm('Are you sure?');
    if (conf) {
      // console.log(reviewLinkData);
      this.deleteReviewLinkResp = this.reviewLinkService.deleteReviewLink({id: reviewLinkData.id});
      this.deleteReviewLinkResp.subscribe(data => {
        if (data.status) {
          this.getAllReviewlinks();
        } else {
          this.errFlg = true;
          this.errString = data.response;
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

  editReviewLink(reviewLinkData: ReviewLink) {
    // console.log(reviewLinkData);
    this.idToUpdate = reviewLinkData.id;
    // remove image validation so that while updating it should not show the save button as disabled
    this.saveReviewLinkForm.controls['myLogo'].clearValidators();
    this.saveReviewLinkForm.controls['myLogo'].updateValueAndValidity();
    this.addReviewLink = true;
    this.isEdit = true;
    this.previewImageLink = this.imageBaseURL + reviewLinkData.logo;
    this.auto_approve_value = reviewLinkData.auto_approve;
    this.saveReviewLinkForm.patchValue({
      name: reviewLinkData.name,
      url_slug: reviewLinkData.url_slug,
      description: reviewLinkData.description,
      min_rating: reviewLinkData.auto_approve === 1 ? reviewLinkData.min_rating : '',
      campaign_id: reviewLinkData.campaign !== null ? reviewLinkData.campaign.id : null,
      negative_info_review_msg_1: reviewLinkData.negative_info_review_msg_1,
      negative_info_review_msg_2: reviewLinkData.negative_info_review_msg_2,
      positive_review_msg: reviewLinkData.positive_review_msg
    });
  }
}
