import { Component, OnInit } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { BrandingService } from '../../../services/branding.service';
import { Log } from '../../../helpers/app.helper';

@Component({
    selector: 'app-branding',
    templateUrl: './branding.component.html',
    styleUrls: ['./branding.component.scss']
})

export class BrandingComponent implements OnInit {
    loader : boolean = false;
    brands : [] = [];

    constructor(public ngxSmartModalService: NgxSmartModalService, private brandingService : BrandingService) {}

    ngAfterViewInit() 
    {
      // const obj: Object = {
      //   prop1: 'test',
      //   prop2: true,
      //   prop3: [{a: 'a', b: 'b'}, {c: 'c', d: 'd'}],
      //   prop4: 327652175423
      // };

      // this.ngxSmartModalService.setModalData(obj, 'myModal');
    }

    ngOnInit() {
        this.loader = true;
        this.brandingService.getAllBrandings().subscribe(
            (data : any) => {
                Log.success(data);
                if(data.status){
                    this.brands = data.response;
                }
                this.loader = false;
            },
            (error : any) => {
                this.loader = false;
                Log.error(error, 'Error from branding component');
            }
        );
    }

}
