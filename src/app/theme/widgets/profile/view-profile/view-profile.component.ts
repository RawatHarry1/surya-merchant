import { CommonModule, Location } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MerchantService } from '@shared/services/merchant.service';
import { CommonService } from '@shared/services/common.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatToolbarModule
  ],
  templateUrl: './view-profile.component.html',
  styleUrl: './view-profile.component.scss'
})
export class ViewProfileComponent {


  type: string = "add";
  merchantForm!: FormGroup;
  isEditOpen: any;
  isAddOpen: any;
  id: any;
  selectedFiles: any = [];
  selectedFiles2: any = [];

  public dialog = inject(MatDialog);

  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('fileInput2') fileInput2!: ElementRef;

  constructor(
    public fb: FormBuilder,
    private merchantService: MerchantService,
    private location: Location,
    private commonService: CommonService,
    private router: Router
  ) { }

  cards = [
    {
      title: 'Business Details',
      fields: [
        { name: 'Business Name', value: 'My Business' },
        { name: 'Business Type', value: 'Retail' },
        { name: 'Owner Name', value: 'John Doe' },
        { name: 'Phone', value: '1234567890' },
        { name: 'Email', value: 'john@example.com' },
        { name: 'Address', value: '123 Main St' }
      ]
    },
    {
      title: 'Operational Information',
      fields: [
        { name: 'Availability', value: '9 AM - 5 PM' },
        { name: 'Service Type', value: 'Delivery' },
        { name: 'Business Category', value: 'Restaurant' }
      ]
    },
    {
      title: 'Bank Details',
      fields: [
        { name: 'Bank Name', value: 'Example Bank' },
        { name: 'Account Holder Name', value: 'John Doe' },
        { name: 'Account Number', value: '123456789012' },
        { name: 'IFSC Code', value: 'EXAMP12345' }
      ]
    },
    {
      title: 'Identification Documents',
      fields: [
        { name: 'Business License Number', value: '987654' },
        { img: 'Business License Image', value: '/images/doc.png' },
        { name: 'Tax Identification Number', value: '123456789' },
        { img: 'Tax Identification Image', value: '/images/doc.png' }
      ]
    }
  ];
  


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

  

  editProfile() {
    const dialogRef = this.dialog.open(EditProfileComponent, {
      data: {
        isEditOpen: false,
        isAddOpen: true
      }
    });
  }

  editMerchant(): void {
    this.router.navigate(['dashboard/edit_merchant'])

  }

  onAddOpen() {
  }

  goBack(): void {
    this.location.back();
  }
}
