import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ErrorsService } from '../errors.service';
import { Log } from '../../helpers/app.helper';
import { LoaderService } from '../loader.service';

/**
 * RequestInterceptor is going to add Access-Control-Allow-Origin and Authorization to the headers to each and every request.
 * Also it will handle all http error responses and display errors and navigate to respective pages using ErrorService which
 * is a shared service among all components and this http interceptor.
 *
 * @package RequestInterceptor
 * @author Tier5 LLC `<work@tier5.us>`
 * @version 1.1.0
 * @see https://stackoverflow.com/questions/39033730/how-to-show-error-page-with-message-in-angular-2
 * @license Proprietary
 */
@Injectable()
export class RequestInterceptor implements HttpInterceptor {

  loader = false;
  defaultErrorMessage = 'Something went wrong. Please try again after successfully login.';

  // constructor method to load all required service
  constructor(private authService: AuthService, private router: Router, private errorService: ErrorsService, private loaderService: LoaderService) { }

  /**
   * This is the implementation of intercept interface and added headers to each request when some api has been called 
   * @param request HttpRequest
   * @param next HttpHandler
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authRequest = request;
    authRequest = request.clone({
      headers: request.headers.set('Access-Control-Allow-Origin', '*'),
    });

    authRequest = request.clone({
      headers: request.headers.set('Accept', 'application/json'),
    });

    const token = this.authService.getToken;
    if (token) {
      authRequest = authRequest.clone({
        headers: authRequest.headers.set('Authorization', 'Bearer ' + token)
      });
    }
    // pipe(delay(500), catchError((error, caught)
    return next.handle(authRequest).pipe(catchError((error, caught) => {
      // intercept the http response error
      this.handleHttpError(error);
      return of(error);
    }) as any);
  }

  /**
   * Function to handle http error responses
   * @method handleHttpError
   * @since Version 1.1.0
   * @param error HttpErrorResponse
   * @returns Observable<String>
   */
  private handleHttpError(error: HttpErrorResponse): Observable<any> {
    // handle your auth error or rethrow
    switch (error.status) {

      case 401: // Unauthorized
        Log.debug(error, "Log error in interceptor");
        // update the error messaged based on message object in http response
        const errorMessage401 = this.updateErrorMessage(error);
        // logging out the user
        this.authService.removeStorageData();
        // hide the loader
        this.loaderService.disableLoader();
        // redirect user to loging page
        this.router.navigate(['/login']);
        return of(errorMessage401);

      case 403: // Forbidden
        // update the error messaged based on message object in http response
        const errorMessage403 = this.updateErrorMessage(error);
        // hide the loader
        this.loaderService.disableLoader();
        // return observable as string
        return of(errorMessage403);

      case 400: // Bad Request
        // update the error messaged based on message object in http response
        const errorMessage400 = this.setErrorMessage(error);
        // update error messages for only for 400 http request. 
        // This will mostly handle the server side form validation messages.
        this.updateErrorMessage400(error);
        // hide the loader
        this.loaderService.disableLoader();
        // return observable as string
        return of(errorMessage400);

      case 404: // Not Found
        this.errorService.update404Status(true);
        // update the error messaged based on message object in http response
        // const errorMessage404 = this.updateErrorMessage(error);
        // redirect user to login page
        // this.router.navigate(['/login']);
        // return observable as string
        // return of(errorMessage404);

      case 405: // Method not allowed
        // update the error messaged based on message object in http response
        const errorMessage405 = this.updateErrorMessage(error);
        // return observable as string
        return of(errorMessage405);

      case 413: // Request entity is too long
        // update the error messaged based on message object in http response
        const errorMessage413 = this.updateErrorMessage(error);
        // return observable as string
        return of(errorMessage413);

      case 422: // Unprocessable Entity
        // update the error messaged based on message object in http response
        const errorMessage422 = this.updateErrorMessage(error);
        // return observable as string
        return of(errorMessage422);

      case 500: // Internal Server Error
        // update the error messaged based on message object in http response
        const errorMessage500 = this.updateErrorMessage(error);
        // hide the loader
        this.loaderService.disableLoader();
        // return observable as string
        return of(errorMessage500);

      case 309: // Unassigned
        // update the error messaged based on message object in http response
        const errorMessage309 = this.updateErrorMessage(error);
        // return observable as string
        return of(errorMessage309);

      case 201: // Created
        // update the error messaged based on message object in http response
        const errorMessage201 = this.updateErrorMessage(error);
        // return observable as string
        return of(errorMessage201);

      case 200: // OK
        // 200 http response will be handled from each and individual components
        // May be implemented later for some better use
        break;

      default:
        Log.info(error.status, 'Error status from http response');
        // const errorMessageDefault = this.updateErrorMessage(error);
        // return of(errorMessageDefault);
        break;
    }
    throw error;
  }

  /**
   * Function to update error message using errorService.
   * @method updateErrorMessage
   * @since version 1.1.0
   * @param error HttpErrorResponse
   * @returns String
   */
  private updateErrorMessage(error: HttpErrorResponse) {
    let errMsg = '';
    if (error instanceof HttpErrorResponse && error.error.hasOwnProperty('message')) {
      // this.errorService.updateMessage(error.error.message);
      setTimeout(() => {this.errorService.setMessage({type: 'error', message: error.error.message})}, 100);
      errMsg = error.error.message;
    } else {
      // this.errorService.updateMessage(this.defaultErrorMessage);
      setTimeout(() => {this.errorService.setMessage({type: 'error', message: this.defaultErrorMessage})}, 100);
      errMsg = this.defaultErrorMessage;
    }
    return errMsg;
  }

  /**
   * Function to update error message for 400 http status response
   * @method setErrorMessage
   * @since version 1.1.0
   * @param error HttpErrorResponse
   * @returns String
   */
  private setErrorMessage(error: HttpErrorResponse) {
    let errMsg = '';
    if (error instanceof HttpErrorResponse && error.error.hasOwnProperty('message')) {
      this.errorService.updateMessage(error.error.message);
      errMsg = error.error.message;
    } else {
      this.errorService.updateMessage(this.defaultErrorMessage);
      errMsg = this.defaultErrorMessage;
    }
    return errMsg;
  }

  /**
   * Function to update validation error messages for 400 http error response using errorService.
   * @method updateErrorMessage400
   * @since version 1.1.0
   * @param error HttpErrorResponse
   * @returns Void
   */
  private updateErrorMessage400(error: HttpErrorResponse) {
    if (error instanceof HttpErrorResponse && error.error.hasOwnProperty('errors')) {
      // this.errorService.updateMessage(error.error.message);
      // errMsg = error.error.message;
      Log.debug(error.error.errors, "Catch 400 validation messages");
      setTimeout(() => {this.errorService.updateValidationMessage(error.error.errors)}, 100);
      // this.errorService.updateValidationMessage(error.error.errors);
    } else {
      const error = {error: this.defaultErrorMessage}
      this.errorService.updateValidationMessage(error);
    }
  }
}
