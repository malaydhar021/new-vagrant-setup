import { Injectable, Injector } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
  HttpSentEvent,
  HttpHeaderResponse,
  HttpProgressEvent,
  HttpResponse,
  HttpUserEvent
} from '@angular/common/http';
import { take, filter, catchError, switchMap, finalize } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { throwError, BehaviorSubject } from 'rxjs';
import 'rxjs/add/operator/catch';
import { AuthenticateserviceService } from '../authenticateservice.service';
import { Router } from '@angular/router';

@Injectable()
export class MyHttpInterceptor implements HttpInterceptor {

  constructor(private injector: Injector, private router: Router) { }

  token: string;
  isRefreshingToken = false;
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({ setHeaders: { Authorization: 'Bearer ' + token }});
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {
    this.token = localStorage.getItem('_tok');

    if (this.token) {
      const authReq = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + this.token) });
      // send the newly created request
      return next.handle(authReq)
        .catch((error) => {
          // intercept the response error and displace it to the console
          console.error('Error Occurred', error);
          // return the error to the method that called it
          return throwError(error);
        }) as any;

      /** Please do not delete following commented out codeblock */
      // If token present then make request with token
      // return next.handle(this.addToken(req, this.token)).pipe(
      //   catchError(error => {
      //     if (error instanceof HttpErrorResponse) {
      //       switch ((<HttpErrorResponse>error).status) {
      //           case 401:
      //           case 403:
      //               return this.handleAuthTokenError(req, next);
      //           default:
      //               // intercept the response error and displace it to the console
      //               console.error('Error Occurred:', error);
      //               // return the error to the method that called it
      //               return throwError(error);
      //           }
      //       } else {
      //           return throwError(error);
      //       }
      //   }));
    } else {
      // If no token found proceed as it is
      const authReq = req;
      return next.handle(authReq)
        .catch((error) => {
          // intercept the response error and displace it to the console
          console.error('Error Occurred:', error);
          // return the error to the method that called it
          return throwError(error);
        });
    }
  }

  handleAuthTokenError(req: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshingToken) {
    this.isRefreshingToken = true;

    // Reset here so that the following requests wait until the token
    // comes back from the refreshToken call.
    this.tokenSubject.next(null);

    const authService = this.injector.get(AuthenticateserviceService);

    return authService.refreshToken(this.token).pipe(
      switchMap((newToken: string) => {
        console.log('newToken', newToken);
        if (newToken) {
          localStorage.setItem('_tok', newToken);
          this.tokenSubject.next(newToken);
          return next.handle(this.addToken(this.getNewRequest(req), newToken));
        }

        // If we don't get a new token, we are in trouble so logout.
        return this.logoutUser({
          error: {
            status: false,
            response: 'Sorry! Your session has expired. Please login again.'
          }
        });
        // return throwError({
        //   error: {
        //     status: false,
        //     response: 'Sorry! Your session has expired. Please login again.'
        //   }
        // });
      }),
      catchError(error => {
        // If there is an exception calling 'refreshToken', bad news so logout.
        console.log(error);
        return this.logoutUser(error);
        // return throwError(error);
      }),
      finalize(() => {
          this.isRefreshingToken = false;
      }), );
    } else {
      return this.tokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(token => {
          return next.handle(this.addToken(this.getNewRequest(req), token));
        }), );
    }
  }

  /**
   * This method is only here so the example works.
   * Do not include in your code, just use 'req' instead of 'this.getNewRequest(req)'.
   */
  getNewRequest(req: HttpRequest<any>): HttpRequest<any> {
    const methods = {
      'delete': 'DELETE',
      'get': 'GET',
      'head': 'HEAD',
      'jsonp': 'JSONP',
      'options': 'OPTIONS'
    };

    const method = methods[req.method];
    const url = req.url + '?type=new';
    console.log(req.body);
    const body = req.body || {};
    body.type = 'new';

    return new HttpRequest(method, url, body);
  }

  /**
   * Log out user and forget user data & token
   */
  logoutUser(error) {
    localStorage.removeItem('_cu');
    localStorage.removeItem('_tok');
    this.router.navigate(['/login']);
    return throwError(error);
  }
}
