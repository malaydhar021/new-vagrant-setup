import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSmartModalService, NgxSmartModalComponent } from 'ngx-smart-modal';
import * as ValidationEngine from '../../../../helpers/form.helper';
import { LoaderService } from '../../../../services/loader.service';
import { UserService } from '../../../../services/user.service';
import { Log } from '../../../../helpers/app.helper';
import { UserAuthInfo } from '../../../../models/user.model';
import { ErrorsService } from '../../../../services/errors.service';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';

/**
 * ProfileComponent is responsible for updating user's profile along with profile password
 * @class ProfileComponent
 * @version 2.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@Component({
  selector: 'user-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy, AfterViewInit {
  // define class properties
  userPasswordUpdateForm: FormGroup // Form group for user password update form
  successMessage: string = ''; // Message coming form server after successful api call
  userInfo: UserAuthInfo;
  userProfileUpdateForm: FormGroup;
  profileImage: any = null;
  choseFileCtrl: string = 'Browse from your computer';
  fileName: string = 'or drag & drop your image here';
  imagePreviewUrl: string = 'assets/images/user.png';
  allowedFileTypes: string[] = [
    'image/jpeg',
    'image/png',
    'image/bmp',
    'image/gif'
  ];

  errorSubscription: Subscription; // to get the current value of showError property
  showError: boolean = false; // flag to show error message
  isModalOpened: boolean = false; // set to true if the modal is opened

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
    private title: Title,
    private ngxSmartModalService: NgxSmartModalService,
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    private userService: UserService,
    private errorService: ErrorsService,
    private cookieService: CookieService,
  ) {
    this.errorSubscription = this.errorService.showMessage$.subscribe(
      (status: boolean) => {
        this.showError = status;
      }
    );
  }

  /**
   * ngOnInit method initialize angular reactive form object for add / edit form of a brand.
   * Also it set the title of the page. Also it defines client side validations.
   * @method ngOnInit
   * @since Version 1.0.0
   * @returns Void
   */
  ngOnInit() {
    // set the title
    this.title.setTitle("Stickyreviews :: Edit Profile");
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

  /**
   * @method ngOnDestroy
   * @since Version 1.0.0
   * @returns Void
   */
  public ngOnDestroy() {
    this.errorService.clearMessage();
    this.errorSubscription.unsubscribe();
  }

  /**
   * @method ngAfterViewInit
   * @since Version 2.0.0
   * @returns Void
   */
  public ngAfterViewInit() {
    this.modalCallbacks(); // modal callbacks i.e onClose, onDismiss, onEscape
  }

  /**
   * Method to perform ngx-smart-modal event callbacks
   * @method modalCallbacks
   * @since Version 2.0.0
   * @returns Void
   */
  public modalCallbacks() {
    // do stuffs when modal has been closed. In this case reset the form when modal is closed
    this.ngxSmartModalService.getModal('modal2').onClose.subscribe((modal: NgxSmartModalComponent) => {
      this.resetForm;
    });
    // do stuffs when modal has been dismissed i.e when the modal is closed clicking in backdrop.
    // In this case reset the form when modal is dismissed
    this.ngxSmartModalService.getModal('modal2').onDismiss.subscribe((modal: NgxSmartModalComponent) => {
      this.resetForm;
    });
    // reset form when modal has been closed by esc key
    this.ngxSmartModalService.getModal('modal2').onEscape.subscribe((modal: NgxSmartModalComponent) => {
      this.resetForm;
    });
    // set showError to false when the modal is being opened
    this.ngxSmartModalService.getModal('modal2').onOpen.subscribe((modal: NgxSmartModalComponent) => {
      this.errorService.updateShowMessageStatus(false);
      this.isModalOpened = true; // set it to true as modal is about to open. This is form show server side messages into modal but not in listing page
    });
  }

  /**
   * create the reactive form for update password
   * @method createReviewLinkForm
   * @param isReset (boolean) // If you want to do reset call with true
   * @since Version 1.0.0
   * @returns Void
   */
  public createUserPasswordUpdateForm(isReset: boolean = false) {
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
   * Method to reset user profile update form when the modal will be closed or escaped
   * @method resetForm
   * @since Version 2.0.0
   * @returns Void
   */
  public get resetForm() {
    this.userProfileUpdateForm.reset();
    this.imagePreviewUrl = 'assets/images/user.png';
    this.isModalOpened = false; // set to false as modal has been closed
    return;
  }

  /**
   * onUpdatePassword method to update user password
   * @method onUpdatePassword
   * @since Version 1.0.0
   * @returns Void
   */
  public onUpdatePassword() {
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
        this.errorService.setMessage({ type: 'success', message: response.message });
      }
    )
  }

  /**
   * getUserInfo method to get user information
   * @method getUserInfo
   * @since Version 1.0.0
   * @returns Void
   */
  public getUserInfo() {
    this.loaderService.enableLoader();
    this.userService.getAuthUserInfo().subscribe(
      (response: any) => {
        this.loaderService.disableLoader();
        Log.info(response.data)
        this.userInfo = response.data;
        this.imagePreviewUrl = (response.data.image !== null) ? response.data.image : this.imagePreviewUrl;
      }
    )
  }

  /**
   * openUserProfileUpdateForm method to open user profile update form
   * @method openUserProfileUpdateForm
   * @since Version 1.0.0
   * @returns Void
  */
  public openUserProfileUpdateForm() {
    this.ngxSmartModalService.getModal('modal2').open();
    this.userProfileUpdateForm = this.formBuilder.group({
      name: [this.userInfo.name, Validators.required],
      email: [this.userInfo.email, Validators.compose([Validators.required, Validators.email])],
      image: [null]
    })
    this.imagePreviewUrl = (this.userInfo.image !== null) ? this.userInfo.image : this.imagePreviewUrl;
  }

  /**
   * onUserProfileUpdate method to open user profile update
   * @method onUserProfileUpdate
   * @since Version 1.0.0
   * @returns Void
   */
  public onUserProfileUpdate() {
    this.loaderService.enableLoader();
    let values: any = this.userProfileUpdateForm.value;
    let formData = new FormData();
    formData.append('_method', "PUT");
    if (this.profileImage) {
      formData.append('image', values.image);
    }
    formData.append('name', values.name);
    formData.append('email', values.email);
    this.userService.changeProfile(formData).subscribe(
      (response: any) => {
        this.loaderService.disableLoader();
        Log.debug(response);
        if(response.status) {
          this.ngxSmartModalService.getModal('modal2').close();
          this.userInfo = response.data.user;
          if (this.userInfo.image) {
            this.userService.setUserImage(this.userInfo.image);
            // update the profile image in the cookie
            this.cookieService.set('_loginUserImage', this.userInfo.image, 450, '/', 'usestickyreviews.com');
          }
          // 100 ms time delay to show the message to user once the modal has been closed
          setTimeout(() => {this.errorService.setMessage({type: 'success', message: response.message})}, 100);
        } else {
          // 100 ms time delay to show the message to user
          setTimeout(() => {this.errorService.setMessage({type: 'error', message: response.message})}, 100);
        }
      }
    )
  }

  /**
   * onFileChange method to make the changes when a file selected
   * @method onFileChange
   * @since Version 1.0.0
   * @returns Void
   */
  public onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.profileImage = file;
      this.userProfileUpdateForm.get('image').setValue(file);
      if (this.profileImage) {
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
}
