import { CommonModule, DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { TranslateModule } from '@ngx-translate/core';
import { CountryISO, NgxIntlTelInputModule, SearchCountryField } from 'ngx-intl-tel-input';

export interface Customer {
  title: string;
  discount: any;
}


@Component({
  selector: 'app-customer-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    TranslateModule,
    MatRadioModule,
    MatDatepickerModule,
    NgxIntlTelInputModule

  ],
  templateUrl: './customer-dialog.component.html',
  styleUrl: './customer-dialog.component.scss',
  providers: [DatePipe]
})
export class CustomerDialogComponent implements OnInit {

  minDate: any;
  isNumber = 2;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  preferredCountries = ['in', 'us', 'ph']
  customerForm!: FormGroup;
  phoneNumber!: AbstractControl;

  constructor(
    private dialogRef: MatDialogRef<CustomerDialogComponent>,
    private fb: FormBuilder,
    private datePipe: DatePipe
  ) {
    this.dateValidator();
  }

  ngOnInit(): void {
    this.initialization();
  }

  /**
   * From initialization Start
   */
  initialization() {
    this.customerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phoneNumber: [''],
      gender: ['', [Validators.required]],
      dob: ['', [Validators.required]],
    });
  }
  /**
  * From initialization End
  */

  /**
 * Date Validators Start
 */

  dateValidator() {
    const currentDate = new Date();
    this.minDate = new Date(currentDate.setFullYear(currentDate.getFullYear() - 110));
  }


  /**
   * Date Validators End
   */

  public submitted: boolean = false;
  /**
   * Submit for Add  Start
   */
  onAdd(): void {
    const dobToUnix = this.datePipe.transform(this.customerForm.get('dob')?.value, 'yyyy-MM-dd');
    const phoneNumberObject = this.customerForm.get('phoneNumber')?.value;
    const countryCode = phoneNumberObject?.countryCode || '';
    const dialCode = phoneNumberObject?.dialCode || '';
    const number = phoneNumberObject?.number.replace(/\s+/g, '') || '';

    this.submitted = true;

    if (this.customerForm.valid) {
      this.submitted = false;

      const payload = {
        firstName: this.customerForm.get('firstName')?.value,
        lastName: this.customerForm.get('lastName')?.value,
        email: this.customerForm.get('email')?.value,
        phoneNumber: number,
        countryCode: dialCode,
        countryCodeIso: countryCode,
        gender: this.customerForm.get('gender')?.value,
        dob: dobToUnix ? new Date(dobToUnix).getTime() / 1000 : null,
      };

      console.log("PAYLOAD", payload);

    } else {
      this.customerForm.markAllAsTouched();
    }
  }
  /**
   * Submit for Add  Start
   */

  closeDialog(): void {
    this.dialogRef.close();
  }
}
