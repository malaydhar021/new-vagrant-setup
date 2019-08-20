import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { MessageModule } from './message.module';
import { SharedModule } from './shared/shared.module';
import { SubscribedEmailsComponent } from '../components/home/subscribed-emails/subscribed-emails.component';
import { SubscribedEmailService } from '../services/subscribed-email.service';
import { SubscribedEmailRoutingModule } from './routes/subscribed-email.route.module';

/**
 * Module to deal with all sort of operations for subscribed email
 * @module SubscribedEmailModule
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@NgModule({
  declarations: [
    SubscribedEmailsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SubscribedEmailRoutingModule,
    MessageModule,
    NgScrollbarModule,
    NgxPaginationModule,
    SharedModule,
    NgxSmartModalModule.forRoot(),
  ],
  providers: [
    SubscribedEmailService
  ]
})
export class SubscribedEmailModule {}