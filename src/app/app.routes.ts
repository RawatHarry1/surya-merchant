import { Routes } from '@angular/router';
import { authGuard } from '@core';
import { AdminLayoutComponent } from '@theme/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from '@theme/auth-layout/auth-layout.component';
import { DashboardComponent } from './routes/dashboard/dashboard.component';
import { LoginComponent } from './routes/sessions/login/login.component';
import { RegisterComponent } from './routes/sessions/register/register.component';
import { MerchantsComponent } from './routes/merchants/merchants.component';
import { AgentsComponent } from './routes/agents/agents.component';
import { OrdersComponent } from './routes/order/orders/orders.component';
import { IntegrationComponent } from './routes/integration/integration.component';
import { SubAdminsComponent } from './routes/sub-admin/sub-admins/sub-admins.component';
import { ReportsComponent } from './routes/reports/reports.component';
import { CataloguesComponent } from './routes/catalogue/catalogues/catalogues.component';
import { ProductListComponent } from './routes/product/product/product-list/product-list.component';
import { CustomerComponent } from './routes/customer/customer.component';



export const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard', component: DashboardComponent
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./theme/widgets/profile/profile.routes').then(m => m.routes)
      },

      { path: 'catalogues', component: CataloguesComponent },

      {
        path: 'catalogues',
        loadChildren: () => import('./routes/catalogue/catalogue.routes').then(m => m.routes)
      },

      { path: 'product', component: ProductListComponent },

      {
        path: 'product',
        loadChildren: () => import('./routes/product/product.routes').then(p => p.routes)
      },

      { path: 'customerlist', component: CustomerComponent },

      {
        path: 'customerlist',
        loadChildren: () => import('./routes/customer/customer.routes').then(p => p.routes)
      },

      { path: 'merchants', component: MerchantsComponent },
      {
        path: 'merchants',
        loadChildren: () => import('./routes/merchants/merchants.routes').then(p => p.routes)
      },
      { path: 'agents', component: AgentsComponent },
      { path: 'orders', component: OrdersComponent },


      {
        path: 'orders',
        loadChildren: () => import('./routes/order/order.routes').then(m => m.routes),
      },
      {
        path: 'marketing',
        loadChildren: () => import('./routes/marketing/marketing.routes').then(m => m.routes),
      },

      { path: 'integration', component: IntegrationComponent },
      { path: 'sub-admins', component: SubAdminsComponent },

      {
        path: 'sub-admins',
        loadChildren: () => import('./routes/sub-admin/sub-admin.routes').then(m => m.routes),
      },

      { path: 'reports', component: ReportsComponent },

      {
        path: 'settings',
        loadChildren: () => import('./routes/settings/settings.routes').then(m => m.routes),
      },
    ],
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },

];
