import { Component, OnInit } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-update-payment-info',
  templateUrl: './update-payment-info.component.html',
  styleUrls: ['./update-payment-info.component.scss']
})
export class UpdatePaymentInfoComponent implements OnInit {

  constructor(public ngxSmartModalService: NgxSmartModalService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // const obj: Object = {
    //   prop1: 'test',
    //   prop2: true,
    //   prop3: [{a: 'a', b: 'b'}, {c: 'c', d: 'd'}],
    //   prop4: 327652175423
    // };

    // this.ngxSmartModalService.setModalData(obj, 'myModal');
  }

}
