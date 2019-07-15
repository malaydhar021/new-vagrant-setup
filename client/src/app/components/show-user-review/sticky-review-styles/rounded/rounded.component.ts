import {Component, Input, OnInit} from '@angular/core';
import * as moment from 'moment';
@Component({
    selector: 'app-rounded',
    templateUrl: './rounded.component.html',
    styleUrls: ['./rounded.component.scss']
})
export class RoundedComponent implements OnInit {
    @Input() reviewData?: number = 100; // default style is set to Rounded
    reviewByUser: string = '';
    constructor() { }

    ngOnInit() {
    }


    /**
     * Function to fetch count of review stars
     * @param rating
     */
    public getStars(rating) {
        const starts = new Array(1);
        for (let i = 1; i < rating; i++) {
            starts.push(i);
        }
        return starts;
    }

    getReviewTimeFormated(created_at) {
        return moment(created_at).startOf('day').fromNow();
    }

}
