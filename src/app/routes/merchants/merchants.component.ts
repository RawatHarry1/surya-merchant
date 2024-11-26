import { AfterViewInit, Component, ViewChild, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortHeader, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MerchantService } from '@shared/services/merchant.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Papa } from 'ngx-papaparse';
import { saveAs } from 'file-saver';
import { Router, Routes } from '@angular/router';




export interface MerchantData {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  rating: string;
  servicable: string;
  status: string;
  action: string;
}

@Component({
  selector: 'app-merchants',
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
    ReactiveFormsModule
  ],
  templateUrl: './merchants.component.html',
  styleUrls: ['./merchants.component.scss']
})
export class MerchantsComponent implements AfterViewInit, OnInit {
  public dialog = inject(MatDialog);
  private http = inject(HttpClient);
  private papa = inject(Papa);


  displayedColumns: string[] = [
    'id',
    'name',
    'email',
    'address',
    'businessType',
    'workingHours',
    'status',
    'action',
  ];

  dataSource = new MatTableDataSource<MerchantData>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  searchQuery: string = '';
  searchControl = new FormControl();

  constructor(
    private merchantService: MerchantService,
    public router: Router) {
  }
  ngOnInit() {
    this.loadMerchants();
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((query: string) => {
        this.searchQuery = query;
        this.onSearch();
      });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.loadMerchants();
  }

  loadMerchants(): void {
    this.http.get<MerchantData[]>(MerchantService.apiUrl).subscribe(
      (data) => {
        const transformedData: MerchantData[] = data.map((item: any) => ({
          id: item?.id,
          name: item.name,
          address: item.address || '--',
          phone: item.phone || '--',
          email: item.email || '--',
          rating: item.rating || "N/A",
          servicable: item.servicable || 'No',
          status: item.status,
          action: item.action
        }));

        this.dataSource.data = transformedData;
      },
      (error) => {
        console.error('Error loading merchants:', error);
      }
    );
  }


  onSearch() {
    this.dataSource.filter = this.searchQuery.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  onEdit(element: any): void {
  this.router.navigate(['/merchants/add_merchant'])
  }

  onDelete(id: string) {
    if (confirm('Are you sure you want to delete this merchant?')) {
      this.merchantService.deleteMerchant(id).subscribe(() => {

        this.loadMerchants();
      }, error => {
        console.error('Error deleting merchant:', error);
      });
    }
  }


  onAddOpen() {
    this.router.navigate(['merchants/add_merchant'])
  }

  onToggleChange(element: any) {
    this.merchantService.updateMerchant(element.id, element.status)
      .subscribe({
        next: (response) => {
          console.log('Status updated successfully:', response);
        },
        error: (error) => {
          console.error('Error updating status:', error);
        }
      });
  }


  // CSV Export functionality
  exportToCSV(): void {
    // Transform the data into an array of objects with string keys
    const dataForExport = this.dataSource.data.map(item => ({
      id: item.id,
      name: item.name,
      address: item.address,
      phone: item.phone,
      email: item.email,
      rating: item.rating,
      servicable: item.servicable,
      status: item.status
    }));

    // Convert the transformed data to CSV format using PapaParse
    const csvString = this.papa.unparse(dataForExport);

    // Create a Blob from the CSV string
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });

    // Trigger the file download using file-saver
    saveAs(blob, 'merchants.csv');
  }

  importCSV(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          // Log the raw result to see if data is parsed correctly
          console.log('Parsed CSV Data:', result);

          // Map the parsed data into the expected structure
          const importedData = result.data.map((item: any) => ({
            id: item['id'],
            name: item['name'],
            address: item['address'],
            phone: item['phone'],
            email: item['email'],
            rating: item['rating'],
            servicable: item['servicable'],
            status: item['status']
          }));

          // Ensure you don't proceed if there are missing IDs
          importedData.forEach((merchant: MerchantData) => {
            if (!merchant.id) {
              console.error('Merchant ID is undefined:', merchant);
              return;
            }

            // Call the service to add the merchant
            this.merchantService.addMerchant(merchant, 'import', merchant.id).subscribe(
              () => {
                console.log('Merchant imported successfully!', merchant);
                this.loadMerchants();
                console.log('Merchant imported successfully!');
              },
              (error: any) => {
                console.error('Error importing merchant:', error);
              }
            );
          });
        },
        error: (error) => {
          console.error('Error parsing CSV file:', error);
        }
      });
    }
  }


}


