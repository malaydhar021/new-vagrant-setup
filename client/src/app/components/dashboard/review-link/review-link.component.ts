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
   */
  createReviewLinkForm() {
    this.reviewLinkForm = this.fornBuilder.group({
      id: [null],
      myLogo: ['', [Validators.required]],
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

  onAddReviewLink(){

  }

  onSubmit(){
    console.log("jahsgd")
  }
}
