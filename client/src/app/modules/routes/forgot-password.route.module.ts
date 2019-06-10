import { NgModule }                       from '@angular/core';
import { Routes, RouterModule }           from '@angular/router';
import { ForgotPasswordComponent }        from '../../components/forgot-password/forgot-password.component';
import { ResetPasswordComponent }         from '../../components/forgot-password/reset-password/reset-password.component';

// defining all possible routes for signup
const routes: Routes = [
  {path: '', component: ForgotPasswordComponent},
  {path: 'reset/:token', component: ResetPasswordComponent}
];

/**
 * Routing module for all possible routes for forgot password 
 * @module ForgotPasswordRoutingModule
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForgotPasswordRoutingModule {}
