import { HttpClient } from '@angular/common/http';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-billing-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatIconModule
  ],
  templateUrl: './billing-dialog.component.html',
  styleUrl: './billing-dialog.component.scss'
})
export class BillingDialogComponent implements OnInit {
  addCardForm!: FormGroup;
  public readonly httpClient = inject(HttpClient);
  public readonly dialogRef = inject(MatDialogRef<BillingDialogComponent>);

  /*Use if require end */

  constructor(public fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {

  }

  ngOnInit(): void {
    this.addCardForm = this.fb.group({
      cardNo: [''],
      validUpto: [''],
      cvv: [''],

    });
  }

  onAdd(): void {
    const payload = {
      cardNo: this.addCardForm.get('cardNo')?.value,
      validUpto: this.addCardForm.get('validUpto')?.value,
      cvv: this.addCardForm.get('cvv')?.value,
    }
    console.log(payload);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
