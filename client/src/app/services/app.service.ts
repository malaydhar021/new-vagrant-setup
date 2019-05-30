import { Injectable, Injector } from "@angular/core";
import { SubscriptionService } from './subscription.service';
import { map } from 'rxjs/operators';
import { Log } from '../helpers/app.helper';

/**
 * Service to call subscription of current user before app got initialized. This method is not in use.
 * ### *DEPRECATED* ###
 * @class AppService
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @deprecated In version 1.0.0
 * @license Proprietary
 */
@Injectable()
export class AppService {
    constructor(private injector: Injector) {}
    public initializeApp(): Promise<any> {
        return new Promise(((resolve, reject) => {
            this.injector.get(SubscriptionService).getCurrentSubscription().pipe(
                map(
                    (response: any) => {
                        Log.info(response, "Log the response in app service");
                        this.injector.get(SubscriptionService).isSubscribed$.next(response);
                        // return response;
                    }
                ))
                .toPromise()
                .then(res => {
                    resolve();
                })
        }))
    }
}

/**
 * Function to run before initialization of app. This is not in use.
 * ### *DEPRECATED* ###
 * @function AppInit
 * @version 1.0.0
 * @deprecated In version 1.0.0
 * @param appService AppService instance
 * @returns Void
 */
export function AppInit(appService: AppService) {
    return () => appService.initializeApp();
}