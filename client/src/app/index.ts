import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CookieService } from 'ngx-cookie-service';
// Custom imports
import { AppRoutingModule } from './modules/routes/app.route.module';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/forgot-password/reset-password/reset-password.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './services/guards/auth.guard.service';
import { GlobalService } from './services/global.service';
import { RequestInterceptor } from './services/interceptors/request.interceptor.service';
import { ErrorsService } from './services/errors.service';
import { SignupService } from './services/signup.service';
import { ReviewLinkService } from './services/review-link.service';
import { LoaderService } from './services/loader.service';

import { MessageModule } from './components/shared/message/message.module';
import { LoaderModule } from './components/shared/loader/loader.module';

/**
 * AppComponent is the first component which loads when the applicatoin is getting bootstraped.
 * In this componentt only the ```<router-outlet></router-outlet>``` angular routing hook whchi is
 * responsible for displaying html content based on the url route, is persent. It is recommemnded
 *
 * @package AppComponent
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */

@Component({
    selector: 'app-root',
    template: `
    <app-loader></app-loader>
    <router-outlet></router-outlet>
    `
})
export class AppComponent {}

/**
 * This module is entry point to this application. AppComponent is the first component when the application
 * is getting bootstraped. This module will only load all the public pages components and services. Dashboard module
 * (under modules directory) will be loaded lazyly once the user is authenticated.
 *
 * @package AppModule
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */

@NgModule({
  declarations: [
      AppComponent,
      LoginComponent,
      SignUpComponent,
      ForgotPasswordComponent,
      ResetPasswordComponent,
      NotFoundComponent,
  ],
  imports: [
      BrowserModule,
      AppRoutingModule,
      ReactiveFormsModule,
      FormsModule,
      HttpClientModule,
      NgxMaskModule.forRoot(),
      BrowserAnimationsModule,
      MessageModule,
      LoaderModule
  ],
  providers: [
      Title,
      AuthService,
      AuthGuard,
      GlobalService,
      CookieService,
      ErrorsService,
      SignupService,
      ReviewLinkService,
      LoaderService,
      { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

