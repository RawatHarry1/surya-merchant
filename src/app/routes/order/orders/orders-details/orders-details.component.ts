import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltip } from '@angular/material/tooltip';
import { TruncatePipe } from '@core/pipes/truncate.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { OrdersService } from '@shared/services/orders.service';
import { ActivatedRoute } from '@angular/router';
import { CurrencyChangePipe } from '@core/pipes/currency-change.pipe';

export interface OrderDetails {

}

@Component({
  selector: 'app-orders-details',
  standalone: true,
  imports: [
    CommonModule,
    MatIcon,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    TranslateModule,
    TruncatePipe,
    MatTooltip,
    MatTableModule,
    MatSort,
    CurrencyChangePipe


  ],
  templateUrl: './orders-details.component.html',
  styleUrl: './orders-details.component.scss'
})
export class OrdersDetailsComponent implements OnInit {
  private readonly location = inject(Location)

  orderId: any;
  mainOrder: any;
  customerName!: string;
  orderDate!: Date;
  merchantName!: string;
  customerCountryCode!: string;
  customerPhone!: number;
  customerEmail!: string;
  customerAddress!: any;
  subOrderId!:any;

  dataSource1 = new MatTableDataSource<OrderDetails>([]);

  constructor(private orderDetailsServices: OrdersService,
    private route: ActivatedRoute
  ) {
    this.orderId = this.route.snapshot.paramMap.get('orderId') || '';
  }

  ngOnInit(): void {
    this.fetchData(this.orderId);

  }

  displayedColumns: string[] = ['product', 'quantity', 'unitPrice', 'totalPrice', 'status'];

  goBack(): void {
    this.location.back();  // Navigates to the previous page in history
  }

  selectedStatus: number = 1;
  selectedSubOrderStatus: number = 0;

  status = [
    // { value: 0, viewValue: 'Pending' },
    { value: 1, viewValue: 'Ordered' },
    { value: 2, viewValue: 'Shipped' },
    { value: 3, viewValue: 'Delivered' },
    // { value: 4, viewValue: 'Cancelled' },
    // { value: 5, viewValue: 'Returned' },
    // { value: 6, viewValue: 'Replaced' },
    { value: 7, viewValue: 'Failed' },
  ];

  SubOrderStatus = [
    // { value: 0, viewValue: 'Pending' },
    { value: 1, viewValue: 'Ordered' },
    { value: 2, viewValue: 'Shipped' },
    { value: 3, viewValue: 'Delivered' },
    // { value: 4, viewValue: 'Cancelled' },
    // { value: 5, viewValue: 'Returned' },
    // { value: 6, viewValue: 'Replaced' },
    { value: 7, viewValue: 'Failed' },
  ];




  onStatusChange(newStatus: number, subOrderId:any): void {
    const payload = {
      orderId: this.orderId,
      status: newStatus,
      subOrderId: subOrderId,
    };

    console.log('Selected status:', payload);

    // Make the API call here
    this.orderDetailsServices.updateOrderStatus(payload).subscribe(
      (response) => {
        console.log('Status updated successfully', response);
      },
      (error) => {
        console.error('Error updating status', error);
      }
    );
  }


  fetchData(id: string) {
    this.orderDetailsServices.getOrderDetails(id).subscribe((res: any) => {
      const fetchOrder = {
        orderDate: new Date(res.data.orderDate),
        orderId: res.data.orderId,
        customerName: res.data.customerName,
        merchantName: res.data.merchantName,
        customerCountryCode: res.data.customerCountryCode,
        customerPhone: res.data.customerPhone,
        customerEmail: res.data.customerEmail,
        totalPrice: res.data.totalPrice || 0,
        totalDiscountPrice: res.data.totalDiscountPrice || 0,
        deliveryCharges: res.data.deliveryCharges || 0,
        totalPriceToPay: res.data.totalPriceToPay || 0,
      }
      this.mainOrder = fetchOrder;

      // Handle address object directly
      const customerAddress = {
        address: res.data.address.address,
        displayAddress: res.data.address.displayAddress,
        locality: res.data.address.locality,
        city: res.data.address.city,
        state: res.data.address.state,
        landmark: res.data.address.landmark
      };
      this.customerAddress = customerAddress;

      // Extract only the subOrders data
      const transformedData = res.data.subOrders.map((subOrder: any) => ({
        subOrderId: subOrder.subOrderId,
        productImage: subOrder.productImage,
        productName: subOrder.productName,
        productQuantity: subOrder.productQuantity,
        subOrderPrice: subOrder.subOrderPrice || 0,
        totalSubOrderPrice: subOrder.totalSubOrderPrice || 0,
        selectedSubOrderStatus: subOrder.subOrderstatus
      }));
      this.dataSource1.data = transformedData;
    });
  }
}