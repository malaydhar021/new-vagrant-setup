import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../../components/login/login.component';
import { SignUpComponent } from '../../components/sign-up/sign-up.component';
import { ForgotPasswordComponent } from '../../components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from '../../components/forgot-password/reset-password/reset-password.component';
import { HomeModule } from '../home.module';
import { NotFoundComponent } from '../../components/not-found/not-found.component';
import { AuthGuard } from '../../services/guards/auth.guard.service';
import { ReviewLinkTypeComponent } from '../../components/home/review-link-type/review-link-type.component';
import { UserReviewModule } from '../user-review.module';

const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'sign-up', component: SignUpComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'reset-password/:token', component: ResetPasswordComponent },
    { path: 'user-review/:slug', loadChildren: '../user-review.module#UserReviewModule' },
    { path: 'home', canLoad: [AuthGuard], loadChildren: '../home.module#HomeModule' },
    { path: 'review-link-type', component: ReviewLinkTypeComponent },
    { path: '**', component: NotFoundComponent }
];

/**
 * AppRoutingModule class will hold all public routes and it will lazy load All Home Module routes
 * and User Review routes when those routes will be called
 * @module AppRoutingModule
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
