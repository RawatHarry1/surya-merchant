import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, inject, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { CommonService } from '@shared/services/common.service';
import { ToastrService } from 'ngx-toastr';

export interface EditProfile {
  fristName: string;
  lastName: string;
}

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    TranslateModule
  ],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss'
})
export class EditProfileComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  public dialogRef = inject(MatDialogRef)

  public editProfileForm: FormGroup;
  selectedImage: any;


  constructor(
    public fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public httpClient: HttpClient,
    public commonService: CommonService,
    public toast: ToastrService
  ) {

    this.editProfileForm = this.fb.group({
      fristName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      image: ['', [Validators.required]],
    })
  }
  ngOnInit(): void {
    // this.patchFormValues();
  }

  private patchFormValues(): void {
    this.editProfileForm.patchValue({
      // fristName: this.editProfileForm.fristName,
      // lastName: this.editProfileForm.lastName,
      // image: this.editProfileForm.image,
    });

  }

  onSubmit(): void {
    const payload = {
      fristName: this.editProfileForm.get('fristName')?.value,
      lastName: this.editProfileForm.get('lastName')?.value,
      image: this.editProfileForm.get('image')?.value,
    }
    console.log(payload,"Not Valid Form");

    if (this.editProfileForm.valid) {
      console.log(payload,"Valid Form");
    }else{
      this.editProfileForm.markAllAsTouched();
        this.toast.warning('Please fill in all required fields.', 'Warning')
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
    this.editProfileForm.get('image')?.reset();
    if (this.fileInput) {
      this.fileInput.nativeElement.value = ''; // Clear the file input
    }
  }



  closeDialog() {
    this.dialogRef.close();
  }
}
