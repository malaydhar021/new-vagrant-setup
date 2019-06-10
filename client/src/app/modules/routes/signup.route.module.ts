import { NgModule }                       from '@angular/core';
import { Routes, RouterModule }           from '@angular/router';
import { SignUpComponent }                from '../../components/sign-up/sign-up.component';

// defining all possible routes for signup
const routes: Routes = [
  {path: '', component: SignUpComponent}
];

/**
 * Routing module for all possible routes for signup 
 * @module SignupRoutingModule
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SignupRoutingModule {}
