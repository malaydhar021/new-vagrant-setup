import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlansComponent } from '../../components/home/plans/plans.component';

// defining all possible routes for user review
const routes: Routes = [
  { path: '', component: PlansComponent }
];

/**
 * Routing module for all possible routes for plans
 * @module PlansRoutingModule
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlansRoutingModule { }
