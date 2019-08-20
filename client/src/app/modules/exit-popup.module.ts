import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { MessageModule } from './message.module';
import { SharedModule } from './shared/shared.module';
import { ColorPickerModule } from 'ngx-color-picker';
import { ExitPopupService } from '../services/exit-popup.service';
import { ExitPopupRoutingModule } from './routes/exit-popup.route.module';
import { ExitPopupComponent } from '../components/home/exit-popup/exit-popup.component';

/**
 * Module to deal with all sort of operations for exit popup
 * @module ExitPopupModule
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@NgModule({
  declarations: [
    ExitPopupComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ExitPopupRoutingModule,
    MessageModule,
    NgScrollbarModule,
    NgxPaginationModule,
    SharedModule,
    NgxSmartModalModule.forRoot(),
    ColorPickerModule
  ],
  providers: [
    ExitPopupService
  ]
})
export class ExitPopupModule {}