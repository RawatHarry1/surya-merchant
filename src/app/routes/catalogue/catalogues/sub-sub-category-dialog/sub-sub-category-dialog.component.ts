import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, Inject, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CategoryService } from '@shared/services/category.service';
import { CommonService } from '@shared/services/common.service';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sub-sub-category-dialog',
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
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    TypeaheadModule,
  ],
  templateUrl: './sub-sub-category-dialog.component.html',
  styleUrl: './sub-sub-category-dialog.component.scss',
})
export class SubSubCategoryDialogComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;

  private readonly toast = inject(ToastrService);
  public categoryService = inject(CategoryService);
  public commonService = inject(CommonService);
  public popupData = inject(MAT_DIALOG_DATA);
  private fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<SubSubCategoryDialogComponent>);

  public subSubCategoryForm!: FormGroup;
  categories: any;
  subCategories: any;
  categoryId: any;
  subCategoryId: any;
  selectedImage: any;
  categoryList: any;
  subCategoryList: any;

  // constructor() {}

  ngOnInit(): void {
    //init the form group
    this.subSubCategoryForm = this.fb.group({
      category: ['', [Validators.required]],
      subCategory: [{ value: '', disabled: true }, [Validators.required]],
      name: [{ value: '', disabled: true }, [Validators.required]],
      image: [{ value: '', disabled: true }, [Validators.required]],
    });
    this.getCategories();
    this.enableControls();
  }

  //manage enable/disable of controls on basis of category and sub category values
  enableControls() {
    //enable sub category dropdown only when category is selected and on category value change, reset the subcategory
    this.subSubCategoryForm.get('category')?.valueChanges.subscribe(value => {
      if (value) {
        this.subSubCategoryForm.get('subCategory')?.enable();
        this.subSubCategoryForm.get('subCategory')?.reset();
      } else {
        this.subSubCategoryForm.get('subCategory')?.disable();
        this.subSubCategoryForm.get('subCategory')?.reset();
      }
    });
    // enable other form fields when category and subcategory has values
    this.subSubCategoryForm.get('category')?.valueChanges.subscribe(value => {
      if (value && this.subSubCategoryForm.get('subCategory')?.value) {
        this.subSubCategoryForm.get('name')?.enable();
        this.subSubCategoryForm.get('image')?.enable();
      }
    });
    this.subSubCategoryForm.get('subCategory')?.valueChanges.subscribe(value => {
      if (value && this.subSubCategoryForm.get('category')?.value) {
        this.subSubCategoryForm.get('name')?.enable();
        this.subSubCategoryForm.get('image')?.enable();
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
        this.toast.error('No Categories found', 'Error');
      }
    );
  }

  //on category selection
  onCategorySelect(name: any, type: string): void {
    if (name && type == 'category') {
      const result = this.categories.find((res: any) => res.categoryName == name);
      this.categoryId = result.categoryId;
      const params = {
        categoryId: this.categoryId,
        // subCategoryId: '135b9b85-cb83-480b-b522-acb5186a4eec',
        pageNumber: 1,
        pageSize: 10,
      };
      this.categoryService.getSubCategory(params).subscribe(
        response => {
          this.subCategories = response.data.subCategories;
          this.subCategoryList = this.subCategories?.map((res: any) => res.subCategoryName);
          if (this.subCategoryList.length > 0) {
            // this.toast.success('Sub Categories fetched successfully', 'success');
          } else {
            this.toast.error('No Sub Category found for selected Category', 'Error');
          }
        },
        error => {
          this.toast.error('No Sub Category found for selected Category', 'Error');
        }
      );
    } else if (name && type == 'subCategory') {
      const result = this.subCategories?.find((res: any) => res.subCategoryName == name);
      this.subCategoryId = result.subCategoryId;
    }
  }

  //on adding sub sub category
  onSubmit(): void {
    const payload = {
      name: this.subSubCategoryForm.get('name')?.value,
      description: 'static description',
      categoryId: this.categoryId,
      image: this.selectedImage?.image,
      thumbnail: this.selectedImage?.thumbnail,
      subCategoryId: this.subCategoryId,
    };

    // Call the service method to add the sub-sub-category
    if (this.subSubCategoryForm.valid) {
      this.categoryService.addSubSubCategory(payload).subscribe(
        response => {
          this.closeDialog();
        },
        error => {
          // Handle error
          this.toast.error('Failed to add Sub Sub-Category', 'Error');
        }
      );
    } else {
      this.subSubCategoryForm.markAllAsTouched();
      this.toast.warning('Please fill in all required fields.', 'Warning');
    }
  }

  //upload the image and trigger the api for it to get image url
  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput && fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      this.commonService.uploadImage(file, true).subscribe({
        next: res => {
          if (res.status) {
            this.selectedImage = res.data;
            this.toast.success('Upload successful', 'success');
          } else {
            this.toast.error('Upload failed', 'error');
          }
        },
        error: error => {
          this.toast.error('Upload failed', 'warning');
        },
      });
    }
  }

  //remove the uploaded file
  removeSelectedFile(): void {
    this.selectedImage = [];
    this.subSubCategoryForm.get('image')?.reset();
    if (this.fileInput) {
      this.fileInput.nativeElement.value = ''; // Clear the file input
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
