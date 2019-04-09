import { Component, OnInit } from '@angular/core';

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
    private loaderService: LoaderService
  ) { }
  

  getAllReviewLinks(){
    this.loaderService.enableLoader()
    this.reviewLinkService.getAllReviewLinks().subscribe(
      (data: any)=> {
        this.loaderService.disableLoader()
        if (data.data.length){
          this.reviews = data.data
        } else {
          this.reviews = []
        }
    })
  }
  ngOnInit() {
    this.getAllReviewLinks();
  }

}
