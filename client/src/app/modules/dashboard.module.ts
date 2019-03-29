import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxMaskModule } from 'ngx-mask';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

import { DashboardRoutingModule } from './routes/dashboard.route.module';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { BrandingComponent } from '../components/dashboard/branding/branding.component';
import { LeftPanelComponent } from '../components/dashboard/left-panel/left-panel.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { BarRatingModule } from 'ngx-bar-rating';
import { StickyReviewsComponent } from '../components/dashboard/sticky-reviews/sticky-reviews.component';
import { CampaignComponent } from '../components/dashboard/campaign/campaign.component';
import { ReviewLinkComponent } from '../components/dashboard/review-link/review-link.component';
import { ExitPopupComponent } from '../components/dashboard/exit-popup/exit-popup.component';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { HeaderComponent } from '../components/dashboard/header/header.component';
import { PlansComponent } from '../components/dashboard/plans/plans.component';
import { UpdatePaymentInfoComponent } from '../components/dashboard/update-payment-info/update-payment-info.component';
import { BrandingService } from '../services/branding.service';

@NgModule({
  declarations: [
    DashboardComponent,
    BrandingComponent,
    LeftPanelComponent,
    StickyReviewsComponent,
    CampaignComponent,
    ReviewLinkComponent,
    ExitPopupComponent,
    HeaderComponent,
    PlansComponent,
    UpdatePaymentInfoComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NgScrollbarModule,
    BarRatingModule,
    NgxSmartModalModule.forRoot(),
    NgxMaskModule.forRoot(),
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ],
  providers: [
    BrandingService
  ]
})
export class DashboardModule { }
