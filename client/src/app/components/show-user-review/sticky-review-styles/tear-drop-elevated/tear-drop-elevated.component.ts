import {Component, Input, OnInit} from '@angular/core';
import * as moment from 'moment';
@Component({
    selector: 'app-tear-drop-elevated',
    templateUrl: './tear-drop-elevated.component.html',
    styleUrls: ['./tear-drop-elevated.component.scss']
})
export class TearDropElevatedComponent implements OnInit {
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

    /**
     * Function to format the date and time
     * @param created_at
     */
    getReviewTimeFormated(created_at) {
        return moment.utc(created_at).local().startOf('day').fromNow();
    }

}
