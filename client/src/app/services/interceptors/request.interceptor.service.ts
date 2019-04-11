import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';
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

  constructor(private authService: AuthService, private router: Router, private errorService: ErrorsService, private loaderService: LoaderService) { }

  /**
   * This is the implementation of intercept interface and added headers to each request when some api has been called 
   * @param request HttpRequest
   * @param next HttpHandler
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authRequest = request;
    authRequest = request.clone({
      headers: request.headers.set('Access-Control-Allow-Origin', '*')
    });

    const token = this.authService.getToken;
    if (token) {
      authRequest = authRequest.clone({
        headers: authRequest.headers.set('Authorization', 'Bearer ' + token)
      });
    }
    
    return next.handle(authRequest).pipe(delay(1000), catchError((error, caught) => {
      // intercept the http response error
      this.handleHttpError(error);
      return of(error);
    }) as any);
  }

  /**
   * Function to handle http error responses
   * @method handleHttpError
   * @since version 1.1.0
   * @param error HttpErrorResponse
   * @returns Observable<String>
   */
  private handleHttpError(error: HttpErrorResponse): Observable<any> {

    //this.loaderService.disableLoader();

    // handle your auth error or rethrow
    switch (error.status) {

      case 401: // Unauthorized
        // update the error messaged based on message object in http response
        const errorMessage401 = this.updateErrorMessage(error);
        // logging out the user
        this.authService.removeStorageData();
        // redirect user to loging page
        this.router.navigate(['/login']);
        return of(errorMessage401);

      case 403: // Forbidden
        // update the error messaged based on message object in http response
        const errorMessage403 = this.updateErrorMessage(error);
        // logging out the user
        this.authService.removeStorageData();
        // redirect user to loging page
        this.router.navigate(['/login']);
        // return observable as string
        return of(errorMessage403);

      case 400: // Bad Request
        // update the error messaged based on message object in http response
        const errorMessage400 = this.updateErrorMessage(error);
        // update error messages for only for 400 http request. 
        // This will mostly handle the server side form validation messages.
        this.updateErrorMessage400(error);
        // return observable as string
        return of(errorMessage400);

      case 404: // Not Found
        // update the error messaged based on message object in http response
        const errorMessage404 = this.updateErrorMessage(error);
        // redirect user to loging page
        // this.router.navigate(['/login']);
        // return observable as string
        return of(errorMessage404);

      case 422: // Unprocessable Entity
        // update the error messaged based on message object in http response
        const errorMessage422 = this.updateErrorMessage(error);
        // return observable as string
        return of(errorMessage422);

      case 500: // Internal Server Error
        // update the error messaged based on message object in http response
        const errorMessage500 = this.updateErrorMessage(error);
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
      this.errorService.updateMessage(error.error.message);
      errMsg = error.error.message;
    } else {
      this.errorService.updateMessage(this.defaultErrorMessage);
      errMsg = this.defaultErrorMessage;
    }
    return errMsg;
  }

  /**
   * Function to update error message for 404 http error response using errorService.
   * @method updateErrorMessage400
   * @since version 1.1.0
   * @param error HttpErrorResponse
   * @returns Array
   */
  private updateErrorMessage400(error: HttpErrorResponse) {
    if (error instanceof HttpErrorResponse && error.error.hasOwnProperty('errors')) {
      // this.errorService.updateMessage(error.error.message);
      // errMsg = error.error.message;
      Log.debug(error.error.errors, "Catch 400 validation messgaes");
      this.errorService.updateValidationMessage(error.error.errors);
    } else {
      this.errorService.updateMessage(this.defaultErrorMessage);
    }
  }
}
