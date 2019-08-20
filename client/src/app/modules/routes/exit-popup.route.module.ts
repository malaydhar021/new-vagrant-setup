import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExitPopupComponent } from '../../components/home/exit-popup/exit-popup.component';

// defining all possible routes for user review
const routes: Routes = [
  { path: '', component: ExitPopupComponent }
];

/**
 * Routing module for all possible routes for exit popup
 * @module ExitPopupRoutingModule
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExitPopupRoutingModule { }
