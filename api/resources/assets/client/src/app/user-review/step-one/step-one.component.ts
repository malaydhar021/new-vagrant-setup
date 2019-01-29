import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UserReviewService} from '../services/user-review.service';

@Component({
  selector: 'app-step-one',
  templateUrl: './step-one.component.html',
  styleUrls: ['./step-one.component.css']
})
export class StepOneComponent implements OnInit {
  @Input() reviewLinkData: any;
  @Output() stepOneAns: EventEmitter<any> = new EventEmitter();
  @Input() imageBaseURL: string;
  errFlg: boolean;
  errString: string;
  constructor(private urService: UserReviewService) { }

  ngOnInit() {
    this.errFlg = false;
    this.errString = null;
  }

  recommendUs(qans: boolean): void {
    this.stepOneAns.emit(qans);
  }
}
