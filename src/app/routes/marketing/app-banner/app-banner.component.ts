import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { AppBannerDialogComponent } from './app-banner-dialog/app-banner-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { BannersService } from '@shared/services/banners.service';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { ToastrService } from 'ngx-toastr';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-app-banner',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIcon,
    MatPaginatorModule,
    MatMenu,
    MatCardModule,
    MatButtonModule,
    MatMenuModule,
    MatSlideToggleModule,
    TranslateModule
  ],
  templateUrl: './app-banner.component.html',
  styleUrl: './app-banner.component.scss'
})
export class AppBannerComponent {
  isContainerVisible: boolean[] = [false];
  bannerList: any = [];
  private readonly toast = inject(ToastrService);
  @ViewChild('paginator1') paginator1!: MatPaginator;
  totalItems1: any = 0;
  pageNumber = 0;
  pageSize = 5;
  pageOptions: any

  constructor(
    public dialog: MatDialog,
    private bannersService: BannersService
  ) { }

  ngOnInit(): void {
    this.fetchBannerData(this.pageNumber, this.pageSize)
  }

  /**
   * Used to show hide banner.
   * @param index 
   */
  toggleContainer(index: any) {
    this.isContainerVisible[index] = !this.isContainerVisible[index];
  }

  /**
   * Get banner list.
   * @param pageNumber 
   * @param pageSize 
   */
  fetchBannerData(pageNumber: number, pageSize: number) {
    const params = {
      pageNumber: pageNumber + 1,
      pageSize: pageSize,
    }
    this.bannersService.getAppBannerList(params).subscribe((res: any) => {
      if (res.status) {
        this.bannerList = res.data.banners.reverse();
        this.totalItems1 = res.data.count;
      }
    })
  };

  /**
   * Used to get banner list by Pagination.
   * @param event 
   */
  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex;
    this.pageSize = event.pageSize;
    this.fetchBannerData(this.pageNumber, this.pageSize,);
  }

  /**
   * Used to open app banner dialog.
   */
  openAddBanner(bannerObj?: any, isUpdate?: any) {
    const dialogRef = this.dialog.open(AppBannerDialogComponent, {});
    dialogRef.componentInstance.bannerData = bannerObj;
    dialogRef.componentInstance.isUpdate = isUpdate;
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result?.isClose) {
        this.fetchBannerData(this.pageNumber, this.pageSize,);
      }
    })
  }

  /**
   * used to change status.
   * @param bannerId 
   */
  onToggleChange(bannerId: any) {
    this.bannersService.changeBannerStatusById(bannerId).subscribe((_) => { })
  }

  /**
   * Used to delete app banner.
   * @param bannerId 
   */
  deleteBannerById(bannerId: any) {
    this.bannersService.deleteAppBannerById(bannerId).subscribe((res: any) => {
      if (res.status) {
        this.fetchBannerData(this.pageNumber, this.pageSize,);
        this.toast.success(res.message, 'Success')
      }
    })
  }
}
