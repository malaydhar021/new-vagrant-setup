import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ZapierSettingsComponent } from '../../components/home/shared/settings/zapier-settings.component';

// defining all possible routes for zapier setting
const routes: Routes = [
  { path: '', component: ZapierSettingsComponent }
];

/**
 * Routing module for all possible routes for zapier settings
 * @module ZapierSettingRoutingModule
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ZapierSettingRoutingModule { }
