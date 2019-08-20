import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { MessageModule } from './message.module';
import { ProfileComponent } from '../components/home/shared/profile/profile.component';
import { ProfileRoutingModule } from './routes/profile.route.module';

/**
 * Module to deal with all sort of operations for user profile
 * @module ProfileModule
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@NgModule({
  declarations: [
    ProfileComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ProfileRoutingModule,
    MessageModule,
    NgScrollbarModule,
    NgxPaginationModule,
    NgxSmartModalModule.forRoot(),
  ],
  providers: []
})
export class ProfileModule {}