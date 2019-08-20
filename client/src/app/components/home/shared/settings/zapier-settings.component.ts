import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { LoaderService } from '../../../../services/loader.service';
import { UserService } from '../../../../services/user.service';
import { UserAuthInfo } from '../../../../models/user.model';
import { ErrorsService } from '../../../../services/errors.service';
import { Title } from '@angular/platform-browser';
import { Log } from 'src/app/helpers/app.helper';


/**
 * ProfileComponent is responsible for updating user's profile
 * @class ProfileComponent
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@Component({
  selector: 'app-zapier-settings',
  templateUrl: './zapier-settings.component.html',
  styleUrls: ['./zapier-settings.component.scss']
})
export class ZapierSettingsComponent implements OnInit, OnDestroy {
  // defining class properties
  userZapierTokenForm: FormGroup; // Form group for user password update form
  successMessage: string = ''; // Message coming form server after successful api call
  userInfo: UserAuthInfo;
  token: [] = [];
  errorSubscription: Subscription; // to get the current value of showError property
  showError: boolean = false; // flag to show error message
  isModalOpened: boolean = false; // set to true if the modal is opened
  showTheMessage: boolean = false;
  tokenIdToDelete: string = null;
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
    this.showTheMessage = true;
    this.title.setTitle('Stickyreviews :: Zapier Settings');
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
    const tokenName = this.userZapierTokenForm.value;
    this.loaderService.enableLoader();
    this.userService.createToken(tokenName).subscribe(
      (response: any) => {
        this.loaderService.disableLoader();
        if (response.data.status) {          
          this.ngxSmartModalService.getModal('modal1').close();          
          this.userZapierTokenForm.reset();          
          this.getUserZapierToken();
        } else {
          this.getUserZapierToken();
          this.errorService.setMessage({type: 'error', message: response.data.message});
        }
        
      }
    );
  }

  /**
   * Function to copy token
   * @param val
   */
  public copyText(val: string) {
    this.showTheMessage = true;
    this.isModalOpened = false;
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
   * Method to open delete modal
   * @param tokenID
   */
  public onDeleteToken(tokenID: string) {
    this.tokenIdToDelete = tokenID;
    this.ngxSmartModalService.getModal('deleteModal').open();
  }

  /**
   * Method to open add token modal
   */
  public onAddToken() {
    this.showTheMessage = false;
    this.isModalOpened = true;
    this.userZapierTokenForm.reset();
    this.userZapierTokenForm = this.formBuilder.group({
      tokenName: ['', Validators.required],
    });
    this.errorService.clearMessage();
    this.ngxSmartModalService.getModal('modal1').open();
  }

  /**
   * Method to delete a zapier token
   * @param tokenID
   */
  public delete(tokenID) {
    this.loaderService.enableLoader();
    this.userService.deleteToken(tokenID).subscribe(
      (response: any) => {
        this.ngxSmartModalService.getModal('deleteModal').close();
        this.loaderService.disableLoader();
        this.getUserZapierToken();
      }
    );
  }

}
