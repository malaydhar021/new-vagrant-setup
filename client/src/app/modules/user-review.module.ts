import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { UserReviewRoutingModule } from './routes/user-review.route.module';
import { MediaModule } from './media.module';
import { UserReviewComponent } from '../components/user-review/user-review.component';
import { RecommendationComponent } from '../components/user-review/recommendation/recommendation.component';
import { ReviewComponent } from '../components/user-review/review/review.component';
import { PermissionComponent } from '../components/user-review/permission/permission.component';
import { DisplayPictureComponent } from '../components/user-review/display-picture/display-picture.component';
import { ContactComponent } from '../components/user-review/contact/contact.component';
import { ThankYouComponent } from '../components/user-review/thank-you/thank-you.component';
import { UserReviewService } from '../services/user-review.service';
import { BarRatingModule } from 'ngx-bar-rating';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MessageModule } from './message.module';
import { DigitsOnlyDirective } from '../directives/digits-only.directive';

/**
 * Module to deal with all sort of operations for user review
 * @module UserReviewModule
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@NgModule({
  declarations: [
    UserReviewComponent,
    RecommendationComponent,
    ReviewComponent,
    PermissionComponent,
    DisplayPictureComponent,
    ContactComponent,
    ThankYouComponent,
    DigitsOnlyDirective
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    BarRatingModule,
    UserReviewRoutingModule,
    MediaModule,
    MessageModule
  ],
  providers: [
    UserReviewService
  ]
})
export class UserReviewModule {}