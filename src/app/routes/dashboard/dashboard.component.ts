import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { Router, RouterLink, Routes } from '@angular/router';
import { MtxProgressModule } from '@ng-matero/extensions/progress';
import { Subscription } from 'rxjs';

import { AppSettings, SettingsService } from '@core';
import { BreadcrumbComponent } from '@shared';
import { DashboardService } from './dashboard.service';
import { CommonModule } from '@angular/common';
import { CurrencyChangePipe } from '@core/pipes/currency-change.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { OrderData } from '../reports/reports.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TruncatePipe } from '@core/pipes/truncate.pipe';
import { OrdersDialogComponent } from '../order/orders/orders-dialog/orders-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { OrdersService } from '@shared/services/orders.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DashboardService],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatListModule,
    MatGridListModule,
    MatTableModule,
    MatTabsModule,
    MtxProgressModule,
    BreadcrumbComponent,
    CurrencyChangePipe,
    TranslateModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    TruncatePipe
  ],
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly ngZone = inject(NgZone);
  private readonly settings = inject(SettingsService);
  private readonly dashboardSrv = inject(DashboardService);
  public dialog = inject(MatDialog);

  @ViewChild('paginator1', { static: false }) paginator1!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  searchControl = new FormControl();


  // displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  // dataSource = this.dashboardSrv.getData();

  // messages = this.dashboardSrv.getMessages();

  charts = this.dashboardSrv.getCharts();
  chart1?: ApexCharts;
  chart2?: ApexCharts;

  dataSource = new MatTableDataSource<OrderData>([]);


  selectedStatus: any = 0;
  totalItems1 = 0;
  pageNumber = 0;
  pageSize = 5;
  search: string = '';
  getOrderStatus: any = 0;
  totalUsers: any;
  totalProducts: any;
  totalOrders: any;
  totalSalesAmount: any;
  statData: any;
  public amount: any;
  stats: { title: string, amount: any, color: string }[] = [];

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
    // { value: 7, viewValue: 'Failed' },
    // { value: 8, viewValue: 'Pending' },
  ];

  orderDiscount: any = {
    1: 'Percentage',
    2: 'Amount',
  };

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

  notifySubscription = Subscription.EMPTY;

  constructor(
    public cdr: ChangeDetectorRef,
    public router: Router,
    public ordersServices: OrdersService

  ) {
    this.fetchData();
  }

  ngOnInit() {
    this.fetchOrdersData(this.search, 0, 10, 0, 'allOrdersList')
  }

  ngAfterViewInit() {
    // this.ngZone.runOutsideAngular(() => this.initCharts());
  }

  ngOnDestroy() {
    this.chart1?.destroy();
    this.chart2?.destroy();

    this.notifySubscription.unsubscribe();
  }


  fetchData() {
    this.dashboardSrv.getDashboardStats().subscribe(
      (res) => {
        if (res.data) {
          this.statData = { ...res.data }
          this.cdr.markForCheck();
          this.cdr.detectChanges();
        }
      },
      (error) => {
        console.error('Error fetching dashboard stats:', error);
      }
    );
  }


  fetchOrdersData(search: string, pageNumber: number, pageSize: number, status: any, table: string) {
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


  onEditOpen() {
    this.dialog.open(OrdersDialogComponent, {
      data: {
        isEditOpen: true,
        isAddOpen: false
      }
    })
  };


  //Navigate to the All Orders Tab 
  allOrders() {
    this.router.navigate(['orders']);
  }


  // Navigate to the order details page within the same tab
  orderDetailsOpen(orderId: string) {
    if (orderId !== '') {
      this.router.navigate(['orders/order_details', orderId]);
    }
  }

  initCharts() {
    this.chart1 = new ApexCharts(document.querySelector('#chart1'), this.charts[0]);
    this.chart1?.render();
    this.chart2 = new ApexCharts(document.querySelector('#chart2'), this.charts[1]);
    this.chart2?.render();

    this.updateCharts(this.settings.options);
  }

  updateCharts(opts: Partial<AppSettings>) {
    this.chart1?.updateOptions({
      chart: {
        foreColor: opts.theme === 'dark' ? '#ccc' : '#333',
      },
      tooltip: {
        theme: opts.theme === 'dark' ? 'dark' : 'light',
      },
      grid: {
        borderColor: opts.theme === 'dark' ? '#5a5a5a' : '#e9e9e9',
      },
    });

    this.chart2?.updateOptions({
      chart: {
        foreColor: opts.theme === 'dark' ? '#ccc' : '#333',
      },
      plotOptions: {
        radar: {
          polygons: {
            strokeColors: opts.theme === 'dark' ? '#5a5a5a' : '#e9e9e9',
            connectorColors: opts.theme === 'dark' ? '#5a5a5a' : '#e9e9e9',
            fill: {
              colors: opts.theme === 'dark' ? ['#2c2c2c', '#222'] : ['#f8f8f8', '#fff'],
            },
          },
        },
      },
      tooltip: {
        theme: opts.theme === 'dark' ? 'dark' : 'light',
      },
    });
  }
}
