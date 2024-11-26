import { Routes } from "@angular/router";
import { CustomerViewComponent } from "./customer-view/customer-view.component";

export const routes: Routes = [
    { path: 'view_customer/:id', component: CustomerViewComponent },
];

