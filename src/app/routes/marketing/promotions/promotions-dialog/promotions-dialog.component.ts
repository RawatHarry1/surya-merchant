import { CommonModule, JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Inject, inject, Input, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MtxSelectModule } from '@ng-matero/extensions/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { PromotionsService } from '@shared/services/promotions.service';
import { MatRadioModule } from '@angular/material/radio';
import { DatePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { merge, Subject, takeUntil } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { error } from 'console';



export interface Promotion {
  title: string;
  description: string;
  discountType: boolean;
  discount: any;
  startDate: any;
  endDate: any;
  maxDiscountAmount: number;
  multiUseByCustomer: boolean;
  maxUser: number;
  maxPerDayUser: number;
  minAmount: number;
}


@Component({
  selector: 'app-promotions-dialog',
  standalone: true,
  providers: [provideNativeDateAdapter(), DatePipe],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatIconModule,
    MatCheckbox,
    MtxSelectModule,
    MatDatepickerModule,
    JsonPipe,
    MatRadioModule,
    TranslateModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './promotions-dialog.component.html',
  styleUrl: './promotions-dialog.component.scss'
})
export class PromotionsDialogComponent implements OnInit {
  public readonly httpClient = inject(HttpClient);
  public dialog = inject(MatDialogRef)
  promotionsForm!: FormGroup;
  @Input() promotionData: any;

  isAddOpen: Boolean;
  isEditOpen: Boolean;
  id: string;
  key = 1;
  todayDate: any;

  /*Use if require end */
  constructor(
    public fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PromotionsDialogComponent>,
    private promotionsService: PromotionsService,
    private datePipe: DatePipe,
    public toast: ToastrService
  ) {
    this.isAddOpen = data.isAddOpen;
    this.isEditOpen = data.isEditOpen;
    this.id = data.id,
      this.todayDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
    this.promotionsForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.maxLength(150)]],
      discountType: [1, [Validators.required]],
      discount: ['', [Validators.required]],
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
      maxDiscountAmount: [''],
      multiUseByCustomer: [false],
      maxUser: ['', [Validators.required]],
      maxPerDayUser: ['', [Validators.required]],
      minAmount: ['', [Validators.required]],
    });
    this.setDiscountValidators();
    // Set up dynamic updates on discountType changes
    this.updateDiscountValidators();
  }


  ngOnInit(): void {
    if (this.isEditOpen) {
      this.patchFormValues();
    }
  }

  setDiscountValidators(): void {
    const discountTypeValue = this.promotionsForm.get('discountType')?.value;
    const discountControl = this.promotionsForm.get('discount');

    console.log(discountTypeValue);

    if (discountTypeValue === 1) {
      discountControl?.setValidators([Validators.required, Validators.min(1), Validators.max(99)]);
    } else {
      discountControl?.setValidators([Validators.required, Validators.min(1)]);
    }
    // Revalidate the form control after setting new validators
    discountControl?.updateValueAndValidity();
  }

  updateDiscountValidators(): void {
    // Listen for changes in discountType field and apply validators dynamically
    this.promotionsForm.get('discountType')?.valueChanges.subscribe(() => {
      this.setDiscountValidators();
    });
  }

  private patchFormValues(): void {
    this.promotionsForm.patchValue({
      title: this.promotionData.title,
      description: this.promotionData.description,
      discountType: this.promotionData.discountType,
      discount: this.promotionData.discount,
      maxDiscountAmount: this.promotionData.maxDiscountAmount,
      startDate: new Date(this.promotionData.fromDate * 1000),
      endDate: new Date(this.promotionData.tillDate * 1000),
      multiUseByCustomer: this.promotionData.multiUseByCustomer === 1 ? true : false,
      maxUser: this.promotionData.maxUser,
      maxPerDayUser: this.promotionData.maxPerDayUser,
      minAmount: this.promotionData.minAmount,
    });

  }

  onAdd(): void {
    const formattedStartDate = this.datePipe.transform(this.promotionsForm.get('startDate')?.value, 'yyyy-MM-dd');
    const formattedEndDate = this.datePipe.transform(this.promotionsForm.get('endDate')?.value, 'yyyy-MM-dd');

    const payload = {
      title: this.promotionsForm.get('title')?.value,
      description: this.promotionsForm.get('description')?.value,
      discountType: this.promotionsForm.get('discountType')?.value,
      discount: this.promotionsForm.get('discount')?.value,
      startDate: formattedStartDate ? new Date(formattedStartDate).getTime() / 1000 : null,
      endDate: formattedEndDate ? new Date(formattedEndDate).getTime() / 1000 : null,
      maxDiscountAmount: this.promotionsForm.get('maxDiscountAmount')?.value,
      multiUseByCustomer: this.promotionsForm.get('multiUseByCustomer')?.value,
      maxUser: this.promotionsForm.get('maxUser')?.value,
      maxPerDayUser: this.promotionsForm.get('maxPerDayUser')?.value,
      minAmount: this.promotionsForm.get('minAmount')?.value,
    };
    if (this.promotionsForm.valid) {
      if (this.isAddOpen) {
        this.promotionsService.addPromotion(payload).subscribe(
          () => {
            this.toast.success('Promotion added successfully!', 'Success');
            this.closeDialog();
          },
          (error) => {
            console.error('Error adding the promotion:', error);
          }
        );
      } else {
        if (this.id) {
          this.promotionsService.editPromotion(payload, this.id).subscribe(
            () => {
              this.toast.success('Promotion updated successfully!', 'Success');
              this.closeDialog();
            },
            (error) => {
              console.error('Error updating the promotion:', error);
              alert('Failed to update the promotion. Please try again later.');
            }
          );
        }
      }
    } else {
      this.promotionsForm.markAllAsTouched();
      this.toast.warning('Please fill in all required fields.', 'Warning')
    }
  }


  closeDialog() {
    this.dialogRef.close();
  }

}
