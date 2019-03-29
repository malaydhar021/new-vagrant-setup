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

const routes: Routes = [
  {path: '', component: DashboardComponent},
  {path: 'branding', component: BrandingComponent},
  {path: 'sticky-reviews', component: StickyReviewsComponent},
  {path: 'campaign', component: CampaignComponent},
  {path: 'review-link', component: ReviewLinkComponent},
  {path: 'exit-popup', component: ExitPopupComponent},
  {path: 'plans', component: PlansComponent},
  {path: 'update-payment-info', component: UpdatePaymentInfoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
