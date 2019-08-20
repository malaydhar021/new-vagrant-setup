import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExitPopupComponent } from '../../components/home/exit-popup/exit-popup.component';
import { CustomDomainComponent } from 'src/app/components/home/custom-domain/custom-domain.component';
import { SubscribedEmailsComponent } from 'src/app/components/home/subscribed-emails/subscribed-emails.component';

// defining all possible routes for user review
const routes: Routes = [
  { path: '', component: SubscribedEmailsComponent }
];

/**
 * Routing module for all possible routes for subscribed emails
 * @module SubscribedEmailRoutingModule
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubscribedEmailRoutingModule { }
