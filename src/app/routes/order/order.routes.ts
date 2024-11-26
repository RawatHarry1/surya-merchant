import { Routes } from "@angular/router";
import { CreateOrdersComponent } from "./orders/create-orders/create-orders.component";
import { OrdersDetailsComponent } from "./orders/orders-details/orders-details.component";

export const routes: Routes = [
    { path: 'create_orders', component: CreateOrdersComponent },
    {path: 'order_details', component: OrdersDetailsComponent},
    {path: 'order_details/:orderId', component: OrdersDetailsComponent},
];