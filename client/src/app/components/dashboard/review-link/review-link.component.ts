import { Component, OnInit } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ReviewLinkService } from '../../../services/review-link.service';
import { ReviewLinkModel } from '../../../models/review-link.model';
import { Log } from '../../../helpers/app.helper';
import {LoaderService} from '../../../services/loader.service';

/**
 * ReviewLinkComponent is responsible for showing, adding, updating and deleting review links
 * @class ReviewLinkComponent
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@Component({
  selector: 'app-review-link',
  templateUrl: './review-link.component.html',
  styleUrls: ['./review-link.component.scss']
})
export class ReviewLinkComponent implements OnInit {

  reviewLinks:Array<ReviewLinkModel> = [] // An array of review links
  reviewLinkForm: FormGroup;

  /**
   * Constructor to inject required service. It also subscribe to a observable which emits the current
   * value of defined variable. 
   * @constructor constructor
   * @since Version 1.0.0
   * @param ngxSmartModalService
   * @param loaderService 
   * @param reviewLinkService
   * @returns Void
   */
  constructor(
    private reviewLinkService : ReviewLinkService,
    private loaderService: LoaderService,
    public ngxSmartModalService: NgxSmartModalService,
    private fornBuilder: FormBuilder
  ) { }
  
  /**
   * Method to get all reviews links from api end point
   * @method getAllReviewLinks
   * @since Version 1.0.0
   * @returns Void
   */
  getAllReviewLinks() {
    // Enable the loader for an ajax call
    this.loaderService.enableLoader()
    // Service to to get all the Review Links
    this.reviewLinkService.getAllReviewLinks().subscribe(
      (response: any) => {
        // disabled the loader when axaj is over with success
        this.loaderService.disableLoader()
        if (response.data.length) {

          this.reviewLinks = response.data

        } else {

          this.reviewLinks = []
        }
      },
      (error: any) => {
        // disabled the loader when axaj is over with success
        this.loaderService.disableLoader()
        // Log the error message
        Log.error(error, error.message);
        // Reset the reviews array
        this.reviewLinks = []
      }
    )
  }


  /**
   * create the reactive form for adding review link
   * @method createReviewLinkForm
   * @since Version 1.0.0
   * @returns Void
   */
  createReviewLinkForm() {
    this.reviewLinkForm = this.fornBuilder.group({
      id: [null],
      myLogo: [''],
      name: ['', Validators.required],
      description: ['', Validators.required],
      url_slug: [Math.random().toString(36).substr(2, 9), Validators.required],
      campaign_id: [''],
      auto_approve: [0],
      min_rating: [''],
      negative_info_review_msg_1: ['', Validators.required],
      negative_info_review_msg_2: ['', Validators.required],
      positive_review_msg: ['', Validators.required]
    });
  }

  

   /**
   * ngOnInit method initialize angular reactive form object for add / edit form of a brand. 
   * Also it set the title of the page. Also it defines client side validations.
   * @method ngOnInit
   * @since Version 1.0.0
   * @returns Void
   */
  ngOnInit() {
    // Initialy Load all the review links
    this.getAllReviewLinks();

    this.createReviewLinkForm();
  }

  /**
   * openModelWithAddOrEdit method to handle the model popup for add or edit the review link
   * @method openModelWithAddOrEdit
   * @param action 
   * @param data 
   * @since Version 1.0.0
   * @returns Void
   */
  openModelWithAddOrEdit(action: string, data: any){
    this.ngxSmartModalService.getModal('modal1').open();
    if (action === 'add'){
      this.createReviewLinkForm();
    }

    if (action === 'edit') {
      Log.info("In Edit", data)
      this.reviewLinkForm.patchValue({
        'id': data.id,
        'name': data.name,
        'description': data.description,
        'url_slug': data.url_slug,
        'campaign_id': data.campaign_id,
        'auto_approve': data.auto_approve,
        'min_rating': data.min_rating,
        'negative_info_review_msg_1': data.negative_info_review_msg_1,
        'negative_info_review_msg_2': data.negative_info_review_msg_2,
        'positive_review_msg': data.positive_review_msg
      });
    }
  }
  
  
  /**
   * onSubmit method to handle submit button from Modal popup for add or edit the review link
   * @method onSubmit
   * @since Version 1.0.0
   * @returns Void
   */
  onSubmit(){
    let id = this.reviewLinkForm.get('id').value;
    if (id){
      this.update(this.reviewLinkForm.value);
    } else {
      this.create(this.reviewLinkForm.value);
    }

  }

  update(data: ReviewLinkModel){
    Log.info(data, "Update Review link")
  }

  create(data: ReviewLinkModel){
    Log.info(data, "Create Review Link");
  }

  delete(id: string){
    Log.info(id, "Delete Review Link")
  }

  checkUrlSlug(slug: string){
    
  }
}
