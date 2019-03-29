import { ErrorHandler, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError, pipe } from 'rxjs';
import { Store } from '@ngrx/store';
import { Log } from '../../helpers/app.helper';
import { AppState } from '../../interfaces/states/app.state.interface';
import { ErrorsAction } from '../../helpers/actions/app.action.helper';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';


/**
 * ErrorsHandlerInterceptor will catch both client and server side erros and exceptions.
 * ### ErrorsHandlerInterceptor is deprecated in version 1.0.1
 *
 * @package ErrorsHandlerInterceptor
 * @author Tier5 LLC `<work@tier5.us>`
 * @version 1.0.1
 * @license Proprietary
 * @deprecated 1.0.1
 */

@Injectable()

export class ErrorsHandlerInterceptor implements ErrorHandler {
    constructor(private router: Router, private store: Store<AppState>) {}

    handleError(error: any) {
        if (error instanceof HttpErrorResponse) {
            // catch server side errors
            if (!navigator.onLine) { // checking if internet connection is there or not
                Log.warning('Application is offline. Please check your interner connection');
                this.dispatchErrors(error.error.response);
            } else {
                this.handleServerExceptions(error.status, error.error.response);
            }
        } else {
            // catch client side errors
            Log.error(error, 'Client Side Errors');
        }
    }

    /**
     * Function which will act accordingly based on http status code
     * @param httpStatusCode number
     * @returns void
     */
    public handleServerExceptions(httpStatusCode: number, errorMessage: string) {
        switch (httpStatusCode) {
            case 401 :
                Log.error('HTTP Error Code : 401');
                this.dispatchErrors(errorMessage);
                break;
            case 403 :
                Log.error('HTTP Error Code : 403');
                this.dispatchErrors(errorMessage);
                break;
            case 404 :
                Log.error('I am in 404 block');
                this.dispatchErrors(errorMessage);
                this.router.navigate(['/sign-up']);
                break;
            case 422 :
                Log.error('I am in 422 block');
                break;
            case 500 :
                Log.error('I am in 500 block');
                break;
            case 309 :
                Log.error('I am in 309 block');
                break;
            case 201 :
                Log.error('I am in 201 block');
                break;
            case 200 :
                Log.error('I am in 200 block');
                break;
            default :
                Log.error('I am in default block');
                this.dispatchErrors(errorMessage);
                break;
        }
    }

    /**
     * Method to dispatch errors so that errors can be accessable by components / services.
     * Here ngrx store api has been used to manage state management in angular.
     *
     * @param error any
     * @returns void
     */
    public dispatchErrors(error: any) {
        /*
        return pipe(
            catchError((error: HttpErrorResponse) => {
                this.store.dispatch(new ErrorsAction(error));
                return throwError(error);
            })
        );
        */
        /*
        this.store.dispatch(new ErrorsAction(error));
        return throwError(error);
        */
        // this.errorService.setErrors(error);
    }
}
