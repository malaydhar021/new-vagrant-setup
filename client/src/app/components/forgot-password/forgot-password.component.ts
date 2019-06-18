import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ErrorsService } from '../../services/errors.service';
import { Log } from 'src/app/helpers/app.helper';
import { LoaderService } from 'src/app/services/loader.service';

/**
 * This component will handle all sort of operations related to forgot password
 * @class ForgotPasswordComponent
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @listens Proprietary
 */
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  // defining class properties
  form: FormGroup;
  isSubmitted = false;
  error: string = null;
  loader = false;
  subscription: Subscription;
  successMessage: string = null; // hold the success message
  errorMessage: string = null; // hold the errorMessage message
  errorSubscription: Subscription; // to get the current value of showError property
  showError: boolean = false; // flag to show error message
  emailFieldFocused = false; // true if the email field is focused

  /**
   * Constructor method to load services at the very first when this component is initialized
   * @constructor Constructor
   * @since Version 1.0.0
   * @param formBuilder FormBuilder instance
   * @param authService AuthService instance
   * @param errorService ErrorService instance
   * @param loaderService LoaderService instance
   * @param router Router instance
   * @param title Title service instance
   * @param renderer Renderer service instance
   */
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private errorService: ErrorsService,
    private loaderService: LoaderService,
    private router: Router,
    private title: Title,
    private renderer: Renderer2
  ) {
    if (this.authService.isAuthenticated) { this.router.navigate(['/home']); }
    this.renderer.addClass(document.body, 'loginPage');
    this.errorSubscription = this.errorService.showMessage$.subscribe(
      (status: boolean) => {
        this.showError = status;
        Log.info(status);
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
    this.title.setTitle('Stickyreviews :: Forgot Password');
    // initialize formBuilder with client side validation
    this.form = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]]
    });
  }

  /**
   * Function to execute when this component is going to destroy by the browser.
   * This will unsubscribe the subscription.
   * @method ngOnDestroy
   * @since Version 1.0.0
   * @returns void
   */
  public ngOnDestroy() {
    // this.subscription.unsubscribe();
    this.errorSubscription.unsubscribe();
    this.renderer.removeClass(document.body, 'loginPage');
  }

  /**
   * @method formControls
   * @since Version 1.0.0
   */
  public get formControls() {
    return this.form.controls;
  }

  /**
   * This method will handle the forgot password form when it is submitted
   * @method onSubmit
   * @since Version 1.0.0
   * @returns void
   */
  public onSubmit() {
    this.isSubmitted = true;
    Log.info("check if this is showing or not");
    if (this.form.invalid) {
      return false;
    }
    // show loader
    this.loaderService.enableLoader();
    const data = { email: this.form.value.email };
    this.authService.forgotPassword(data).subscribe(
      (response: any) => {
        if(response.status) {
          this.form.reset();
          Log.info(response, 'response for forgot password');
          // hide loader
          this.loaderService.disableLoader();
          this.successMessage = response.message;
          setTimeout(() => {
            this.successMessage = null;
          }, 3000);
        } else {
          this.loaderService.disableLoader();
          this.errorMessage = response.message;
          setTimeout(() => {
            this.errorMessage = null;
          }, 3000);
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
      case 'email':
        this.emailFieldFocused = ((<HTMLInputElement>event.target).value === '') ? true : (((<HTMLInputElement>event.target).value === '') ? false : true);
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
      case 'email':
        this.emailFieldFocused = ((<HTMLInputElement>event.target).value === '') ? false : true;
        break;
      default:
        break;
    }
  }
}
