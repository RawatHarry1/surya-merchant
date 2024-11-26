import { Routes } from "@angular/router";
import { StoreComponent } from "./store/store.component";
import { ConfigurationComponent } from "./configuration/configuration.component";
import { OrderComponent } from "./order/order.component";
import { PaymentsComponent } from "./payments/payments.component";
import { DeliveryComponent } from "./delivery/delivery.component";
import { CustomersComponent } from "./customers/customers.component";
import { NotificationComponent } from "./notification/notification.component";
import { LanguageComponent } from "./language/language.component";
import { BrandingComponent } from "./branding/branding.component";
import { GeneralSettingsComponent } from "./general-settings/general-settings.component";
import { DesignLayoutComponent } from "./design-layout/design-layout.component";
import { BillingComponent } from "./billing/billing.component";
import { SubscriptionComponent } from "./subscription/subscription.component";
import { NotificationsComponent } from "./notifications/notifications.component";

export const routes: Routes = [
    { path: 'store', component: StoreComponent },
    { path: 'configuration', component: ConfigurationComponent },
    { path: 'order', component: OrderComponent },
    { path: 'payments', component: PaymentsComponent },
    { path: 'delivery', component: DeliveryComponent },
    { path: 'customers', component: CustomersComponent },
    { path: 'notification', component: NotificationComponent },
    { path: 'notifications', component: NotificationsComponent },
    { path: 'language', component: LanguageComponent },
    { path: 'branding', component: BrandingComponent },
    { path: 'general_settings', component: GeneralSettingsComponent },
    { path: 'design_layout', component: DesignLayoutComponent },
    { path: 'billing', component: BillingComponent },
    { path: 'subscription', component: SubscriptionComponent }
]











