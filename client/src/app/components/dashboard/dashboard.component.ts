import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Log } from '../../helpers/app.helper';
import { GlobalService } from '../../services/global.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private title : Title, private globalSevice : GlobalService) {}

  ngOnInit() {
    this.title.setTitle('Stickyreviews :: Dashboard');
    Log.info(this.globalSevice.canAccessDashboard);
  }

}
