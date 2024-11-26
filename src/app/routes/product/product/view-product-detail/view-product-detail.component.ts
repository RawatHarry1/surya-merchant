import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CategoryService } from '@shared/services/category.service';
import { ProductService } from '@shared/services/product.service';
import { ToastrService } from 'ngx-toastr';
import { CurrencyPipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ViewProductImageDialogComponent } from '../view-product-image-dialog/view-product-image-dialog.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-view-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatIcon,
    MatButtonModule
  ],
  templateUrl: './view-product-detail.component.html',
  styleUrl: './view-product-detail.component.scss',
  providers: [CurrencyPipe]
})
export class ViewProductDetailComponent {
  public productDetailId: any;
  public productDetail: any;
  public productImage: any;
  public categories: any[] = [];
  public productVarients: any = [];
  currencySymbol!: string;
  formattedPrice: any;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private toast: ToastrService,
    private categoryService: CategoryService,
    private location: Location,
    private currencyPipe: CurrencyPipe,
    public dialog: MatDialog
  ) {
    this.route.params.subscribe((param) => {
      this.productDetailId = param['id'];
      this.getProductDetailById();

    })
    this.currencySymbol = this.getCurrencySymbol('USD');
  }



  ngOnInit() { }

  openImageDialog(imageUrl: any) {
    const dialogRef = this.dialog.open(ViewProductImageDialogComponent, {});
    dialogRef.componentInstance.productImageUrl = imageUrl;
    dialogRef.afterClosed().subscribe((res) => {

    })
  }

  getCurrencySymbol(currencyCode: string): string {
    const formattedCurrency = this.currencyPipe.transform(0, currencyCode);
    return formattedCurrency ? formattedCurrency.replace(/[0-9.,]/g, '').trim() : '';
  }

  formatCurrency(value: any, currencyCode: string): string {
    const number = parseFloat(value);
    if (isNaN(number)) {
      return '';
    }
    const formatter = new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
    return formatter.format(number);
  }


  /**
   * get all category, sub category, Thridlevel category list.
   */
  getCategories(): void {
    this.categoryService.getSubSubCategory().subscribe((resp: any) => {
      if (resp.status) {
        this.categories = resp.data.subCategories;
      }
    })
  }

  /**
   * used to get name of category.
   * @param id 
   * @param key 
   * @param property 
   * @returns 
   */
  getNameOfCategoryById(id: any, key: any, property: any): any {
    const category = this.categories.find((obj: any) => obj[key] == id);
    if (category) {
      return category[property] ? category[property] : null;
    }
    return null;
  }

  /**
   * used to get product detail.
   */
  getProductDetailById(): void {
    this.productService.getProductDetailById(this.productDetailId).subscribe({
      next: ((resp: any) => {
        if (resp.status) {
          this.productDetail = resp.data;
          this.productVarients = this.transformData(resp.data.variants)
          this.getProductImage();
          this.getCategories()
        } else {
          this.toast.error('Error', resp.message);
        }
      }),
      error: ((error: any) => {
        this.toast.error('Server Error');
      })
    })
  }

  /**
   * Used to transform data.
   * @param data 
   * @returns 
   */
  transformData(data: any) {
    const flatArray = data.flatMap((item: any) =>
      item.options2.map((option: any) => ({
        optionId: item.optionId1,
        optionName1: item.optionName1,
        variantName1: item.variantName1,
        variantId: item.variantId1,
        mappingId: option.mappingId,
        optionId2: option.optionId2,
        optionName2: option.optionName2,
        variantName2: option.variantName2,
        variantId2: option.variantId2,
        price: option.price,
        inventory: option.inventory,
        discount: option.discount
      }))
    );

    return flatArray;
  };

  /**
   * get Product image.
   */
  getProductImage(): void {
    this.productImage = this.productDetail?.media.find((obj: any) => obj.isDefault == 1);
  }

  /**
   * Used to go back.
   */
  goBack() {
    this.location.back();
  }

  /**
   * Used to calculate discount.
   * @param originalPrice 
   * @param discountPercentage 
   * @returns 
   */
  calculateDiscountedPrice(originalPrice: any, discountPercentage: any) {
    const price = Number(originalPrice);
    const discount = Number(discountPercentage);
    // Check if the inputs are valid numbers
    if (isNaN(price) || isNaN(discount)) {
      throw new Error("Invalid input: originalPrice and discountPercentage must be numbers.");
    }
    const discountAmount = price * (discount / 100);
    const discountedPrice = price - discountAmount;
    // Return the final price as a whole number (removing decimals)
    return Math.floor(discountedPrice); // Remove decimals
  }
}
