import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { MessageModule } from './message.module';
import { SharedModule } from './shared/shared.module';
import { ReviewLinkComponent } from '../components/home/review-link/review-link.component';
import { ReviewLinkService } from '../services/review-link.service';
import { ReviewLinkRoutingModule } from './routes/review-link.route.module';
import { BarRatingModule } from 'ngx-bar-rating';
import { ColorPickerModule } from 'ngx-color-picker';
import { CustomDomainService } from '../services/custom-domain.service';

/**
 * Module to deal with all sort of operations for review link
 * @module ReviewLinkModule
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@NgModule({
  declarations: [
    ReviewLinkComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ReviewLinkRoutingModule,
    MessageModule,
    NgScrollbarModule,
    NgxPaginationModule,
    SharedModule,
    NgxSmartModalModule.forRoot(),
    BarRatingModule,
    ColorPickerModule
  ],
  providers: [
    ReviewLinkService,
    CustomDomainService
  ]
})
export class ReviewLinkModule {}