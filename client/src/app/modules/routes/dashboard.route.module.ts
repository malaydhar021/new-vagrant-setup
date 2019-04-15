import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from '../../components/dashboard/dashboard.component';
import { BrandingComponent } from '../../components/dashboard/branding/branding.component';
import { StickyReviewsComponent } from '../../components/dashboard/sticky-reviews/sticky-reviews.component';
import { CampaignComponent } from '../../components/dashboard/campaign/campaign.component';
import { ReviewLinkComponent } from '../../components/dashboard/review-link/review-link.component';
import { ExitPopupComponent } from '../../components/dashboard/exit-popup/exit-popup.component';
import { PlansComponent } from '../../components/dashboard/plans/plans.component';
import { UpdatePaymentInfoComponent } from '../../components/dashboard/update-payment-info/update-payment-info.component';
import {ProfileComponent} from '../../components/dashboard/shared/profile/profile.component';
const routes: Routes = [
  {path: '', component: DashboardComponent, children:[
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
export class DashboardRoutingModule { }
