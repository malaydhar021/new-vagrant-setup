import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from '../../components/home/shared/profile/profile.component';

// defining all possible routes for user profile
const routes: Routes = [
  { path: '', component: ProfileComponent }
];

/**
 * Routing module for all possible routes for user profile
 * @module ProfileRoutingModule
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
