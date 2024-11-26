import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSort, MatSortHeader, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterOutlet } from '@angular/router';
import { SubAdminsDialogComponent } from './sub-admins-dialog/sub-admins-dialog.component';
import { SubAdminsService } from '@shared/services/sub-admins.service';

export interface DialogData {
  isEditOpen: boolean;
  isAddOpen: boolean;
}

export interface SubAdminData {
  id: string;
  phone: string;
  email: string;
  registrationDate: string;
  status: string;
  permissions: string;
}

@Component({
  selector: 'app-sub-admins',
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
    RouterOutlet
  ],
  templateUrl: './sub-admins.component.html',
  styleUrl: './sub-admins.component.scss'
})
export class SubAdminsComponent {
  public dialog = inject(MatDialog);
  
  constructor(public router: Router,
    private subAdminServices: SubAdminsService,
  ) { }

  displayedColumns: string[] = [
    'id',
    'phone',
    'email',
    'registrationDate',
    'status',
    'permissions',
  ];
  dataSource = new MatTableDataSource<SubAdminData>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  searchQuery: string = '';


  ngOnInit() {
    this.loadSubAdmins();
  }


  /* ------------TO SORT THE DATA OF TABLE */
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.loadSubAdmins();
  }

  onSearch() {
    this.dataSource.filter = this.searchQuery.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  };
  OnSearchIcon() {

  }

  loadSubAdmins() {
    this.subAdminServices.getSubAdmin().subscribe((data: any) => {
      const transformedData: SubAdminData[] = data.map((item: any) => ({
        id: item.id,
        phone: item.phone,
        email: item.email,
        registrationDate: item.registrationDate,
        status: item.status 
      }));
      this.dataSource.data = transformedData;
    });
  }


  onAddSubAdminsOpen() {
    const dialogRef = this.dialog.open(SubAdminsDialogComponent, {
      data: {
        isEditOpen: false,
        isAddOpen: true
      }

    });

    dialogRef.afterClosed().subscribe((data) => {
      this.loadSubAdmins();
    })


  }

   // This function will be triggered when the toggle changes
    // Handle toggle change
  onToggleChange(element: any): void {
    console.log('Toggle changed for element:', element);
    
    // Call the service to update the status on the server
    this.subAdminServices.updateStatus(element.id, element.status)
      .subscribe({
        next: (response) => {
          console.log('Status updated successfully:', response);
        },
        error: (error) => {
          console.error('Error updating status:', error);
        }
      });
  }

  //this is to Edit in the table now
  onEditOpen(subAdmin: SubAdminData) {
    const dialogRef = this.dialog.open(SubAdminsDialogComponent, {
      data: {
        isAddOpen: false,
        isEditOpen: true,
        id: subAdmin.id
      }
    });
    dialogRef.componentInstance.subAdminData = subAdmin;
    dialogRef.afterClosed().subscribe((data) => {
      this.loadSubAdmins();
    })
  };

  onOpenPermission() {
    this.router.navigateByUrl('sub-admins/sub-admins-permission')
  }
}