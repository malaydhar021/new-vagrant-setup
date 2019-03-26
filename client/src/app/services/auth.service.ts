import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthModel } from '../models/auth.model';
import { AuthResponse } from '../interfaces/auth.interface';
import { ApiEndPoint } from '../helpers/api.helper';
import { Log } from '../helpers/app.helper';
import { Observable, of } from 'rxjs';

/**
 * This service will handle all operations related to user login and authentication
 * 
 * @package AuthService
 * @author Tier5 LLC `<work@tier5.us>`
 * @version 1.0.0
 * @license Proprietary
 */

@Injectable()

export class AuthService 
{

    constructor(private httpClient : HttpClient, private router : Router, private cookieService : CookieService){}

    /**
     * This method will make an api request and authenticate a user
     * 
     * @since 1.0.0
     * @param auth authModel<Object>
     * @returns Observable<Object>
     */
    public doLogin(auth : AuthModel)
    {
        return this.httpClient.post<AuthResponse>(ApiEndPoint.authenticateUser, auth);
    }

    /**
     * Function to determine whether a user is loggedIn or not
     * 
     * @since 1.0.0
     * @returns boolean
     */
    public get isAuthenticated()
    {
        // return this.validateToken(this.getToken);
        // return of(false);
        return (this.getToken) ? true : false;
    }

    /**
     * Function to get the token from localstorage
     * 
     * @since 1.0.0
     * @returns boolean
     */
    public get getToken()
    {
        let data = null;
        switch(this.cookieService.get('_rm')){
            case "on" :
                data = localStorage.getItem('_sr') ? JSON.parse(localStorage.getItem('_sr')) : null;
                break;
            case "off" : 
                data = sessionStorage.getItem('_sr') ? JSON.parse(sessionStorage.getItem('_sr')) : null;    
                break;
            default:
                data = localStorage.getItem('_sr') ? JSON.parse(localStorage.getItem('_sr')) : null;
                break;
        }

        if(data !== null && data.token !== '' && data.token !== null && typeof data.token !== 'undefined') {
            return data.token;
        } else {
            return false;
        }
    }

    /**
     * Function that returns the api endpoing with query string to validate a token
     * 
     * @since 1.0.0
     * @param token string
     * @returns Observable<Object>
     */
    public validateToken(token : string) 
    {
        return this.httpClient.get(ApiEndPoint.validateToken, { params : new HttpParams().set('token', token) });
    }

    /**
     * Function to make a post request to logout the user
     * 
     * @since 1.0.0
     * @param token string
     * @returns void
     */
    public doLogout(token : string)
    {
        return this.httpClient.post(ApiEndPoint.logout, null, { params : new HttpParams().set('token', token) });        
    }
}