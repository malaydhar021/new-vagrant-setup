import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-step-two',
  templateUrl: './step-two.component.html',
  styleUrls: ['./step-two.component.css']
})
export class StepTwoComponent implements OnInit {
  @Input() reviewLinkData: any;
  @Input() imageBaseURL: string;
  @Input() stepOneQuesAns: any;
  @Output() stepTwoAns: EventEmitter<any> = new EventEmitter();
  constructor(private fb: FormBuilder) { }
  saveStepTwoDetailsForm: FormGroup;
  myDefinedRating: any;
  savingData: boolean;
  errFlg: boolean;
  errString: string;
  ngOnInit() {
    this.createStepTwoForm();
    if (this.reviewLinkData.auto_approve === 1) {
      this.myDefinedRating = this.reviewLinkData.min_rating;
    } else {
      this.myDefinedRating = 0;
    }
    this.savingData = false;
  }

  /**
   * creting the reactive form for step two
   */
  createStepTwoForm() {
    this.saveStepTwoDetailsForm = this.fb.group({
      review_title: ['', [Validators.required, Validators.maxLength(25)]],
      description: ['', [Validators.required, Validators.maxLength(80)]],
      rating: [this.myDefinedRating]
    });
  }

  /**
   * submit the step two form and emits event to load third step
   */
  onSubmit() {
    if (this.saveStepTwoDetailsForm.valid) {
      this.saveStepTwoDetailsForm.value.rating = this.myDefinedRating;
      this.stepTwoAns.emit(this.saveStepTwoDetailsForm.value);
      // if (this.stepOneQuesAns) {
      //   if (this.reviewLinkData.min_rating <= this.myDefinedRating) {
      //     this.saveStepTwoDetailsForm.value.rating = this.myDefinedRating;
      //     this.stepTwoAns.emit(this.saveStepTwoDetailsForm.value);
      //   } else {
      //     this.errFlg = true;
      //     this.errString = 'Minimum rating should be more than or equals to ' + this.reviewLinkData.min_rating;
      //     alert(this.errString);
      //   }
      // } else {
      //   this.saveStepTwoDetailsForm.value.rating = this.myDefinedRating;
      //   this.stepTwoAns.emit(this.saveStepTwoDetailsForm.value);
      // }
    } else {
      this.errFlg = true;
      this.errString = 'Please fill up the form correctly!';
    }
  }
}
