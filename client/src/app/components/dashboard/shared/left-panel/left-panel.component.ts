import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MenuService } from '../../../../services/menu.service';

@Component({
  selector: 'app-left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.scss']
})
export class LeftPanelComponent implements OnInit, OnDestroy {
  allRoute: any = {};
  subscription: Subscription;
  isActive: boolean = false;
  
  constructor( private menuService: MenuService) {
    this.allRoute = {
      '' : ['/dashboard'],
      'branding' : ['/dashboard/branding'],
      'campaign' : ['/dashboard/campaign'],
      'sticky-reviews' : ['/dashboard/sticky-reviews'],
      'review-link' : ['/dashboard/review-link'],
      'exit-popup' : ['/dashboard/exit-popup'],
      'update-payment-info' : ['/dashboard/update-payment-info'],
    };
    
    this.subscription = this.menuService.activeMenu$.subscribe(
      status => {
        this.isActive = status;
      }
    );
    
   }

  ngOnInit() {

  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
