import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard-home/dashboard.component';
import { BrandingComponent } from './branding/branding.component';
import { StickyReviewsComponent } from './sticky-reviews/sticky-reviews.component';
import { CampaignComponent } from './campaign/campaign.component';
import { ReviewLinkComponent } from './review-link/review-link.component';
import { ExitPopupComponent } from './exit-popup/exit-popup.component';
import { PlansComponent } from './plans/plans.component';

const routes: Routes = [
  {path: "", redirectTo: "home"},
  {path: "home", component: DashboardComponent},
  {path: "branding", component: BrandingComponent},
  {path: "sticky-reviews", component: StickyReviewsComponent},
  {path: "campaign", component: CampaignComponent},
  {path: "review-link", component: ReviewLinkComponent},
  {path: "exit-popup", component: ExitPopupComponent},
  {path: "plans", component: PlansComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
