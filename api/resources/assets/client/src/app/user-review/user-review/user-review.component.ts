import { Component, OnInit } from '@angular/core';
import {ActivatedRoute , Params } from '@angular/router';
import { UserReviewService } from '../services/user-review.service';
import {Observable} from 'rxjs/Observable';
import {ReviewLinkSingle} from '../models/reviewLinkSingle';

@Component({
  selector: 'app-user-review',
  templateUrl: './user-review.component.html',
  styleUrls: ['./user-review.component.css']
})
export class UserReviewComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private urService: UserReviewService) { }
  myReviewLinkId: string;
  stepOneFlg: boolean;
  stepTwoFlg: boolean;
  stepThreeFlg: boolean;
  stepOneQuesAnswer: boolean;
  userReviewLinkResp: Observable<any>;
  errFlg: boolean;
  errString: string;
  reviewLinkData: ReviewLinkSingle;
  stepTwoQuesAnswer: any;
  stepThreeQuesAns: any;
  thankyouFlg: boolean;
  upldImgFlg: boolean;
  imageBaseURL: string;
  imageBaseURLResp: Observable<any>;
  stickyReviewImage: any;
  storeUserReview: Observable<any>;
  formData: FormData;

  ngOnInit() {
    this.getUrlParam();
    this.stepOneFlg = false;
    this.stepTwoFlg = false;
    this.stepThreeFlg = false;
    this.stepOneQuesAnswer = false;
    this.errFlg = false;
    this.errString = null;
    this.thankyouFlg = false;
    this.upldImgFlg = false;
    this.getBucketURL();
  }

  /**
   * fetch the param from URL
   */
  getUrlParam(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params.id) {
        this.myReviewLinkId = params.id;
        this.getReviewLinkData();
      }
    });
  }

  /**
   * fetch review link data created by admin
   */
  getReviewLinkData(): void {
    this.userReviewLinkResp = this.urService.getReviewLinkData(this.myReviewLinkId);
    this.userReviewLinkResp.subscribe(data => {
      if (data.status) {
        this.reviewLinkData = data.response;
        this.stepOneFlg = true;
      } else {
        this.errFlg = true;
        this.errString = 'Something went wrong, please try in a while!';
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
   * ans of step one through event emitter
   * @param $event
   */
  stepOneAns($event): void {
    this.stepOneQuesAnswer = $event;
    this.stepOneFlg = false;
    this.stepTwoFlg = true;
  }

  /**
   * ans of step two through event emitter
   * @param $event
   */
  stepTwoAns($event): void {
    this.stepTwoQuesAnswer = $event;
    this.stepTwoFlg = false;
    this.stepThreeFlg = true;
  }

  /**
   * ans of step three throgh event emitter
   * @param $event
   */
  stepThreeAns($event): void {
    this.stepThreeQuesAns = $event;
    this.stepThreeFlg = false;
    if (this.stepOneQuesAnswer && typeof this.stepThreeQuesAns === 'boolean' && this.stepThreeQuesAns) {
      this.upldImgFlg = true;
    } else if (this.stepOneQuesAnswer && typeof this.stepThreeQuesAns === 'boolean' && !this.stepThreeQuesAns) {
      if (this.saveAllStepsRecords(this.stepOneQuesAnswer, this.stepTwoQuesAnswer, this.stepThreeQuesAns)) {
        this.thankyouFlg = true;
      } else {
        this.errFlg = true;
        this.errString = 'Something went wrong while saving the data in. Please try again later!';
      }
    } else {
      if (this.saveAllStepsRecords(this.stepOneQuesAnswer, this.stepTwoQuesAnswer, this.stepThreeQuesAns)) {
        this.thankyouFlg = true;
      } else {
        this.errFlg = true;
        this.errString = 'Something went wrong while saving the data in. Please try again later!';
      }
    }
  }

  upldImgAns($event): void {
    console.log($event);
    if ($event) {
      this.stickyReviewImage = $event.target.files[0];
    } else {
      this.stickyReviewImage = '';
    }
    if (this.saveAllStepsRecords(this.stepOneQuesAnswer, this.stepTwoQuesAnswer, this.stepThreeQuesAns, this.stickyReviewImage)) {
      this.upldImgFlg = false;
      this.thankyouFlg = true;
    } else {
      this.errFlg = true;
      this.errString = 'Something went wrong while saving the data in. Please try again later!';
    }
  }
  /**
   * this function gets the image base url based on amazon s3 defined in backend
   */
  getBucketURL() {
    this.imageBaseURLResp = this.urService.getAmazonBucketURL();
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
   * saves the review at the end to database
   * @param stepOneData
   * @param stepTwoData
   * @param stepThreeData
   * @param {File} imageData
   * @returns {boolean}
   */
  saveAllStepsRecords(stepOneData: any, stepTwoData: any, stepThreeData: any, imageData?: File): boolean {
    this.formData = new FormData();
    this.formData.append('step1', stepOneData);
    this.formData.append('step2', JSON.stringify(stepTwoData));
    if (localStorage.getItem('_cu')) {
      const user = JSON.parse(localStorage.getItem('_cu'));
      if (user.hasOwnProperty('id')) {
        this.formData.append('created_by', user.id);
      }
    }
    this.formData.append('review_link_id', this.myReviewLinkId);
    if (imageData) {
       if (!stepOneData) {
         // if recommend us is no then step three is json else boolean
         this.formData.append('step3', stepThreeData);
       } else {
         this.formData.append('step3', JSON.stringify(stepThreeData));
       }
       if (imageData) {
         this.formData.append('imageData', imageData, imageData.name);
       } else {
         this.formData.append('imageData', '');
       }
    } else {
      if (!stepOneData) {
        // if recommend us is no then step three is json else boolean
        this.formData.append('step3', JSON.stringify(stepThreeData));
      } else {
        this.formData.append('step3', stepThreeData);
      }
    }
    this.storeUserReview = this.urService.saveUserReview(this.formData);
    this.storeUserReview.subscribe(data => {
        console.log(data.response);
    }, error => {
      this.errFlg = true;
      if (error.hasOwnProperty('error')) {
        if (error.error.hasOwnProperty('response')) {
          this.errString = error.error.response;
        }
      }
      console.log(this.errString);
    });
    return true;
  }
}
