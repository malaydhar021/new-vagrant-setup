import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { ErrorsService } from '../../../services/errors.service';
import { Log } from '../../../helpers/app.helper';
import * as ValidationEngine from '../../../helpers/form.helper';

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

  form: FormGroup;
  isSubmitted = false;
  error: any = null;
  loader = false;
  subscription: Subscription;
  email: string = null;
  token: string = null;
  validationErrors : any = null;

  constructor(
    private renderer: Renderer2,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private errorService: ErrorsService,
    private router: Router,
    private title: Title,
    private route: ActivatedRoute
  ) {
    // if user is already logged in then redirect the user to home
    if (this.authService.isAuthenticated) { this.router.navigate(['/home']); }
    // add `loginPage` class to reset password template body
    this.renderer.addClass(document.body, 'loginPage'); 
    this.subscription = this.errorService.error$.subscribe(
      errMsg => {
        this.loader = false;
        this.error = errMsg;
      }
    );
    this.subscription = this.errorService.validationErrors$.subscribe(
      validationErrMsg => {
        Log.info(validationErrMsg, 'component error subscription');
        this.loader = false;
        this.validationErrors = validationErrMsg;
      }
    );
  }

  /**
   * Function to initialize angular reactive form object.
   *
   * @since 1.0.0
   * @returns void
   */
  public ngOnInit() {
    // check if the user is logged in or not. if logged in then redirect to home
    if (this.authService.isAuthenticated) { this.router.navigate(['/home']); }
    // set the page title
    this.title.setTitle('Stickyreviews :: Reset Password');
    this.loader = true; // show loader
    // get the token from last urlsegment from the current route
    const token = this.route.snapshot.url[1].path;
    // check the token is valid or not
    this.authService.resetPasswordValidateToken(token).subscribe(
      (response: any) => {
        Log.info(response, 'Loggin the response in ngOnInit');
        this.email = response.data.email;
        this.token = response.data.token;
        this.loader = false;
      }
    );

    // initialize formBuilder with client side validation
    this.form = this.formBuilder.group({
        password: [null, [Validators.required, Validators.minLength(8)]],
        confirmPassword: [null, [Validators.required]]
      }, {
        validator: ValidationEngine.MustMatch('password', 'confirmPassword') // custom validator to match with password and confirm password
      }
    );
  }

  /**
   * Function to execute when this component is going to destroy by the browser.
   * This will unsubscribe the subscription
   *
   * @since 1.0.0
   * @returns void
   */
  public ngOnDestroy() {
    this.renderer.removeClass(document.body, 'loginPage');
    this.subscription.unsubscribe();
  }

  /**
   * Getter method to access the reset password form fields
   * 
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
    this.validationErrors = null;
    this.error = null;
    if (this.form.invalid) {
      return false;
    }

    Log.info("show me when validation is passed");

    this.loader = true; // show loader

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
        this.error = response.message;
        this.validationErrors = null;
        this.errorService.updateMessage("Password has been successfully reset. Please loging with updated password");
        this.loader = false; // hide loader
        this.router.navigate(['/login']);
      }
    );
  }

}
