import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserReviewComponent } from './user-review/user-review.component';
import { UserReviewRoutingModule } from './routing/user-review-routing.module';
import { StepOneComponent } from './step-one/step-one.component';
import { StepTwoComponent } from './step-two/step-two.component';
import { StepThreeComponent } from './step-three/step-three.component';
import { ThankyouComponent } from './thankyou/thankyou.component';
import {  FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { BarRatingModule } from 'ngx-bar-rating';
import {UserReviewService} from './services/user-review.service';
import {NgxMaskModule} from 'ngx-mask';
import { UploadImageComponent } from './upload-image/upload-image.component';
@NgModule({
  imports: [
    CommonModule,
    UserReviewRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BarRatingModule,
    NgxMaskModule.forRoot()
  ],
  declarations: [
    UserReviewComponent,
    StepOneComponent,
    StepTwoComponent,
    StepThreeComponent,
    ThankyouComponent,
    UploadImageComponent
  ],
  providers: [
    UserReviewService
  ]
})
export class UserReviewModule { }
