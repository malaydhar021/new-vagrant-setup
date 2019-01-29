import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthenticateserviceService} from '../authenticateservice.service';
import {Router} from '@angular/router';
import {Constants} from '../constants';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(protected auth: AuthenticateserviceService, private router: Router) { }

  name: string;
  email: string;
  password: string;
  errFlg: boolean;
  errObject: any;
  signupResponse: any;
  showForm: boolean;
  fetchStripePlansResp: any;
  stripePlansArr: any;
  errString: string;
  passwordFlg: boolean;
  passMatch: string;
  monthArr: any;
  yearArr: any;
  cardType: string;
  myPayOptions: boolean;
  userDetailsResponse: any;
  formBusy: boolean;
  isMaintenance: boolean;
  ngOnInit() {
    this.stripePlansArr  = [];
    this.monthArr        = [];
    this.yearArr         = [];
    this.errFlg          = false;
    this.errObject       = null;
    this.showForm        = true;
    this.passwordFlg     = false;
    this.passMatch       = null;
    this.myPayOptions    = false;
    this.cardType        = 'undefined-card';
    this.getStripePlans();
    this.setupMonthArray();
    this.setupYearArray();
    this.formBusy = false;
    this.isMaintenance = environment.maintenance;
  }

   /**
   * this function register a user to the system
   * @param {NgForm} loginFormData
   */
  onSubmit(signupFormData: NgForm) {
    if (signupFormData.value.name && signupFormData.value.email && signupFormData.value.password &&
      signupFormData.value.password_confirmation && signupFormData.value.stripe_plan && signupFormData.value.card_no &&
      signupFormData.value.month && signupFormData.value.year && signupFormData.value.cvc) {
        if (signupFormData.value.password === signupFormData.value.password_confirmation) {
          this.formBusy = true;
          this.signupResponse = this.auth.doSignup({
            'name'                  : signupFormData.value.name,
            'email'                 : signupFormData.value.email,
            'password'              : signupFormData.value.password,
            'password_confirmation' : signupFormData.value.password_confirmation,
            'stripe_plan'           : signupFormData.value.stripe_plan,
            'card_no'               : signupFormData.value.card_no,
            'month'                 : signupFormData.value.month,
            'year'                  : signupFormData.value.year,
            'cvc'                   : signupFormData.value.cvc
          });
          if (localStorage.getItem('_tok')) {
            localStorage.removeItem('_tok');
          }
          localStorage.removeItem('_cu');
          this.signupResponse.subscribe(
            data => {
              if (data.status) {
                this.formBusy = false;
                this.setLocalData(data.token);
              }
            },
            error => {
              this.formBusy = false;
              this.errFlg = true;
              if (error.hasOwnProperty('error')) {
                if (error.error.hasOwnProperty('response')) {
                  this.errString = error.error.response;
                }
              }
              if (error.error.errors === null || error.error.errors === undefined) {
                if (error.hasOwnProperty('error')) {
                  if (error.error.hasOwnProperty('response')) {
                    this.errString = error.error.response;
                  }
                }
              } else {
                this.errString = JSON.stringify(error.error.errors);
              }
            }
          );
        } else {
          this.formBusy = false;
          this.errFlg = true;
          this.errString = 'Password and confirm password did not match!';
        }
    } else {
      this.formBusy = false;
      this.errFlg = true;
      this.errString = 'Missing expected params!';
    }
  }

  /**
   * this function fetch all the stripe plans to generate dropdowns
   */
  getStripePlans(): void {
    this.fetchStripePlansResp = this.auth.getStripePlans();
    this.fetchStripePlansResp.subscribe(
      data => {
        if (data.status) {
          this.stripePlansArr = data.response.data;
        } else {
          this.errFlg = true;
          this.errString = 'Something went wrong. Please try again later';
        }
      },
      error => {
        this.errFlg = true;
        if (error.hasOwnProperty('error')) {
          if (error.error.hasOwnProperty('response')) {
            this.errString = error.error.response;
          }
        }
        console.log(this.errString);
      }
    );
  }

  /**
   *closes error div
   */
  closeDiv(): void {
    this.errFlg     = false;
    this.errString  = null;
  }

  /**
   * this handles password and confirm password match
   * @param password
   * @param confirm_password
   */
  handleMatch(password, confirm_password): void {
    if (password !== confirm_password) {
      this.passwordFlg = true;
      this.passMatch = 'Password and confirm password did not match';
    } else {
      this.passwordFlg = false;
      this.passMatch = null;
    }
  }

  /**
   * set up months array for credit card form
   */
  setupMonthArray(): void {
    for (let i = 1; i <= 12; i++) {
      this.monthArr.push(i);
    }
  }

  /**
   * set up years array for credit card form
   */
  setupYearArray(): void {
    const dateObj = new Date();
    for (let i = dateObj.getUTCFullYear(); i <= dateObj.getUTCFullYear() + Constants.dateRange; i++  ) {
      this.yearArr.push(i);
    }
  }

  /**
   * this function checks unser Input for credit card type
   * @param {number} creditCardNumber
   */
  checkCreditCardType(creditCardNumber: number): void {
    const ccNumber = creditCardNumber.toString();
    const re = {
      electron: /^(4026|417500|4405|4508|4844|4913|4917)\d+$/,
      maestro: /^(5018|5020|5038|5612|5893|6304|6759|6761|6762|6763|0604|6390)\d+$/,
      dankort: /^(5019)\d+$/,
      interpayment: /^(636)\d+$/,
      unionpay: /^(62|88)\d+$/,
      visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
      mastercard: /^5[1-5]\d{2}-?\d{4}-?\d{4}-?\d{4}$|^2(?:2(?:2[1-9]|[3-9]\d)|[3-6]\d\d|7(?:[01]\d|20))-?\d{4}-?\d{4}-?\d{4}$/,
      amex: /^3[47][0-9]{13}$/,
      diners: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
      discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
      jcb: /^(?:2131|1800|35\d{3})\d{11}$/
    };
    if (re.electron.test(ccNumber)) {
      this.cardType =  'ELECTRON';
    } else if (re.maestro.test(ccNumber)) {
      this.cardType = 'MAESTRO';
    } else if (re.dankort.test(ccNumber)) {
      this.cardType = 'DANKORT';
    } else if (re.interpayment.test(ccNumber)) {
      this.cardType = 'INTERPAYMENT';
    } else if (re.unionpay.test(ccNumber)) {
      this.cardType = 'UNIONPAY';
    } else if (re.visa.test(ccNumber)) {
      this.cardType = 'VISA';
    } else if (re.mastercard.test(ccNumber)) {
      this.cardType = 'MASTERCARD';
    } else if (re.amex.test(ccNumber)) {
      this.cardType = 'AMEX';
    } else if (re.diners.test(ccNumber)) {
      this.cardType = 'DINERS';
    } else if (re.discover.test(ccNumber)) {
      this.cardType = 'DISCOVER';
    } else if (re.jcb.test(ccNumber)) {
      this.cardType = 'JCB';
    } else {
      this.cardType = 'undefined-card';
    }
  }

  /**
   * based on selection it shows payment option
   * @param {string} eventValue
   */
  showPaymentOptions(eventValue: string): void {
    if (eventValue.length) {
      this.myPayOptions = true;
    } else {
      this.myPayOptions = false;
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
}
