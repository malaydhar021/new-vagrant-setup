import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { ErrorsService } from '../../../services/errors.service';
import { LoaderService } from '../../../services/loader.service';

/**
 * MessageComponent is responsible for showing messages when a server sends an error message
 * @class BrandingComponent
 * @version 1.0.0
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
  errorMessage: string = null; // Error Message for the MessageComponent
  validationErrorMessages: string[] = []; // Error Message for the MessageComponent 
  subscription: Subscription;  // Subscription Variable to create server side error message subscriptions 
  validationSubscription: Subscription;  // Subscription Variable to create server side validation error message subscriptions 

  // This property is bound using its original name.
  @Input() successMessage?: string = '';
  @Input() warningMessage?: string = '';
  @Input() showMessage?: string = '';

  /**
   * Constructor to inject required service. It also subscribe to a observable which emits the current
   * value of defined variable. 
   * @constructor constructor
   * @since Version 1.0.0
   * @param errorService 
   * @returns Void
   */
  constructor(
    private errorService: ErrorsService,
    private loaderService: LoaderService,
  ) {
    // A subscription to an error service error message object
    this.subscription = this.errorService.error$.subscribe(
      errMsg => {
        // Assign the error message to the error message template string variable
        this.loaderService.disableLoader();
        this.errorMessage = errMsg;
        setTimeout(() => {
          this.errorMessage = ''
        }, 3000)
      }
    );

    // update validationErrors if anything has been caught by our error interceptor
    this.validationSubscription = this.errorService.validationErrors$.subscribe(
      validationErrMsg => {
        this.loaderService.disableLoader();
        this.validationErrorMessages = Object.values(validationErrMsg);
        setTimeout(() => {
          this.validationErrorMessages = [];
        }, 3000)
      }
    );
  }

  /**
  * @method ngOnInit
  */
  public ngOnInit() { }

  /**
   * @method ngOnDestroy
   */
  public ngOnDestroy() {
    this.subscription.unsubscribe();
    this.validationSubscription.unsubscribe();
  }
}