import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [
    CommonModule,
    MatSlideToggleModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,

  ],
  templateUrl: './store.component.html',
  styleUrl: './store.component.scss'
})
export class StoreComponent implements OnInit {

  ngOnInit() {
    console.log(this.storeDataSource.data);
  }

  isContainerVisible: boolean = false;
  storeDataSource = new MatTableDataSource<StoreData>(ELEMENT_DATA);

  displayedStoreColumns: string[] = ['fieldName', 'fieldType', 'value', 'filter', 'mandatory', 'askOnSignup']
  toggleContainer(): void {
    this.isContainerVisible = !this.isContainerVisible;
  }
}


export interface StoreData {

  fieldName: string;
  fieldType: string;
  value: string;
  filter: string;
  mandatory: string;
  askOnSignup: string;
}


const ELEMENT_DATA: StoreData[] = [
  { fieldName: "test Data", fieldType: "test Data", value: "test Data", filter: "test Data", mandatory: "test Data", askOnSignup: "test Data" }
]