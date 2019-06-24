import { Component, OnInit, Input, OnDestroy, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';

import { ErrorsService } from '../../../services/errors.service';
import { LoaderService } from '../../../services/loader.service';
import { Log } from 'src/app/helpers/app.helper';

/**
 * MessageComponent is responsible for showing messages when a server sends an error message
 * @class BrandingComponent
 * @version 2.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@Component({
  selector: 'message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit, OnDestroy {
  // declaring class properties
  errMsg: string = ''; // Error Message for the MessageComponent
  validationErrorMessages: string[] = []; // Error Message for the MessageComponent 
  subscription: Subscription;  // Subscription variable to create server side error message subscriptions 
  validationSubscription: Subscription;  // Subscription variable to create server side validation error message subscriptions 
  messageSubscription: Subscription;  // Subscription variable to create server side validation for success|warning|error message subscriptions 
  showValidationMessage: boolean = true; // flag to show each validation messages

  // This property is bound using its original name
  @Input() errorMessage?: string = '';
  @Input() successMessage?: string = '';
  @Input() warningMessage?: string = '';
  @Input() showMessage?: string = '';

  /**
   * Constructor to inject required service. It also subscribe to a observable which emits the current
   * value of defined variable. 
   * @constructor constructor
   * @since Version 1.0.0
   * @param errorService ErrorsService instance
   * @param loaderService LoaderService instance
   * @returns Void
   */
  constructor(
    private errorService: ErrorsService,
    private loaderService: LoaderService,
  ) {
    // A subscription to an error service error message object
    this.subscription = this.errorService.error$.subscribe(
      errMsg => {
        if(errMsg === null || errMsg === '') return;
        // Assign the error message to the error message template string variable
        this.loaderService.disableLoader();
        this.errMsg = errMsg;
      }
    );

    // update validationErrors if anything has been caught by our error interceptor
    this.validationSubscription = this.errorService.validationErrors$.subscribe(
      validationErrMsg => {
        if(validationErrMsg === null || validationErrMsg === '') return;
        this.loaderService.disableLoader();
        this.validationErrorMessages = Object.values(validationErrMsg);
      }
    );

    // update message set from mostly from different components for 200 http status response
    this.messageSubscription = this.errorService.message$.subscribe(
      message => {
        Log.info(message, "log message into message component");
        if(message === null || message === '') return;
        // this.loaderService.disableLoader();
        switch(message.type){
          case 'success':
            this.successMessage = message.message;
            break;
          case 'warning':
            this.warningMessage = message.message;
            break;
          case 'error':
            this.errorMessage = message.message;
            break;
          default:
            break;
        }
      }
    );
  }

  /**
  * @method ngOnInit
  * @since Version 1.0.0
  * @returns Void
  */
  public ngOnInit() { }

  /**
   * @method ngOnDestroy
   * @since Version 1.0.0
   * @returns Void
   */
  public ngOnDestroy() {
    // this.errorService.updateMessage('');
    // this.errorService.updateValidationMessage('');
    this.subscription.unsubscribe();
    this.validationSubscription.unsubscribe();
    this.messageSubscription.unsubscribe();
  }

  /**
   * Method to hide the alert message block in UI once the close icon is clicked
   * @method onClose
   * @since Version 2.0.0
   * @param messageType Type of message. ```PM => Primary Message | VM => Validation Message | EM => Error Message | SM => Success Message | WM => Warning Message```
   * @returns Void
   */
  public onClose(messageType: string, removeMessage: string = null) {
    Log.info(messageType, 'Type of error message');
    // do nothing if no message type has been provided
    if(messageType === null || messageType === '') return;
    switch(messageType) {
      case "PM":
        this.errorService.updateMessage('');
        this.errMsg = '';
        break;
      case "VM":
        this.validationErrorMessages = this.validationErrorMessages.filter(message => message !== removeMessage);
        break;
      case "EM":
        this.errorMessage = '';
        this.errorService.setMessage(null);
        break;
      case "SM":
        this.successMessage = '';
        this.errorService.setMessage(null);
        break;
      case "WM":
        this.warningMessage = '';
        this.errorService.setMessage(null);
        break;
      default:
        break;
    }
  }
}