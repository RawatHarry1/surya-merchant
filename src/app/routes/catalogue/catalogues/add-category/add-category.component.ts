import { CommonModule, Location } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CatalogueDialogComponent } from '../catalogue-dialog/catalogue-dialog.component';
import { CategoryService } from '@shared/services/category.service';
import { FormBuilder, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonService } from '@shared/services/common.service';
import { ToastrService } from 'ngx-toastr';

interface Chip {
  name: string;
  image: string;
}

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIcon,
    MatChipsModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.scss',
})
export class AddCategoryComponent implements OnInit, AfterViewInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  public dialog = inject(MatDialog);
  private readonly toast = inject(ToastrService);
  public categoryService = inject(CategoryService);
  public commonService = inject(CommonService);
  private readonly location = inject(Location)
  filterSections: { filterName: string; chips: any[] }[] = [];
  chips: Chip[] = [];
  selectedFiles: any = [];
  categoryName: string = '';
  categoryDescription: string = '';
  duplicateError: boolean = false;

  ngAfterViewInit(): void { }

  ngOnInit(): void {
    //to display one row of filters initialy
    this.addFilterSection();
  }

  //upload the image and trigger the api for it to get image url
  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput && fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      this.commonService.uploadImage(file, true).subscribe({
        next: res => {
          if (res.status) {
            this.selectedFiles = res.data;
            console.log(this.selectedFiles);
          } else {
            console.error('Image upload failed', res.message);
          }
        },
        error: error => {
          console.error('Error during image upload:', error);
        },
      });
    }
  }

  //remove the uploaded file
  removeSelectedFile(): void {
    this.selectedFiles = [];
    if (this.fileInput) {
      this.fileInput.nativeElement.value = ''; // Clear the file input
    }
  }

  //open the catalogue dialog box
  openAddFilter(i: number) {
    const dialogRef = this.dialog.open(CatalogueDialogComponent);
    //get the values added in the dialoge
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addChip(result, i);
      }
    });
  }

  //show the returned values in chip 
  addChip(newChip: any, sectionIndex: number) {
    const chipExists = this.filterSections[sectionIndex].chips.some(
      chip => chip.name === newChip.name
    );

    if (!chipExists) {
      this.filterSections[sectionIndex].chips.push(newChip);
      console.log(this.filterSections);
    } else {
      this.toast.error(`Chip with name '${newChip.name}' already exists.`);
    }
  }

  //remove the selected chip
  removeChip(chip: Chip, sectionIndex: number) {
    const chipIndex = this.filterSections[sectionIndex].chips.indexOf(chip);
    if (chipIndex >= 0) {
      this.filterSections[sectionIndex].chips.splice(chipIndex, 1);
    }
  }

  //add new filter row after checking for duplicate names
  addFilterSection() {
    if (!this.duplicateError) {
      this.filterSections.push({ filterName: '', chips: [] });
    } else {
      this.toast.error('Duplicate filter name detected. Please use unique filter names');
    }
  }

  //remove selected filter
  removeFilterSection(index: number) {
    this.filterSections.splice(index, 1);
  }

  //validation method to check duplicate names in the filter array
  checkDuplicateFilterName(sectionIndex: number) {
    this.duplicateError = false;
    const currentFilterName = this.filterSections[sectionIndex].filterName.trim();
    const duplicateFound = this.filterSections.some(
      (section, index) =>
        section.filterName.toLowerCase() === currentFilterName.toLowerCase() &&
        index !== sectionIndex
    );

    if (duplicateFound) {
      this.duplicateError = true;
    } else {
      this.duplicateError = false;
    }
  }

  //save the data to backend
  saveCategory() {
    const payload = {
      image: this.selectedFiles?.image,
      thumbnail: this.selectedFiles?.thumbnail,
      name: this.categoryName,
      description: 'test',
      filters: this.filterSections.map(section => ({
        name: section.filterName,
        options: section.chips.map(chip => ({
          name: chip.name,
          image: chip.image.thumbnail,
          thumbnail: chip.image.thumbnail,
        })),
      })),
    };

    // If not valid, collect errors
    let errorMessages: string[] = [];

    if (!this.categoryName) {
      errorMessages.push('Category name');
    }

    if (!this.selectedFiles?.image || !this.selectedFiles?.thumbnail) {
      errorMessages.push('Image');
    }

    if (!this.filterSections.every(section => section.filterName)) {
      errorMessages.push('Filter name');
    }

    // Add "Each filter must have at least one Option Name" at the end if needed
    const isEveryFilterHasOption = this.filterSections.every(section => section.chips.length > 0);

    // Build the error message
    let errorMessage = '';
    if (errorMessages.length > 1) {
      const mainErrors = errorMessages.slice(0, -1).join(', ');
      errorMessage = `${mainErrors} are required.`;
    } else if (errorMessages.length === 1) {
      errorMessage = `${errorMessages[0]} is required.`;
    }

    // Append the "Each filter" message last if it exists
    if (!isEveryFilterHasOption) {
      errorMessage += (errorMessage ? ' ' : '') + 'Each filter must have at least one Option Name.';
    }

    if (errorMessage) {
      this.toast.warning(errorMessage, 'Warning');
    }
    else {
      // Submit if valid
      this.categoryService.addCategory(payload).subscribe({
        next: response => {
          this.toast.success('Saved Successfully', 'Success');
          this.resetCategory();
          this.goBack();
        },
        error: error => {
          console.error('Error adding category', error);
        }
      });
    }
  }

  //reset all the fields on Reset button at bottom
  resetCategory() {
    this.selectedFiles = [];
    this.categoryName = '';
    this.filterSections = [];
    this.addFilterSection();
    if (this.fileInput) {
      this.fileInput.nativeElement.value = ''; // Clear the file input
    }
  }

  goBack(): void {
    this.location.back();
  }
}
