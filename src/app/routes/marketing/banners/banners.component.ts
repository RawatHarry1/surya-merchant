import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatCard, MatCardModule, MatCardTitle } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { BannersDialogComponent } from './banners-dialog/banners-dialog.component';
import { BannersService } from '@shared/services/banners.service';

export interface BannersData {
  image: string;
  mobileImageWeb: string;
  mobileImage: string;
  name: string;
  text: string;
  storeId: string;
  storeName: string;
  externalLink: string;
  action: string;
  id: string;
}

@Component({
  selector: 'app-banners',
  standalone: true,
  imports: [
    CommonModule,
    MatFormField,
    MatTableModule,
    MatListModule,
    MatCardModule,
    MatIcon,
    MatPaginator,
    MatSortHeader,
    MatSort,
    MatMenuModule,
  ],
  templateUrl: './banners.component.html',
  styleUrl: './banners.component.scss'
})
export class BannersComponent implements OnInit {

  public dialog = inject(MatDialog);

  dataSource = new MatTableDataSource<BannersData>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  ngOnInit(): void {

  }
  displayedColumns: string[] = [
    'image',
    'mobileImageWeb',
    'mobileImage',
    'name',
    'text',
    'storeId',
    'storeName',
    'externalLink',
    'action',
  ]

  constructor(
    private bannerSevices: BannersService
  ) { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.loadBanner();
  }


  loadBanner() {
    this.bannerSevices.getBanner().subscribe((data: any) => {
      const transformedData: BannersData[] = data.map((item: any) => ({
        image: item.image,
        mobileImageWeb: item.mobileImageWeb,
        mobileImage: item.mobileImage,
        name: item.name,
        text: item.text,
        storeId: item.storeId,
        storeName: item.storeName,
        externalLink: item.externalLink,
        id: item.id
      }));
      this.dataSource.data = transformedData;
    })
  }
  
  onAddPromotionsOpen() {
    const dialogRef = this.dialog.open(BannersDialogComponent, {
      data: {
        isEditOpen: false,
        isAddOpen: true
      }
    });
    dialogRef.afterClosed().subscribe((data) => {
      this.loadBanner();
    })
  }

  onEditOpen(banner: BannersData) {
    const dialogRef = this.dialog.open(BannersDialogComponent, {
      data: {
        isEditOpen: true,
        isAddOpen: false,
        id:banner.id,
      }
    });
    dialogRef.componentInstance.bannerData = banner;
    dialogRef.afterClosed().subscribe((data) => {
      this.loadBanner();
    })
  }

  onDelete(banner: BannersData) {
    if (confirm("Are you sure you want to delete this Banner!")) {
      this.bannerSevices.deleteBanner(banner.id).subscribe((data) => {
        this.loadBanner();
      })
    }
  }
}
