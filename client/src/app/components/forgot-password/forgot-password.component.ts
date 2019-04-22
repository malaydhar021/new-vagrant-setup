import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ErrorsService } from '../../services/errors.service';
import { Log } from 'src/app/helpers/app.helper';

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

  form: FormGroup;
  isSubmitted = false;
  error: string = null;
  loader = false;
  subscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private errorService: ErrorsService,
    private router: Router,
    private title: Title,
    private renderer: Renderer2
  ) {
    if (this.authService.isAuthenticated) { this.router.navigate(['/home']); }
    this.renderer.addClass(document.body, 'loginPage');
    this.subscription = this.errorService.error$.subscribe(
      errMsg => {
        this.loader = false;
        this.error = errMsg;
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
   * @since 1.0.0
   * @returns void
   */
  public ngOnDestroy() {
    this.subscription.unsubscribe();
    this.renderer.removeClass(document.body, 'loginPage');
  }

  /**
   * This method will handle the forgot password form when it is submitted
   * @method onSubmit
   * @since 1.0.0
   * @returns void
   */
  public onSubmit() {
    Log.info('Forgot password form is submitted !');
    Log.info(this.form.value.email);
    this.isSubmitted = true;
    if (this.form.invalid) {
      return false;
    }
    // show loader
    this.loader = true;

    const data = { email: this.form.value.email };

    this.authService.forgotPassword(data).subscribe(
      (response: any) => {
        this.form.reset();
        Log.info(response, 'response for forgot password');
        // hide loader
        this.loader = false;
        this.error = response.message;
      }
    );
  }
}
