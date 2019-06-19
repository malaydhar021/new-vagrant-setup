import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { ErrorsService } from '../../../services/errors.service';
import { Log } from '../../../helpers/app.helper';
import * as ValidationEngine from '../../../helpers/form.helper';
import { LoaderService } from 'src/app/services/loader.service';

/**
 * This component will handle all sort of operations related to reset password
 *
 * @package ResetPasswordComponent
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @listens Proprietary
 */
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  // class properties
  form: FormGroup;
  isSubmitted = false;
  error: any = null;
  loader = false;
  subscription: Subscription;
  email: string = null;
  token: string = null;
  validationErrors : any = null;
  successMessage: string = null;
  errorMessage: string = null;
  errorSubscription: Subscription; // to get the current value of showError property
  showError: boolean = false; // flag to show error message
  passwordFieldFocused:boolean = false; // true if the password field is focused
  confirmPasswordFieldFocused: boolean = false; // true if confirm password field is focused

  /**
   * Constructor method to load every required services and class at the very first when this component is initialized
   * @constructor constructor
   * @since Version 1.0.0
   * @param renderer Renderer2 class instance
   * @param formBuilder FormBuilder class instance
   * @param authService AuthService instance
   * @param errorService ErrorService class instance
   * @param router Router class instance
   * @param title Title service instance
   * @param route Route class instance
   * @returns Void
   */
  constructor(
    private renderer: Renderer2,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private errorService: ErrorsService,
    private loaderService: LoaderService,
    private router: Router,
    private title: Title,
    private route: ActivatedRoute
  ) {
    // if user is already logged in then redirect the user to home
    if (this.authService.isAuthenticated) { this.router.navigate(['/home']); }
    // add `loginPage` class to reset password template body
    this.renderer.addClass(document.body, 'loginPage');
    this.errorSubscription = this.errorService.showMessage$.subscribe(
      (status: boolean) => {
        this.showError = status;
      }
    );
  }

  /**
   * Function to initialize angular reactive form object.
   * @method ngOnInit
   * @since Version 1.0.0
   * @returns Void
   */
  public ngOnInit() {
    // check if the user is logged in or not. if logged in then redirect to home
    if (this.authService.isAuthenticated) { this.router.navigate(['/home']); }
    // set the page title
    this.title.setTitle('Stickyreviews :: Reset Password');
    this.loaderService.enableLoader(); // show loader
    // get the token from last url segment from the current route
    const token = this.route.snapshot.url[1].path;
    // check the token is valid or not
    this.authService.resetPasswordValidateToken(token).subscribe(
      (response: any) => {
        this.email = response.data.email;
        this.token = response.data.token;
        // this.loader = false;
        this.loaderService.disableLoader();
      }
    );
    // initialize formBuilder with client side validation
    this.form = this.formBuilder.group({
        password: [null, [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')]],
        confirmPassword: [null, [Validators.required]]
      }, {
        validator: ValidationEngine.MustMatch('password', 'confirmPassword') // custom validator to match with password and confirm password
      }
    );
  }

  /**
   * Function to execute when this component is going to destroy by the browser.
   * This will unsubscribe the subscription
   * @method ngOnDestroy
   * @since Version 1.0.0
   * @returns Void
   */
  public ngOnDestroy() {
    this.renderer.removeClass(document.body, 'loginPage');
    this.errorSubscription.unsubscribe();
  }

  /**
   * Getter method to access the reset password form fields
   * @member resetPasswordFormControls
   * @since 1.0.0
   * @returns void
   */
  public get resetPasswordFormControls() {
    return this.form.controls;
  }

  /**
   * onSubmit method will handle all actions when reset password form has been submitted.
   * This handles validation as well. If the form does not pass the validation then thid method
   * with simply stop the execution of remaining code by retuning false on top.
   *
   * @since 1.0.0
   * @returns void
   */
  public onSubmit() {
    Log.info(this.form.invalid, 'is invalid');
    this.isSubmitted = true;
    if (this.form.invalid) {
      return false;
    }

    this.loaderService.enableLoader(); // show loader

    const data = {
      email: this.email,
      password: this.form.value.password,
      password_confirmation: this.form.value.confirmPassword,
      token: this.token
    };
    // lets make the api request and handle the response
    this.authService.resetPassword(data).subscribe(
      (response: any) => {
        Log.info(response, 'response for forgot password');
        if(response.status) {
          this.errorService.updateMessage("Password has been successfully reset. Please loging with updated password");
          this.loaderService.disableLoader(); // hide the loader
          this.successMessage = response.message;
          setTimeout(() => {
            this.successMessage = null;
          }, 3000);
          this.router.navigate(['/login']);
        } else {
          this.loaderService.disableLoader();
          this.errorMessage = response.message;
        }
      }
    );
  }

  /**
   * Function to append some class based on some input value when login form fields are focused
   * @since 1.0.0
   * @param field string
   * @param event any
   * @returns void
   */
  public onFocus(field: string, event: any) {
    switch (field) {
      case 'password':
        this.passwordFieldFocused = ((<HTMLInputElement>event.target).value === '') ? true : (((<HTMLInputElement>event.target).value === '') ? false : true);
        break;
      case 'confirmPassword':
        this.confirmPasswordFieldFocused = ((<HTMLInputElement>event.target).value === '') ? true : (((<HTMLInputElement>event.target).value === '') ? false : true);
        break;
      default:
        break;
    }
  }

  /**
   * Function to append some class based on some input value when login form fields are out of focused
   * @since 1.0.0
   * @param field string
   * @param event any
   * @returns void
   */
  public onFocusOut(field: string, event: any) {
    switch (field) {
      case 'password':
        this.passwordFieldFocused = ((<HTMLInputElement>event.target).value === '') ? false : true;
        break;
      case 'confirmPassword':
        this.confirmPasswordFieldFocused = ((<HTMLInputElement>event.target).value === '') ? false : true;
        break;
      default:
        break;
    }
  }
}
