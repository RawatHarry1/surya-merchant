import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { GeneralSettingDialogComponent } from './general-setting-dialog/general-setting-dialog.component';

export interface TableElement {
  name: string;
  default: string;
  action: string;
}

@Component({
  selector: 'app-general-settings',
  standalone: true,
  imports: [
    MatSlideToggleModule,
    MatIconModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule
  ],
  templateUrl: './general-settings.component.html',
  styleUrl: './general-settings.component.scss'
})
export class GeneralSettingsComponent implements AfterViewInit {
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
  public dialog = inject(MatDialog);
  isContainerVisible: any;

  displayedColumns: string[] = ['name', 'default', 'action'];
  dataSource = new MatTableDataSource<TableElement>(ELEMENT_DATA);

  @ViewChild(MatSort) sort!: MatSort;

  onAddTagsOpen() {
    this.dialog.open(GeneralSettingDialogComponent)
  };
}

const ELEMENT_DATA: TableElement[] = [
  { name: 'Element 1', default: 'Yes', action: 'Edit' },
  { name: 'Element 2', default: 'No', action: 'Delete' },
  { name: 'Element 3', default: 'Yes', action: 'View' },
  // Add more elements as needed
];
