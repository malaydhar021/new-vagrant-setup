import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { MessageModule } from './message.module';
import { SharedModule } from './shared/shared.module';
import { StickyReviewsComponent } from '../components/home/sticky-reviews/sticky-reviews.component';
import { StickyReviewService } from '../services/sticky-review.service';
import { BrandingService } from '../services/branding.service';
import { StickyReviewsRoutingModule } from './routes/sticky-reviews.route.module';
import { BarRatingModule } from 'ngx-bar-rating';
import { OwlDateTimeModule } from 'ng-pick-datetime';
import { MediaModule } from './media.module';

/**
 * Module to deal with all sort of operations for sticky reviews
 * @module StickyReviewsModule
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@NgModule({
  declarations: [
    StickyReviewsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    BarRatingModule,
    StickyReviewsRoutingModule,
    MessageModule,
    NgScrollbarModule,
    NgxPaginationModule,
    SharedModule,
    NgxSmartModalModule.forRoot(),
    OwlDateTimeModule,
    MediaModule
  ],
  providers: [
    StickyReviewService,
    BrandingService
  ]
})
export class StickyReviewsModule {}