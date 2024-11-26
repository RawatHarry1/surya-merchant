import { CommonModule, JsonPipe } from '@angular/common';

import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormField, MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { CurrencyChangePipe } from '@core/pipes/currency-change.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { CustomerService } from '@shared/services/customer.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { TruncatePipe } from "../../../core/pipes/truncate.pipe";
import { MatTooltip } from '@angular/material/tooltip';
import { NotificatonService } from '@shared/services/notificaton.service';
import { ToastrService } from 'ngx-toastr';

export interface Customer {
  id: string;
  profileImage: any;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: number;
  countryCode: any;
  countryCodeIso: any;
  gender: string;
  selected?: boolean;
}

@Component({
  selector: 'app-notifications',
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
    JsonPipe,
    MatRadioModule,
    TranslateModule,
    MatCheckboxModule,
    CurrencyChangePipe,
    TruncatePipe,
    MatTooltip
  ],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent implements OnInit, AfterViewInit {

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
    'checkbox',
    'profileImage',
    'customerId',
    'customerName',
    // 'gender',
    'email',
    'phoneNumber',
  ];

  dataSource = new MatTableDataSource<Customer>([]);
  @ViewChild('paginator1', { static: false }) paginator1!: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private customerServices: CustomerService,
    private notificationServices: NotificatonService,
    public router: Router,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {
    this.fetchData(this.search, this.pageNumber, this.pageSize, 'allCustomerList');
    this.initialization();
    this.onSearch();
  }

  ngAfterViewInit(): void {

  }

  // Initialize the form
  initialization() {
    this.notificationForm = this.fb.group({
      medium: [1, [Validators.required]],
      notification: this.fb.group({
        title: ['', [Validators.required, Validators.maxLength(100)]],
        message: ['', [Validators.required, Validators.maxLength(100)]]
      }),
      customers: this.fb.group({
        selectedCustomers: [[]]
      })
    });
  }



  isRowSelected(row: any): boolean {
    return this.selectedCustomers.has(row.id);
  }

  toggleRowSelection(row: any): void {
    if (this.selectedCustomers.has(row.id)) {
      this.selectedCustomers.delete(row.id);
    } else {
      this.selectedCustomers.add(row.id);
    }
    this.updateSelectedCustomersFormControl();
  }

  isAllSelected(): boolean {
    return this.dataSource.data.length > 0 && this.selectedCustomers.size === this.dataSource.data.length;
  }

  isIndeterminate(): boolean {
    return this.selectedCustomers.size > 0 && this.selectedCustomers.size < this.dataSource.data.length;
  }

  toggleSelectAll(event: any): void {
    if (event.checked) {
      this.dataSource.data.forEach(row => this.selectedCustomers.add(row.id));
    } else {
      this.selectedCustomers.clear();
    }
    this.updateSelectedCustomersFormControl();
  }

  updateSelectedCustomersFormControl(): void {
    this.notificationForm.patchValue({
      customers: {
        selectedCustomers: Array.from(this.selectedCustomers)
      }
    });
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
              dob: customers.dob
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

  // Handle form submission
  onSubmit() {
    const formValues = this.notificationForm.value;
    const selectedCustomerIds = Array.from(this.selectedCustomers).map(customerId => ({ id: customerId }));

    if (this.notificationForm.valid) {
      const payload = {
        customers: selectedCustomerIds,
        notification: {
          title: formValues.notification.title,
          message: formValues.notification.message
        },
        medium: this.notificationForm.value.medium
      };

      this.notificationServices.sendNotificationCustomers(payload).subscribe({
        next: (response) => {
          this.notificationForm.reset({
            notification: {
              title: '',
              message: ''
            },
            medium: 1 // Reset to default 'Push' option
          });
          this.toast.success('Notifeaction Sent Successfully', 'Successful');
        },
        error: (error) => {
        }
      });
    } else {
      this.notificationForm.markAllAsTouched();
    }
  }

}