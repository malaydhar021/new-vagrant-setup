import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { ErrorsService } from '../../../services/errors.service';

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

export class MessageComponent implements OnInit {

  errorMessage : string = null; // Error Message for the MessageComponent 
  subscription : Subscription;  // Subscription Variable to create server side error message subscriptions 

  /**
   * Constructor to inject required service. It also subscribe to a observable which emits the current
   * value of defined variable. 
   * @constructor constructor
   * @since Version 1.0.0
   * @param errorService 
   * @returns Void
   */
  constructor(
    private errorService: ErrorsService
  ) {
    // A subscription to an error service error message object
    this.subscription = this.errorService.error$.subscribe(
      errMsg => {
          // Assign the error message to the error message template string variable
          this.errorMessage = errMsg;
      }
  );
   }

  ngOnInit() {
  }

}
