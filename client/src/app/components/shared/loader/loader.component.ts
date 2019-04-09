import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {LoaderService} from '../../../services/loader.service'

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  isLoading : Boolean = false;
  subscription: Subscription;

  constructor(private loaderService : LoaderService) { 
    this.subscription = this.loaderService.getLoaderStatus().subscribe(status=> { this.isLoading  = status; });
  }

  ngOnInit() {
  }

}
