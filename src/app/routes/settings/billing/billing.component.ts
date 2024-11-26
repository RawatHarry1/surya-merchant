import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BillingDialogComponent } from './billing-dialog/billing-dialog.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';


export interface TableElement {
  invoiceId: string;
  amount: number;
  billingMonth: string;
  status: string;
  paymentDate: string;
}

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule
  ],
  templateUrl: './billing.component.html',
  styleUrl: './billing.component.scss'
})
export class BillingComponent implements AfterViewInit{

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public dialog = inject(MatDialog);


  displayedColumns: string[] = ['invoiceId', 'amount', 'billingMonth', 'status', 'paymentDate'];
  dataSource = new MatTableDataSource<TableElement>(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  onAddCard() {
    this.dialog.open(BillingDialogComponent)
  }
}
const ELEMENT_DATA: TableElement[] = [
  { invoiceId: 'INV-001', amount: 1500, billingMonth: 'January', status: 'Paid', paymentDate: '2024-01-15' },
  { invoiceId: 'INV-002', amount: 2000, billingMonth: 'February', status: 'Pending', paymentDate: '2024-02-20' },
  { invoiceId: 'INV-003', amount: 1800, billingMonth: 'March', status: 'Overdue', paymentDate: '2024-03-10' },
  // Add more elements as needed
];