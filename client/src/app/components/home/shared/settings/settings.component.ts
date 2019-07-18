import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { LoaderService } from '../../../../services/loader.service';
import { UserService } from '../../../../services/user.service';
import { UserAuthInfo } from '../../../../models/user.model';
import { ErrorsService } from '../../../../services/errors.service';
import { Title } from '@angular/platform-browser';


/**
 * ProfileComponent is responsible for updating user's profile
 * @class ProfileComponent
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {
  // defining class properties
  userZapierTokenForm: FormGroup; // Form group for user password update form
  successMessage: string = ''; // Message coming form server after successful api call
  userInfo: UserAuthInfo;
  token: [] = [];
  errorSubscription: Subscription; // to get the current value of showError property
  showError: boolean = false; // flag to show error message
  isModalOpened: boolean = false; // set to true if the modal is opened

  /**
   * Constructor to inject required service. It also subscribe to a observable which emits the current
   * value of defined variable.
   * @constructor constructor
   * @since Version 1.0.0
   * @param ngxSmartModalService
   * @param formBuilder
   * @param userService
   * @returns Void
   */
  constructor(
    private title: Title,
    private ngxSmartModalService: NgxSmartModalService,
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    private userService: UserService,
    private errorService: ErrorsService
  ) {
    this.errorSubscription = this.errorService.showMessage$.subscribe(
      (status: boolean) => {
        this.showError = status;
      }
    );
  }

  /**
   * ngOnInit method initialize angular reactive form object for add / edit form of a brand.
   * Also it set the title of the page. Also it defines client side validations.
   * @method ngOnInit
   * @since Version 1.0.0
   * @returns Void
   */
  public ngOnInit() {
    this.title.setTitle('Stickyreviews :: Settings');
    this.userZapierTokenForm = this.formBuilder.group({
      tokenName: ['', Validators.required],
    });
    this.getUserZapierToken();
  }

  /**
   * Method that unsubscribed to a subscription and clear messages if any
   * when this component is being destroyed
   * @method ngOnDestroy
   * @since Version 1.0.0
   * @returns Void
   */
  public ngOnDestroy() {
    this.errorSubscription.unsubscribe();
    this.errorService.clearMessage();
  }

  /**
   * Function to fetch the zapier tokens
   * @method getUserZapierToken
   * @since Version 1.0.0
   * @returns Void
   */
  public getUserZapierToken() {
    this.loaderService.enableLoader();
    this.userService.showToken().subscribe(
      (response: any) => {
        this.token = response.data.data;
        this.loaderService.disableLoader();
      }
    );
  }

  /**
   * Method to create a zapier token
   */
  public onCreateToken() {
    // values from the form element
    const tokenName = this.userZapierTokenForm.value;
    this.loaderService.enableLoader();
    this.userService.createToken(tokenName).subscribe(
      (response: any) => {
        if (response.data.status) {
          this.userZapierTokenForm.reset();
          this.token = response.data.data;
          this.getUserZapierToken();
        } else {
          this.token = response.data.data;
          this.getUserZapierToken();
        }
        // set success message to show to user
        this.errorService.setMessage({type: 'success', message: response.data.message});
        // hide the loader
        this.loaderService.disableLoader();
      }
    );
  }

  /**
   * Function to copy token
   * @param val
   */
  public copyText(val: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    // set the success message to show to user
    this.errorService.setMessage({type: 'success', message: 'Token has been copied to clipboard'});
  }

  /**
   * Method for deleting the token
   * @param tokenID
   */
  public onDeleteToken(tokenID: string) {
    // ask user for confirmation
    if (!confirm('Are you sure want to delete?')) {
      return;
    }
    this.loaderService.enableLoader();
    this.userService.deleteToken(tokenID).subscribe(
      (response: any) => {
        console.log(response.data.data);
        this.token = response.data.data;
        this.loaderService.disableLoader();
      }
    );
    this.getUserZapierToken();
  }
}