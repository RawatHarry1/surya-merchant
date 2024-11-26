import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSort, MatSortHeader, MatSortModule } from '@angular/material/sort';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CurrencyChangePipe } from '@core/pipes/currency-change.pipe';
import { TruncatePipe } from '@core/pipes/truncate.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { ProductService } from '@shared/services/product.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged } from 'rxjs';

export interface ProductList {
  serial_number: string;
  name: string;
  categoryName: string;
  subCategoryName: string;
  thirdLevelCateogoryName: string;
  merchantName: string;
  discount: string;
  price: string;
  description: string;
  image: string;
  status: boolean;
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
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
    TranslateModule,
    TruncatePipe,
    MatTooltip,
    CurrencyChangePipe

  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {

  dataSource = new MatTableDataSource<ProductList>([]);
  @ViewChild('paginator1') paginator1!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  searchControl = new FormControl();
  private readonly toast = inject(ToastrService);
  displayedColumns: string[] = [
    'serial_number',
    'thumbnail',
    'name',
    'categoryName',
    'subCategoryName',
    'thirdLevelCateogoryName',
    'discount',
    'price',
    'status',
    'action'
  ];
  totalItems1: any = 0;
  search = '';
  pageNumber = 0;
  pageSize = 5;

  constructor(
    private productServices: ProductService) {

  }


  ngOnInit() {
    this.fetchData(this.search, this.pageNumber, this.pageSize, 'productList');
    this.onSearch();
  }

  /**
 * Used to search list item.
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
      case 'productList':
        this.pageNumber = event.pageIndex;
        this.pageSize = event.pageSize;
        this.fetchData(this.search, this.pageNumber, this.pageSize, 'productList');
        break;
    }
  }

  handleSearch(searchTerm: string) {
    this.search = searchTerm;
    this.fetchData(this.search, this.pageNumber, this.pageSize, 'productList');
  }

  /**
   * Used to get product List using pagination.
   */
  fetchData(search: string, pageNumber: number, pageSize: number, table: string) {
    const params = {
      pageNumber: pageNumber + 1,
      pageSize: pageSize,
      search: search
    }
    switch (table) {
      case 'productList':
        this.productServices.getProductList(params).subscribe(
          (response: any) => {
            const transformedData: ProductList[] = response.data.products.map((products: any) => ({
              id: products.id,
              serial_number: products.serial_number,
              name: products.name,
              categoryName: products.categoryName,
              subCategoryName: products.subCategoryName,
              thirdLevelCateogoryName: products.thirdLevelCateogoryName,
              merchantName: products.merchantName,
              discount: products.discount,
              price: products.price,
              description: products.description,
              thumbnail: products.thumbnail,
              status: products.status === 1,
            }))
            this.dataSource.data = transformedData
            this.totalItems1 = response.data.count;
          })
        break;
    };

  }

  /**
   * This function will be triggered when the toggle changes
   * @param element 
   */
  onToggleChange(element: any): void {
    // console.log('Toggle changed for element:', element);

    // Call the service to update the status on the server
    this.productServices.updateStatus(element.id)
      .subscribe({
        next: (response) => {

          console.log('Status updated successfully:', response);
        },
        error: (error) => {
          console.error('Error updating status:', error);
        }
      });
  }

  /**
   * Delete product by id.
   * @param productId 
   */
  deleteProductById(productId: any) {
    this.productServices.deleteProductById(productId).subscribe((resp: any) => {
      if (resp.status) {
        this.toast.success(resp.message)
        this.fetchData(this.search, this.pageNumber, this.pageSize, 'productList');
      }
    })
  }
}