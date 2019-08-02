import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CookieService } from 'ngx-cookie-service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, Component } from '@angular/core';
import { NgxMaskModule } from 'ngx-mask';
import { ReactiveFormsModule } from '@angular/forms';
// Custom imports
import { AppRoutingModule } from './modules/routes/app.route.module';
import { AuthGuard } from './services/guards/auth.guard.service';
import { AuthService } from './services/auth.service';
import { ErrorsService } from './services/errors.service';
import { LoginComponent } from './components/login/login.component';
import { LoaderModule } from './components/shared/loader/loader.module';
import { LoaderService } from './services/loader.service';
import { RequestInterceptor } from './services/interceptors/request.interceptor.service';
import { ReviewLinkService } from './services/review-link.service';
import { SignupService } from './services/signup.service';
import { SubscriptionService } from './services/subscription.service';
import { UserService } from './services/user.service';
import { ColorPickerModule } from 'ngx-color-picker';
import { MessageModule } from './modules/message.module';
import { SubscriptionGuard } from './services/guards/subscription.guard.service';
import { MediaModule } from './modules/media.module';
import { MediaService } from './services/media.service';
import { NotFoundModule } from './modules/shared/not-found.module';

/**
 * AppComponent is the first component which loads when the application is getting bootstrapped.
 * In this component only the ```<router-outlet></router-outlet>``` angular routing hook which is
 * responsible for displaying html content based on the url route, is present. It is recommended
 * @class AppComponent
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@Component({
  selector: 'app-root',
  template: `<app-loader></app-loader><router-outlet></router-outlet>`
})
export class AppComponent {}

/**
 * This module is entry point to this application. AppComponent is the first component when the application
 * is getting bootstrapped. This module will only load all the public pages components and services. Dashboard module
 * (under modules directory) will be loaded lazily once the user is authenticated.
 * @module AppModule
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
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
    ColorPickerModule,
    MediaModule,
    NotFoundModule
  ],
  providers: [
    Title,
    AuthService,
    AuthGuard,
    CookieService,
    ErrorsService,
    SignupService,
    ReviewLinkService,
    LoaderService,
    UserService,
    SubscriptionService,
    SubscriptionGuard,
    MediaService,
    { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}