import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../../components/login/login.component';
import { NotFoundComponent } from '../../components/not-found/not-found.component';
import { AuthGuard } from '../../services/guards/auth.guard.service';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'sign-up', loadChildren: '../signup.module#SignupModule' },
  { path: 'forgot-password', loadChildren: '../forgot-password.module#ForgotPasswordModule' },
  { path: 'user-review/:slug', loadChildren: '../user-review.module#UserReviewModule' },
  { path: 'show-user-review/:id', loadChildren: '../show-user-review.module#ShowUserReviewModule' },
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
