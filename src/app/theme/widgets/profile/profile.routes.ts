import { Routes } from '@angular/router';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { AddMerchantComponent } from 'app/theme/widgets/profile/add-merchant/add-merchant.component';

export const routes: Routes = [
    { path: 'profile', component: ViewProfileComponent },
    { path: 'edit_merchant', component: AddMerchantComponent }
];