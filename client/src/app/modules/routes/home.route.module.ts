import { NgModule }                         from '@angular/core';
import { Routes, RouterModule }             from '@angular/router';
import { HomeComponent }                    from '../../components/home/home.component';
import { SubscriptionGuard }                from '../../services/guards/subscription.guard.service';

const routes: Routes = [
  {path: '', component: HomeComponent, children: [
    {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
    {path: 'dashboard',           canLoad: [SubscriptionGuard], loadChildren: '../dashboard.module#DashboardModule'},
    {path: 'plans',               loadChildren: '../plans.module#PlansModule'},
    {path: 'profile',             canLoad: [SubscriptionGuard], loadChildren: '../profile.module#ProfileModule'},
    {path: 'update-payment-info', canLoad: [SubscriptionGuard], loadChildren: '../update-payment-info.module#UpdatePaymentInfoModule'},
    {path: 'cancel-membership',   canLoad: [SubscriptionGuard], loadChildren: '../cancel-membership.module#CancelMembershipModule'},

    {path: 'sticky-reviews',      canLoad: [SubscriptionGuard], loadChildren: '../sticky-reviews.module#StickyReviewsModule'},
    {path: 'branding',            canLoad: [SubscriptionGuard], loadChildren: '../branding.module#BrandingModule'},
    {path: 'campaign',            canLoad: [SubscriptionGuard], loadChildren: '../campaign.module#CampaignModule'},
    {path: 'exit-popup',          canLoad: [SubscriptionGuard], loadChildren: '../exit-popup.module#ExitPopupModule'},
    {path: 'review-link',         canLoad: [SubscriptionGuard], loadChildren: '../review-link.module#ReviewLinkModule'},
    {path: 'zapier-settings',     canLoad: [SubscriptionGuard], loadChildren: '../zapier-setting.module#ZapierSettingModule'},
    {path: 'custom-domains',      canLoad: [SubscriptionGuard], loadChildren: '../custom-domain.module#CustomDomainModule'},
    {path: 'subscribed-emails',   canLoad: [SubscriptionGuard], loadChildren: '../subscribed-email.module#SubscribedEmailModule'},
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
