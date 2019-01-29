import { Component, OnInit, TemplateRef, OnDestroy } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CampaignServiceService } from '../campaign-service.service';
import { StickyReviewsService } from '../sticky-reviews.service';
import { StickyReviewsList } from '../models/StickyReviewsList';
import { Observable } from 'rxjs/Observable';
import { Constants } from '../constants';
import { CustomValidator } from '../validator/customValidator';
import { User } from '../models/user';
import { ImageValidationService } from '../validator/image-validation.service';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sticky-reviews',
  templateUrl: './sticky-reviews.component.html',
  styleUrls: ['./sticky-reviews.component.css']
})
export class StickyReviewsComponent implements OnInit, OnDestroy {

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private camService: CampaignServiceService,
    private stickyService: StickyReviewsService,
    private imageValidatior: ImageValidationService,
    private router: Router
  ) {
    this.navigationSubscription = this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.init();
      }
    });
  }

  saveStickyReviewsForm: FormGroup;
  modalRef: BsModalRef;
  token: string;
  errFlg: boolean;
  errString: string;
  saveStickyReviewsResp: any;
  stickyImage: File;
  stickyReviewsListResp: Observable<any>;
  stickyReviewRespArr: StickyReviewsList[];
  paginate: number;
  searchStickyReview: string;
  p: number;
  addStickyReviews: boolean;
  savingData: boolean;
  usrObj: User;
  formData: FormData;
  imageBaseURLResp: Observable<any>;
  imageBaseURL: string;
  deleteStickyReviewResp: Observable<any>;
  isEdit: boolean;
  previewImageLink: string;
  stickyReviewDbID: any;
  rate: any;
  minStartDate: any;
  startMoment: any;
  globalClickable: number;
  newRecord: boolean;
  isInvalidImage: boolean;
  navigationSubscription: Subscription;
  activeTabNumber: number;

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
       this.navigationSubscription.unsubscribe();
    }
  }

  init() {
    this.p = 1;
    this.errFlg = false;
    this.errString = null;
    this.token = localStorage.getItem('_tok');
    this.usrObj = JSON.parse(localStorage.getItem('_cu'));
    this.paginate = Constants.paginateCampaignRecordPerPage;
    this.createSaveStickyReviews();
    this.addStickyReviews = false;
    this.savingData = false;
    this.getStickyReviewsList(1);
    this.isEdit = false;
    this.minStartDate = new Date();
    this.startMoment = new Date(
                        this.minStartDate.getFullYear(),
                        this.minStartDate.getMonth(),
                        this.minStartDate.getDate()
                      );
    this.newRecord = false;
    this.isInvalidImage = false;
    this.activeTabNumber = 1;
    this.searchStickyReview = '';
  }

  /**
   * this function set up form for saving sticky reviews
   */
  createSaveStickyReviews() {
    this.saveStickyReviewsForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(25)]],
      tags: [''],
      description: ['', [Validators.required, Validators.maxLength(80)]],
      image: ['', [Validators.required, CustomValidator.imageValidate]],
      selectDtTime: ['']
    });
  }

  /**
   * this function toggles showing sticky reviews form
   */
  showAddStickyReviews() {
    this.isEdit = false;
    if (!this.isEdit) {
      this.setImageValidator();
    }
    this.addStickyReviews = !this.addStickyReviews;
    this.saveStickyReviewsForm = this.fb.group({
      name: ['', Validators.required],
      tags: [''],
      description: ['', Validators.required],
      image: ['', [Validators.required, CustomValidator.imageValidate]],
      selectDtTime: ['']
    });
    window.scrollTo(0, 0);
  }

  /**
   * this function saves sticky review in database
   */
  onSubmit() {
    if (this.saveStickyReviewsForm.valid) {
      this.savingData = true;
      if (this.isEdit) {
        const formDataEdit = new FormData();
        formDataEdit.append('id', this.stickyReviewDbID);
        formDataEdit.append('name', this.saveStickyReviewsForm.value.name);
        formDataEdit.append('description', this.saveStickyReviewsForm.value.description);
        formDataEdit.append('rating', this.rate);
        if (this.saveStickyReviewsForm.value.tags !== null) {
          formDataEdit.append('tags', this.saveStickyReviewsForm.value.tags);
        }
        if (this.saveStickyReviewsForm.value.image !== null) {
          if (this.saveStickyReviewsForm.value.image.length > 0) {
            formDataEdit.append('image', this.stickyImage, this.stickyImage.name);
          }
        }
        formDataEdit.append('myDateString', this.saveStickyReviewsForm.value.selectDtTime);
        this.saveStickyReviewsResp = this.stickyService.updateStickyReview(formDataEdit);
      } else {
        this.formData = new FormData();
        this.formData.append('created_by', this.usrObj.id);
        this.formData.append('name', this.saveStickyReviewsForm.value.name);
        this.formData.append('description', this.saveStickyReviewsForm.value.description);
        this.formData.append('image', this.stickyImage, this.stickyImage.name);
        this.formData.append('rating', this.rate);
        this.formData.append('myDateString', this.saveStickyReviewsForm.value.selectDtTime);
        if (this.saveStickyReviewsForm.value.tags !== null) {
          this.formData.append('tags', this.saveStickyReviewsForm.value.tags);
        }
        this.saveStickyReviewsResp = this.stickyService.saveStickyReviews(this.formData);
      }
      this.saveStickyReviewsResp.subscribe(data => {
        this.savingData = false;
        if (data.status) {
          this.isEdit = false;
          this.getStickyReviewsList(this.globalClickable);
          this.saveStickyReviewsForm.reset();
          this.setImageValidator();
        } else {
          this.errFlg = true;
          this.errString = 'Something went wrong while saving your data, Please try in a while!';
        }
      }, err => {
        this.savingData = false;
        this.errFlg = true;
        if (err.error.exception === 'InvalidArgumentException') {
          this.errString = 'Failed to connect with Amazon s3 bucket. Please try in a while after refreshing the page!';
        } else {
          this.errString = err.error.response;
        }
      });
    } else {
      this.savingData = false;
      this.errFlg = true;
      this.errString = 'Please fill up the form correctly.';
    }
  }

  /**
   * this function opens up add sticky notes modal
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
   * this function handle image upload on change event on input type file in view
   * @param event
   */
  handleImageUpload(event) {
    const imageFile = event.target.files[0];
    if (this.imageValidatior.validateByMimeType(imageFile)) {
      this.stickyImage = imageFile;
      this.isInvalidImage = false;
    } else {
      this.isInvalidImage = true;
    }
  }

  /**
   * generate the list of sticky reviews in table
   */
  getStickyReviewsList(clickable_tabs?: number): void {
    this.globalClickable = clickable_tabs;
    if (this.token.length) {
      this.stickyReviewsListResp = this.stickyService.getAllStickReviews(this.globalClickable);
      this.stickyReviewsListResp.subscribe(
        data => {
          if (data.status) {
            this.getBucketURL();
            this.stickyReviewRespArr = data.response;
            this.activeTabNumber = clickable_tabs;
          } else {
            this.errFlg = true;
            this.errString = 'Something went wrong. Please try again after some time.';
          }
        }, err => {
          this.errFlg = true;
          this.errString = err.error.response;
        }
      );
    } else {
      this.errFlg = true;
      this.errString = 'Please login again to continue session expired!';
    }
  }

  /**
   * this function gets the image base url based on amazon s3 defined in backend
   */
  getBucketURL() {
    this.imageBaseURLResp = this.stickyService.getAmazonBucketURL();
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
   * this function soft deletes sticky review in database
   * @param {number} id
   */
  deleteStickyReview(id: number): void {
    if (id.toString().length) {
        const isConfirm = confirm('Are you sure?');
        if (isConfirm) {
          this.deleteStickyReviewResp = this.stickyService.deleteStickyReview(id);
          this.deleteStickyReviewResp.subscribe(data => {
            if (data.status) {
              this.getStickyReviewsList(this.globalClickable);
            }
          }, err => {
            this.errFlg = true;
            this.errString = err.error.response;
          });
        }
    } else {
      this.errFlg = true;
      this.errString = 'Unable to process request, Hint: No id found';
    }
  }

  /**
   * this function sets sticky review for edit
   * @param {StickyReviewsList} stickyReview
   */
  editStickyReview(stickyReview: StickyReviewsList): void {
    const created_at_dt = new Date(stickyReview.created_at);
    this.stickyReviewDbID =  stickyReview.id;
    this.addStickyReviews = true;
    this.isEdit = true;
    this.previewImageLink = this.imageBaseURL + stickyReview.image;
    this.saveStickyReviewsForm.patchValue({
      name: stickyReview.name,
      description: stickyReview.description,
      selectDtTime: new Date(
        created_at_dt.getFullYear(),
        created_at_dt.getMonth(),
        created_at_dt.getDate(),
        created_at_dt.getHours(),
        created_at_dt.getMinutes(),
        created_at_dt.getMinutes()
      ),
      tags: stickyReview.tags
    });
    this.rate = stickyReview.rating;
    this.clearImageValidator();
    window.scrollTo(0, 0);
  }

  /**
   * remove the validation from image field of the form
   * ie. for edit we might not need image
   */
  clearImageValidator(): void {
    this.saveStickyReviewsForm.controls['image'].clearValidators();
    this.saveStickyReviewsForm.controls['image'].updateValueAndValidity();
  }

  /**
   * set the validation back again in image
   */
  setImageValidator(): void {
    this.saveStickyReviewsForm.controls['image'].setValidators([Validators.required, CustomValidator.imageValidate]);
    this.saveStickyReviewsForm.controls['image'].updateValueAndValidity();
  }
}
