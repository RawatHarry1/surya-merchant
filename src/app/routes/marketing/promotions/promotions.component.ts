import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortHeader, MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { RouterOutlet, Router } from '@angular/router';
import { PromotionsDialogComponent } from './promotions-dialog/promotions-dialog.component';
import { HttpClient } from '@angular/common/http';
import { PromotionsService } from '@shared/services/promotions.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { DatePipe } from '@angular/common';
import { MatTooltip } from '@angular/material/tooltip';
import { TruncatePipe } from '@core/pipes/truncate.pipe';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';

export interface DialogData {
  isAddOpen: Boolean;
  isEditOpen: Boolean;
}

export interface PromotionData {
  id: string;
  couponName: string;
  couponType: string;
  description: string;
  value: string;
  minimumOrder: string;
  discount: any;
  amount: string;
  startDate: string;
  endDate: string;
  totalUsers: string;
  isActive: any;
}

@Component({
  selector: 'app-promotions',
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
    TranslateModule
  ],
  providers: [DatePipe],
  templateUrl: './promotions.component.html',
  styleUrl: './promotions.component.scss'
})
export class PromotionsComponent implements AfterViewInit, OnInit {
  public dialog = inject(MatDialog);
  private http = inject(HttpClient)

  dataSource = new MatTableDataSource<PromotionData>([]);
  @ViewChild('paginator1') paginator1!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  searchQuery: string = '';
  searchControl = new FormControl();

  totalItems1 = 0;

  search = '';
  pageNumber = 0;
  pageSize = 5;
  startDate = '';
  endDate = '';

  constructor(public router: Router,
    private promotionsService: PromotionsService,
    private datePipe: DatePipe,
    public toast : ToastrService
  ) { }

  displayedColumns: string[] = [
    'couponId',
    'couponName',
    'discount',
    'minimumOrderAmount',
    'maxDiscountAmount',
    'startDate',
    'endDate',
    'totalUsers',
    'status',
    'action',
  ];

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((query: string) => {
        this.searchQuery = query;
        this.onSearch();
      })
    this.fetchData(this.search, this.pageNumber, this.pageSize, this.startDate, this.endDate, 'promotionList');
  }


  /* ------------TO SORT THE DATA OF TABLE */
  ngAfterViewInit() {
  }

  onPageChange(event: PageEvent, table: string) {
    switch (table) {
      case 'promotionList':
        this.pageNumber = event.pageIndex;
        this.pageSize = event.pageSize;
        this.fetchData(this.search, this.pageNumber, this.pageSize, this.startDate, this.endDate, 'promotionList');
        break;
    }
  }

  fetchData(search: string, pageNumber: number, pageSize: number, startDate: any,
    endDate: any, table: string) {
    const params = {
      pageNumber: pageNumber + 1,
      pageSize: pageSize,
      search: search,
      startDate: startDate,
      endDate: endDate,

    }
    switch (table) {
      case 'promotionList':
        this.promotionsService.getPromotion(params).subscribe(
          (res: any) => {
            const transformedData: [] = res.data.promos.map((promos: any) => ({
              id: promos.id,
              title: promos.title || '',
              discountType: promos.discountType,
              description: promos.description,
              discount: promos.discount,
              value: promos.value,
              minAmount: promos.minAmount,
              maxDiscountAmount: promos.maxDiscountAmount,
              startDate: this.datePipe.transform(promos.startDate * 1000, 'dd/MM/yyyy'),
              endDate: this.datePipe.transform(promos.endDate * 1000, 'dd/MM/yyyy'),
              maxUser: promos.maxUser,
              isActive: promos.isActive,
              maxPerDayUser: promos.maxPerDayUser,
              multiUseByCustomer: promos.multiUseByCustomer,
              fromDate: promos.startDate,// to patch the value In dialog
              tillDate: promos.endDate,// to patch the value In dialog

            }));

            this.dataSource.data = transformedData;
            this.totalItems1 = res.data.total;
          }
        );
        break;
    };
  }

  // Satatus Change OF Coupon 
  isCouponActive(id: string) {
    this.promotionsService.updatePromotion(id).subscribe((res: any) => {
      this.toast.success(res.message, "Successfull")
      this.fetchData(this.search, this.pageNumber, this.pageSize, this.startDate, this.endDate, 'promotionList');
    })
  }


  onDelete(promotion: PromotionData) {
    if (confirm('Are you sure you want to delete this promotion?')) {
      this.promotionsService.deletePromotion(promotion.id).subscribe(
        (res) => {
          this.fetchData(this.search, this.pageNumber, this.pageSize, this.startDate, this.endDate, 'promotionList');
          this.toast.success(res.message, "Successfull")
        },
        (error) => {
          console.error('Error deleting promotion:', error);
        }
      );
    }
  }

  onSearch() {
    this.dataSource.filter = this.searchQuery.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  };

  onEditOpen(promotion: PromotionData) {
    console.log(promotion)
    const dialogRef = this.dialog.open(PromotionsDialogComponent, {
      data: {
        isEditOpen: true,
        isAddOpen: false,
        id: promotion.id
      }
    });
    dialogRef.componentInstance.promotionData = promotion;
    dialogRef.afterClosed().subscribe((res) => {
      // this.toast.success(res.message, "Successfull")

      this.fetchData(this.search, this.pageNumber, this.pageSize, this.startDate, this.endDate, 'promotionList');
    })
  };


  onAddPromotionsOpen() {
    const dialogRef = this.dialog.open(PromotionsDialogComponent, {
      data: {
        isEditOpen: false,
        isAddOpen: true
      }
    });
    dialogRef.afterClosed().subscribe((res) => {
      // this.toast.success(res.message, "Successfull")
      this.fetchData(this.search, this.pageNumber, this.pageSize, this.startDate, this.endDate, 'promotionList');
    })
  }
}
