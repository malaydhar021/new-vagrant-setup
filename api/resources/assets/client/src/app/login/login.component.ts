import {Component, isDevMode, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthenticateserviceService} from '../authenticateservice.service';
import {Router} from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(protected auth: AuthenticateserviceService, private router: Router) { }
  email: string;
  password: string;
  remember_me: boolean;
  errFlg: boolean;
  errString: string;
  authResponse: any;
  userDetailsResponse: any;
  isMaintenance: boolean;
  showCookiesPolicy: boolean;

  /**
   * LoginComponent's constructor
   */
  ngOnInit() {
    this.errFlg = false;
    this.errString = null;
    if (isDevMode()) {
      console.log('Your application is in development mode');
    } else {
      console.log('Your application running in production mode');
    }
    this.isMaintenance = environment.maintenance;
    this.showCookiesPolicy = true;
  }

  /**
   * this function authenticate one user to the system
   * @param {NgForm} loginFormData
   */
  onSubmit(loginFormData: NgForm) {
    this.email = loginFormData.value.email;
    this.password = loginFormData.value.password;
    this.remember_me = loginFormData.value.remember_me;
    if (this.email.length && this.password.length) {
      if (localStorage.getItem('_tok')) {
        localStorage.removeItem('_tok');
      }
      localStorage.removeItem('_cu');
      this.authResponse = this.auth.doLogin({'email': this.email, 'password': this.password});
      this.authResponse.subscribe(
        data => {
          if (data.status) {
              this.setLocalData(data.token);
          }
        },
        error => {
          this.errFlg = true;
          if (error.hasOwnProperty('error')) {
            if (error.error.hasOwnProperty('response')) {
              this.errString = error.error.response;
            }
          }
        }
      );
    } else {
      this.errFlg = true;
      this.errString = 'Missing expected params';
      return false;
    }
  }

  /**
   * this function set local storage after login
   * @param {string} token
   */
  setLocalData(token: string) {
    this.userDetailsResponse = this.auth.getUserDetails(token);
    this.userDetailsResponse.subscribe(
      data => {
        localStorage.setItem('_tok', token);
        localStorage.setItem('_cu', JSON.stringify(data.response));
        // route to dashboard
        this.router.navigate(['/dashboard']);
      },
      error => {
        this.errFlg = true;
        if (error.hasOwnProperty('error')) {
          if (error.error.hasOwnProperty('response')) {
            this.errString = error.error.response;
          }
        }
      }
    );
  }

  /**
   * this function closes the error div
   */
  closeDiv() {
    this.errFlg = false;
    this.errString = null;
  }
  offPolicy() {
    this.showCookiesPolicy = false;
  }
}
