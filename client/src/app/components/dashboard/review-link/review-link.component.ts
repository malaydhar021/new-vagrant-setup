import { Component, OnInit } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';


@Component({
  selector: 'app-review-link',
  templateUrl: './review-link.component.html',
  styleUrls: ['./review-link.component.scss']
})
export class ReviewLinkComponent implements OnInit {

  constructor(public ngxSmartModalService: NgxSmartModalService) { }

  ngOnInit() {
  }

  onAddReviewLink(){

  }

}
