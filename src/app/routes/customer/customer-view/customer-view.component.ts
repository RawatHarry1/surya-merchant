import { Dialog } from '@angular/cdk/dialog';
import { CommonModule, DatePipe, Location } from '@angular/common';
import { ChangeDetectorRef, Component, inject, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { CustomerDialogComponent } from '../customer-dialog/customer-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { MatTooltip } from '@angular/material/tooltip';
import { TruncatePipe } from '@core/pipes/truncate.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CurrencyChangePipe } from '@core/pipes/currency-change.pipe';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { OrdersService } from '@shared/services/orders.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '@shared/services/customer.service';

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
  selector: 'app-customer-view',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatTabsModule,
    TruncatePipe,
    MatTooltip,
    TranslateModule,
    MatTableModule,
    CurrencyChangePipe,
    MatCardModule,
    MatSelectModule,
    MatMenuModule,
    MatPaginatorModule

  ],
  templateUrl: './customer-view.component.html',
  styleUrl: './customer-view.component.scss',
  providers: [DatePipe]
})
export class CustomerViewComponent {

  constructor(
    public location: Location,
    private ordersServices: OrdersService,
    public router: Router,
    private customerServices: CustomerService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    public cdr: ChangeDetectorRef,
  ) {

  }

  public dialog = inject(MatDialog);
  dataSource = new MatTableDataSource<OrderData>([]);
  @ViewChild('paginator1', { static: false }) paginator1!: MatPaginator;

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

  selectedTabIndex: number = 0;
  searchControl = new FormControl();
  selectedStatus: any = 0;
  totalItems1 = 0;
  pageNumber = 0;
  pageSize = 5;
  search: string = '';
  getOrderStatus: any = 0;

  customers: any[] = [];
  selectedCustomer: any;
  cxId: string | null = null;

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
    this.cxId = this.route.snapshot.paramMap.get('id')

    this.getOrderStatus = null; // Initialize to 'All' by default
    this.getOrderByStatus(this.getOrderStatus);
    this.onSearch();

    if (this.cxId) {
      this.fetchAllCustomers();
    } else {
      console.error('Customer ID is missing!');
    }
  }

  /**
   * For the TAB Switch
   */

  onTabChange(event: MatTabChangeEvent): void {
    this.selectedTabIndex = event.index;
  }
  /**
   * For the TAB Switch
   */

  onPageChange(event: PageEvent, table: string) {
    switch (table) {
      case 'allOrdersList':
        this.pageNumber = event.pageIndex;
        this.pageSize = event.pageSize;
        this.fetchData(this.search, this.pageNumber, this.pageSize, this.getOrderStatus, 'allOrdersList');
        break;
    }
  }

  onSearch() {
    this.searchControl.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged())
      .subscribe((searchTerm) => {
        this.pageNumber = 0;
        // this.paginator1.pageIndex = 0;
        // this.handleSearch(searchTerm);
      });
    this.pageNumber = 0;
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
  /*
   *Get Customer List START
   */


  fetchAllCustomers(): void {
    this.customerServices.getCustomers().subscribe(
      (res: any) => {
        this.customers = res.data.data;
        this.fetchCustomerData();
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      (err) => {
        console.error('Error fetching customers:', err);
      }
    );
  }


  fetchCustomerData(): void {
    const customer = this.customers.find(customer => {
      return String(customer.id) === this.cxId;
    });
    if (customer) {
      this.selectedCustomer = customer;
      this.selectedCustomer.dob = this.datePipe.transform(new Date(this.selectedCustomer.dob * 1000), 'yyyy-MM-dd');
    } else {
      console.error('Customer not found for cxId:', this.cxId);
    }
  }


  /*
  *Get Customer List END
  */

  orderDetailsOpen(orderId: string) {
    if (orderId !== '') {
      // Navigate to the order details page within the same tab
      this.router.navigate(['orders/order_details', orderId]);
    }
  }

  openEditCustomer(): void {
    this.dialog.open(CustomerDialogComponent)
  }

  goBack(): void {
    this.location.back();
  }

}
