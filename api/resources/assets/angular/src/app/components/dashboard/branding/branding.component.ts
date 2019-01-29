import { Component, OnInit } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-branding',
  templateUrl: './branding.component.html',
  styleUrls: ['./branding.component.scss']
})
export class BrandingComponent implements OnInit {

  constructor(public ngxSmartModalService: NgxSmartModalService) { }

  ngAfterViewInit() {
    // const obj: Object = {
    //   prop1: 'test',
    //   prop2: true,
    //   prop3: [{a: 'a', b: 'b'}, {c: 'c', d: 'd'}],
    //   prop4: 327652175423
    // };

    // this.ngxSmartModalService.setModalData(obj, 'myModal');
  }

  ngOnInit() {
  }

}
