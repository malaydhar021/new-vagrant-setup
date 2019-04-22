import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '../../components/home/home.component';
import { BrandingComponent } from '../../components/home/branding/branding.component';
import { StickyReviewsComponent } from '../../components/home/sticky-reviews/sticky-reviews.component';
import { CampaignComponent } from '../../components/home/campaign/campaign.component';
import { ReviewLinkComponent } from '../../components/home/review-link/review-link.component';
import { ExitPopupComponent } from '../../components/home/exit-popup/exit-popup.component';
import { PlansComponent } from '../../components/home/plans/plans.component';
import { UpdatePaymentInfoComponent } from '../../components/home/update-payment-info/update-payment-info.component';
import { ProfileComponent } from '../../components/home/shared/profile/profile.component';
import { DashboardComponent } from '../../components/home/dashboard/dashboard.component';
const routes: Routes = [
  {path: '', component: HomeComponent, children:[
    {path: 'dashboard', component: DashboardComponent},
    {path: 'profile', component: ProfileComponent},
    {path: 'sticky-reviews', component: StickyReviewsComponent},
    {path: 'branding', component: BrandingComponent},
    {path: 'campaign', component: CampaignComponent},
    {path: 'exit-popup', component: ExitPopupComponent},
    {path: 'plans', component: PlansComponent},
    {path: 'review-link', component: ReviewLinkComponent},
    {path: 'update-payment-info', component: UpdatePaymentInfoComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
