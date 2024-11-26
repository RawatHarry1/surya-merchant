import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSort, MatSortHeader, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { OrdersDialogComponent } from './orders-dialog/orders-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterOutlet } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { OrdersService } from '@shared/services/orders.service';
import { TruncatePipe } from '@core/pipes/truncate.pipe';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { CurrencyChangePipe } from '@core/pipes/currency-change.pipe';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

export interface OrderData {
  orderId: string,
  subOrderId: string;
  orderStatus: any;
  orderPrice: string;
  orderDate: string;
  orderDiscount: string;
  orderDiscountType: string;
  productQuantity: string;
  productName: string;
  productImage: string;
  productThumbnail: string;
  customerFirstName: string;
  customerLastName: string;
  merchantName: string;
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatSortHeader,
    MatSortModule,
    MatIconModule,
    MatMenuModule,
    MatCardModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    RouterOutlet,
    ReactiveFormsModule,
    TruncatePipe,
    MatTooltip,
    TranslateModule,
    CurrencyChangePipe,
    MatOptionModule,
    MatIcon,
    MatSelectModule
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {
  public dialog = inject(MatDialog);
  constructor(
    public router: Router,
    public ordersServices: OrdersService
  ) { }

  displayedColumns: string[] = [
    'subOrderId',
    'productImage',
    'productName',
    'customerName',
    'productQuantity',
    'orderPrice',
    'orderStatus',
    'action'
  ];

  dataSource = new MatTableDataSource<OrderData>([]);

  @ViewChild('paginator1', { static: false }) paginator1!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  searchControl = new FormControl();

  selectedStatus: any = 0;
  totalItems1 = 0;
  pageNumber = 0;
  pageSize = 5;
  search: string = '';
  getOrderStatus: any = 0;

  status: any = {
    0: 'All',
    1: 'Ordered',
    2: 'Shipped',
    3: 'Delivered',
    4: 'Cancelled',
    5: 'Returned',
    6: 'Replaced',
    7: 'Failed',
    8: 'Pending',
  };

  tableStatus = [
    { value: 0, viewValue: 'All' },
    { value: 1, viewValue: 'Ordered' },
    { value: 2, viewValue: 'Shipped' },
    { value: 3, viewValue: 'Delivered' },
    // { value: 4, viewValue: 'Cancelled' },
    // { value: 5, viewValue: 'Returned' },
    // { value: 6, viewValue: 'Replaced' },
    { value: 7, viewValue: 'Failed' },
    // { value: 8, viewValue: 'Pending' },
  ];

  orderDiscount: any = {
    1: 'Percentage',
    2: 'Amount',
  };

  getOrderStatusClass(orderStatus: number): string {
    switch (orderStatus) {
      case 1:
        return 'status-placed';   // Blue for 'Order Placed'
      case 2:
        return 'status-shipped';  // Yellow for 'Shipped'
      case 3:
        return 'status-delivered'; // Green for 'Delivered'
      default:
        return 'status-unknown';  // Default case
    }
  }

  getOrderStatusLabel(orderStatus: 0 | 1 | 2 | 3 | 4): string {
    return this.status[orderStatus];
  }

  getOrderDiscountLabel(orderDiscountType: 1 | 2): string {
    return this.orderDiscount[orderDiscountType];
  }

  ngOnInit() {
    this.getOrderStatus = null; // Initialize to 'All' by default
    this.getOrderByStatus(this.getOrderStatus);
    this.onSearch();
    this.dataSource.sort = this.sort;

  }

  /* ------------TO SORT THE DATA OF TABLE */
  ngAfterViewInit() {

  }


  //This is for the Search for the a
  onSearch() {
    this.searchControl.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged())
      .subscribe((searchTerm) => {
        this.pageNumber = 0;
        this.paginator1.pageIndex = 0;
        this.handleSearch(searchTerm);
      });
    this.pageNumber = 0;
  }

  onPageChange(event: PageEvent, table: string) {
    switch (table) {
      case 'allOrdersList':
        this.pageNumber = event.pageIndex;
        this.pageSize = event.pageSize;
        this.fetchData(this.search, this.pageNumber, this.pageSize, this.getOrderStatus, 'allOrdersList');
        break;
    }
  }

  handleSearch(searchTerm: string) {
    this.search = searchTerm;
    this.fetchData(this.search, this.pageNumber, this.pageSize, this.getOrderStatus, 'allOrdersList');
  }

  getOrderByStatus(getOrderStatus: any): void {
    this.getOrderStatus = getOrderStatus; // Update the selected status
    this.pageNumber = 0;
    if (this.paginator1) {
      this.paginator1.pageIndex = 0;
    }
    this.fetchData(this.search, this.pageNumber, this.pageSize, this.getOrderStatus, 'allOrdersList');
  }

  fetchData(search: string, pageNumber: number, pageSize: number, status: any, table: string) {
    const params = {
      pageNumber: pageNumber + 1,
      pageSize: pageSize,
      search: search,
      status: status,
    }
    switch (table) {
      case 'allOrdersList':
        this.ordersServices.getOrders(params).subscribe(
          (res: any) => {
            const transformedData = res.data.orders.map((orders: any) => ({
              orderId: orders.orderId,
              subOrderId: orders.subOrderId,
              orderStatus: orders.orderStatus,
              orderPrice: orders.orderPrice,
              orderDate: orders.orderDate,
              orderDiscount: orders.orderDiscount,
              orderDiscountType: orders.orderDiscountType,
              productQuantity: orders.productQuantity,
              productName: orders.productName,
              productImage: orders.productImage,
              productThumbnail: orders.productThumbnail,
              customerFirstName: orders.customerFirstName,
              customerLastName: orders.customerLastName,
              merchantName: orders.merchantName,
            }));
            this.dataSource.data = transformedData;
            this.totalItems1 = res.data.count;
            // console.log(this.totalItems1, "TOTAL ITEM");

          }
        );
        break;
    }
  }
  OnSearchIcon() {

  }

  onEditOpen() {
    this.dialog.open(OrdersDialogComponent, {
      data: {
        isEditOpen: true,
        isAddOpen: false
      }
    })
  };


  onAddOrderOpen() {
    this.router.navigateByUrl('orders/create_orders');
  }

  orderDetailsOpen(orderId: string) {
    if (orderId !== '') {
      // Navigate to the order details page within the same tab
      this.router.navigate(['orders/order_details', orderId]);
    }
  }

}

