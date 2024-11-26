
import { Routes } from "@angular/router";

import { PromotionsComponent } from "./promotions/promotions.component";
import { BannersComponent } from "./banners/banners.component";
import { DiscountsComponent } from "./discounts/discounts.component";
import { LoyaltyPointsComponent } from "./loyalty-points/loyalty-points.component";
import { PushCampaignsComponent } from "./push-campaigns/push-campaigns.component";
import { ReferralsComponent } from "./referrals/referrals.component";
import { SEOComponent } from "./s-e-o/s-e-o.component";
import { AppBannerComponent } from "./app-banner/app-banner.component";
import { AppBannerDialogComponent } from "./app-banner/app-banner-dialog/app-banner-dialog.component";


export const routes: Routes = [
    { path: 'coupon', component: PromotionsComponent },
    { path: 'loyalty_points', component: LoyaltyPointsComponent },
    { path: 'referrals', component: ReferralsComponent },
    { path: 'push_campaigns', component: PushCampaignsComponent },
    { path: 's_e_o', component: SEOComponent },
    { path: 'banners', component: BannersComponent },
    { path: 'discounts', component: DiscountsComponent },
    { path: 'app_banners', component: AppBannerComponent }
];