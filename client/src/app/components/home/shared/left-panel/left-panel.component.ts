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
      '' : ['/home'],
      'dashboard' : ['/home/dashboard'],
      'branding' : ['/home/branding'],
      'campaign' : ['/home/campaign'],
      'sticky-reviews' : ['/home/sticky-reviews'],
      'review-link' : ['/home/review-link'],
      'exit-popup' : ['/home/exit-popup'],
      'update-payment-info' : ['/home/update-payment-info'],
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
