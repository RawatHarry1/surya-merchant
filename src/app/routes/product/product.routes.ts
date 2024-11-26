import { Routes } from "@angular/router";
import { AddProductComponent } from "./product/add-product/add-product.component";
import { ProductListComponent } from "./product/product-list/product-list.component";
import { ViewProductDetailComponent } from "./product/view-product-detail/view-product-detail.component";

export const routes: Routes = [
    // { path: '', component: ProductListComponent },
    { path: 'add-product', component: AddProductComponent },
    { path: 'update-product/:id', component: AddProductComponent },
    // { path: 'product-list', component: ProductListComponent },
    { path: 'view-product-Detail/:id', component: ViewProductDetailComponent }
]