import { NgModule }                         from '@angular/core';
import { Routes, RouterModule }             from '@angular/router';
import { HomeComponent }                    from '../../components/home/home.component';
import { SubscriptionGuard }                from '../../services/guards/subscription.guard.service';
import { PlansComponent }                   from 'src/app/components/home/plans/plans.component';

const routes: Routes = [
  {path: '', component: HomeComponent, children: [
    {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
    {path: 'dashboard',           canActivate: [SubscriptionGuard], loadChildren: '../dashboard.module#DashboardModule'},
    {path: 'plans',               component: PlansComponent},
    {path: 'profile',             canActivate: [SubscriptionGuard], loadChildren: '../profile.module#ProfileModule'},
    {path: 'update-payment-info', canActivate: [SubscriptionGuard], loadChildren: '../update-payment-info.module#UpdatePaymentInfoModule'},
    {path: 'cancel-membership',   canActivate: [SubscriptionGuard], loadChildren: '../cancel-membership.module#CancelMembershipModule'},

    {path: 'sticky-reviews',      canActivate: [SubscriptionGuard], loadChildren: '../sticky-reviews.module#StickyReviewsModule'},
    {path: 'branding',            canActivate: [SubscriptionGuard], loadChildren: '../branding.module#BrandingModule'},
    {path: 'campaign',            canActivate: [SubscriptionGuard], loadChildren: '../campaign.module#CampaignModule'},
    {path: 'exit-popup',          canActivate: [SubscriptionGuard], loadChildren: '../exit-popup.module#ExitPopupModule'},
    {path: 'review-link',         canActivate: [SubscriptionGuard], loadChildren: '../review-link.module#ReviewLinkModule'},
    {path: 'zapier-settings',     canActivate: [SubscriptionGuard], loadChildren: '../zapier-setting.module#ZapierSettingModule'},
    {path: 'custom-domains',      canActivate: [SubscriptionGuard], loadChildren: '../custom-domain.module#CustomDomainModule'},
    {path: 'subscribed-emails',   canActivate: [SubscriptionGuard], loadChildren: '../subscribed-email.module#SubscribedEmailModule'},
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
