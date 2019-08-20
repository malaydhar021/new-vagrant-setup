import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { MessageModule } from './message.module';
import { SharedModule } from './shared/shared.module';
import { CustomDomainService } from '../services/custom-domain.service';
import { CustomDomainComponent } from '../components/home/custom-domain/custom-domain.component';
import { CustomDomainRoutingModule } from './routes/custom-domain.route.module';

/**
 * Module to deal with all sort of operations for custom domains
 * @module CustomDomainModule
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@NgModule({
  declarations: [
    CustomDomainComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CustomDomainRoutingModule,
    MessageModule,
    NgScrollbarModule,
    NgxPaginationModule,
    SharedModule,
    NgxSmartModalModule.forRoot(),
  ],
  providers: [
    CustomDomainService
  ]
})
export class CustomDomainModule {}