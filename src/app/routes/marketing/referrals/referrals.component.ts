import { Component, ViewChild } from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatSort, MatSortHeader, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MtxSelectModule } from '@ng-matero/extensions/select';

@Component({
  selector: 'app-referrals',
  standalone: true,
  imports: [
    MatFormField,
    MatLabel,
    MatInput,
    MatFormField,
    MatSlideToggle,
    MtxSelectModule,
    MatTableModule,
    MatSortHeader,
    MatSortModule,
    MatSort,
    MatPaginator

  ],
  templateUrl: './referrals.component.html',
  styleUrl: './referrals.component.scss'
})
export class ReferralsComponent {

  displayedColumns: string[] = [
    'customersID',
    'name',
    'customersEmail',
    'referalCode',
    'successfulReferal',
  ];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!:MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
export interface PeriodicElement {
  customersID: number;
  name: string
  customersEmail: string;
  referalCode: string;
  successfulReferal: string;
}


const ELEMENT_DATA: PeriodicElement[] = [
  {
    customersID: 1,
    name: 'Agent 1',
    customersEmail: '1234567890',
    referalCode: 'Address 1',
    successfulReferal: 'agent1@example.com',

  },
  {
    customersID: 5,
    name: 'Agent 1',
    customersEmail: '1234567890',
    referalCode: 'Address 1',
    successfulReferal: 'agent1@example.com',

  },
  {
    customersID: 2,
    name: 'Agent 1',
    customersEmail: '1234567890',
    referalCode: 'Address 1',
    successfulReferal: 'agent1@example.com',

  },
  {
    customersID: 1,
    name: 'Agent 1',
    customersEmail: '1234567890',
    referalCode: 'Address 1',
    successfulReferal: 'agent1@example.com',

  },
  {
    customersID: 1,
    name: 'Agent 1',
    customersEmail: '1234567890',
    referalCode: 'Address 1',
    successfulReferal: 'agent1@example.com',

  },
  {
    customersID: 5,
    name: 'Agent 1',
    customersEmail: '1234567890',
    referalCode: 'Address 1',
    successfulReferal: 'agent1@example.com',

  },
  {
    customersID: 2,
    name: 'Agent 1',
    customersEmail: '1234567890',
    referalCode: 'Address 1',
    successfulReferal: 'agent1@example.com',

  },
  {
    customersID: 1,
    name: 'Agent 1',
    customersEmail: '1234567890',
    referalCode: 'Address 1',
    successfulReferal: 'agent1@example.com',

  },


];