import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggle, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DiscountsService } from '@shared/services/discounts.service';

export interface Discount {
  name: string;
  discount: string;
  fromDate: string;
  tillDateAdd: string;
  tillDateSet: string;
  addonDiscount: string;
  description: string;
  maxAmount: string;
  product: string;
  id: string;
}

@Component({
  selector: 'app-discounts-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatFormField,
    MatLabel,
    MatSlideToggle,
    MatInput,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatIconModule,
    FormsModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './discounts-dialog.component.html',
  styleUrl: './discounts-dialog.component.scss'
})
export class DiscountsDialogComponent implements OnInit {
  public readonly httpClient = inject(HttpClient);
  @Input() discountData: any;

  discountForm!: FormGroup;
  isAddOpen: boolean;
  isSetOpen: boolean;
  isEditOpen: boolean;
  isEditOpenAppliances: boolean;
  id: string;

  constructor(
    public fb: FormBuilder,
    private discountServices: DiscountsService,
    public dialogRef: MatDialogRef<DiscountsDialogComponent>,

    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.isAddOpen = data.isAddOpen;
    this.isSetOpen = data.isSetOpen;
    this.isEditOpen = data.isEditOpen;
    this.isEditOpenAppliances = data.isEditOpenAppliances;
    this.id = data.id

    this.discountForm = this.fb.group({
      name: ['', Validators.required],
      discount: ['', Validators.required],
      fromDate: ['', Validators.required],
      tillDateAdd: [''],
      tillDateSet: [''],
      addonDiscount: [false],
      description: ['', [Validators.required, Validators.maxLength(150)]],
      maxAmount: [''],
      product: [''],
      id: ['']
    });
  }

  ngOnInit(): void {
    if (this.isEditOpen || this.isEditOpenAppliances) {
      this.discountForm.patchValue({
        name: this.discountData.name,
        discount: this.discountData.value,
        fromDate: this.discountData.validFrom,
        tillDateAdd: this.discountData.validTo,
        tillDateSet: this.discountData.validTo,
        description: this.discountData.description,
        maxAmount: this.discountData.maxAmount
      })
    }
  }

  onAddDiscount() {

    const payload = {
      name: this.discountForm.get('name')?.value,
      discount: this.discountForm.get('discount')?.value,
      fromDate: this.discountForm.get('fromDate')?.value,
      tillDateAdd: this.discountForm.get('tillDateAdd')?.value,
      tillDateSet: this.discountForm.get('tillDateSet')?.value,
      addonDiscount: this.discountForm.get('addonDiscount')?.value,
      description: this.discountForm.get('description')?.value,
      maxAmount: this.discountForm.get('maxAmount')?.value,
      product: this.discountForm.get('product')?.value,
      id: this.id
    }
    console.log(payload, "THIS IT THE PAYLOAD RAW");
    if (this.discountForm.valid) {
      if (this.isAddOpen) {
        this.discountServices.addDiscountAppliances(payload).subscribe((data) => {
          alert("Discount added Successfully !")
          this.closeDialog();
        },
          (error) => {
            console.error('Error adding the Discount', error);
            alert('Failed to add the Discount. Please try again later.');
          });
      }
      if (this.isEditOpenAppliances) {
        this.discountServices.updateDiscountAppliances(payload, this.id).subscribe((data) => {
          alert("Appliances Discount Updated Successfully !")
          this.closeDialog();
        })
      }
      if (this.isSetOpen) {
        this.discountServices.addDiscount(payload).subscribe((data) => {
          alert("Discount added Successfully !")
          this.closeDialog();
        },
          (error) => {
            console.error('Error adding the Discount', error);
            alert('Failed to add the Discount. Please try again later.');
          });
      }
      if (this.isEditOpen) {
        this.discountServices.updateDiscount(payload, this.id).subscribe((data) => {
          alert("Discount Updated Successfully !")
          this.closeDialog();
        })
      }
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
