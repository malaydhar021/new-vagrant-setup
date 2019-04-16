import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule} from '@angular/forms';
import { NgxSmartModalService } from 'ngx-smart-modal';
import * as ValidationEngine from '../../../../helpers/form.helper';
import { LoaderService } from '../../../../services/loader.service';
@Component({
  selector: 'user-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  
  userPasswordUpdateForm: FormGroup
   /**
   * Constructor to inject required service. It also subscribe to a observable which emits the current
   * value of defined variable. 
   * @constructor constructor
   * @since Version 1.0.0
   * @param ngxSmartModalService
   * @param formBuilder 
   * @param 
   * @returns Void
   */
  constructor(
    private ngxSmartModalService: NgxSmartModalService,
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
  ) { }
  
  createUserPasswordUpdateForm(isReset = false){

    this.userPasswordUpdateForm = this.formBuilder.group({
      current_password: ['', Validators.required],
      new_password: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')
      ])],
      confirm_password: ['', Validators.required]
    }, {
      validator: ValidationEngine.MustMatch('new_password', 'confirm_password')
    })

    isReset && this.userPasswordUpdateForm.reset();
  }


  onUpdatePassword(){
    let values = this.userPasswordUpdateForm.value;
    this.loaderService.enableLoader();
    setTimeout(()=>{
      this.loaderService.disableLoader();
      this.createUserPasswordUpdateForm(true);
    },3000)
    console.log(values);
    
  }
  ngOnInit() {
    this.createUserPasswordUpdateForm();
  }

}