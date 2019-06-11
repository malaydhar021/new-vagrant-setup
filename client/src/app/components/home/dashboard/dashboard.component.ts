import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../services/loader.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private loaderService: LoaderService) { 
    this.loaderService.enableLoader();
  }

  ngOnInit() {
    this.loaderService.disableLoader();
  }

}
