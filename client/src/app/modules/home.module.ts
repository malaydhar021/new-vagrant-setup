import { NgModule, APP_INITIALIZER }                                       from '@angular/core';
import { CommonModule }                                   from '@angular/common';
import { ReactiveFormsModule, FormsModule }               from '@angular/forms';
import { NgxMaskModule }                                  from 'ngx-mask';
import { OwlDateTimeModule, OwlNativeDateTimeModule }     from 'ng-pick-datetime';
import { NgScrollbarModule }                              from 'ngx-scrollbar';
import { BarRatingModule }                                from 'ngx-bar-rating';
import { NgxSmartModalModule }                            from 'ngx-smart-modal';
/** custom imports */
import { HomeRoutingModule }                from './routes/home.route.module'; // dashobaord routing module
// importing components
import { HomeComponent }                    from '../components/home/home.component';
import { DashboardComponent }               from '../components/home/dashboard/dashboard.component';
import { BrandingComponent }                from '../components/home/branding/branding.component';
import { LeftPanelComponent }               from '../components/home/shared/left-panel/left-panel.component';
import { StickyReviewsComponent }           from '../components/home/sticky-reviews/sticky-reviews.component';
import { CampaignComponent }                from '../components/home/campaign/campaign.component';
import { ReviewLinkComponent }              from '../components/home/review-link/review-link.component';
import { ExitPopupComponent }               from '../components/home/exit-popup/exit-popup.component';
import { HeaderComponent }                  from '../components/home/shared/header/header.component';
import { PlansComponent }                   from '../components/home/plans/plans.component';
import { UpdatePaymentInfoComponent }       from '../components/home/update-payment-info/update-payment-info.component';
import {ProfileComponent}                   from '../components/home/shared/profile/profile.component';
import {CancelMembershipComponent}          from '../components/home/cancel-membership/cancel-membership.component';
//importing module
import { MessageModule}                     from '../components/shared/message/message.module'
// importing services
import { ColorPickerModule }                from 'ngx-color-picker';
import { BrandingService }                  from '../services/branding.service'; // services for branding
import { CampaignService }                  from '../services/campaign.service';
import { StickyReviewService }              from '../services/sticky-review.service';
import { MenuService }                      from '../services/menu.service';
import { MediaModule }                      from './media.module';
import { MediaService }                     from '../services/media.service';
import { ExitPopupService }                 from '../services/exit-popup.service';
import { WidgetStylesModule }               from './widget-styles.module';
import { DigitsOnlyDirective }              from '../directives/digits-only.directive';
import { CopyToClipboardDirective }         from '../directives/copy-to-clipboard.directive';
import { ClickOutsideDirective }            from '../directives/click-outside.directive';
import { NgxPaginationModule } from 'ngx-pagination';

/**
 * HomeModule is loading all components and services along with few angular modules once the user is logged in.
 * @class HomeModule
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@NgModule({
  declarations: [
    HomeComponent,
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
    ProfileComponent,
    CancelMembershipComponent,
    DigitsOnlyDirective,
    CopyToClipboardDirective,
    ClickOutsideDirective,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HomeRoutingModule,
    NgScrollbarModule,
    BarRatingModule,
    NgxSmartModalModule.forRoot(),
    NgxMaskModule.forRoot(),
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MessageModule,
    ColorPickerModule,
    MediaModule,
    WidgetStylesModule,
    NgxPaginationModule,
  ],
  providers: [
    BrandingService,
    CampaignService,
    StickyReviewService,
    MenuService,
    ExitPopupService,
    MediaService,
  ]
})
export class HomeModule { }
