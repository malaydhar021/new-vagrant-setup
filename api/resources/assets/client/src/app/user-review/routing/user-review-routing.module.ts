import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserReviewComponent } from '../user-review/user-review.component';

const routes: Routes = [
  {path: '', pathMatch: 'full', component: UserReviewComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserReviewRoutingModule { }
