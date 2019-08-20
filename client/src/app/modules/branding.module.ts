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

/**
 * Module to deal with all sort of operations for branding
 * @module BrandingModule
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@NgModule({
  declarations: [
    BrandingComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    BrandingRoutingModule,
    MessageModule,
    NgScrollbarModule,
    NgxPaginationModule,
    SharedModule,
    NgxSmartModalModule.forRoot(),
  ],
  providers: [
    BrandingService
  ]
})
export class BrandingModule {}