import { CommonModule } from '@angular/common';
import { ImplicitReceiver } from '@angular/compiler';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { IntigrationDialogComponent } from './intigration-dialog/intigration-dialog.component';
import { IntegrationService } from '@shared/services/integration.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';

export interface IntegrationData {
  dsmName: string;
  url: string;
  authToken: string;
  status: string;
  action: string;
  id: string;
}

@Component({
  selector: 'app-intigration',
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
    ReactiveFormsModule
  ],
  templateUrl: './integration.component.html',
  styleUrl: './integration.component.scss'
})
export class IntegrationComponent implements OnInit {

  public dialog = inject(MatDialog);
  constructor(public router: Router,
    private integrationService: IntegrationService
  ) { }

  displayedColumns: string[] = [
    'dsmName',
    'url',
    'authToken',
    'status',
    'action',
  ];
  dataSource = new MatTableDataSource<IntegrationData>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  searchQuery: string = '';
  searchControl = new FormControl();


  ngOnInit() {
    // this.dataSource.sort = this.sort;
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((query: string) => {
        this.searchQuery = query;
        this.onSearch();
      })
  }


  /* ------------TO SORT THE DATA OF TABLE */
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.loadIntegration();
  }

  onSearch() {
    this.dataSource.filter = this.searchQuery.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  };


  loadIntegration() {
    this.integrationService.getIntegration().subscribe((data: any) => {
      const transformedData: IntegrationData[] = data.map((item: any) => ({
        dsmName: item.dsmName,
        url: item.url,
        authToken: item.authToken,
        status: item.status,
        action: item.action,
        id: item.id
      }));
      this.dataSource.data = transformedData;
    })
  }

  //Add Integration ==================
  onAddIntegrationOpen() {
    const dialogRef = this.dialog.open(IntigrationDialogComponent, {
      data: {
        isAddOpen: true,
        isEditOpen: false,
      }
    });
    dialogRef.afterClosed().subscribe((data) => {
      this.loadIntegration();
    })
  };

  // Edit Integration====================
  onEditOpen(intigration: IntegrationData): void {
    const dialogRef = this.dialog.open(IntigrationDialogComponent, {
      data: {
        isAddOpen: false,
        isEditOpen: true,
        id: intigration.id,
      }
    });
    dialogRef.componentInstance.integrationData = intigration;
    dialogRef.afterClosed().subscribe(() => {
      this.loadIntegration();
    });
  }

  //Status Change====================
  onToggleChange(element: any): void {
    this.integrationService.statusIntegration(element.id, element.status)
      .subscribe({
        next: (data) => {
          console.log("Toggle changed", data);
        },
        error: (error) => {
          console.log("Error in the TOGGLE CHANGE", error);
        }
      })
  }

  //Delete Integration==============
  onDelete(id: string): void {
    if (confirm('Are you sure you want to delete this merchant?')) {
      this.integrationService.deleteIntegration(id)
        .subscribe({
          next: (data) => {
            console.log("DELETE", data);
            this.loadIntegration();
          },
          error: (error) => {
            console.log("Error In Integration Delete", error);
          }
        })
    }
  }
}







