import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StickyReviewsComponent } from 'src/app/components/home/sticky-reviews/sticky-reviews.component';

// defining all possible routes for user review
const routes: Routes = [
  { path: '', component: StickyReviewsComponent }
];

/**
 * Routing module for all possible routes for user review
 * @module StickyReviewsRoutingModule
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StickyReviewsRoutingModule { }
