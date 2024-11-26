import { CommonModule } from '@angular/common';
import { Component, OnInit, viewChild, ViewChild } from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatListModule, MatSelectionList } from '@angular/material/list';
import { MatPaginator } from '@angular/material/paginator';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatSort, MatSortHeader, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MtxSelectModule } from '@ng-matero/extensions/select';

@Component({
  selector: 'app-push-campaigns',
  standalone: true,
  imports: [
    CommonModule,
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
    MatPaginator,
    MatListModule,
    MatIcon,
    MatSelectionList
  ],
  templateUrl: './push-campaigns.component.html',
  styleUrl: './push-campaigns.component.scss'
})
export class PushCampaignsComponent implements OnInit {

  displayedColumns: string[] = [
    'id',
    'name',
    'phone',
    'registrationDate',
    'totalOrder'
  ]

  dataSource = new MatTableDataSource<campaignsData>(TABLE_DATA);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  ngOnInit(): void {

  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  isContainerVisible: boolean = false;

  // Method to toggle the container visibility
  toggleContainer() {
    this.isContainerVisible = !this.isContainerVisible;
  }
}

export interface campaignsData {
  id: number;
  name: string;
  phone: number;
  registrationDate: string;
  totalOrder: number;
}

const TABLE_DATA: campaignsData[] = [
  {
    id: 1,
    name: "Rashi",
    phone: 48912044545,
    registrationDate: "20/05/2024",
    totalOrder: 49
  },
  {
    id: 2,
    name: "Rahul",
    phone: 48912044545,
    registrationDate: "20/05/2024",
    totalOrder: 15
  },
  {
    id: 3,
    name: "Realme",
    phone: 48912044545,
    registrationDate: "20/05/2024",
    totalOrder: 505
  },
  {
    id: 4,
    name: "Redmi",
    phone: 48912044545,
    registrationDate: "20/05/2024",
    totalOrder: 98
  },
  {
    id: 5,
    name: "Noise",
    phone: 48912044545,
    registrationDate: "20/05/2024",
    totalOrder: 159
  },
  {
    id: 1,
    name: "Rashi",
    phone: 48912044545,
    registrationDate: "20/05/2024",
    totalOrder: 465
  },
  {
    id: 2,
    name: "Rahul",
    phone: 48912044545,
    registrationDate: "20/05/2024",
    totalOrder: 484
  },
  {
    id: 3,
    name: "Realme",
    phone: 48912044545,
    registrationDate: "20/05/2024",
    totalOrder:54
  },
  {
    id: 4,
    name: "Redmi",
    phone: 48912044545,
    registrationDate: "20/05/2024",
    totalOrder: 45
  },
  {
    id: 5,
    name: "Noise",
    phone: 48912044545,
    registrationDate: "20/05/2024",
    totalOrder: 45
  },
  {
    id: 1,
    name: "Rja",
    phone: 48912044545,
    registrationDate: "20/05/2024",
    totalOrder: 45
  },
  {
    id: 2,
    name: "Rahul",
    phone: 48912044545,
    registrationDate: "20/05/2024",
    totalOrder: 45
  },
  {
    id: 3,
    name: "Realme",
    phone: 48912044545,
    registrationDate: "20/05/2024",
    totalOrder: 45
  },
  {
    id: 4,
    name: "Redmi",
    phone: 48912044545,
    registrationDate: "20/05/2024",
    totalOrder: 45
  },
  {
    id: 5,
    name: "Noise",
    phone: 48912044545,
    registrationDate: "20/05/2024",
    totalOrder: 45
  },
]
