import { BrowserModule, Title }                 from '@angular/platform-browser';
import { BrowserAnimationsModule }              from '@angular/platform-browser/animations';
import { CookieService }                        from 'ngx-cookie-service';
import { FormsModule }                          from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS }  from '@angular/common/http';
import { NgModule, Component }                  from '@angular/core';
import { NgxMaskModule }                        from 'ngx-mask';
import { ReactiveFormsModule }                  from '@angular/forms';
// Custom imports
import { AppRoutingModule }                     from './modules/routes/app.route.module';
import { AuthGuard }                            from './services/guards/auth.guard.service';
import { AuthService }                          from './services/auth.service';
import { ErrorsService }                        from './services/errors.service';
import { ForgotPasswordComponent }              from './components/forgot-password/forgot-password.component';
import { GlobalService }                        from './services/global.service';
import { LoginComponent }                       from './components/login/login.component';
import { LoaderModule }                         from './components/shared/loader/loader.module';
import { LoaderService }                        from './services/loader.service';
import { NotFoundComponent }                    from './components/not-found/not-found.component';
import { ResetPasswordComponent }               from './components/forgot-password/reset-password/reset-password.component';
import { RequestInterceptor }                   from './services/interceptors/request.interceptor.service';
import { ReviewLinkService }                    from './services/review-link.service';
import { SignUpComponent }                      from './components/sign-up/sign-up.component';
import { SignupService }                        from './services/signup.service';
import { SubscriptionService }                  from './services/subscription.service';
import { UserService }                          from './services/user.service';

import { MessageModule } from './components/shared/message/message.module';
import { ReviewLinkTypeComponent } from './components/home/review-link-type/review-link-type.component';
import { MediaPlayerModule } from './modules/media-player.module';
import { MediaPlayerService } from './services/media-player.service';

/**
 * AppComponent is the first component which loads when the applicatoin is getting bootstraped.
 * In this component only the ```<router-outlet></router-outlet>``` angular routing hook whchi is
 * responsible for displaying html content based on the url route, is persent. It is recommemnded
 * @class AppComponent
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */

@Component({
  selector: 'app-root',
  template: `<app-loader></app-loader><router-outlet></router-outlet>`
})
export class AppComponent { }

/**
 * This module is entry point to this application. AppComponent is the first component when the application
 * is getting bootstrapped. This module will only load all the public pages components and services. Dashboard module
 * (under modules directory) will be loaded lazily once the user is authenticated.
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
    ReviewLinkTypeComponent
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
    LoaderModule,
    MediaPlayerModule,
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
    UserService,
    SubscriptionService,
    MediaPlayerService,
    { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

