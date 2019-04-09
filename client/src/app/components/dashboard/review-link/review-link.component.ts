import { Component, OnInit } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';


import { ReviewLinkService } from '../../../services/review-link.service';
import { ReviewLinkModel } from '../../../models/review-link.model';
import { Log } from '../../../helpers/app.helper';
import {LoaderService} from '../../../services/loader.service';

@Component({
  selector: 'app-review-link',
  templateUrl: './review-link.component.html',
  styleUrls: ['./review-link.component.scss']
})
export class ReviewLinkComponent implements OnInit {

  reviews:Array<ReviewLinkModel> = []

  constructor(
    private reviewLinkService : ReviewLinkService,
    private loaderService: LoaderService,
    public ngxSmartModalService: NgxSmartModalService
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

          this.reviews = response.data

        } else {

          this.reviews = []
        }
      },
      (error: any) => {
        // disabled the loader when axaj is over with success
        this.loaderService.disableLoader()
        // Log the error message
        Log.error(error, error.message);
        // Reset the reviews array
        this.reviews = []
      }
    )
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
  }

  onAddReviewLink(){

  }

}
