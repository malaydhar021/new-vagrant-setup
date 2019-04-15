import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../../components/login/login.component';
import { SignUpComponent } from '../../components/sign-up/sign-up.component';
import { ForgotPasswordComponent } from '../../components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from '../../components/forgot-password/reset-password/reset-password.component';
import { DashboardModule } from '../dashboard.module';
import { NotFoundComponent } from '../../components/not-found/not-found.component';
import { AuthGuard } from '../../services/guards/auth.guard.service';
import { ReviewLinkTypeComponent } from '../../components/dashboard/review-link-type/review-link-type.component';

const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'sign-up', component: SignUpComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'reset-password/:token', component: ResetPasswordComponent },
    { path: 'dashboard', canLoad: [AuthGuard], loadChildren: () => DashboardModule },
    { path: 'not-found', component: NotFoundComponent },
    {path: 'review-link-type', component: ReviewLinkTypeComponent}  
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }
