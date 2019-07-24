import { Component, OnInit, Renderer2, OnDestroy, } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ErrorsService } from '../../services/errors.service';
import { SignupService } from '../../services/signup.service';
import { Log } from '../../helpers/app.helper';
import * as ValidationEngine from '../../helpers/form.helper';
import { LoaderService } from 'src/app/services/loader.service';

/**
 * SignUpComponent class handles all operations related to user signup. It also handles the two step
 * signup form requests and handles the response including validation errors.
 * @class SignUpComponent
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit, OnDestroy {
  // class properties
  signupFormStep1: FormGroup; // instance of angular reactive form FormGroup class
  signupFormStep2: FormGroup; // instance of angular reactive form FormGroup class
  isStep2: boolean = false; // flag to set which step show be shown based on true / false
  subscription: Subscription; // subscribe to a observable to get the current value of that variable
  loader: boolean = false; // to show / hide the loader by setting true / false
  errorMessage: string = null; // to display server side errors into component template
  isSubmittedStep1: boolean = false; // flag to set to true if the signup form step 1 has been submitted
  isSubmittedStep2: boolean = false; // flag to set to true if the signpu form step 2 has been submitted
  validationErrors : any = null; // to display server side validation errors into component template
  successMessage: string = null;
  errorSubscription: Subscription; // to get the current value of showError property
  showError: boolean = false; // flag to show error message
  years: any = []; // holds all years within an array
  currentYear: number = null; // holds the current year

  /**
   * Constructor method which initialize few angular services and few custom services to serve a certain purpose
   * @constructor constructor
   * @since Version 1.0.0
   * @param title Title service from angular to change the title of the page from DOM element
   * @param renderer Renderer2 service from angular core to add or remove some class on some document selector
   * @param router Angular router to handle route operations like redirect to one route by programme
   * @param formBuilder Angular reactive form builder to handle forms
   * @param authService AuthService is a custom service to handle actions related to user authentication
   * @param errorService ErrorsService is a custom service to handle all sort of server side errors along with all validation error messages
   * @param signupService SignupService is a custom service only for signup to make api calls mainly
   * @returns Void
   */
  constructor(
    private title: Title,
    private renderer: Renderer2,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private errorService: ErrorsService,
    private signupService: SignupService,
    private loaderService: LoaderService
  ) {
    // if user is already logged in then redirect the user to home
    if (this.authService.isAuthenticated) { this.router.navigate(['/home']); }
    this.renderer.addClass(document.body, 'sign-upPage');
    this.errorSubscription = this.errorService.showMessage$.subscribe(
      (status: boolean) => {
        this.showError = status;
        Log.info(this.showError);
      }
    );
  }

  /**
   * ngOnInit method initialize angular reactive form object for sign up form step 1 and step 2. 
   * Also it set the title of the page. It has some guard checking at the very top if the user is
   * logged in then redirect user to home page. Also it handles some sort of custom validations
   * specially for signup form step 2.
   * @method ngOnInit
   * @since Version 1.0.0
   * @returns Void
   */
  public ngOnInit() {
    // check if the user is logged in or not. if logged in then redirect to home
    if (this.authService.isAuthenticated) { this.router.navigate(['/home']); }
    // set the page title
    this.title.setTitle('Stickyreviews :: Sign Up');
    // get all years
    this.yearsToDisplay();
    // initialize the form builder for signup form step 1
    this.signupFormStep1 = this.formBuilder.group({
      name : [null, [Validators.required]], // full name
      email : [null, [Validators.required, Validators.email]],
      password : [null, [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')]]
    });
    // initialize the form builder for signup form step 2
    this.signupFormStep2 = this.formBuilder.group({
      card : [null, Validators.required], // card number
      cvc : [null, Validators.required], // CVC number
      expMonth : [1, Validators.required], // expiry month
      expYear: [this.currentYear, Validators.required] // expiry year
    }, {
      validators: [
        ValidationEngine.IsNumeric('card'), // in house validation method to check if the card number is number
        ValidationEngine.IsNumeric('cvc'), // in house validation method to check if the CVC number is number
        ValidationEngine.InRange('card', 14, 16), // in house validation method to check if the card number within 14 and 16 digits
        ValidationEngine.InRange('cvc', 3, 5) // in house validation method to check if the CVC number within 3 and 5 digits
      ]
    });
  }

  /**
   * Function to execute when this component is going to destroy by the browser.
   * This will unsubscribe the subscription and also remove the `sign-upPage class` from body when
   * this component will be destroyed.
   * @method ngOnDestroy
   * @since Version 1.0.0
   * @returns Void
   */
  public ngOnDestroy() {
    this.renderer.removeClass(document.body, 'sign-upPage');
    this.errorSubscription.unsubscribe();
    this.errorService.clearMessage();
  }

  /**
   * Method to generate years from current to upcoming 25 years
   * @method yearsToDisplay
   * @since Version 1.0.0
   * @returns Void
   */
  public yearsToDisplay() {
    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    this.currentYear = currentYear
    for (let i = 0; i < 20; i++) {
      this.years.push(currentYear + i);
    }
  }

  /**
   * This method is responsible for going to step 2 if the user is in step 1 in signup form
   * @method nextStep
   * @since Version 1.0.0
   * @returns Boolean
   */
  public nextStep() {
    this.isStep2 = true;
    this.errorService.clearMessage();
  }

  /**
   * This method is responsible for going back to step 1 if the user is in step 2 in signup form
   * @method goBack
   * @since Version 1.0.0
   * @returns Boolean
   */
  public goBack() {
    this.isStep2 = false;
    this.errorService.clearMessage();
  }

  /**
   * signupFormStep1FormControls method returns all the control objects for sign up form step 1
   * @method signupFormStep1FormControls
   * @since Version 1.0.0
   * @returns FormControls
   */
  public get signupFormStep1FormControls() {
    return this.signupFormStep1.controls;
  }

  /**
   * signupFormStep2FormControls method returns all the control objects for sign up form step 2
   * @method signupFormStep2FormControls
   * @since Version 1.0.0
   * @returns FormControls
   */
  public get signupFormStep2FormControls() {
    return this.signupFormStep2.controls;
  }

  /**
   * onSubmitStep1 method handles user input from sign up form step 1 and make an api call to check the email provided
   * by the user and if it passes the validation then it let the user go to step 2. It also handles primary client side 
   * validations to reduce http api calls.
   * @method onSubmitStep1
   * @since Version 1.0.0
   * @returns Void
   */
  public onSubmitStep1() {
    this.errorMessage = null;
    Log.info(this.signupFormStep1, 'Step 1 form data');
    // set the flag as true as the form is submitted
    this.isSubmittedStep1 = true;
    // check if the form values pass the validation or not
    if(this.signupFormStep1.invalid) {
      return false;
    }
    // lets show the loader to user to perform some api calls
    this.loaderService.enableLoader();
    // prepare the request data
    const data = {
      email: this.signupFormStep1.value.email,
      password: this.signupFormStep1.value.password
    };
    // make the api call check the email what we got here is exists or not
    this.signupService.validateEmailPassword(data).subscribe(
      (response : any) => {
        Log.info(response, 'Checking api response');
        // hide the loader
        this.loaderService.disableLoader();
        if(response.status) {
          // if email and password are valid then show next step form to user
          this.nextStep();
        } else {
          // if email is already exists then show the message to user
          this.errorService.setMessage({type: 'error', message: response.message});
        }
      }
    );
  }

  /**
   * onSubmitStep2 method handles user input from sign up form step 2 and make an api call to register the user
   * if it passes the validation. It also handles primary client side validations to reduce http api calls.
   * @method onSubmitStep2
   * @since Version 1.0.0
   * @returns Void
   */
  public onSubmitStep2() {
    Log.info(this.signupFormStep2, 'Step 2 form data');
    // set the flag as true as the form is submitted
    this.isSubmittedStep2 = true;
    // check if the form values pass the validation or not
    if(this.signupFormStep2.invalid) { 
      return false;
    }
    Log.info("Show this when client validation is passed in signup form 2");
    // if the form is valid then show the loader
    this.loaderService.enableLoader();
    // prepare the data to make api call to signup the user
    const data = {
      name: this.signupFormStep1.value.name,
      email: this.signupFormStep1.value.email,
      password: this.signupFormStep1.value.password,
      card_number: this.signupFormStep2.value.card,
      cvc_number: this.signupFormStep2.value.cvc,
      expiry_month: this.signupFormStep2.value.expMonth,
      expiry_year: this.signupFormStep2.value.expYear,
      affiliate_id: null
    };
    /**
     * let's make the api call to signup the user and handle the response
     * validation errors for this request will be handled by request interceptor
     */
    this.signupService.doSignup(data).subscribe(
      (response: any) => {
        Log.info(response, 'Log the response for signup');
        this.loaderService.disableLoader();
        this.errorService.updateMessage("You have successfully signed up. Please login to continue");
        this.router.navigate(['/login']);
      }
    );
  }
}
