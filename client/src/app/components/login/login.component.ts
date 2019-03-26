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
    form : FormGroup;
    emailFieldFocused : boolean = false;
    passwordFieldFocused : boolean = false;
    event : object = null;
    isLoggedIn : boolean = false;
    authResponse : any;
    rememberMe : boolean = false;
    isSubmitted : boolean = false;
    errMessage : string = null;
    error : string = null;
    loader : boolean = false;
    subscription: Subscription;
    
    constructor(
        private formBuilder : FormBuilder, 
        private router : Router, 
        private title: Title, 
        private route : ActivatedRoute,
        private authService : AuthService,
        private renderer: Renderer2,
        private cookieService: CookieService,
        private errorService: ErrorsService
    ) 
    { 
        if(this.authService.isAuthenticated) this.router.navigate(['/dashboard']);
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
     * @since 1.0.0
     * @returns void
     */
    public ngOnInit() 
    {
        // check if the user is logged in or not. if logged in then redirect to dashboard
        if(this.authService.isAuthenticated) this.router.navigate(['/dashboard']);
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
     * Function to execute when this component is going to destroy by the browser 
     * @since 1.0.0
     * @returns void
     */
    public ngOnDestroy(){
        this.renderer.removeClass(document.body, 'loginPage');
    }
    
    /**
     * Function to do the user loging and handle api response
     * @since 1.0.0
     * @todo Implemented redirected to addons route instead of statically routed to dashboard each and every time
     * @returns void
     */
    public onSubmit() 
    {  
        
        this.isSubmitted = true;
        if(this.form.invalid) {
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
            (response : any) => {
                if (localStorage.getItem('_sr')) {
                    localStorage.removeItem('_sr');
                }
                // creating object to store in localStorage / sessionStorage
                let data = {token : response.token};
                // set the cookie for remember me
                this.cookieService.set('_rm', 'off');
                // if remember me is checked
                if(this.form.value.rememberMe){
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
            }
        );
    }

    /**
     * Getter method to access the login form fields
     * @since 1.0.0
     * @returns void
     */
    public get loginFormControls()
    {
        return this.form.controls;
    }    
    /**
     * Function to apend some class based on some input value when login form fields are focused
     * @since 1.0.0
     * @param field string
     * @param event any
     * @returns void
     */
    public onFocus(field : string, event : any){
        switch(field){
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
    public onFocusOut(field : string, event : any){
        switch(field){
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
