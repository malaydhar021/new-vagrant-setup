import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../login/login.component';
// import { SignupComponent } from '../signup/signup.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { AuthGuardGuard } from '../Authentication-Guards/auth.guard';
import { CampaignsComponent } from '../campaigns/campaigns.component';
import { StickyReviewsComponent } from '../sticky-reviews/sticky-reviews.component';
import { BrandingComponent } from '../branding/branding.component';
import { SettingsComponent } from '../settings/settings.component';
import { ReviewLinkComponent } from '../review-link/review-link.component';
import { ExitPopUpComponent } from '../exit-pop-up/exit-pop-up.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  // { path: 'signup', component: SignupComponent }
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardGuard] },
  { path: 'campaigns', component: CampaignsComponent, canActivate: [AuthGuardGuard] },
  { path: 'campaigns/:id' , component: CampaignsComponent, canActivate: [AuthGuardGuard] },
  { path: 'sticky-reviews', component: StickyReviewsComponent, canActivate: [AuthGuardGuard] },
  { path: 'branding', component: BrandingComponent, canActivate: [AuthGuardGuard] },
  { path: 'branding/:id', component: BrandingComponent, canActivate: [AuthGuardGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuardGuard] },
  { path: 'review-links', component: ReviewLinkComponent, canActivate: [AuthGuardGuard] },
  { path: 'exit-popups', component: ExitPopUpComponent, canActivate: [AuthGuardGuard] },
  {
    path: 'user-review/:id',
    loadChildren: '../user-review/user-review.module#UserReviewModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
