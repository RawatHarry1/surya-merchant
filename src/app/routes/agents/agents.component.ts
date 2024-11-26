import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortHeader, MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { AgentsDialogComponent } from './agents-dialog/agents-dialog.component';

@Component({
  selector: 'app-agents',
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
    MatSlideToggleModule
  ],
  templateUrl: './agents.component.html',
  styleUrl: './agents.component.scss'
})
export class AgentsComponent implements OnInit {

  public dialog = inject(MatDialog);


  displayedColumns: string[] = [
    'checkbox',
    'storeId',
    'name',
    'address',
    'phone',
    'email',
    'rating',
    'servicable',
    'status',
    'action',];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  searchQuery: string = '';

  ngOnInit() {
    // this.dataSource.sort = this.sort;
  }


  /* ------------TO SORT THE DATA OF TABLE */
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onSearch() {
    this.dataSource.filter = this.searchQuery.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  };
  OnSearchIcon() {

  }

  onEditOpen() {
    this.dialog.open(AgentsDialogComponent, {
      data: {
        isEditOpen: true,
        isAddOpen: false
      }
    })
  };
  onAddOpen() {
    this.dialog.open(AgentsDialogComponent, {
      data: {
        isEditOpen: false,
        isAddOpen: true
      }
    })
  };
}

export interface PeriodicElement {
  storeId: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  rating: number;
  servicable: string;
  status: string;
  action: string;
}


const ELEMENT_DATA: PeriodicElement[] = [
  { storeId: 1, name: 'Agent 1', address: 'Address 1', phone: '1234567890', email: 'agent1@example.com', rating: 4.5, servicable: 'Yes', status: '', action: 'Edit' },
  { storeId: 2, name: 'Agent 2', address: 'Address 2', phone: '2345678901', email: 'agent2@example.com', rating: 4.0, servicable: 'No', status: ' ', action: 'Edit' },
  { storeId: 3, name: 'Agent 1', address: 'Address 1', phone: '1234567890', email: 'agent1@example.com', rating: 4.5, servicable: 'Yes', status: '  ', action: 'Edit' },
  { storeId: 4, name: 'Agent 2', address: 'Address 2', phone: '2345678901', email: 'agent2@example.com', rating: 4.0, servicable: 'No', status: ' ', action: 'Edit' },
  { storeId: 5, name: 'Agent 1', address: 'Address 1', phone: '1234567890', email: 'agent1@example.com', rating: 4.5, servicable: 'Yes', status: '  ', action: 'Edit' },
  { storeId: 6, name: 'Agent 2', address: 'Address 2', phone: '2345678901', email: 'agent2@example.com', rating: 4.0, servicable: 'No', status: ' ', action: 'Edit' },
  { storeId: 7, name: 'Agent 1', address: 'Address 1', phone: '1234567890', email: 'agent1@example.com', rating: 4.5, servicable: 'Yes', status: '  ', action: 'Edit' },
  { storeId: 8, name: 'Agent 2', address: 'Address 2', phone: '2345678901', email: 'agent2@example.com', rating: 4.0, servicable: 'No', status: ' ', action: 'Edit' },
  { storeId: 9, name: 'Agent 1', address: 'Address 1', phone: '1234567890', email: 'agent1@example.com', rating: 4.5, servicable: 'Yes', status: '  ', action: 'Edit' },
  { storeId: 10, name: 'Agent 2', address: 'Address 2', phone: '2345678901', email: 'agent2@example.com', rating: 4.0, servicable: 'No', status: ' ', action: 'Edit' },
  { storeId: 11, name: 'Agent 1', address: 'Address 1', phone: '1234567890', email: 'agent1@example.com', rating: 4.5, servicable: 'Yes', status: '  ', action: 'Edit' },
  { storeId: 12, name: 'Agent 2', address: 'Address 2', phone: '2345678901', email: 'agent2@example.com', rating: 4.0, servicable: 'No', status: ' ', action: 'Edit' },
  { storeId: 1, name: 'Agent 1', address: 'Address 1', phone: '1234567890', email: 'agent1@example.com', rating: 4.5, servicable: 'Yes', status: '  ', action: 'Edit' },
  { storeId: 2, name: 'Agent 2', address: 'Address 2', phone: '2345678901', email: 'agent2@example.com', rating: 4.0, servicable: 'No', status: ' ', action: 'Edit' },
  { storeId: 3, name: 'Agent 1', address: 'Address 1', phone: '1234567890', email: 'agent1@example.com', rating: 4.5, servicable: 'Yes', status: '  ', action: 'Edit' },
  { storeId: 4, name: 'Agent 2', address: 'Address 2', phone: '2345678901', email: 'agent2@example.com', rating: 4.0, servicable: 'No', status: ' ', action: 'Edit' },
  { storeId: 5, name: 'Agent 1', address: 'Address 1', phone: '1234567890', email: 'agent1@example.com', rating: 4.5, servicable: 'Yes', status: '  ', action: 'Edit' },
  { storeId: 6, name: 'Agent 2', address: 'Address 2', phone: '2345678901', email: 'agent2@example.com', rating: 4.0, servicable: 'No', status: ' ', action: 'Edit' },
  { storeId: 7, name: 'Agent 1', address: 'Address 1', phone: '1234567890', email: 'agent1@example.com', rating: 4.5, servicable: 'Yes', status: '  ', action: 'Edit' },
  { storeId: 8, name: 'Agent 2', address: 'Address 2', phone: '2345678901', email: 'agent2@example.com', rating: 4.0, servicable: 'No', status: ' ', action: 'Edit' },
  { storeId: 9, name: 'Agent 1', address: 'Address 1', phone: '1234567890', email: 'agent1@example.com', rating: 4.5, servicable: 'Yes', status: '  ', action: 'Edit' },
  { storeId: 10, name: 'Agent 2', address: 'Address 2', phone: '2345678901', email: 'agent2@example.com', rating: 4.0, servicable: 'No', status: ' ', action: 'Edit' },
  { storeId: 11, name: 'Agent 1', address: 'Address 1', phone: '1234567890', email: 'agent1@example.com', rating: 4.5, servicable: 'Yes', status: '  ', action: 'Edit' },
  { storeId: 12, name: 'Agent 2', address: 'Address 2', phone: '2345678901', email: 'agent2@example.com', rating: 4.0, servicable: 'No', status: ' ', action: 'Edit' },
];
