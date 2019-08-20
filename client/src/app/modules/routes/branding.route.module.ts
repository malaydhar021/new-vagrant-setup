import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BrandingComponent } from '../../components/home/branding/branding.component';

// defining all possible routes for user review
const routes: Routes = [
  { path: '', component: BrandingComponent }
];

/**
 * Routing module for all possible routes for user review
 * @module BrandingRoutingModule
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BrandingRoutingModule { }
