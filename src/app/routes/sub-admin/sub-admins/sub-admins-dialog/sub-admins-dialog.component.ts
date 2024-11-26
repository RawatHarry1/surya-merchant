import { HttpClient } from '@angular/common/http';
import { Component, inject, Inject, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormField, MatLabel, MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { RouterOutlet } from '@angular/router';
import { SubAdminsService } from '@shared/services/sub-admins.service';
import { OrdersDialogComponent } from 'app/routes/order/orders/orders-dialog/orders-dialog.component';

export interface SubAdmin {
  id: string;
  registrationDate: string;
  email: string;
  phone: string;
}

@Component({
  selector: 'app-sub-admins-dialog',
  standalone: true,
  imports: [
    MatFormField,
    MatLabel,
    MatInput,
    MatFormFieldModule,
    MatCheckbox,
    RouterOutlet,
    ReactiveFormsModule,
  ],
  templateUrl: './sub-admins-dialog.component.html',
  styleUrl: './sub-admins-dialog.component.scss'
})
export class SubAdminsDialogComponent implements OnInit {

  subAdminForm!: FormGroup;
  public readonly httpClient = inject(HttpClient);
  public readonly dialogRef = inject(MatDialogRef<OrdersDialogComponent>);
  @Input() subAdminData: any;
  isEditOpen: boolean;
  isAddOpen: boolean;


  constructor(public fb: FormBuilder,
    private subAdminServices: SubAdminsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.isAddOpen = data.isAddOpen
    this.isEditOpen = data.isEditOpen

    this.subAdminForm = this.fb.group({
      id: ['', Validators.required],
      registrationDate: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.isEditOpen) {
      console.log(this.isEditOpen, "IS EDIT OPEN");

      this.subAdminForm.patchValue({
        id: this.subAdminData.id,
        registrationDate: this.subAdminData.registrationDate,
        email: this.subAdminData.email,
        phone: this.subAdminData.phone
      })
    }
  }

  onAdd(): void {
    const payload = {
      id: this.subAdminForm.get('id')?.value,
      email: this.subAdminForm.get('email')?.value,
      registrationDate: this.subAdminForm.get('registrationDate')?.value,
      phone: this.subAdminForm.get('phone')?.value,
    }
    console.log(payload);

    if (this.subAdminForm.valid) {
      this.subAdminServices.addSubAdmin(payload).subscribe((data) => {
        alert("Sub-Admin Added Successfully!")
        this.closeDialog();

      })
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}