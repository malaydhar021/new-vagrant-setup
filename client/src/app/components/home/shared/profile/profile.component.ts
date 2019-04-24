import { Component, OnInit }                              from '@angular/core';
import { FormBuilder, FormGroup, Validators}              from '@angular/forms';
import { NgxSmartModalService }                           from 'ngx-smart-modal';
import * as ValidationEngine                              from '../../../../helpers/form.helper';
import { LoaderService }                                  from '../../../../services/loader.service';
import {UserService}                                      from '../../../../services/user.service';
import { Log }                                            from '../../../../helpers/app.helper';
import {UserAuthInfo}                                     from '../../../../models/user.model';


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
  userInfo: UserAuthInfo;
  userProfileUpdateForm : FormGroup;
  profileImage : any = null;
  choseFileCtrl: string = 'Browse from your computer';
  fileName: string = 'or drag & drop your image here';
  imagePreviewUrl: string = 'assets/images/user.png';
  allowedFileTypes: string[] = [
    'image/jpeg',
    'image/png',
    'image/bmp',
    'image/gif'
  ];

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
   * getUserInfo method to get user information
   * @method getUserInfo
   * @since Version 1.0.0
   * @returns Void
   */
  getUserInfo(){

    this.loaderService.enableLoader();

    this.userService.getAuthUserInfo().subscribe(
      (response: any)=>{
        this.loaderService.disableLoader();
        this.userInfo = response.data
      }
    )
  }
   /**
   * openUserProfileUpdateForm method to open user profile update form
   * @method openUserProfileUpdateForm
   * @since Version 1.0.0
   * @returns Void
   */
  openUserProfileUpdateForm(){

    this.ngxSmartModalService.getModal('modal2').open();

    this.userProfileUpdateForm = this.formBuilder.group({
      name: [this.userInfo.name, Validators.required],
      email: [this.userInfo.email, Validators.compose([Validators.required, Validators.email])],
      image: [null]
    })
    this.imagePreviewUrl = this.userInfo.image;

  }
  /**
   * onUserProfileUpdate method to open user profile update
   * @method onUserProfileUpdate
   * @since Version 1.0.0
   * @returns Void
   */
  onUserProfileUpdate() {

    this.loaderService.enableLoader();

    let values: any = this.userProfileUpdateForm.value;
    let formData = new FormData();
    formData.append('_method', "PUT");
    if (this.profileImage){
      formData.append('image', values.image);
    }
    formData.append('name', values.name);
    formData.append('email', values.email);
    this.userService.changeProfile(formData).subscribe(
      (response: any)=> {
        this.loaderService.disableLoader();
        this.userInfo = response.data.user;
        if (this.userInfo.image){
          this.userService.setUserImage(this.userInfo.image)
        }
        this.ngxSmartModalService.getModal('modal2').close();
      }
    )

  }
  /**
   * onFileChange method to make the changes when a file selected
   * @method onFileChange
   * @since Version 1.0.0
   * @returns Void
   */
  onFileChange(event){
    if (event.target.files.length > 0) {
      
      const file = event.target.files[0];
      
      this.profileImage = file;

      this.userProfileUpdateForm.get('image').setValue(file);
      if(this.profileImage){
        this.userProfileUpdateForm.setValidators(ValidationEngine.FileType('image', this.profileImage, this.allowedFileTypes));
        this.userProfileUpdateForm.updateValueAndValidity();
        this.userProfileUpdateForm.setValidators(ValidationEngine.FileSize('image', this.profileImage, 1, 'MB'));
        this.userProfileUpdateForm.updateValueAndValidity();
      }
      let reader = new FileReader();
      
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      // called once readAsDataURL is completed
      reader.onload = (e) => { 
        this.imagePreviewUrl = reader.result.toString();
      }
    }
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
    // get user info 
    this.getUserInfo();
    // Initiate the user profile update form
    this.userProfileUpdateForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      image: [null]
    })
  }

}