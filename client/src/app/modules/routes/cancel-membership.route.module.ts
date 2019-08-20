import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CancelMembershipComponent } from '../../components/home/cancel-membership/cancel-membership.component';

// defining all possible routes for user review
const routes: Routes = [
  { path: '', component: CancelMembershipComponent }
];

/**
 * Routing module for all possible routes for cancel membership
 * @module CancelMembershipRoutingModule
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CancelMembershipRoutingModule { }
