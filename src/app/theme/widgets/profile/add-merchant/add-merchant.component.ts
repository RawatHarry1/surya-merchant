import { CommonModule, Location } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonService } from '@shared/services/common.service';
import { MerchantService } from '@shared/services/merchant.service';

@Component({
  selector: 'app-add-merchant',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatIconModule
  ],
  templateUrl: './add-merchant.component.html',
  styleUrl: './add-merchant.component.scss'
})
export class AddMerchantComponent {

  type: string = "add";
  merchantForm!: FormGroup;
  isEditOpen: any;
  isAddOpen: any;
  id: any;
  selectedFiles: any = [];
  selectedFiles2: any = [];

  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('fileInput2') fileInput2!: ElementRef;

  constructor(
    public fb: FormBuilder,
    private merchantService: MerchantService,
    private location: Location,
    private commonService: CommonService
  ) {



  }

  ngOnInit(): void {
    if (this.isEditOpen) {
      // this.merchantForm.patchValue();
    }

    // Initialize the form
    this.merchantForm = this.fb.group({
      businessName: ['', Validators.required],
      businessType: ['', [Validators.required]],
      ownerName: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      availability: ['', Validators.required],
      serviceType: ['', Validators.required],
      businessCategory: ['', Validators.required],
      bankName: ['', Validators.required],
      accountHolderName: ['', Validators.required],
      accountNumber: ['', Validators.required],
      ifscCode: ['', Validators.required],
      businessLicenseNumber: ['', Validators.required],
      businessLicenseImage: ['', Validators.required],
      taxIdentificationNumber: ['', Validators.required],
      taxIdentificationImage: ['', Validators.required],
      description: [''],
    });
  }

  onAdd(): void {
    if (this.id) {
      this.type = 'update';
    }

    if (this.merchantForm.valid) {
     

      const payload = {             
        ...this.merchantForm.value
      };

      if (this.type === 'add') {
        this.merchantService.addMerchant(payload, this.type, this.id).subscribe(() => {
          alert('Merchant added successfully!');

        },
          (error) => {
            console.error('Error updating merchant:', error);
          }
        );
      } else {
        this.merchantService.addMerchant(payload, this.type, this.id).subscribe(() => {
          alert('Merchant updated successfully!');

        },
          (error) => {
            console.error('Error adding merchant:', error);
          }
        );
      }
    }
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

  onFileSelected2(event: Event): void {
    const fileInput2 = event.target as HTMLInputElement;
    if (fileInput2 && fileInput2.files && fileInput2.files[0]) {
      const file = fileInput2.files[0];
      this.commonService.uploadImage(file, true).subscribe({
        next: res => {
          if (res.status) {
            this.selectedFiles2 = res.data
            console.log(this.selectedFiles2);
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

  removeSelectedFile2(): void {
    this.selectedFiles2 = [];
    this.fileInput2.nativeElement.value = '';
  }

  goBack(): void {
    this.location.back();
  }

}
