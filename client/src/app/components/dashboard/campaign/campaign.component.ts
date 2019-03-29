import { Component, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.scss']
})
export class CampaignComponent implements OnInit {

  constructor(public ngxSmartModalService: NgxSmartModalService) { }

  public windowHeight: any;
  public scrollTrigger = false;
  viewHeight: number;

  @ViewChild('mainScreen') elementView: ElementRef;

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
    this.windowHeight = window.innerHeight - 280;
  }

  @HostListener('window:resize', ['$event'])
    onResize(event) {
    this.viewHeight = this.elementView.nativeElement.offsetHeight;
    this.windowHeight = window.innerHeight - 280;
    console.log(this.windowHeight);

    if (this.viewHeight > this.windowHeight) {
      this.scrollTrigger = true;
    } else {
      this.scrollTrigger = false;
    }
  }
    clickMe() {
      this.viewHeight = this.elementView.nativeElement.offsetHeight;

      if (this.viewHeight > this.windowHeight) {
        this.scrollTrigger = true;
      } else {
        this.scrollTrigger = false;
      }
    }
}
