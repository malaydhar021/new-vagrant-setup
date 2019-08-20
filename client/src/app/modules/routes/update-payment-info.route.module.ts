import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UpdatePaymentInfoComponent } from '../../components/home/update-payment-info/update-payment-info.component';

// defining all possible routes for user review
const routes: Routes = [
  { path: '', component: UpdatePaymentInfoComponent }
];

/**
 * Routing module for all possible routes for user review
 * @module UpdatePaymentInfoRoutingModule
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UpdatePaymentInfoRoutingModule { }
