import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { MessageModule } from './message.module';
import { UpdatePaymentInfoComponent } from '../components/home/update-payment-info/update-payment-info.component';
import { UpdatePaymentInfoRoutingModule } from './routes/update-payment-info.route.module';
import { NgxMaskModule } from 'ngx-mask';
import { SubscriptionService } from '../services/subscription.service';

/**
 * Module to deal with all sort of operations for branding
 * @module BrandingModule
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@NgModule({
  declarations: [
    UpdatePaymentInfoComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    UpdatePaymentInfoRoutingModule,
    MessageModule,
    NgScrollbarModule,
    NgxPaginationModule,
    NgxSmartModalModule.forRoot(),
    NgxMaskModule.forRoot()
  ],
  providers: [
    SubscriptionService
  ]
})
export class UpdatePaymentInfoModule {}