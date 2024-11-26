import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { DiscountsDialogComponent } from './discounts-dialog/discounts-dialog.component';
import { DiscountsService } from '@shared/services/discounts.service';

export interface DialogData {
  isSetOpen: boolean;
  isAddOpen: boolean;
  isEditOpen: boolean;
  isEditOpenAppliances:boolean;
}
export interface DiscountData { 
  name: string;
  value: string;
  description: string;
  validFrom: string;
  validTo: string;
  maxAmount?: string;
  id: string;
}

@Component({
  selector: 'app-discounts',
  standalone: true,
  imports: [
    CommonModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatIconModule,
    MatMenuModule,
    MatCardModule,
    MatPaginator,
    MatTable,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatSort

  ],
  templateUrl: './discounts.component.html',
  styleUrl: './discounts.component.scss'
})
export class DiscountsComponent implements OnInit, AfterViewInit {
  public dialog = inject(MatDialog);

  constructor(
    public router: Router,
    private discountServices: DiscountsService) { }

  displayedColumns1: string[] = [
    'name',
    'value',
    'description',
    'validFrom',
    'validTo',
    'action'
  ]
  displayedColumns: string[] = [
    'name',
    'value',
    'description',
    'validFrom',
    'validTo',
    'maxAmount',
    'action'
  ]

  dataSource1 = new MatTableDataSource<DiscountData>([]);
  dataSource2 = new MatTableDataSource<DiscountData>([]);

  @ViewChild('paginator1', { static: true }) paginator1!: MatPaginator;
  @ViewChild('paginator2', { static: true }) paginator2!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort1!: MatSort;
  @ViewChild(MatSort, { static: true }) sort2!: MatSort;

  ngOnInit(): void {
    this.loadDiscount();
    this.loadDiscountAppliances();
    this.dataSource1.paginator = this.paginator1;
    this.dataSource1.sort = this.sort1;
    this.dataSource2.paginator = this.paginator2;
    this.dataSource2.sort = this.sort2;
  }

  ngAfterViewInit(): void {
    this.loadDiscount();
    this.loadDiscountAppliances();
    this.dataSource1.paginator = this.paginator1;
    this.dataSource1.sort = this.sort1;
    this.dataSource2.paginator = this.paginator2;
    this.dataSource2.sort = this.sort2;
  }

  loadDiscount() {
    this.discountServices.getDiscount().subscribe((data: any) => {
      const transformedData: DiscountData[] = data.map((item: any) => ({
        name: item.name,
        value: item.discount,
        description: item.description,
        validFrom: item.fromDate,
        validTo: item.tillDateAdd,
        maxAmount: item.maxAmount,
        id: item.id
      }));
      this.dataSource1.data = transformedData;
    })
  }
  loadDiscountAppliances() {
    this.discountServices.getDiscountAppliances().subscribe((data: any) => {
      const transformedData: DiscountData[] = data.map((item: any) => ({
        name: item.name,
        value: item.discount,
        description: item.description,
        validFrom: item.fromDate,
        validTo: item.tillDateAdd,
        maxAmount: item.maxAmount,
        id: item.id
      }));
      this.dataSource2.data = transformedData;
    })
  }


  setDiscounts() {
    const dialogRef = this.dialog.open(DiscountsDialogComponent, {
      data: {
        isSetOpen: true,
        isAddOpen: false,
        isEditOpen: false,
        isEditOpenAppliances: false,
      }
    });
    dialogRef.afterClosed().subscribe((data) => {
      this.loadDiscount();
    })
  }
  addDiscounts() {
    const dialogRef = this.dialog.open(DiscountsDialogComponent, {
      data: {
        isSetOpen: false,
        isAddOpen: true,
        isEditOpen: false,
        isEditOpenAppliances: false,
      }
    });
    dialogRef.afterClosed().subscribe((data) => {
      this.loadDiscountAppliances();
    })
  }

  onEditOpenDiscount(discount: DiscountData) {
  const dialogRef = this.dialog.open(DiscountsDialogComponent, {
      data: {
        isSetOpen: false,
        isAddOpen: false,
        isEditOpen: true,
        isEditOpenAppliances: false,
        id: discount.id
      }
    })
    dialogRef.componentInstance.discountData = discount;
    dialogRef.afterClosed().subscribe((data) => {
      this.loadDiscount();
    })
  }
  onEditOpenAppliances(discount: DiscountData) {
    const dialogRef = this.dialog.open(DiscountsDialogComponent, {
      data: {
        isSetOpen: false,
        isAddOpen: false,
        isEditOpen: false,
        isEditOpenAppliances: true,
        id: discount.id
      }
    })
    dialogRef.componentInstance.discountData = discount;
    dialogRef.afterClosed().subscribe((data) => {
      this.loadDiscountAppliances();
    })
  }

  onDelete(discount: DiscountData) {
    if (confirm("Are you sure want to delete this Discount!")) {
      this.discountServices.deleteDiscount(discount.id).subscribe(() => {
        this.loadDiscount();
      },
        (error) => {
          console.error('Error deleting promotion:', error);
        })
    }

  }

  onDeleteAppliances(discount: DiscountData) {
    if (confirm("Are you sure want to delete this Discount!")) {
      this.discountServices.deleteDiscountAppliances(discount.id).subscribe(() => {
        this.loadDiscountAppliances();
      },
        (error) => {
          console.error('Error deleting promotion:', error);
        })
    }

  }

}