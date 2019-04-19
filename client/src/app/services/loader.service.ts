import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * LoaderService is responsible for displaying the loader in template or stop displaying loader in template.
 * @package LoaderService
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */

@Injectable()
export class LoaderService {
    loaderStatus: Subject<any> = new Subject();

    constructor() {}

    /**
     * Function to showloader. this will update loader status asynchronously
     * @since 1.0.0
     * @returns void
     */
    public enableLoader() {
        this.loaderStatus.next(true)
    }

    /**
     * Function to disable loader. loader setter method used to set the _loader value;
     * @since 1.0.0
     * @returns void
     */
    public disableLoader() {
        this.loaderStatus.next(false)
    }

    /**
     * Function to get loader status.
     * @since 1.0.0
     * @returns void
     */
    public getLoaderStatus() {
        return this.loaderStatus.asObservable();
    }


}
