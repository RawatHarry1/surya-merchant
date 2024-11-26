import { Component, inject, OnInit } from '@angular/core';
import { OrdersDialogComponent } from '../orders-dialog/orders-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatCheckbox } from '@angular/material/checkbox';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-create-orders',
  standalone: true,
  imports: [
    MatFormField,
    MatLabel,
    MatInput,
    MatFormFieldModule,
    MatCheckbox,
    RouterOutlet
  ],
  templateUrl: './create-orders.component.html',
  styleUrl: './create-orders.component.scss'
})
export class CreateOrdersComponent implements OnInit {
  public dialog = inject(MatDialog);


  ngOnInit() {
    // this.dataSource.sort = this.sort;
  }



  onAddOpen() {
    this.dialog.open(OrdersDialogComponent, {
    })
  };
}
