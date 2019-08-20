import { NgModule } from "@angular/core";
import { DashboardComponent } from '../components/home/dashboard/dashboard.component';
import { DashboardRoutingModule } from './routes/dashboard.route.module';
import { DashboardService } from '../services/dashboard.service';

/**
 * Module to deal with all sort of operations for review link
 * @module DashboardModule
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    DashboardRoutingModule,
  ],
  providers: [
    DashboardService
  ]
})
export class DashboardModule {}