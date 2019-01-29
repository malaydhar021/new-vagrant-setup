import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {  FormsModule, ReactiveFormsModule  } from '@angular/forms';
import {  AuthenticateserviceService } from './authenticateservice.service';
import {  HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MyHttpInterceptor } from './interceptors/my-http-interceptor';
import {  AppRoutingModule } from './routes/app-routing.module';
import { AppComponent } from './layouts/app.component';
import {  AuthGuardGuard  } from './Authentication-Guards/auth.guard';
import { SidebarComponent } from './layouts/sidebar/sidebar.component';
import { HeaderComponent } from './layouts/header/header.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { CampaignsComponent } from './campaigns/campaigns.component';
import {  CampaignServiceService  } from './campaign-service.service';
import {  ModalModule } from 'ngx-bootstrap';
import {  Ng2SearchPipeModule } from 'ng2-search-filter';
import {  NgxPaginationModule } from 'ngx-pagination';
import { StickyReviewsComponent } from './sticky-reviews/sticky-reviews.component';
import {  StickyReviewsService  } from './sticky-reviews.service';
import { HighlightModule } from 'ngx-highlightjs';
import { SignupComponent } from './signup/signup.component';
import { BrandingComponent } from './branding/branding.component';
import {  BrandingServiceService  } from './branding-service.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './Angular-materials/material.module';
import {  ClipboardModule } from 'ngx-clipboard';
import { OwlModule } from 'ngx-owl-carousel';
import { TooltipModule } from 'ngx-bootstrap';
import { SettingsComponent } from './settings/settings.component';
import { NoticelabelComponent } from './noticelabel/noticelabel.component';
import { SettingserviceService } from './settingservice.service';
import { BarRatingModule } from 'ngx-bar-rating';
import { ReviewLinkComponent } from './review-link/review-link.component';
import { ReviewlinkserviceService } from './reviewlinkservice.service';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { ExitPopUpComponent } from './exit-pop-up/exit-pop-up.component';
import {ExitpopupService} from './exitpopup.service';
@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    DashboardComponent,
    AppComponent,
    SidebarComponent,
    HeaderComponent,
    FooterComponent,
    CampaignsComponent,
    StickyReviewsComponent,
    SignupComponent,
    BrandingComponent,
    SettingsComponent,
    NoticelabelComponent,
    ReviewLinkComponent,
    ExitPopUpComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    ModalModule.forRoot(),
    Ng2SearchPipeModule,
    NgxPaginationModule,
    HighlightModule.forRoot({ theme: 'default' }),
    BrowserAnimationsModule,
    MaterialModule,
    ClipboardModule,
    OwlModule,
    TooltipModule.forRoot(),
    BarRatingModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ],
  providers: [AuthenticateserviceService, AuthGuardGuard, CampaignServiceService, StickyReviewsService, {
    provide: HTTP_INTERCEPTORS,
    useClass: MyHttpInterceptor,
    multi: true
  }, BrandingServiceService, SettingserviceService, ReviewlinkserviceService, ExitpopupService],
  bootstrap: [AppComponent]
})
export class AppModule { }
