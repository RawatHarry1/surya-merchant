import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CategoryService } from '@shared/services/category.service';
import { CommonService } from '@shared/services/common.service';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { ToastrService } from 'ngx-toastr';

export interface SubCategory {

}

@Component({
  selector: 'app-sub-category-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatIconModule,
    MatSelectModule,
    TypeaheadModule
  ],
  templateUrl: './sub-category-dialog.component.html',
  styleUrl: './sub-category-dialog.component.scss'
})
export class SubCategoryDialogComponent {

  @ViewChild('fileInput') fileInput!: ElementRef;
  public subCategoryForm: FormGroup;
  selectedFiles: any = [];
  public commonService = inject(CommonService);
  categoryList: any;
  categories: any;
  categoryId!: string;

  constructor(
    private dialogRef: MatDialogRef<SubCategoryDialogComponent>,
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private toast: ToastrService
  ) {
    this.subCategoryForm = this.fb.group({
      categoryName: ['', [Validators.required]],
      subCategoryName: [{ value: '', disabled: true }, [Validators.required]],
      subCategoryImage: [{ value: '', disabled: true }, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.getCategories();
    this.enableControls();
  }



  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput && fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      this.commonService.uploadImage(file, true).subscribe({
        next: res => {
          if (res.status) {
            this.selectedFiles = res.data
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

  removeSelectedFile(): void {
    this.selectedFiles = [];
    this.fileInput.nativeElement.value = '';
  }

  //on adding sub sub category
  onSubmit(): void {
    const payload = {
      name: this.subCategoryForm.get('subCategoryName')?.value,
      description: 'static description',
      categoryId: this.categoryId,
      image: this.selectedFiles.image,
      thumbnail: this.selectedFiles?.thumbnail
    };

    // Call the service method to add the sub-sub-category
    if (this.subCategoryForm.valid) {
      this.categoryService.addSubCategory(payload).subscribe(
        response => {
          this.toast.success('Sub Category Added', 'Successful');
          this.closeDialog();
        },
        error => {
          // Handle error
        }
      );
    }
    else {
      this.subCategoryForm.markAllAsTouched();
      this.toast.warning('Please fill in all required fields.', 'Warning');
    }
  }

  enableControls() {
    // enable other form fields when category and subcategory has values
    this.subCategoryForm.get('categoryName')?.valueChanges.subscribe(value => {
      if (value) {
        this.subCategoryForm.get('subCategoryName')?.enable();
        this.subCategoryForm.get('subCategoryImage')?.enable();
      }
    });
  }

  //get the category/sub category data to show in the dropdowns
  getCategories() {
    this.categoryService.getCategory().subscribe(
      response => {
        this.categories = response.data.categories;
        this.categoryList = this.categories.map((res: any) => res.categoryName);
      },
      error => {
        console.error('Error fetching dropdown data:', error);
      }
    );
  }
  //on category selection
  onCategorySelect(name: any): void {
    if (name) {
      const result = this.categories.find((res: any) => res.categoryName == name);
      this.categoryId = result.categoryId;
    }
  }

  closeDialog(): void {
    this.dialogRef.close()
  }

}
