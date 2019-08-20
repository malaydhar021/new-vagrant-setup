import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { MessageModule } from './message.module';
import { SharedModule } from './shared/shared.module';
import { CampaignComponent } from '../components/home/campaign/campaign.component';
import { CampaignRoutingModule } from './routes/campaign.route.module';
import { WidgetStylesModule } from './widget-styles.module';
import { CampaignService } from '../services/campaign.service';
import { CustomDomainService } from '../services/custom-domain.service';

/**
 * Module to deal with all sort of operations for campaigns
 * @module CampaignModule
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@NgModule({
  declarations: [
    CampaignComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CampaignRoutingModule,
    MessageModule,
    NgScrollbarModule,
    NgxPaginationModule,
    SharedModule,
    NgxSmartModalModule.forRoot(),
    WidgetStylesModule,
  ],
  providers: [
    CampaignService,
    CustomDomainService
  ]
})
export class CampaignModule {}