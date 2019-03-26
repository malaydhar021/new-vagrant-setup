import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoaderService } from '../../services/loader.service';

/**
 * LoaderComponent is responsible for show / hide a loader.
 * 
 * DO NOT DELETE / REMOVE THIS FILE
 * 
 * ### *DEPRECATED* ###
 * 
 * @package LoaderComponent
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @todo Not in use right now. Need to implement a global loader for each request
 * @license Proprietary
 */

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})

export class LoaderComponent implements OnInit, OnDestroy {

    loader : boolean = false;
    loaderSubscription: Subscription;

    constructor(private loaderService : LoaderService) { }

    /**
     * Subscription for loaderSubcription to assign the value asynchronously
     * 
     * @since 1.0.0
     * @returns Observable<Boolean>
     */
    ngOnInit() 
    {
        this.loaderSubscription = this.loaderService.loaderStatus.subscribe((value) => {
            this.loader = value;
        });
    }

    /**
     * Destroy the loaderSubscription subscription
     * 
     * @since 1.0.0
     * @returns void
     */
    ngOnDestroy()
    {
        this.loaderSubscription.unsubscribe();
    }

}
