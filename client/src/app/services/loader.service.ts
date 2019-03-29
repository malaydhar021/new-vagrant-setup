import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * LoaderService is responsible for displaying the loader in template or stop displaying loader in template.
 *
 * DO NOT DELETE / REMOVE THIS FILE
 *
 * ### *DEPRECATED* ###
 *
 * @package LoaderService
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 * @todo Later on we have to implment some kind of global loader service which will show or hide loader asynchronously.
 * @deprecated 1.0.0
 */

@Injectable()

export class LoaderService {
    private _loader = false;
    loaderStatus: Subject<any> = new Subject();
    loaderState = this.loaderStatus.asObservable();

    constructor() {}

    /**
     * Loader getter method to return the current loader value
     *
     * @since 1.0.0
     * @returns boolean
     */
    public get loader(): boolean {
        return this._loader;
    }

    /**
     * Loader setter method to set the loader value
     *
     * @since 1.0.0
     * @param value boolean
     * @returns void
     */
    public set loader(value: boolean) {
        this._loader = value;
        this.loaderStatus.next(value);
    }

    /**
     * Function to showloader. loader setter method used to set the _loader value.
     *
     * @since 1.0.0
     * @returns void
     */
    public enableLoader() {
        this.loader = true;
    }

    /**
     * Function to disable loader. loader setter method used to set the _loader value;
     *
     * @since 1.0.0
     * @returns void
     */
    public disableLoader() {
        this.loader = false;
    }

}
