import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title }                        from '@angular/platform-browser';
import { ActivatedRoute }               from '@angular/router';
import { Subscription }                 from 'rxjs';
import { UserReviewService }            from '../../services/user-review.service';
import { Log }                          from '../../helpers/app.helper';
import { LoaderService }                from '../../services/loader.service';
import { UserReviewLinkInfo }           from '../../interfaces/user-review.interface';
import { UserReviewModel }              from '../../models/user-review.model';
import { ErrorsService }                from '../../services/errors.service';

/**
 * Component to load the first screen of user review link with proper info
 * @class ShowUserReviewComponent
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@Component({
    selector: 'app-show-user-review',
    templateUrl: './show-user-review.component.html',
    styleUrls: ['./show-user-review.component.scss']
})
export class ShowUserReviewComponent implements OnInit, OnDestroy {

    subscription: Subscription;

    // do something
    constructor(
        private title: Title,
        private userReviewService: UserReviewService,
        private loaderService: LoaderService,
        private errorService: ErrorsService,
        private route: ActivatedRoute
    ) {
        this.title.setTitle('Stickyreviews :: Show User Review');
        // subscribe to review to get the latest update data from review
    }

    public ngOnInit() {
        
    }

    public ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}