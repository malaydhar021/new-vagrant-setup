import { NgModule }                       from '@angular/core';
import { Routes, RouterModule }           from '@angular/router';
import { LoginComponent }                 from '../../components/login/login.component';

// defining all possible routes for signup
const routes: Routes = [
  {path: '', component: LoginComponent}
];

/**
 * Routing module for all possible routes for signup 
 * @module LoginRoutingModule
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule {}
