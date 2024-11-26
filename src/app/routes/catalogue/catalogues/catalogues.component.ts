import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, inject, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardModule } from '@angular/material/card';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortHeader, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { FilterDialogComponent } from './filter-dialog/filter-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CategoryService } from '@shared/services/category.service';
import { SubCategoryDialogComponent } from './sub-category-dialog/sub-category-dialog.component';
import { SubSubCategoryDialogComponent } from './sub-sub-category-dialog/sub-sub-category-dialog.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { MatOption, MatSelect } from '@angular/material/select';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { TruncatePipe } from '@core/pipes/truncate.pipe';
import { MatTooltip } from '@angular/material/tooltip';
import { HttpClient } from '@angular/common/http';

export interface CategoryData {
  id: string,
  categoryName: string,
  categoryImage: string,
  filters: [],
  thirdLevelCategoryName: string,
  subCategoryName: string
}

@Component({
  selector: 'app-catalogues',
  standalone: true,
  imports: [
    CommonModule,
    MatTabGroup,
    MatFormField,
    MatFormFieldModule,
    MatTab,
    ReactiveFormsModule,
    MatIcon,
    MatInputModule,
    MatCardContent,
    MatCard,
    MatMenuModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatSort,
    RouterOutlet,
    MatCheckboxModule,
    MatSortHeader,
    MatSortModule,
    MatIconModule,
    MatCardModule,
    FormsModule,
    MatSelect,
    MatOption,
    TranslateModule,
    TruncatePipe,
    MatTooltip
  ],
  templateUrl: './catalogues.component.html',
  styleUrl: './catalogues.component.scss'
})
export class CataloguesComponent implements AfterViewInit, OnInit {

  searchControl = new FormControl();
  selectedTabIndex: number = 0;
  selectedTab: number = 1;

  // pageSize: number = 5;
  // pageNumber: number = 1

  totalItems1 = 0;
  totalItems2 = 0;
  totalItems3 = 0;

  pageSize1 = 5;
  pageSize2 = 5;
  pageSize3 = 5;

  pageIndex1 = 0;
  pageIndex2 = 0;
  pageIndex3 = 0;

  query: any = '';
  categories: any[] = [];
  subCategories: any[] = [];
  subSubCategories: any[] = [];
  initialLoad: boolean = true;
  public dialog = inject(MatDialog);

  dataSource1 = new MatTableDataSource<CategoryData>([]);
  dataSource2 = new MatTableDataSource<CategoryData>([]);
  dataSource3 = new MatTableDataSource<CategoryData>([]);

  @ViewChild('paginator1', { static: false }) paginator1!: MatPaginator;
  @ViewChild('paginator2', { static: false }) paginator2!: MatPaginator;
  @ViewChild('paginator3', { static: false }) paginator3!: MatPaginator;
  @ViewChild('sort1') sort1!: MatSort;
  @ViewChild('sort2') sort2!: MatSort;
  @ViewChild('sort3') sort3!: MatSort;

  displayedColumns: string[] = ['id', 'categoryImage' , 'categoryName', 'filters', 'action'];
  displayedColumns2: string[] = ['id', 'subCategoryImage', 'subCategoryName', 'categoryName', 'action'];
  displayedColumns3: string[] = ['id', 'thirdLevelCategoryThumbnail', 'thirdLevelCategoryName', 'subCategoryName', 'categoryName', 'action'];

  ngOnInit() {
    this.fetchData(this.query, this.pageIndex1, this.pageSize1, 'categoryTable');
    this.onSearch();
  }
  ngAfterViewInit() {

  }

  constructor(public router: Router,
    private route: ActivatedRoute,
    private categoryServices: CategoryService,
    private cdRef: ChangeDetectorRef
  ) { }

  //This is for the Search for the all 3
  onSearch() {
    this.searchControl.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged())
      .subscribe((searchTerm) => {
        this.handleSearch(searchTerm);
      });
  }

  onTabChange(event: any) {
    this.selectedTab = event.value;
    this.searchControl.setValue('');

    // Call fetchData with the current search query
    this.fetchData(this.query, this.getCurrentPageIndex(), this.getCurrentPageSize(), this.getCurrentTableName());
  }

  handleSearch(searchTerm: string) {
    this.query = searchTerm;
    //This is to redirect the paginator to 1 page On search 
    switch (this.selectedTab) {
      case 1:
        this.pageIndex1 = 0;
        if (this.paginator1) this.paginator1.firstPage();
        break;
      case 2:
        this.pageIndex2 = 0;
        if (this.paginator2) this.paginator2.firstPage();
        break;
      case 3:
        this.pageIndex3 = 0;
        if (this.paginator3) this.paginator3.firstPage();
        break;
    }
    this.fetchData(this.query, this.getCurrentPageIndex(), this.getCurrentPageSize(), this.getCurrentTableName());
  }

  // Utility to get current page index based on selected tab
  getCurrentPageIndex(): number {
    switch (this.selectedTab) {
      case 1:
        return this.pageIndex1;
      case 2:
        return this.pageIndex2;
      case 3:
        return this.pageIndex3;
      default:
        return 0;
    }
  }

  // Utility to get current page size based on selected tab
  getCurrentPageSize(): number {
    switch (this.selectedTab) {
      case 1:
        return this.pageSize1;
      case 2:
        return this.pageSize2;
      case 3:
        return this.pageSize3;
      default:
        return 5;
    }
  }

  // Utility to get current table name based on selected tab
  getCurrentTableName(): string {
    switch (this.selectedTab) {
      case 1:
        return 'categoryTable';
      case 2:
        return 'subCategoryTable';
      case 3:
        return 'subSubCategoryTable';
      default:
        return '';
    }
  }


  // To HELP TO Apply search for Right Tab 
  getDataSourceForSelectedTab() {
    const dataSources = [this.dataSource1, this.dataSource2, this.dataSource3];
    return dataSources[this.selectedTabIndex];
  }

  // This is for the Event For the Paginator for Eact Click (PAGE CHANGE)
  onPageChange(event: PageEvent, table: string) {
    switch (table) {
      case 'categoryTable':
        this.pageIndex1 = event.pageIndex;
        this.pageSize1 = event.pageSize;
        this.fetchData(this.query, this.pageIndex1, this.pageSize1, 'categoryTable');
        break;
      case 'subCategoryTable':
        this.pageIndex2 = event.pageIndex;
        this.pageSize2 = event.pageSize;
        this.fetchData(this.query, this.pageIndex2, this.pageSize2, 'subCategoryTable');
        break;
      case 'subSubCategoryTable':
        this.pageIndex3 = event.pageIndex;
        this.pageSize3 = event.pageSize;
        this.fetchData(this.query, this.pageIndex3, this.pageSize3, 'subSubCategoryTable');
        break;
    }
  }

  // Data For all the 3 Tables

  fetchData(query: string, pageIndex: number, pageSize: number, table: string) {
    const params = {
      search: query,
      pageNumber: (pageIndex + 1).toString(),
      pageSize: pageSize.toString()
    };
    switch (table) {
      case 'categoryTable':
        this.categoryServices.getCategory(params).subscribe(
          (response: any) => {
            const transformedData = response.data.categories.map((category: any) => ({
              id: category.categoryId,
              categoryName: category.categoryName,
              categoryImage: category.categoryThumbnail || category.categoryImage,
              filters: category.filters,
            }));

            this.dataSource1.data = transformedData;
            this.totalItems1 = response.data.count;  // Update total count for pagination
          }
        );
        break;

      case 'subCategoryTable':
        this.categoryServices.getSubCategory(params).subscribe((response: any) => {
          const transformedData: CategoryData[] = response.data.subCategories.map((subCategory: any) => ({
            id: subCategory.subCategoryId,
            subCategoryImage: subCategory.subCategoryThumbnail,
            subCategoryName: subCategory.subCategoryName,
            categoryName: subCategory.categoryName
          }));
          this.dataSource2.data = transformedData;
          this.totalItems2 = response.data.count;

        }, error => {
          console.error('Error loading categories:', error);
        });
        break;

      case 'subSubCategoryTable':
        this.categoryServices.getSubSubCategory(params).subscribe((response: any) => {
          const transformedData: CategoryData[] = response.data.subCategories.map((subSubCategories: any) => ({
            id: subSubCategories.thirdLevelCategoryId,
            thirdLevelCategoryThumbnail: subSubCategories.thirdLevelCategoryThumbnail,
            thirdLevelCategoryName: subSubCategories.thirdLevelCategoryName,
            subCategoryName: subSubCategories.subCategoryName,
            categoryName: subSubCategories.categoryName
          }));
          this.dataSource3.data = transformedData;
          this.totalItems3 = response.data.count;

        }, error => {
          console.error('Error loading categories:', error);
        });
        break;

      default:
        console.error('Invalid table specified');
    }
  }





  displayFilter(catagoryData: CategoryData) {
    this.dialog.open(FilterDialogComponent, {
      data: {
        filters: catagoryData.filters
      }
    })
  }

  onAddCataloguesOpen() {
    if (this.selectedTab === 1) {
      this.router.navigateByUrl('catalogues/add_category');
    } else if (this.selectedTab === 2) {
      const subDialog = this.dialog.open(SubCategoryDialogComponent);
      subDialog.afterClosed().subscribe(result => {
        this.fetchData(this.query, this.pageIndex2, this.pageSize2, 'subCategoryTable');
      });
    } else if (this.selectedTab === 3) {
      const subSubdialogRef = this.dialog.open(SubSubCategoryDialogComponent);
      subSubdialogRef.afterClosed().subscribe(result => {
        this.fetchData(this.query, this.pageIndex3, this.pageSize3, 'subSubCategoryTable');
      });
    }
  }

  categoryDetails() {
    // this.router.navigateByUrl('catalogues/add_category');
  }

  onEditOpen() {

  }

  onDelete() {

  }
}



