import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BrandingServiceService} from '../branding-service.service';
import {Observable} from 'rxjs/Observable';
import {Brandings} from '../models/brandings';
import {Constants} from '../constants';
import {ActivatedRoute, Params, Router, NavigationEnd} from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-branding',
  templateUrl: './branding.component.html',
  styleUrls: ['./branding.component.css']
})
export class BrandingComponent implements OnInit, OnDestroy {

  constructor(
    private fb: FormBuilder,
    private bs: BrandingServiceService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.navigationSubscription = this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.init();
      }
    });
  }

  errFlg: boolean;
  errString: string;
  term: string;
  saveBrandingForm: FormGroup;
  addBranding: boolean;
  userDetails: string;
  signedUpUserId: number;
  saveBrandingResp: Observable<any>;
  savingData: boolean;
  allBrandingResp: Observable<any>;
  brandingArr: Brandings[];
  paginate: number;
  p: number;
  deleteBrandResp: Observable<any>;
  isEditForm: boolean;
  editableBrandId: number;
  isParameterized: boolean;
  paramValue: any;
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
    this.addBranding = false;
    this.savingData = false;
    this.userDetails = localStorage.getItem('_cu');
    if (JSON.parse(this.userDetails).hasOwnProperty('id')) {
      this.signedUpUserId = JSON.parse(this.userDetails).id;
    }
    this.createSaveBranding();
    this.getAllBrandings();
    this.paginate = Constants.paginateCampaignRecordPerPage;
    this.p = 1;
    this.isEditForm = false;
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params.id) {
        this.isParameterized = true;
        this.paramValue = Number(params.id);
      }
    });
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
   * create branding saving form
   * @returns {any}
   */
  createSaveBranding(): any {
    this.saveBrandingForm = this.fb.group({
      brand_name: ['', [Validators.required, Validators.maxLength(25)]],
      url: ['', [Validators.required, Validators.pattern('^(http|https):\/\/[^ "]+$')]],
      user_id: [this.signedUpUserId, Validators.required]
    });
  }

  /**
   * save branding data in database
   */
  onSubmit() {
    if (this.saveBrandingForm.valid) {
      this.savingData = true;
      if (this.isEditForm) {
        this.saveBrandingResp = this.bs.updateBranding(this.editableBrandId, this.saveBrandingForm.value);
      } else {
        this.saveBrandingResp = this.bs.saveBranding(this.saveBrandingForm.value);
      }
      this.saveBrandingResp.subscribe(
        data => {
          if (data.status) {
            this.savingData = false;
            this.getAllBrandings();
            if (!this.isEditForm) {
              this.saveBrandingForm.reset();
              this.createSaveBranding();
            }
          } else {
            this.savingData = false;
            this.errFlg = true;
            this.errString = 'Something went wrong. Please try again later!';
          }
        },
        error => {
          this.savingData = false;
          this.errFlg = true;
          if (error.hasOwnProperty('error')) {
            if (error.error.hasOwnProperty('response')) {
              this.errString = error.error.response;
            }
          }
        }
      );
    } else {
      this.savingData = false;
      this.errFlg = true;
      this.errString = 'Fill up the form properly';
    }
  }

  /**
   * get a list of the saved campaigns
   */
  getAllBrandings() {
    this.allBrandingResp = this.bs.getAllBranding();
    this.allBrandingResp.subscribe(data => {
      if (data.status) {
        this.brandingArr = data.response;
        if (this.isParameterized) {
          this.brandingArr.forEach(i => {
            if (i.id === this.paramValue) {
              this.brandingArr = this.brandingArr.filter(item => item.id === this.paramValue);
            }
          });
        }
      } else {
        this.errFlg = true;
        this.errString = 'Something went wrong while fetching brandings!';
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
   * this function deletes a branding from database
   * @param {number} id
   */
  deleteBranding(id: number) {
    const sure = confirm('Are you sure ?');
    if (sure) {
      this.deleteBrandResp = this.bs.deleteBrand(id);
      this.deleteBrandResp.subscribe(
        data => {
          if (data.status) {
            this.getAllBrandings();
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
  }

  /**
   * this function set the params for editing and edits the branding
   * @param {Brandings} data
   */
  editBranding(data: Brandings) {
    this.addBranding = true;
    this.isEditForm = true;
    this.editableBrandId = data.id;
    this.saveBrandingForm.patchValue({
      brand_name: data.brand_name,
      url: data.url
    });
    window.scrollTo(0, 0);
  }

  /**
   * show the edit or add branding form
   */
  showAddBranding(): void {
    this.addBranding = !this.addBranding;
    this.isEditForm = false;
    this.saveBrandingForm = this.fb.group({
      brand_name: ['', Validators.required],
      url: ['', Validators.required],
      user_id: [this.signedUpUserId, Validators.required]
    });
  }
}
