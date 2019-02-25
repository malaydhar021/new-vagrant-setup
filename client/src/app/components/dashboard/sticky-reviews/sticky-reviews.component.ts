import { Component, OnInit } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-sticky-reviews',
  templateUrl: './sticky-reviews.component.html',
  styleUrls: ['./sticky-reviews.component.scss']
})
export class StickyReviewsComponent implements OnInit {
    rate:number = 5;
    constructor(public ngxSmartModalService: NgxSmartModalService) { }

    ngAfterViewInit() {
      // const obj: Object = {
      //   prop1: 'test',
      //   prop2: true,
      //   prop3: [{a: 'a', b: 'b'}, {c: 'c', d: 'd'}],
      //   prop4: 327652175423
      // };

      // this.ngxSmartModalService.setModalData(obj, 'myModal');
  }

  ngOnInit() {
  }

}
