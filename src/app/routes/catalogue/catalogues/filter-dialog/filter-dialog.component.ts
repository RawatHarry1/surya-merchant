import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

interface FilterOption {
  optionName: string;
  optionImage: string;
  optionId: string;
}

interface Filter {
  filterId: string;
  filterName: string;
  filterOptions: FilterOption[];
}

@Component({
  selector: 'app-filter-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatTooltipModule
  ],
  templateUrl: './filter-dialog.component.html',
  styleUrl: './filter-dialog.component.scss'
})
export class FilterDialogComponent implements OnInit, AfterViewInit {

  filters: Filter[] = [];

  constructor(private dialogRef: MatDialogRef<FilterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { filters: Filter[] }
  ) {

  }
  ngAfterViewInit(): void {
    this.loadFilters();
  }

  ngOnInit(): void {
    this.loadFilters();
  }


  loadFilters(): void {
    if (this.data && this.data.filters) {
      this.filters = this.data.filters;
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
