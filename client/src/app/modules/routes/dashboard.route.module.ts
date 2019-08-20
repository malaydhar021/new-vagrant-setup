import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from '../../components/home/dashboard/dashboard.component';

// defining all possible routes for user review
const routes: Routes = [
  { path: '', component: DashboardComponent }
];

/**
 * Routing module for all possible routes for dashboard
 * @module DashboardRoutingModule
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
