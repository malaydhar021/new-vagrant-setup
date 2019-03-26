import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ErrorsService } from '../errors.service';

/**
 * RequestInterceptor is going to add Access-Control-Allow-Origin and Authorization to the headers to each and every request.
 * Also it will handle all http error responses and display errors and navigate to respective pages using ErrorService which 
 * is a shared service among all components and this http interceptor.
 * 
 * @package RequestInterceptor
 * @author Tier5 LLC `<work@tier5.us>`
 * @version 1.0.0
 * @see https://stackoverflow.com/questions/39033730/how-to-show-error-page-with-message-in-angular-2
 * @license Proprietary
 */
@Injectable()

export class RequestInterceptor implements HttpInterceptor {
    
    loader : boolean = false;
    defaultErrorMessage : string = "Something went wrong. Please try again after successfully login.";

    constructor(private authService : AuthService, private router : Router, private errorService: ErrorsService){}

    intercept(request : HttpRequest<any>, next : HttpHandler) : Observable<HttpEvent<any>>
    {
        let authRequest = request;
        authRequest = request.clone({
            headers: request.headers.set('Access-Control-Allow-Origin', '*')
        });
        
        let token = this.authService.getToken;
        if(token){
            authRequest = authRequest.clone({
                headers: authRequest.headers.set("Authorization", "Bearer "  + token)
            });
        }

        return next.handle(authRequest).pipe(delay(1000), catchError((error, caught) => {
            //intercept the http response error
            this.handleHttpError(error);
            return of(error);
        }) as any);
    }

    /**
     * Function to handle http error responses
     * @param error HttpErrorResponse
     * @returns Observable<String>
     */
    private handleHttpError(error: HttpErrorResponse): Observable<any> {
        //handle your auth error or rethrow
        switch(error.status){
            case 401:
                let errorMessage401 = this.updateErrorMessage(error);
                this.router.navigate(['/login']);
                return of(errorMessage401);
                break;
            case 403:
                let errorMessage403 = this.updateErrorMessage(error);
                this.router.navigate(['/login']);
                return of(errorMessage403);
                break;
            case 404:
                let errorMessage404 = this.updateErrorMessage(error);
                this.router.navigate(['/login']);
                return of(errorMessage404);
                break;
            case 422 : 
                let errorMessage422 = this.updateErrorMessage(error);
                return of(errorMessage404);
                break;
            case 500 : 
                let errorMessage500 = this.updateErrorMessage(error);
                return of(errorMessage500);
                break;
            case 309 : 
                let errorMessage309 = this.updateErrorMessage(error);
                return of(errorMessage309);
                break;
            case 201 : 
                let errorMessage201 = this.updateErrorMessage(error);
                return of(errorMessage201);
                break;
            case 200 : 
                // handle 200 http reponse
                break;
            default:
                let errorMessageDefault = this.updateErrorMessage(error);
                return of(errorMessageDefault);
                break;
        }      
        throw error;
    }

    /**
     * Function to update error message using errorService
     */
    private updateErrorMessage(error : HttpErrorResponse)
    {
        let errMsg = '';
        if(error instanceof HttpErrorResponse && error.error.hasOwnProperty('response')){
            this.errorService.updateMessage(error.error.response);
            errMsg = error.error.response;
        } else {
            this.errorService.updateMessage(this.defaultErrorMessage);
            errMsg = this.defaultErrorMessage;
        }
        return errMsg;
    }
}