import * as Actions from '../actions/app.action.helper';

/**
 * AppReducer responsible for state management in entire app using ngrx.
 * 
 * DO NOT DELETE THIS FILE
 * 
 * ### *DEPRECATED* 
 * 
 * @author Tier5 LLC `<work@tier5.us>`
 * @version 1.0.0
 * @param state any | null
 * @param action Exported all actions from ngrx action
 * @deprecated Deprecated in version 1.0.0
 * @license Proprietary
 */

export function AppReducer(state : any = null, action : Actions.All) {
    switch (action.type) {
        case Actions.ERROR: {
            return action.payload;
        }
        default:
            return state;
    }
}