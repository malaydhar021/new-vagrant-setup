import { Component, OnInit, Renderer2 } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Log } from '../../helpers/app.helper';
import { AuthService } from '../../services/auth.service';
import { GlobalService } from '../../services/global.service';


/**
 * This component is will handle all sort of operations along with api responses for user login.
 * 
 * @package LoginComponent
 * @author Tier5 LLC `<work@tier5.us>`
 * @version 1.0.0
 * @license Proprietery
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
    error : string = null;
    
    constructor(
        private formBuilder : FormBuilder, 
        private router : Router, 
        private title: Title, 
        private route : ActivatedRoute,
        private authService : AuthService,
        private renderer: Renderer2,
        private globalSevice : GlobalService
    ) 
    { 
        if(this.authService.getToken) this.router.navigate(['/dashboard']);
        this.renderer.addClass(document.body, 'loginPage');
    }
    
    /**
     * Function to initialize angular reactive form object.
     * @since 1.0.0
     * @returns void
     */
    public ngOnInit() 
    {
        // check if the user is logged in or not. if logged in then redirect to dashboard
        if(this.authService.getToken) this.router.navigate(['/dashboard']);
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
     * @returns void
     */
    public onSubmit()
    {
        const auth = {
            email : this.form.value.email,
            password : this.form.value.password
        };
        this.authService.doLogin(auth).subscribe(
            (response : any) => {
                this.globalSevice.canAccessDashboard = true;
                if (localStorage.getItem('_sr')) {
                    localStorage.removeItem('_sr');
                }
                let data = {token : response.token};
                localStorage.setItem('_sr', JSON.stringify(data));
                this.router.navigate(['/dashboard']);
            },
            (error : any) => {
                this.globalSevice.canAccessDashboard = false;
                if(error.hasOwnProperty('error') && error.error.hasOwnProperty('response')) {
                    this.error = error.error.response;
                }
            }
        );
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
