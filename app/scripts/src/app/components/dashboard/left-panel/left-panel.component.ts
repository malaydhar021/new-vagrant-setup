import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.scss']
})
export class LeftPanelComponent implements OnInit {
  allRoute : any = {}
  constructor() {
    this.allRoute = {
      'home' : ['/dashboard/home'],
      'branding' : ['/dashboard/branding'],
      'campaign' : ['/dashboard/campaign'],
      'sticky-reviews' : ['/dashboard/sticky-reviews'],
      'review-link' : ['/dashboard/review-link'],
      'exit-popup' : ['/dashboard/exit-popup']
    }

   }

  ngOnInit() {
  }

}
