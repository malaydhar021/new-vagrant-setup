import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { NgxMaskModule } from 'ngx-mask';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { MessageModule } from './message.module';
import { SharedModule } from './shared/shared.module';
import { PricingPlanService } from '../services/pricing-plan.service';
import { SubscriptionService } from '../services/subscription.service';
import { PlansRoutingModule } from './routes/plans.route.module';
import { PlansComponent } from '../components/home/plans/plans.component';

/**
 * Module to deal with all sort of operations for plans and pricing
 * @module PlansModule
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@NgModule({
  declarations: [
    PlansComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PlansRoutingModule,
    MessageModule,
    NgScrollbarModule,
    NgxPaginationModule,
    SharedModule,
    NgxSmartModalModule.forRoot(),
    NgxMaskModule.forRoot()
  ],
  providers: [
    SubscriptionService,
    PricingPlanService
  ]
})
export class PlansModule {}