import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShowUserReviewComponent } from 'src/app/components/show-user-review/show-user-review.component';
// defining all possible routes for user review
const routes: Routes = [
    {path: '', component: ShowUserReviewComponent}
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
export class ShowUserReviewRoutingModule { }
