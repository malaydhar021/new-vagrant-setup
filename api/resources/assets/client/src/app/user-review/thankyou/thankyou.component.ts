import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-thankyou',
  templateUrl: './thankyou.component.html',
  styleUrls: ['./thankyou.component.css']
})
export class ThankyouComponent implements OnInit {
  @Input() stepOneData: boolean;
  @Input() reviewLinkData: any;
  @Input() imageBaseURL: string;
  constructor() { }

  ngOnInit() {
    // console.log(this.stepOneData);
  }

}
