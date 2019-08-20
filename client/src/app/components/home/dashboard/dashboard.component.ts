import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { LoaderService } from '../../../services/loader.service';
import { DashboardService } from '../../../services/dashboard.service';
import { Log } from '../../../helpers/app.helper';

/**
 * Dashboard component has been used to show all sort of analytics data into a user dashboard
 * @class DashboardComponent
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  /**
   * Constructor method
   * @param loaderService 
   * @param title 
   * @param dashboardService 
   */
  constructor(private loaderService: LoaderService, private title: Title, private dashboardService: DashboardService) {}

  /**
   * Method to set page title and call an api to get required data
   * @method ngOnInit
   * @since Version 1.0.0
   * @returns Void
   */
  ngOnInit() {
    // set the title of the page
    this.title.setTitle("Stickyreviews :: Dashboard");
    this.loaderService.enableLoader();
    Log.info("Dashboard before making the api call");
    this.dashboardService.getAnalytics().subscribe(
      (response: any) => {
        Log.info(response, "Dashboard response");
        this.loaderService.disableLoader();
      }
    );
  }
}