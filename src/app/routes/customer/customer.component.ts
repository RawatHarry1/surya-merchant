import { Component, inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { CustomerService } from '@shared/services/customer.service';
import { ToastrService } from 'ngx-toastr';
import { Customer } from '../settings/notifications/notifications.component';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { CommonModule, DatePipe, JsonPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltip } from '@angular/material/tooltip';
import { CurrencyChangePipe } from '@core/pipes/currency-change.pipe';
import { TruncatePipe } from '@core/pipes/truncate.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { Dialog } from '@angular/cdk/dialog';
import { MatDialog } from '@angular/material/dialog';
import { CustomerDialogComponent } from './customer-dialog/customer-dialog.component';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatPaginatorModule,
    MatTableModule,
    MatIconModule,
    MatRadioModule,
    TranslateModule,
    MatCheckboxModule,
    TruncatePipe,
    MatTooltip,
    MatMenuModule,
    MatCardModule
  ],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.scss',
  providers: [DatePipe]
})
export class CustomerComponent {

  isChecked = new FormControl(false);
  searchControl = new FormControl();
  selectedCustomers: Set<any> = new Set();
  notificationForm!: FormGroup;

  isPushEnabled: boolean = true;
  totalItems1 = 0;
  pageNumber = 0;
  pageSize = 5;
  search: string = '';

  displayedColumns: string[] = [
    'customerId',
    'profileImage',
    'customerName',
    'email',
    'phoneNumber',
    'action'
  ];

  public dialog = inject(MatDialog);
  dataSource = new MatTableDataSource<Customer>([]);
  @ViewChild('paginator1', { static: false }) paginator1!: MatPaginator;


  constructor(
    private fb: FormBuilder,
    private customerServices: CustomerService,
    public router: Router,
    private toast: ToastrService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    const initialSearchValue = this.searchControl.value;
    if (initialSearchValue) {
      this.handleSearch(initialSearchValue);

    } else {
      this.fetchData(this.search, this.pageNumber, this.pageSize, 'allCustomerList');
    }

    this.onSearch();
  }

  ngAfterViewInit(): void {

  }
  /*
  *Get Customer List Pagination START
  */
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
      case 'allCustomerList':
        this.pageNumber = event.pageIndex;
        this.pageSize = event.pageSize;
        this.fetchData(this.search, this.pageNumber, this.pageSize, 'allCustomerList');
        break;
    }
  }

  handleSearch(searchTerm: string) {
    this.search = searchTerm;
    this.fetchData(this.search, this.pageNumber, this.pageSize, 'allCustomerList');
  }

  /*
    *Get Customer List Pagination START
  */

  /*
  *Get Customer List START
  */
  fetchData(search: string, pageNumber: number, pageSize: number, table: string) {
    const params = {
      pageNumber: pageNumber + 1,
      pageSize: pageSize,
      search: search
    }
    switch (table) {
      case 'allCustomerList':
        this.customerServices.getCustomers(params).subscribe(
          (res: any) => {
            const transformedData = res.data.data.map((customers: any) => ({
              id: customers.id,
              profileImage: customers.profileImage,
              firstName: customers.firstName,
              lastName: customers.lastName,
              gender: customers.gender,
              email: customers.email,
              phoneNumber: customers.phoneNumber,
              countryCode: customers.countryCode,
              countryCodeIso: customers.countryCodeIso,
              dob: this.datePipe.transform(new Date(customers.dob))
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
  *Get Customer List END
  */

  onAddCustomerOpen(): void {
    this.dialog.open(CustomerDialogComponent)
  }

  viewCustomerOpen(id: any): void {
    this.router.navigate([`/customerlist/view_customer`, id]);
  }


  onEditOpen(): void {

  }
  onDelete(): void {

  }
}
