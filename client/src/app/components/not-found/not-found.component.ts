import { Component, OnInit } from '@angular/core';
import { Log } from 'src/app/helpers/app.helper';

/**
 * NotFoundComponent will handle the all http 404 error responses and display users the 404 page
 * 
 * @package NotFoundComponent
 * @author Tier5 LLC `<work@tier5.us>`
 * @version 1.0.0
 * @license Proprietary
 */
@Component({
    selector : 'app-not-found',
    templateUrl : './not-found.component.html',
    styleUrls : ['./not-found.component.scss']
})

export class NotFoundComponent implements OnInit
{
    constructor(){}

    ngOnInit()
    {
        Log.info('this is 404 not found component');
    }
    
}