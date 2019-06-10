import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MessageModule } from './message.module';
import { SharedModule } from './shared/shared.module';
import { ForgotPasswordRoutingModule } from './routes/forgot-password.route.module';
import { ForgotPasswordComponent } from '../components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from '../components/forgot-password/reset-password/reset-password.component';

/**
 * Module to deal with all sort of operations for forgot password
 * @module ForgotPasswordModule
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@NgModule({
  declarations: [
    ForgotPasswordComponent,
    ResetPasswordComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MessageModule,
    SharedModule,
    ForgotPasswordRoutingModule
  ],
  providers: []
})
export class ForgotPasswordModule {}