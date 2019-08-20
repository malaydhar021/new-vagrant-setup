import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { MessageModule } from './message.module';
import { BrandingComponent } from '../components/home/branding/branding.component';
import { BrandingRoutingModule } from './routes/branding.route.module';
import { BrandingService } from '../services/branding.service';
import { SharedModule } from './shared/shared.module';
import { CancelMembershipComponent } from '../components/home/cancel-membership/cancel-membership.component';
import { CancelMembershipRoutingModule } from './routes/cancel-membership.route.module';

/**
 * Module to deal with all sort of operations for cancel a membership
 * @module CancelMembershipModule
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@NgModule({
  declarations: [
    CancelMembershipComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CancelMembershipRoutingModule,
    MessageModule,
    NgScrollbarModule,
    NgxPaginationModule,
    SharedModule,
    NgxSmartModalModule.forRoot(),
  ],
  providers: []
})
export class CancelMembershipModule {}