import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserReviewComponent } from '../../components/user-review/user-review.component';
import { UserReviewResolver } from '../../services/resolvers/user-review.resolver.service';

// defining all possible routes for user review
const routes: Routes = [
  { path: '', resolve: { reviewLink: UserReviewResolver }, component: UserReviewComponent }
];

/**
 * Routing module for all possible routes for user review
 * @module UserReviewRoutingModule
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserReviewRoutingModule { }
