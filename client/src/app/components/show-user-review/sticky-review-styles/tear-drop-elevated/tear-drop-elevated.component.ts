import {Component, Input, OnInit} from '@angular/core';
import * as moment from 'moment';
@Component({
    selector: 'app-tear-drop-elevated',
    templateUrl: './tear-drop-elevated.component.html',
    styleUrls: ['./tear-drop-elevated.component.scss']
})
export class TearDropElevatedComponent implements OnInit {
    @Input() reviewData?: any = ''; // default style is set to Rounded
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
     * Method to format the time/date and show to the sticky reviews
     * @param created_at
     */
    public getReviewTimeFormated(reviewAt) {
        const reviewTime = moment.utc(reviewAt).local().format('YYYY-MM-DD HH:mm:ss');
        const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
        const timeDiffrence = moment(currentTime).diff(moment(reviewTime));
        return moment.duration(timeDiffrence).humanize();
    }

}
