import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { BarRatingModule } from 'ngx-bar-rating';
import { NgxSmartModalModule } from 'ngx-smart-modal';
/** custom imports */
import { DashboardRoutingModule } from './routes/dashboard.route.module'; // dashobaord routing module
// importing components
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { BrandingComponent } from '../components/dashboard/branding/branding.component';
import { LeftPanelComponent } from '../components/dashboard/shared/left-panel/left-panel.component';
import { StickyReviewsComponent } from '../components/dashboard/sticky-reviews/sticky-reviews.component';
import { CampaignComponent } from '../components/dashboard/campaign/campaign.component';
import { ReviewLinkComponent } from '../components/dashboard/review-link/review-link.component';
import { ExitPopupComponent } from '../components/dashboard/exit-popup/exit-popup.component';
import { HeaderComponent } from '../components/dashboard/shared/header/header.component';
import { PlansComponent } from '../components/dashboard/plans/plans.component';
import { UpdatePaymentInfoComponent } from '../components/dashboard/update-payment-info/update-payment-info.component';
import {ProfileComponent} from '../components/dashboard/shared/profile/profile.component';

import { MessageModule} from '../components/shared/message/message.module'
// importing services
import { BrandingService } from '../services/branding.service'; // services for branding
import { CampaignService } from '../services/campaign.service';
import { StickyReviewService } from '../services/sticky-review.service';
import { MenuService } from '../services/menu.service';





/**
 * DashboardModule is loading all components and services along with few angular modules once the user is logged in.
 * @class DashboardModule
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
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
    UpdatePaymentInfoComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DashboardRoutingModule,
    NgScrollbarModule,
    BarRatingModule,
    NgxSmartModalModule.forRoot(),
    NgxMaskModule.forRoot(),
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MessageModule
  ],
  providers: [
    BrandingService,
    CampaignService,
    StickyReviewService,
    MenuService
  ]
})
export class DashboardModule { }
