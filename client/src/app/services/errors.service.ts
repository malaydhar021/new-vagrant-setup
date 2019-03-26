import { Injectable } from "@angular/core";
import { Log } from '../helpers/app.helper';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * ErrorsService is responsible to collect all errors and store it into errros array.
 * 
 * ### *DEPRECATED*
 * 
 * @package ErrorsService
 * @author Tier5 LLC `<work@tier5.us>`
 * @version 1.0.0
 * @license Proprietary
 * @deprecated 1.0.0
 */
@Injectable()

export class ErrorsService
{
    // this property was in use previously but not it's not been used
    errors : string[] = []; // deprecated

    private errorSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
    error$: Observable<string> = this.errorSubject.asObservable();

    /**
     * Method to update the error message from http request asynchronously
     * @since 2.0.0
     * @param message (string) the updated error message
     * @returns Observable<String>
     */
    updateMessage(message: string) {        
        Log.notice(message, 'Message from error service');
        this.errorSubject.next(message);
    }

    /**
     * Method to get all errors
     * 
     * ### *DEPRECATED*
     * 
     * @since 1.0.0
     * @deprecated in version 2.0.0
     * @returns array
     */
    public get getErrors()
    {
        return this.errors;
    }

    /**
     * Method to get all errors
     * 
     * ### *DEPRECATED*
     * 
     * @since 1.0.0
     * @deprecated in version 2.0.0
     * @param error (string) Error message
     * @returns void
     */
    public setErrors(error : string)
    {
        Log.info(error, "Log in setErrors");
        this.errors.push(error)
    }

    /**
     * Method to clear all errors
     * 
     * ### *DEPRECATED*
     * 
     * @since 1.0.0
     * @deprecated in version 2.0.0
     * @returns void
     */
    public clearErrors()
    {
        this.errors = [];
    }
}