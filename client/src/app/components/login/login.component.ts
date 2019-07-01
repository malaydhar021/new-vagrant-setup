import { Component, OnInit, Renderer2 } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { ErrorsService } from '../../services/errors.service';
import { LoaderService } from '../../services/loader.service';
import { Log } from 'src/app/helpers/app.helper';

/**
 * This component is will handle all sort of operations along with api responses for user authentication and auth validation.
 * @class LoginComponent
 * @author Tier5 LLC `<work@tier5.us>`
 * @version 1.0.0
 * @license Proprietary
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  emailFieldFocused = false; // true if the email field is focused
  passwordFieldFocused = false; // true if the password field is focused
  event: object = null;
  rememberMe = false; // true if remember me is checked
  isSubmitted = false; // flag to set true if the form has been submitted
  error: string = null; // to display error message if any
  loader = false; // for show/hide loader
  subscription: Subscription; // used for load error message set from different places and assign to error property asynchronously
  showCookie: boolean = false;
  errorSubscription: Subscription; // to get the current value of showError property
  showError: boolean = false; // flag to show error message 
  successMessage: string = null; // flag to hold the success message

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private title: Title,
    private route: ActivatedRoute,
    private authService: AuthService,
    private renderer: Renderer2,
    private cookieService: CookieService,
    private errorService: ErrorsService,
    private loaderService: LoaderService
  ) {
    // if user is already logged in then redirect the user to home
    if (this.authService.isAuthenticated) { this.router.navigate(['/home']); }
    this.renderer.addClass(document.body, 'loginPage');
    if (!this.cookieService.get('_readSite')) {
        this.showCookie = true;
    }
    this.errorSubscription = this.errorService.showMessage$.subscribe(
      (status: boolean) => {
        this.showError = status;
      }
    );
  }

  /**
   * ngOnInit method initialize angular reactive form object. Also it set the title of the page.
   * @method ngOnInit
   * @since Version 1.0.0
   * @returns Void
   */
  public ngOnInit() {
    // check if the user is logged in or not. if logged in then redirect to home
    if (this.authService.isAuthenticated) { this.router.navigate(['/home']); }
    // set the page title
    this.title.setTitle('Stickyreviews :: Login');
    // initialize formBuilder with client side validation
    this.form = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required],
      rememberMe: [false]
    });

    if (!this.cookieService.get('readSite')) {
      this.showCookie = true;
    }

  }

  /**
   * Function to execute when this component is going to destroy by the browser.
   * This will unsubscribe the subscription and also remove the loginPage class from body when
   * this component will be destroyed.
   * @method ngOnDestroy
   * @since Version 1.0.0
   * @returns Void
   */
  public ngOnDestroy() {
    this.renderer.removeClass(document.body, 'loginPage');
    // this.subscription.unsubscribe();
    this.errorSubscription.unsubscribe();
    this.errorService.clearMessage();
  }

  /**
   * Function to do the user login and handle api response
   * @since Version 1.0.0
   * @todo Implemented redirected to addons route instead of statically routed to home each and every time
   * @returns void
   */
  public onSubmit() {
    this.isSubmitted = true;
    Log.debug(this.loginFormControls.rememberMe.value, "Remember Me");
    if (this.form.invalid) {
      return false;
    }
    // preparing auth object with required elements
    const auth = {
      email: this.form.value.email,
      password: this.form.value.password,
      remember_me: this.form.value.rememberMe ? 1 : 0
    };
    this.loaderService.enableLoader();
    // making the api call and handle the response asynchronously
    this.authService.doLogin(auth).subscribe(
      (response: any) => {
        Log.info(response, "Log the response: ");
        if (response.status) {
          if (localStorage.getItem('_sr')) {
            localStorage.removeItem('_sr');
          }
          // creating object to store in localStorage / sessionStorage
          const data = { token: response.access_token };
          // set the cookie for remember me
          this.cookieService.set('_rm', 'off');
          // if remember me is checked
          if (this.form.value.rememberMe) {
            // set _rm cookie to on
            this.cookieService.set('_rm', 'on');
          }
          // set token as a string into local storage
          localStorage.setItem('_sr', JSON.stringify(data));
          // setting a cookie in main domain when user login
          this.cookieService.set('_loginUser', '1', 450, '/', 'usestickyreviews.com');
          // this.loaderService.disableLoader();
          // redirect to home
          this.router.navigate(['/home']);
        } else {
          this.error = response.message;
          this.loaderService.disableLoader();
        }
      }
    );
  }

  /**
   * Getter method to access the login form fields
   * @since 1.0.0
   * @returns void
   */
  public get loginFormControls() {
    return this.form.controls;
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
      case 'email':
        this.emailFieldFocused = ((<HTMLInputElement>event.target).value === '') ? true : (((<HTMLInputElement>event.target).value === '') ? false : true);
        break;
      case 'password':
        this.passwordFieldFocused = ((<HTMLInputElement>event.target).value === '') ? true : (((<HTMLInputElement>event.target).value === '') ? false : true);
        break;
      default:
        break;
    }
  }
  /**
   * Function to  set cookie and close the cookie notification
   */
  public closeCookie() {
      this.cookieService.set('_readSite', '1', 450, '/', 'usestickyreviews.com');
      this.showCookie = false;
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
      case 'email':
        this.emailFieldFocused = ((<HTMLInputElement>event.target).value === '') ? false : true;
        break;
      case 'password':
        this.passwordFieldFocused = ((<HTMLInputElement>event.target).value === '') ? false : true;
        break;
      default:
        break;
    }
  }
}