import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';


interface SelectedFile {
  file: File;
  url: string;
}


@Component({
  selector: 'app-s-e-o',
  standalone: true,
  imports: [
    CommonModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatIcon,
    MatMenuModule,
    MatCardModule,
    MatPaginator,
    MatTable,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatSort,
    MatButtonModule
  ],
  templateUrl: './s-e-o.component.html',
  styleUrl: './s-e-o.component.scss'
})
export class SEOComponent implements OnInit {

  displayedColumns: string[] = [
    'page',
    'description',
    'action'
  ];
  dataSource = new MatTableDataSource<SEOData>(ELEMENT_DATA);
  selectedFiles: SelectedFile[] = [];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  
  ngOnInit(): void {

  }
  closeFrom() {

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.selectedFiles.push({
            file: file,
            url: e.target.result
          });
        };
        reader.readAsDataURL(file);
      }
    }
  }
  removeSelectedFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }
  onEditOpen() {
  };
}

export interface SEOData {
  page: number;
  description: string;
  action: string;
}
const ELEMENT_DATA: SEOData[] = [
  {
    page: 1,
    description: "It will help to imporve the SEO",
    action: "edit",
  },
  {
    page: 2,
    description: "It will help to imporve the SEO",
    action: "edit",
  },
  {
    page: 3,
    description: "It will help to imporve the SEO",
    action: "edit",
  },
]