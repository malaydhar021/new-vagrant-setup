import { Component, OnInit } from '@angular/core';
import { Log } from 'src/app/helpers/app.helper';
import { Title } from '@angular/platform-browser';

/**
 * NotFoundComponent will handle the all http 404 error responses and display users the 404 page
 * @class NotFoundComponent
 * @author Tier5 LLC `<work@tier5.us>`
 * @version 1.0.0
 * @license Proprietary
 */
@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {
  constructor(private title: Title) { }

  public ngOnInit() { 
    this.title.setTitle("Stickyreviews:: Page Not Found");
  }
}
