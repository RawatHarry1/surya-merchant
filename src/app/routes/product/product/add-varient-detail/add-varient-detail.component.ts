import { Component, inject, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { varientDetails } from './varientDetails';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '@shared/services/product.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-varient-detail',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,],
  templateUrl: './add-varient-detail.component.html',
  styleUrl: './add-varient-detail.component.scss'
})
export class AddVarientDetailComponent {
  public varientDetailForm!: FormGroup;
  public varient: varientDetails = new varientDetails()
  @Input() productDetail: any;
  @Input() varientObj: any;
  @Input() productDetailId: any
  private readonly toast = inject(ToastrService);
  constructor(
    private dialogRef: MatDialogRef<any>,
    private productService: ProductService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.validateVarientForm()
    if (this.varientObj) {
      this.varientDetailForm.patchValue(this.varientObj)
    }
    console.log(this.productDetail)
    console.log('varient obj', this.varientObj)

  }

  validateVarientForm() {
    this.varientDetailForm = this.fb.group({
      price: ['', [Validators.required]],
      discount: ['', [Validators.required]],
      inventory: ['', [Validators.required]]
    })
  }

  get price() {
    return this.varientDetailForm.get('price');
  }

  get discount() {
    return this.varientDetailForm.get('discount');
  }

  get inventory() {
    return this.varientDetailForm.get('inventory');
  }


  /**
   * used to update the varient.
   */
  updateProductVarient() {
    console.log(this.productDetail)
    if (this.varientDetailForm.valid) {
      let mappingId: any = this.varientObj.mappingId;
      const payload = {
        inventory: this.inventory?.value,
        price: this.price?.value,
        discount: this.discount?.value,
      }
      if (this.productDetailId) {
        this.productService.updateProductVarientMappingId(mappingId, payload).subscribe({
          next: ((resp: any) => {
            if (resp.status) {
              this.closeDialog()
            } else {
              this.toast.error(resp.message)
            }
          }),
          error: ((error) => {
            console.log(error)
          })
        })
      } else {
        this.closeDialog();
      }
    } else {
      this.varientDetailForm.markAllAsTouched();
    }

  }

  /**
   * Used to close the dialog.
   */
  closeDialog(): void {
    this.dialogRef.close(this.varientDetailForm.value);
  }
}
