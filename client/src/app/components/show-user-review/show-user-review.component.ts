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
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, Form } from '@angular/forms';
import { StickyReviewService } from '../../services/sticky-review.service';

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
    passkeyForm: FormGroup; // for update reviews from listing page for each campaign
    id: any = null;
    showMe: boolean = true;
    reviewImage: string = '';
    reviewName: string = '';
    reviewDescription: string = '';
    reviewRating: string = '';
    reviewDate: string = '';
    reviewType: string = '';
    reviewStatus: string = '';
    showReview: boolean = false;
    message: string = '';
    showMessage: boolean = false;
    // do something
    constructor(
        private title: Title,
        private userReviewService: UserReviewService,
        private loaderService: LoaderService,
        private errorService: ErrorsService,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder
    ) {
        this.title.setTitle('Stickyreviews :: Show User Review');
        // subscribe to review to get the latest update data from review
    }

    public ngOnInit() {
        // do something
        this.route.params.subscribe(params => {
            this.id = params.id;
        });
        this.passkeyForm = this.formBuilder.group({
            passkey: [null, Validators.required], // campaign name
        });
    }

    public ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    public onSubmit() {
        // check if the form is valid or not. if invalid then do nothing
        if (this.passkeyForm.invalid) {
            return;
        }
        const formData = new FormData();
        formData.append('passKey', this.passkeyForm.value.passkey); // append name
        formData.append('stickyId', this.id); // append tags

        this.loaderService.enableLoader();

        this.userReviewService.checkPasskey(formData).subscribe(
            (response: any) => {
                if (response.status) {
                    this.loaderService.disableLoader();
                    this.showMe = false;
                    this.showReview = true;
                    this.reviewImage = response.data.image;
                    this.reviewName = response.data.name;
                    this.reviewRating = response.data.rating;
                    this.reviewDescription = response.data.description;
                    this.reviewDate = response.data.created_at;
                    this.reviewType = response.data.type;
                    this.reviewStatus = response.data.is_accept;
                } else {
                    this.loaderService.disableLoader();
                }
            });
    }

    public acceptReview() {
        const formData = new FormData();
        formData.append('reviewAction', '1');
        formData.append('stickyId', this.id);
        this.reviewAction(formData);
    }

    public rejectReview() {
        const formData = new FormData();
        formData.append('reviewAction', '0');
        formData.append('stickyId', this.id);
        this.reviewAction(formData);
    }

    public reviewAction(formData) {
        this.userReviewService.reviewAction(formData).subscribe(
            (response: any) => {
                if (response.status) {
                    this.loaderService.disableLoader();
                    this.showMe = false;
                    this.showReview = false;
                    this.showMessage = true;
                    this.message = response.message;
                } else {
                    this.loaderService.disableLoader();
                    this.message = response.message;
                }
            });
    }


}