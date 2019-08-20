import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { MessageModule } from './message.module';
import { SharedModule } from './shared/shared.module';
import { LoginComponent } from '../components/login/login.component';
import { LoginRoutingModule } from './routes/login.route.module';

/**
 * Module to deal with all sort of operations for user review
 * @module SignupModule
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MessageModule,
    SharedModule,
    LoginRoutingModule,
    NgxMaskModule
  ],
  providers: []
})
export class LoginModule { }
