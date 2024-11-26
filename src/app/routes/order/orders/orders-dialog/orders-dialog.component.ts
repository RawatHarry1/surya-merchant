import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-orders-dialog',
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
  templateUrl: './orders-dialog.component.html',
  styleUrl: './orders-dialog.component.scss'
})
export class OrdersDialogComponent implements OnInit {


  customerForm!: FormGroup;
  public readonly httpClient = inject(HttpClient);
  public readonly dialogRef = inject(MatDialogRef<OrdersDialogComponent>);


/* Use IF require*/
  customerData: any = {
    name: "",
    customerEmail: "",
    customerPassword: "",
    customerPhoneNo: "",
  };

 /*Use if require end */
 
  constructor(public fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {

  }

  ngOnInit(): void {
    this.customerForm = this.fb.group({
      name: [''],
      customerPassword: [''],
      customerEmail: [''],
      customerPhoneNo: [''],
    });
  }

  onAdd(): void {
    const payload = {
      Name: this.customerForm.get('name')?.value,
      customerEmail: this.customerForm.get('customerEmail')?.value,
      customerPassword: this.customerForm.get('customerPassword')?.value,
      customerPhoneNo: this.customerForm.get('customerPhoneNo')?.value,
    }
    console.log(payload);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
