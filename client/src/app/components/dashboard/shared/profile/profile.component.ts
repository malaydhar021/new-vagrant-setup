import { Component, OnInit }                              from '@angular/core';
import { FormBuilder, FormGroup, Validators}              from '@angular/forms';
import { NgxSmartModalService }                           from 'ngx-smart-modal';
import * as ValidationEngine                              from '../../../../helpers/form.helper';
import { LoaderService }                                  from '../../../../services/loader.service';
import {UserService}                                      from '../../../../services/user.service';
import { Log }                                            from '../../../../helpers/app.helper';


/**
 * ProfileComponent is responsible for updating user's profile
 * @class ProfileComponent
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */

@Component({
  selector: 'user-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {
  
  userPasswordUpdateForm: FormGroup // Form group for user password update form
  successMessage: string = ''; // Message coming form server after successful api call

   /**
   * Constructor to inject required service. It also subscribe to a observable which emits the current
   * value of defined variable. 
   * @constructor constructor
   * @since Version 1.0.0
   * @param ngxSmartModalService
   * @param formBuilder 
   * @param userService
   * @returns Void
   */
  constructor(
    private ngxSmartModalService: NgxSmartModalService,
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    private userService: UserService
  ) { }
  
  /**
   * create the reactive form for update password
   * @method createReviewLinkForm
   * @param isReset (boolean) // If you want to do reset call with true
   * @since Version 1.0.0
   * @returns Void
   */
  createUserPasswordUpdateForm(isReset: boolean = false){

    this.userPasswordUpdateForm = this.formBuilder.group({
      current_password: ['', Validators.required],
      new_password: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')
      ])],
      new_password_confirmation: ['', Validators.required]
    }, {
      validator: ValidationEngine.MustMatch('new_password', 'new_password_confirmation')
    })
    // Reset the form if flag is true
    isReset && this.userPasswordUpdateForm.reset();
  }

  /**
   * onUpdatePassword method to update user password
   * @method onUpdatePassword
   * @since Version 1.0.0
   * @returns Void
   */
  onUpdatePassword(){
    // values from the form element 
    let values = this.userPasswordUpdateForm.value;
    // Start loader
    this.loaderService.enableLoader();
    // Api call for changing password 
    this.userService.changePassword(values).subscribe(
      (response: any) => {
        // disable the loader 
        this.loaderService.disableLoader();
        // reset the update user password form 
        this.createUserPasswordUpdateForm(true);
        // set the server side success message
        this.successMessage = response.message;
        setTimeout(()=> {
          // reset the success message from server
          this.successMessage = ''
        }, 3000)
        Log.info(response, response.message);
      }
    )
    
  }

  /**
   * ngOnInit method initialize angular reactive form object for add / edit form of a brand. 
   * Also it set the title of the page. Also it defines client side validations.
   * @method ngOnInit
   * @since Version 1.0.0
   * @returns Void
   */
  ngOnInit() {

    // initialize the update user password form 
    this.createUserPasswordUpdateForm();
  }

}