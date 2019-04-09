import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { ErrorsService } from '../../../services/errors.service';

@Component({
  selector: 'message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  error : string = null;
  subscription : Subscription;
  constructor(
    private errorService: ErrorsService
  ) {
    this.subscription = this.errorService.error$.subscribe(
      errMsg => {
          this.error = errMsg;
      }
  );
   }

  ngOnInit() {
  }

}
