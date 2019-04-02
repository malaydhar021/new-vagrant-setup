import { Component, OnInit, Renderer2 } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { Log } from 'src/app/helpers/app.helper';
import { Subscription } from 'rxjs';
import { ErrorsService } from '../../services/errors.service';

/**
 * This component is will handle all sort of operations along with api responses for user authentication and auth validation.
 *
 * @package LoginComponent
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
    event : object = null;
    rememberMe = false; // true if remember me is checked
    isSubmitted = false; // flag to set true if the form has been submitted
    error : string = null; // to display error message if any
    loader = false; // for show/hide loader
    subscription : Subscription; // used for load error message set from different places and assign to error property asynchronously

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private title: Title,
        private route: ActivatedRoute,
        private authService: AuthService,
        private renderer: Renderer2,
        private cookieService: CookieService,
        private errorService: ErrorsService
    ) {
        // if user is already logged in then redirect the user to dashboard
        if (this.authService.isAuthenticated) { this.router.navigate(['/dashboard']);}
        this.renderer.addClass(document.body, 'loginPage');
        this.subscription = this.errorService.error$.subscribe(
            errMsg => {
                this.loader = false;
                this.error = errMsg;
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
        // check if the user is logged in or not. if logged in then redirect to dashboard
        if (this.authService.isAuthenticated) { this.router.navigate(['/dashboard']); }
        // set the page title
        this.title.setTitle('Stickyreviews :: Login');
        // initialize formBuilder with client side validation
        this.form = this.formBuilder.group({
            email : [null, [Validators.required, Validators.email]],
            password : [null, Validators.required],
            rememberMe : [null]
        });
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
        this.subscription.unsubscribe();
    }

    /**
     * Function to do the user loging and handle api response
     * @since Version 1.0.0
     * @todo Implemented redirected to addons route instead of statically routed to dashboard each and every time
     * @returns void
     */
    public onSubmit() {
        this.isSubmitted = true;
        if (this.form.invalid) {
            return false;
        }
        // preparing auth object with required elements
        const auth = {
            email : this.form.value.email,
            password : this.form.value.password
        };
        this.loader = true;
        // making the api call and handle the reponse asynchronously
        this.authService.doLogin(auth).subscribe(
            (response: any) => {
                if (response.status) {
                    if (localStorage.getItem('_sr')) {
                        localStorage.removeItem('_sr');
                    }
                    // creating object to store in localStorage / sessionStorage
                    const data = {token : response.access_token};
                    // set the cookie for remember me
                    this.cookieService.set('_rm', 'off');
                    // if remember me is checked
                    if (this.form.value.rememberMe) {
                        // set _rm cookie to on
                        this.cookieService.set('_rm', 'on');
                        // store in local storage if remember is checked
                        localStorage.setItem('_sr', JSON.stringify(data));
                    } else {
                        // store in session storage if remember is unchecked
                        sessionStorage.setItem('_sr', JSON.stringify(data));
                    }
                    // redirectt to dashboard
                    this.router.navigate(['/dashboard']);
                } else {
                    this.error = response.message;
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
     * Function to apend some class based on some input value when login form fields are focused
     * @since 1.0.0
     * @param field string
     * @param event any
     * @returns void
     */
    public onFocus(field: string, event: any) {
        switch (field) {
            case 'email':
                this.emailFieldFocused = ((<HTMLInputElement>event.target).value === '') ? true : (((<HTMLInputElement>event.target).value === '') ? false : true );
                break;
            case 'password':
                this.passwordFieldFocused = ((<HTMLInputElement>event.target).value === '') ? true : (((<HTMLInputElement>event.target).value === '') ? false : true );
                break;
            default :
                break;
        }
    }

    /**
     * Function to apend some class based on some input value when login form fields are out of focused
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
            default :
                break;
        }
    }
}
