import { Component, OnInit } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ErrorsService } from '../../../services/errors.service';
import { LoaderService } from '../../../services/loader.service';
import { ExitPopupModel } from '../../../models/exit-popup.model';
import { Log } from '../../../helpers/app.helper';
import { ExitPopupService } from '../../../services/exit-popup.service';

@Component({
  selector: 'app-exit-popup',
  templateUrl: './exit-popup.component.html',
  styleUrls: ['./exit-popup.component.scss']
})
export class ExitPopupComponent implements OnInit {

  isSubmitted: boolean = false; // flag to set true if the add / edit form is submitted
  form: FormGroup; // for add or edit brand form in modal
  subscription: Subscription; // to get the current value updated from error interceptor
  errorMessage: string = null;

  // selectedColor: string = 'color1';
  color1: string = '#2889e9';
  color2: string = '#e920e9';
  color3: string = '#fff500';
  color4: string = '#c77ff1';
  color5: string = '#e93e20';
  color6: string = '#1973c0';

  visualStyles: [] = []; // holds all brands as an array


  constructor(
      public ngxSmartModalService: NgxSmartModalService,
      public title: Title,
      private formBuilder: FormBuilder,
      private errorService: ErrorsService,
      private loaderService: LoaderService,
      private exitPopupService: ExitPopupService) { }


  ngOnInit() {
    this.title.setTitle('Stickyreviews :: Exit pop-up(s)');
    this.form = this.formBuilder.group({
      exitPopUpName : [null, Validators.required], // exitPopUpName name
      headerTextColor : [null],
      headerBackgroundColor : [null],
      buttonTextColor : [null],
      buttonBackgroundColor : [null],
      paragraphTextColor : [null],
      bodyBackgroundColor : [null],
      exitPopupVisualStyles : [null, Validators.required],
    });
    this.getVisualStyles();
  }

  public get getFormControls() {
    return this.form.controls;
  }


  public onSubmit() {
    console.log(' some thing will happen ... ');
    this.isSubmitted = true;
    // check if the form does not pass the client side validation
    if(this.form.invalid) {
      return;
    }
    this.loaderService.enableLoader();

    const data = {
      name: this.form.value.exitPopUpName
    };
    this.addExitPopUp(data);
    console.log(data);
  }

  public addExitPopUp(data: ExitPopupModel) {
    // let's make an api call to add this brand
    this.exitPopupService.addExitPopup(data).subscribe(
        (response: any ) => {
          Log.info(response, 'add a Exit popup response');
        }
    );
  }

  public getVisualStyles() {
    this.exitPopupService.getVisualStyles().subscribe(
        (response: any ) => {
          // Log.info(response, 'Exit popup styles');
          if (response.status) {
            this.visualStyles = response.data;
          }
        }
    );
  }

}
