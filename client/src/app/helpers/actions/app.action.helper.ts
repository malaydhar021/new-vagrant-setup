import { Action } from '@ngrx/store';

/**
 * ngrx actions to handle state management in angular.
 *
 * DO NOT DELETE THIS FILE
 *
 * ### *DEPRECATED*
 *
 * @package AppActions
 * @see https://ngrx.io/guide/store
 * @author Tier5 LLC `<work@tier5.us>`
 * @version 1.0.0
 * @deprecated 1.0.0
 * @license Proprietary
 */

export const ERROR = '';

/**
 * ErrorsAction is defining the ERROR constant using ngrx actions
 *
 * ### *DEPRECATED*
 *
 * @since 1.0.0
 * @deprecated 1.0.0
 */
export class ErrorsAction implements Action {
    readonly type = ERROR;
    constructor( public payload: any ) {}
}

export type All = | ErrorsAction;
