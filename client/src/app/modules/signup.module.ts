import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { MessageModule } from './message.module';
import { SharedModule } from './shared/shared.module';
import { SignUpComponent } from '../components/sign-up/sign-up.component';
import { SignupRoutingModule } from './routes/signup.route.module';

/**
 * Module to deal with all sort of operations for user review
 * @module SignupModule
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@NgModule({
  declarations: [
    SignUpComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MessageModule,
    SharedModule,
    SignupRoutingModule,
    NgxMaskModule
  ],
  providers: []
})
export class SignupModule { }
