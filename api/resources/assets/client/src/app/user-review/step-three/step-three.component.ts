import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-step-three',
  templateUrl: './step-three.component.html',
  styleUrls: ['./step-three.component.css']
})
export class StepThreeComponent implements OnInit {
  @Input() reviewLinkData: any;
  @Input() imageBaseURL: string;
  @Input() stepOneQuesAns: boolean;
  @Output() stepThreeAns: EventEmitter<any> = new EventEmitter();
  constructor(private fb: FormBuilder) { }
  saveStepThreeDetailsForm: FormGroup;
  savingData: boolean;
  errFlg: boolean;
  errString: string;
  ngOnInit() {
    this.createStepThreeFrom();
    this.savingData = false;
    this.errFlg = false;
    this.errString =  null;
  }

  /**
   * if user says yes in step one then they pop up with can we use this in website, the answer of that question shows up here
   * @param {boolean} param
   */
  useReview(param: boolean): void {
    this.stepThreeAns.emit(param);
  }

  /**
   * create the reactive form for taking user details who gave a negative review
   */
  createStepThreeFrom() {
    this.saveStepThreeDetailsForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      phone_number: ['']
    });
  }
  onSubmit() {
    if (this.saveStepThreeDetailsForm.valid) {
      this.stepThreeAns.emit(this.saveStepThreeDetailsForm.value);
    } else {
      this.errFlg = true;
      this.errString = 'Please fill up the form correctly!';
    }
  }
}
