import { Injectable } from '@angular/core';

/**
 * Service to declare some global variables and update it as required and use it throughout the app. Any variable which will be used to globally those
 * will be declared here.
 * ### *DEPRECATED*
 *
 * @class GlobalService
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @deprecated in version 1.0.0
 * @license Proprietary
 */
@Injectable()

export class GlobalService {
    canAccessDashboard = false;
    isSessionExpired = false;
    errorMessage: string = null;
}
