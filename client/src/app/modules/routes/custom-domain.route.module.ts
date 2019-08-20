import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExitPopupComponent } from '../../components/home/exit-popup/exit-popup.component';
import { CustomDomainComponent } from 'src/app/components/home/custom-domain/custom-domain.component';

// defining all possible routes for user review
const routes: Routes = [
  { path: '', component: CustomDomainComponent }
];

/**
 * Routing module for all possible routes for custom domain
 * @module CustomDomainRoutingModule
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomDomainRoutingModule { }
