import { CommonModule } from '@angular/common';
import { Component, ElementRef, Inject, inject, OnInit, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonService } from '@shared/services/common.service';

@Component({
  selector: 'app-catalogue-dialog',
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
  ],
  templateUrl: './catalogue-dialog.component.html',
  styleUrl: './catalogue-dialog.component.scss',
})
export class CatalogueDialogComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  customerForm: FormGroup;
  selectedFiles: any=[];
  public commonService = inject(CommonService);
  constructor(
    private dialogRef: MatDialogRef<CatalogueDialogComponent>,
    private fb: FormBuilder
  ) {
    this.customerForm = this.fb.group({
      optionName: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

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
    this.fileInput.nativeElement.value = ''; // Clear the file input
  }

  onAdd(): void {
    if (this.customerForm.valid) {
      const optionName = this.customerForm.get('optionName')?.value;
      this.dialogRef.close({ name: optionName, image: this.selectedFiles });
    }
    else{
      this.customerForm.markAllAsTouched();
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
