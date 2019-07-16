import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { ShowUserReviewRoutingModule } from './routes/show-user-review.route.module';
import { MediaModule } from './media.module';
import { UserReviewService } from '../services/user-review.service';
import { BarRatingModule } from 'ngx-bar-rating';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MessageModule } from './message.module';
import { SharedModule } from './shared/shared.module';
import { ShowUserReviewComponent } from '../components/show-user-review/show-user-review.component';
import { RoundedComponent } from '../components/show-user-review/sticky-review-styles/rounded/rounded.component';
import { SquareComponent } from '../components/show-user-review/sticky-review-styles/square/square.component';
import { SquareElevatedComponent } from '../components/show-user-review/sticky-review-styles/square-elevated/square-elevated.component';
import { TearDropComponent } from '../components/show-user-review/sticky-review-styles/tear-drop/tear-drop.component';
import { TearDropElevatedComponent } from '../components/show-user-review/sticky-review-styles/tear-drop-elevated/tear-drop-elevated.component';

/**
 * Module to deal with all sort of operations for user review
 * @module UserReviewModule
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@NgModule({
    declarations: [
        ShowUserReviewComponent,
        RoundedComponent,
        SquareComponent,
        SquareElevatedComponent,
        TearDropComponent,
        TearDropElevatedComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        BarRatingModule,
        ShowUserReviewRoutingModule,
        MediaModule,
        MessageModule,
        SharedModule,
    ],
    providers: [
        UserReviewService
    ]
})
export class ShowUserReviewModule {}