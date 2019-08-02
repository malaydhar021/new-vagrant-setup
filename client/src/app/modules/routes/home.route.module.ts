import { NgModule }                         from '@angular/core';
import { Routes, RouterModule }             from '@angular/router';
import { HomeComponent }                    from '../../components/home/home.component';
import { BrandingComponent }                from '../../components/home/branding/branding.component';
import { StickyReviewsComponent }           from '../../components/home/sticky-reviews/sticky-reviews.component';
import { CampaignComponent }                from '../../components/home/campaign/campaign.component';
import { ReviewLinkComponent }              from '../../components/home/review-link/review-link.component';
import { ExitPopupComponent }               from '../../components/home/exit-popup/exit-popup.component';
import { PlansComponent }                   from '../../components/home/plans/plans.component';
import { UpdatePaymentInfoComponent }       from '../../components/home/update-payment-info/update-payment-info.component';
import { ProfileComponent }                 from '../../components/home/shared/profile/profile.component';
import { DashboardComponent }               from '../../components/home/dashboard/dashboard.component';
import { CancelMembershipComponent }        from '../../components/home/cancel-membership/cancel-membership.component';
import { SubscriptionGuard }                from '../../services/guards/subscription.guard.service';
import { SettingsComponent }                from '../../components/home/shared/settings/settings.component';
import { CustomDomainComponent }            from '../../components/home/custom-domain/custom-domain.component';
import { SubscribedEmailsComponent }        from '../../components/home/subscribed-emails/subscribed-emails.component';

const routes: Routes = [
  {path: '', component: HomeComponent, children: [
    {path: '', redirectTo: 'dashboard', pathMatch: 'full'},

    {path: 'plans',               component: PlansComponent},
    {path: 'profile',             component: ProfileComponent, canActivate: [SubscriptionGuard]},
    {path: 'update-payment-info', component: UpdatePaymentInfoComponent, canActivate: [SubscriptionGuard]},
    {path: 'cancel-membership',   component: CancelMembershipComponent, canActivate: [SubscriptionGuard]},
    {path: 'dashboard',           component: DashboardComponent, canActivate: [SubscriptionGuard]},

    {path: 'sticky-reviews',      canActivate: [SubscriptionGuard], component: StickyReviewsComponent},
    {path: 'branding',            canActivate: [SubscriptionGuard], component: BrandingComponent},
    {path: 'campaign',            canActivate: [SubscriptionGuard], component: CampaignComponent},
    {path: 'exit-popup',          canActivate: [SubscriptionGuard], component: ExitPopupComponent},
    {path: 'review-link',         canActivate: [SubscriptionGuard], component: ReviewLinkComponent},
    {path: 'settings',            canActivate: [SubscriptionGuard], component: SettingsComponent},
    {path: 'custom-domains',      canActivate: [SubscriptionGuard], component: CustomDomainComponent},
    {path: 'subscribed-emails',   canActivate: [SubscriptionGuard], component: SubscribedEmailsComponent},
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
