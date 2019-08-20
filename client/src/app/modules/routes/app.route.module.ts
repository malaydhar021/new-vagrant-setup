import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from '../../components/not-found/not-found.component';
import { AuthGuard } from '../../services/guards/auth.guard.service';
import { AppGuard } from '../../services/guards/app.guard.service';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', canLoad: [AppGuard], loadChildren: '../login.module#LoginModule' },
  { path: 'sign-up', canLoad: [AppGuard], loadChildren: '../signup.module#SignupModule' },
  { path: 'forgot-password', canLoad: [AppGuard], loadChildren: '../forgot-password.module#ForgotPasswordModule' },
  { path: 'user-review/:slug', loadChildren: '../user-review.module#UserReviewModule' },
  { path: 'show-user-review/:token/:id', loadChildren: '../show-user-review.module#ShowUserReviewModule' },
  { path: 'home', canLoad: [AuthGuard], loadChildren: '../home.module#HomeModule' },
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
