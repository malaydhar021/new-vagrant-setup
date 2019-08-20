import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReviewLinkComponent } from '../../components/home/review-link/review-link.component';

// defining all possible routes for user review
const routes: Routes = [
  { path: '', component: ReviewLinkComponent }
];

/**
 * Routing module for all possible routes for review link
 * @module ReviewLinkRoutingModule
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReviewLinkRoutingModule { }
