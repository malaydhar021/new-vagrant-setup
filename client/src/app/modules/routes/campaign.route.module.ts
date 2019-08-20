import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CampaignComponent } from '../../components/home/campaign/campaign.component';

// defining all possible routes for user review
const routes: Routes = [
  { path: '', component: CampaignComponent }
];

/**
 * Routing module for all possible routes for campaigns
 * @module CampaignRoutingModule
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CampaignRoutingModule { }
