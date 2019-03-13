import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from "rxjs/operators";
import { AuthService } from '../auth.service';
import { Log } from '../../helpers/app.helper';

/**
 * @package UserModel
 * @author Tier5 LLC <work@tier5.us>
 * @version 1.0.0
 * @license Proprietary
 */
@Injectable()

export class RequestInterceptor implements HttpInterceptor {

    constructor(private authService : AuthService){}

    intercept(request : HttpRequest<any>, next : HttpHandler) : Observable<HttpEvent<any>>
    {
        let authRequest = request;
        let token = this.authService.getToken;
        Log.info(token, 'print the token');
        if(token){
            authRequest = request.clone({
                headers: request.headers.set("Authorization", "Bearer "  + token)
            });
            Log.info(authRequest, 'before making the api call');
        }
        return next.handle(authRequest).pipe(
            tap(
                event => {
                    if (event instanceof HttpResponse) {
                        Log.success(event);
                    }
                },
                error => {
                    if (error instanceof HttpResponse) {
                        Log.error(error);
                    }
                }
            )
        );
    }
}