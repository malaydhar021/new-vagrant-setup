import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard-home/dashboard.component';
import { BrandingComponent } from './branding/branding.component';
import { LeftPanelComponent } from './left-panel/left-panel.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { BarRatingModule } from "ngx-bar-rating";
import { StickyReviewsComponent } from './sticky-reviews/sticky-reviews.component';
import { CampaignComponent } from './campaign/campaign.component';
import { ReviewLinkComponent } from './review-link/review-link.component';
import { ExitPopupComponent } from './exit-popup/exit-popup.component';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { HeaderComponent } from './header/header.component';
import { PlansComponent } from './plans/plans.component';
import { UpdatePaymentInfoComponent } from './update-payment-info/update-payment-info.component';


@NgModule({
  declarations: [
    DashboardComponent, 
    BrandingComponent, 
    LeftPanelComponent, 
    StickyReviewsComponent, 
    CampaignComponent, 
    ReviewLinkComponent, 
    ExitPopupComponent, HeaderComponent, PlansComponent, UpdatePaymentInfoComponent
  ],
  
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NgScrollbarModule,
    BarRatingModule,
    NgxSmartModalModule.forRoot(),
  ]
})
export class DashboardModule { }
