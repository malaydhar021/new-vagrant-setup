import { Component, OnInit, OnDestroy } from '@angular/core';
import { environment } from '../../environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {SettingserviceService} from '../settingservice.service';
import {Observable} from 'rxjs/Observable';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, OnDestroy {

  constructor(private fb: FormBuilder, private settingService: SettingserviceService, private router: Router) {
    this.navigationSubscription = this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.init();
      }
    });
  }

  addUserEndPoint: string;
  successResponseTemplate: string;
  badRequestResponseTemplate: string;
  myApiKey: string;
  deleteUserEndPoint: string;
  deleteUserResponses: Array<any>;
  updateUserStatusEndPoint: string;
  updateUserStatusResponses: Array<any>;
  userObj: any;
  changePasswordForm: FormGroup;
  savingData: boolean;
  errFlg: boolean;
  errString: string;
  changePasswordResp: Observable<any>;
  successFlg: boolean;
  successString: string;
  navigationSubscription: Subscription;

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
   }
  }

  init() {
    this.addUserEndPoint = environment.API_BASE_URL + '/signup-user';
    this.successResponseTemplate = `{
      "status" => true,
      "response" => "Successfully created the user! By default password has been set to 123456, do change it after you login"}
    `;
    this.badRequestResponseTemplate = '{"status" => false, "response" => "Missing expected param!"}';
    this.deleteUserEndPoint = environment.API_BASE_URL + '/delete-user';
    this.deleteUserResponses = [
      `{
        "status" => true,
        "response" => "Successfully deleted the user!"
      }`, `{
        "status" => false,
        "response" => "Something went wrong while deleting the record!"
      }`, `{
        "status" => false,
        "response" => "Missing expected param either authorization bearer or uid"
      }`, `{
        "status" => false,
        "response" => "Failed to authenticate. Please get your api key to continue!
        Hint: you can get your api key in settings section. In header authorization key is missing"
      }`, `{
        "status" => false,
        "response" => "No Records found with the email"
      }`
    ];
    this.updateUserStatusEndPoint = environment.API_BASE_URL + '/alter-user-state';
    this.updateUserStatusResponses = [
      `{
        "status" => true,
        "response" => "Successfully updated the user!"
      }`, `{
        "status" => false,
        "response" => "Something went wrong while updating the record!"
      }`, `{
        "status" => false,
        "response" => "Missing expected param!"
      }`, `{
        "status" => false,
        "response" => "Failed to authenticate. Please get your api key to continue! Hint: you can get your api key in settings section."
      }`
    ];
    this.userObj = JSON.parse(localStorage.getItem('_cu'));
    this.myApiKey = this.userObj.api_token;
    this.createChangePasswordForm();
    this.savingData = false;
    this.errFlg = false;
    this.errString = '';
    this.successFlg = false;
    this.successString = null;
  }

  createChangePasswordForm() {
    this.changePasswordForm = this.fb.group({
      current_password: ['', Validators.required],
      new_password: ['', Validators.required],
      confirm_new_password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.changePasswordForm.valid) {
      if (this.changePasswordForm.value.new_password === this.changePasswordForm.value.confirm_new_password) {
        this.savingData = true;
        this.changePasswordResp = this.settingService.changePassword({
          uid: JSON.parse(localStorage.getItem('_cu')).id,
          current_password: this.changePasswordForm.value.current_password,
          new_password: this.changePasswordForm.value.new_password
        });
        this.changePasswordResp.subscribe(data => {
          this.savingData = false;
          if (data.status) {
            this.successFlg = true;
            this.successString = data.response;
            this.changePasswordForm.reset();
            this.errFlg = false;
            this.errString = null;
          } else {
            this.savingData = false;
            this.errFlg = true;
            this.errString = 'Something went wrong while saving campaign.';
          }
        }, error => {
          this.savingData = false;
          this.errFlg = true;
          if (error.hasOwnProperty('error')) {
            if (error.error.hasOwnProperty('response')) {
              this.errString = error.error.response;
            }
          }
        });
      } else {
        this.errFlg =  true;
        this.errString = 'Password and confirm password did not match!';
      }
    } else {
      this.errFlg =  true;
      this.errString = 'Please fill up the form correctly';
    }
  }

  closeDiv() {
    this.errFlg = false;
    this.errString = null;
  }
}
