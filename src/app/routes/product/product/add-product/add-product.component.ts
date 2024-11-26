import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { ProductService } from '@shared/services/product.service';
import { ToastrService } from 'ngx-toastr';
import { MatListModule } from '@angular/material/list';
import { CategoryService } from '@shared/services/category.service';
import { AddVarientDetailComponent } from '../add-varient-detail/add-varient-detail.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CommonService } from '@shared/services/common.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';


export interface PayLoad {
  name?: string;
  description?: string;
  price?: number;
  discount?: number;
  isReccomended?: boolean;
  categoryId?: string;
  subCategoryId?: string;
  thirdLevelCategoryId?: string;
  media?: any;
  variants?: any; // Make this optional
  filters?: any;
}

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [
    MatBadgeModule,
    MatSlideToggleModule,
    FormsModule,
    MatListModule,
    CommonModule,
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatIcon],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss'
})
export class AddProductComponent {
  public productForm!: FormGroup;
  selectedFiles: any[] = [];
  varientNamelist: any[] = [];
  varientNameOptionList: any[] = [];
  varientNameOption2List: any[] = [];
  selectedVarientOptionList: any[] = [];
  selectedVarientOption2List: any = [];
  selectedItemList: any[] = [];
  productCategoryList: any[] = [];
  productSubCategoryList: any[] = [];
  productThridLevelCategoryList: any = [];
  varientNameObj: any;
  varientName2Obj: any;
  varientName2list: any[] = [];
  combinedVarientList: any[] = [];
  tempCombineVarientList: any[] = [];
  varients: any[] = [];
  filterOptions: any[] = [];
  filterId1: any;
  varientDetail: any;
  filterNameObj: any;
  filterOptionObj: any;
  filterNameOptionId: any;
  productDetailId: any;
  productDetail: any;
  filterOption: any;
  filterOptionName: any = [];
  removeFileList: any = [];
  addImagesList: any = [];
  isShowVarientSection: boolean = false;
  public isShowHideVarient: boolean = false;
  public isShowVarient2: boolean = false;
  public dialog = inject(MatDialog);
  public isActive: boolean = true;
  showVariant: boolean = false;

  private readonly toast = inject(ToastrService);
  public commonService = inject(CommonService);

  constructor(
    private fb: FormBuilder,
    public router: Router,
    private route: ActivatedRoute,
    private productService: ProductService,
    private categoryService: CategoryService,
    private location: Location
  ) {
    this.route.params.subscribe((param) => {
      this.productDetailId = param['id'];
    })
  }

  ngOnInit(): void {
    this.validateProductForm();
    this.getProductCategory();
    this.getProductVarientList();
    if (this.productDetailId) {
      this.getProductDetailById();
    }
  }

  /**
   * used to get patch product detail.
   */
  getProductDetailById(): void {
    this.productService.getProductDetailById(this.productDetailId).subscribe({
      next: ((resp: any) => {
        if (resp.status) {
          this.productDetail = resp.data;
          this.getPatchValue();
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
   * Used to get patch value.
   */
  getPatchValue() {
    if (this.productDetail) {
      this.name?.patchValue(this.productDetail.name);
      this.price?.patchValue(this.productDetail.price);
      this.discount?.patchValue(this.productDetail.discount);
      this.categoryCtrl?.patchValue(this.productDetail.categoryId);
      this.description?.patchValue(this.productDetail.description)

      if (this.categoryCtrl?.value) {
        this.getSubProductCategory();
        this.subCategoryCtrl?.patchValue(this.productDetail.subCategoryId);
        this.getFilterDetailById();
      }

      if (this.subCategoryCtrl?.value) {
        this.getThridLevelCategory();
        this.thirdLevelCategoryId?.patchValue(this.productDetail.thirdLevelCategoryId);
      }

      if (this.productDetail.media) {
        this.selectedFiles = this.productDetail.media
      }
      if (this.productDetail.filters?.length > 0) {
        this.filterOptionName = [];
        const filterOption = this.productDetail.filters.map((item: any) => ({
          filterId: item.filterId,
          filterOptionId: item.optionId
        }))

        this.productDetail.filters.map((item: any) => {
          this.filterOptionName.push(item.optionId)
        })
        this.filterOptions = filterOption;
      }

      if (this.productDetail.variants.length > 0) {

        const varientOption1List: any = [];
        const variantNameId = this.productDetail.variants[0].variantId1

        // const groupedVariants = this.productDetail.variants.reduce((acc: any, variant: any) => {
        //   // Find the option in the accumulator
        //   let option = acc.find((item: any) => item.optionId1 === variant.optionId1);

        //   // If the option does not exist, create a new one
        //   if (!option) {
        //     option = {
        //       optionId1: variant.optionId1,
        //       name: variant.optionName1,
        //       variantName1: variant.variantName1,
        //       variantId1: variant.variantId1,
        //       combineVarientList: []
        //     };
        //     acc.push(option);
        //   }

        //   // Check if the variant fields are null
        //   if (variant.optionId2 === null && variant.optionName2 === null && variant.variantName2 === null && variant.variantId2 === null) {
        //     // Push an empty combineVarientList and move mappingId outside
        //     option.combineVarientList = []; // Set to empty array
        //     option.mappingId = variant.mappingId; // Move mappingId outside
        //   } else {
        //     // Otherwise, add the variant details
        //     option.combineVarientList.push({
        //       mappingId: variant.mappingId,
        //       optionId2: variant.optionId2,
        //       name: variant.optionName2,
        //       variantName2: variant.variantName2,
        //       variantId2: variant.variantId2,
        //       price: variant.price,
        //       inventory: variant.inventory,
        //       discount: variant.discount
        //     });
        //   }

        //   return acc;
        // }, []);


        this.combinedVarientList = this.transformData(this.productDetail.variants)
        this.varientName?.patchValue(variantNameId)
        if (this.varientName?.value) {
          this.productDetail.variants.map((item: any) => {
            if (variantNameId) {
              varientOption1List.push(item.optionId1)
            }
          })
          this.varient1()
          this.varientOption?.setValue(varientOption1List)
          this.selectedItemList = varientOption1List;
        }





        // this.productDetail.variants.map((item: any) => {
        //   this.varientName?.patchValue(item.variantId1);
        //   if (this.varientName?.value) {
        //     this.getVarientOptionListById();
        //     varientOption1List.push(item.optionId1)
        //   }
        // })

        // this.varientOption?.setValue(varientOption1List)
        // // this.setVarientOption1List(varientOption1List)
        // if (this.varientName?.value) {
        //   this.selectedItemList = varientOption1List;
        //   // this.VarientOption1List()
        // }

      }
      this.isShowVarientSection = true
    }
  }


  transformData(data: any) {
    return data.map((item: any) => {
      const options2 = item.options2.map((opt: any) => {

        if (opt.optionName2 === null || opt.variantName2 === null) {
          return null; // Filter out or replace with null
        }
        return {
          mappingId: opt.mappingId,
          optionId2: opt.optionId2,
          optionId1: opt.optionId1,
          name: opt.optionName2, // Rename optionName2 to name
          variantName: opt.variantName2, // Rename variantName2 to variantName
          variantId2: opt.variantId2,
          price: opt.price,
          inventory: opt.inventory,
          discount: opt.discount
        };
      }).filter(Boolean); // Remove null values
      const mappingId = item.options2.map((opt: any) => opt.mappingId)
      const price = item.options2.length > 0 ? item.options2[0].price : null;
      const inventory = item.options2.length > 0 ? item.options2[0].inventory : null;
      const discount = item.options2.length > 0 ? item.options2[0].discount : null;
      return {
        optionId1: item.optionId1,
        name: item.optionName1, // Rename optionName1 to name
        variantName: item.variantName1,
        variantId1: item.variantId1,
        mappingId: mappingId[0],
        price: price,
        inventory: inventory,
        discount: discount,
        combineVarientList: options2.length > 0 ? options2 : [] // Ensure it's an empty array if no valid options
      };
    });
  };


  varient1() {

    setTimeout(() => {
      this.getVarientOptionListById()
      this.varientOption1List()
      if (this.selectedVarientOptionList.length > 0) {
        const variantNameId = this.productDetail.variants[0]?.variantId1;
        const variantName2Id = this.productDetail.variants[0]?.variantId2;
        this.varientName2?.setValue(variantName2Id)
        this.varientName2list = this.varientNamelist.filter((varient: any) => varient.id !== variantNameId);
        if (variantNameId) {
          const varientOption2List: any = []


          this.productDetail.variants.map((item: any) => {
            if (variantNameId) {
              varientOption2List.push(item.optionId2)

            }
          })
          if (this.varientName2?.value) {
            this.varient2()
          }
          this.varientOption2?.setValue(varientOption2List)
          this.varientOption2List(varientOption2List);
        }
      }

    }, 1000)

  }

  varient2() {

    setTimeout(() => {
      this.getVarientOption2ListById();
      const varientOption2List: any = []
      const variantNameId = this.productDetail.variants[0]?.variantId1;

      this.productDetail.variants.map((item: any) => {
        if (variantNameId) {
          varientOption2List.push(item.optionId2)

        }
      })
      this.varientOption2List(varientOption2List)
    }, 1000)
  }



  /**
   * Used to open dialog.
   * @param varient 
   * @param varientObj 
   */
  openInsertDialog(varient: any, varientObj: any): void {
    const dialog = this.dialog.open(AddVarientDetailComponent);
    dialog.componentInstance.productDetail = this.productDetail;
    if (this.productDetailId) {
      dialog.componentInstance.productDetailId = this.productDetailId;
    }
    if (this.combinedVarientList[0].combineVarientList.length > 0) {
      dialog.componentInstance.varientObj = varientObj;
    } else {
      dialog.componentInstance.varientObj = varient;
    }
    dialog.afterClosed().subscribe(result => {
      if (result) {
        if (this.productDetailId) {
          this.getProductDetailById();
        }
      }
      this.varientDetail = result;
      const length = this.tempCombineVarientList[0]?.combineVarientList?.length;
      const varientId = length ? varientObj.uuId : varient.parent_id;
      this.tempCombineVarientList = this.addVarientObj(varientId, result)
      this.varients = this.getOnlyVarientList(this.tempCombineVarientList)
    });
  }

  /**
   * Add new obj in varient and varient option array.
   * @param id 
   * @param result 
   * @returns 
   */
  addVarientObj(id: any, result: any): any[] {
    const updatedArray = this.tempCombineVarientList.map((item: any) => {
      if (item.combineVarientList?.length > 0) {
        const updatedCombineVarientList = item.combineVarientList.map((variant: any) => {
          if (variant.uuId === id) {
            return { ...variant, ...result };
          }
          return variant;
        });
        return { ...item, combineVarientList: updatedCombineVarientList };
      }
      if (item.parent_id === id) {
        return { ...item, ...result };
      }
      return item;
    }).filter(item => item !== undefined);
    return updatedArray;
  }

  /**
   * toggle Switch.
   * @param event 
   * @param varientOption 
   */
  onCheckboxChange(event: any, varientOption: any): void {
    if (!this.productDetailId) {
      this.combineVarientNameVarientOption();
    }
    this.varients = this.getOnlyVarientList(this.tempCombineVarientList);
    const isChecked = event.target.checked;
    this.varients.forEach((item: any) => {
      if (item.varientOptionId === varientOption.uuId || item.parent_id === varientOption.parent_id) {
        item.isActive = isChecked;
      } else {
        item.isActive = true;
      }
    });
  }

  /**
   * Used to convert in single array.
   * @param data 
   * @returns 
   */
  getOnlyVarientList(data: any): any {
    const variants: any = [];
    data.forEach((variant: any) => {
      const price = variant.price ? parseFloat(variant.price) : (this.price?.value);
      const discount = variant.discount ? parseFloat(variant.discount) : this.discount?.value;
      const inventory = variant.inventory ? parseFloat(variant.inventory) : 50
      if (variant.combineVarientList?.length > 0) {
        variant.combineVarientList.forEach((item: any) => {
          const price = item.price ? parseFloat(item.price) : (this.price?.value);
          const discount = item.discount ? parseFloat(item.discount) : this.discount?.value;
          const inventory = item.inventory ? parseFloat(item.inventory) : 50
          variants.push({
            variantOptionId1: variant.id,
            variantOptionId2: item.id,
            parent_id: variant.parent_id,
            varientOptionId: item.uuId,
            price: price,
            discount: discount,
            inventory: inventory,
            isActive: true
          });
        });
      } else {
        variants.push({
          variantOptionId1: variant.id,
          parent_id: variant.parent_id,
          price: price,
          discount: discount,
          inventory: inventory,
          isActive: true
        })
      }
    });
    return variants;
  }

  /**
   * used to get product category list.
   */
  getProductCategory(): void {
    this.categoryService.getCategory().subscribe({
      next: ((resp: any) => {
        if (resp.status) {
          this.productCategoryList = resp.data.categories;
        }
      }),
      error: ((error: any) => {
        this.toast.error('Server Error');
      })
    })
  }

  /**
   * Used to change category.
   */
  onChangeCategory(): void {
    const categoryId = this.categoryCtrl?.value;
    if (this.productCategoryList.length > 0 && categoryId) {
      this.getSubProductCategory();
      this.getFilterDetailById();
    }
  }

  /**
   * Used to get category detail by id.
   */
  getFilterDetailById(): void {
    const categoryId = {
      categoryId: this.categoryCtrl?.value
    }
    this.categoryService.getCategoryById(categoryId).subscribe((resp) => {
      if (resp.status) {
        this.filterNameObj = resp.data;
      }
    })
  }

  /**
   * Used to create filter array.
   * @param filter 
   * @param filterOption 
   */
  onChangeFilterOption(filter: any, filterOption: any, i: any): void {
    if (this.filterNameObj.filters.length > 0) {
      const newObj: any = { filterId: filter.filterId, filterOptionId: filterOption.optionId };
      // Check if the new object already exists in the array
      if (!this.filterOptions.some((obj: any) => obj.filterId === newObj.filterId)) {
        this.filterOptions.splice(i, 0, newObj);
      } else {
        const index = this.filterOptions.findIndex(item => item.filterId === filter.filterId);
        if (index !== -1) {
          this.filterOptions.splice(index, 1)
        }
        this.filterOptions.splice(index, 0, newObj);
      }
    }
  }

  /**
   * on cnange sub category.
   */
  onChangeSubCategory(): void {
    const subCategory = this.subCategoryCtrl?.value;
    if (this.productSubCategoryList.length > 0 && subCategory) {
      this.getThridLevelCategory()
    }
  }

  /**
   * Used to get sub sub category list.
   */
  getThridLevelCategory(): void {
    const params = {
      categoryId: this.categoryCtrl?.value,
      subCategoryId: this.subCategoryCtrl?.value,
    }
    this.categoryService.getSubSubCategory(params).subscribe({
      next: ((resp: any) => {
        if (resp.status) {
          this.productThridLevelCategoryList = resp.data.subCategories;
        }
      }),
      error: ((error: any) => {
        this.toast.error('Server Error');
      })
    })
  }

  /**
   * used to get Sub-category list.
   */
  getSubProductCategory(): void {
    const categoryId = this.categoryCtrl?.value;
    const payload = {
      categoryId: categoryId
    }
    this.categoryService.getSubCategory(payload).subscribe({
      next: ((resp: any) => {
        if (resp.status) {
          this.productSubCategoryList = resp.data.subCategories;
        }
      }),
      error: ((error: any) => {
        this.toast.error('Server Error');
      })
    })
  }

  /**
   * Used to get varient name list.
   */
  getProductVarientList(): void {
    this.productService.getProductVarientName().subscribe({
      next: ((resp: any) => {
        if (resp.status) {
          this.varientNamelist = resp.data;
        }
      }),
      error: ((error: any) => {
        this.toast.error('Server Error');
      })
    })
  }

  /**
   * Used to validate product form.
   */
  validateProductForm(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(200)]],
      price: ['', [Validators.required, Validators.min(1)]],
      discount: ['', [Validators.required, Validators.min(0), Validators.max(99)]],
      isReccomended: [false],
      varientName: [''],
      varientName2: [''],
      varientOption: ['', []],
      varientOption2: [''],
      categoryId: ['', [Validators.required]],
      subCategoryId: ['', [Validators.required]],
      thirdLevelCategoryId: [''],
      media: ['', [Validators.required]],
    })
  }

  get name() {
    return this.productForm.get('name');
  }

  get thirdLevelCategoryId() {
    return this.productForm.get('thirdLevelCategoryId');
  }

  get description() {
    return this.productForm.get('description');
  }

  get discount() {
    return this.productForm.get('discount');
  }

  get media() {
    return this.productForm.get('media');
  }

  get price() {
    return this.productForm.get('price');
  }

  get varientName2() {
    return this.productForm.get('varientName2');
  }

  get varientOption() {
    return this.productForm.get('varientOption');
  }

  get varientOption2() {
    return this.productForm.get('varientOption2');
  }

  get varientName() {
    return this.productForm.get('varientName');
  }

  get categoryCtrl() {
    return this.productForm.get('categoryId');
  }

  get subCategoryCtrl() {
    return this.productForm.get('subCategoryId');
  }

  /**
   * Used to create the product.
   */
  createUpdateProduct(): void {
    //validation
    if (this.productDetailId) {
      if (this.productForm.contains('media')) {
        this.productForm.removeControl('media');
      }
    }

    if (this.productForm.valid) {
      if (!this.varientDetail) {
        this.combineVarientNameVarientOption();
        this.varients = this.getOnlyVarientList(this.tempCombineVarientList);
      }
      let modifiedSelectedFiles: any = [];
      if (this.selectedFiles.length > 0) {
        modifiedSelectedFiles = this.selectedFiles.map((media: any) => ({
          ...media,
          isDefault: media.isDefault === 1 ? true : false
        }))
      }
      const updatedVarinetData = this.varients.map(({ varientOptionId, isActive, parent_id, ...rest }) => rest);
      const payLoad: PayLoad = {
        name: this.name?.value,
        description: this.description?.value,
        price: this.price?.value,
        discount: this.discount?.value,
        isReccomended: this.productForm.get('isReccomended')?.value,
        categoryId: this.categoryCtrl?.value,
        subCategoryId: this.subCategoryCtrl?.value,
        thirdLevelCategoryId: this.thirdLevelCategoryId?.value,
        media: modifiedSelectedFiles,
        variants: updatedVarinetData,
        filters: this.filterOptions
      }
      if (!this.productDetailId) {
        this.productService.createProduct(payLoad).subscribe({
          next: ((resp: any) => {
            if (resp.status) {
              this.router.navigateByUrl('/product/product-list');
              this.toast.success(resp.message);
            } else {
              this.toast.error(resp.message);
            }
          }),
          error: ((error: any) => {
            this.toast.error(error.message);
          })
        })
      } else {
        delete payLoad.variants;
        delete payLoad.media;
        delete payLoad.filters;
        this.productService.updateProductDetailById(payLoad, this.productDetailId).subscribe({
          next: ((resp: any) => {
            if (resp.status) {
              this.router.navigateByUrl('/product/product-list');
              this.toast.success(resp.message);
              this.varients = [];
              this.selectedFiles = [];
              this.filterOptions = [];
            }
          }),
          error: ((error: any) => {
            console.error(error)
          })
        })
      }
    }
    else {
      this.productForm.markAllAsTouched();
    }
  }

  /**
   * Used to update product image.
   */
  updateProductImage(): void {
    const payload = {
      add: this.addImagesList,
      remove: this.removeFileList,
      productId: this.productDetailId
    }
    this.productService.updateProductImage(payload, this.productDetailId).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.router.navigateByUrl('/product/product-list');
          this.removeFileList = [];
          // this.getProductDetailById();
        } else {
          // console.error('Image upload failed', res.message);
        }
      },
      error: error => {
        console.error('Error during image upload:', error);
      },
    })
  }

  /**
   * Used to make product image default true.
   * @param file 
   * @param index 
   */
  isDefaultImage(file: any, index: number): void {
    if (this.productDetailId) {
      if (file.id) {
        this.productService.addProductFile(file.id).subscribe({
          next: (res: any) => {
            if (res.status) {
              this.selectedFiles.forEach((f, i) => {
                f.isDefault = (i === index) ? 1 : 0;
              });
              this.toast.success('Default Image Selected', 'Success');
            }
          },
        });
      } else {
        this.toast.error('Please upload Before Selecting it as a Default Image', 'Error')
      }
    } else {
      if (this.selectedFiles.length > 0) {
        this.selectedFiles.forEach((f, i) => {
          f.isDefault = (i === index) ? 1 : 0;
        });
      }
    }
  }

  /**
   * Upload image/ video file.
   * @param event 
   */
  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
    const imageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/bmp', 'image/svg', 'image/webp'];
    // Limit the number of files to 5
    const maxFiles = 5;
    const maxSize = 500 * 1024; // 500 KB in bytes
    if (files.length > maxFiles || this.selectedFiles.length + 1 > maxFiles) {
      this.toast.error(`You can only upload a maximum of ${maxFiles} images.`);
      return;
    }
    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      if (file) {
        console.log(file)
        // Check file size
        if (file.size > maxSize) {
          this.toast.error(`File exceeds the maximum size of 500 KB.`);
          continue; // Skip to the next file
        }

        // Check file type (if needed)
        if (!imageTypes.includes(file.type)) {
          this.toast.error(`File ${file.name} is not a valid image type.`);
          continue; // Skip to the next file
        }
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.commonService.uploadImage(file, true).subscribe({
            next: res => {
              if (res.status) {
                const isDefault = (this.selectedFiles.length === 0) ? 1 : 0;
                if (!this.productDetailId) {
                  this.selectedFiles.push({
                    type: 1,
                    url: res.data?.image,
                    thumbnail: res.data?.thumbnail,
                    isDefault: isDefault
                  });
                } else {
                  this.addImagesList.push({
                    type: 1,
                    url: res.data?.image,
                    thumbnail: res.data?.thumbnail,
                  });
                  this.selectedFiles.push({
                    type: 1,
                    url: res.data?.image,
                    thumbnail: res.data?.thumbnail,
                  });
                }

              } else {
                console.error('Image upload failed', res.message);
              }
            },
            error: error => {
              console.error('Error during image upload:', error);
            },
          });
          // if (imageTypes.includes(file.type)) {

          //   this.selectedFiles.push({
          //     type: 1,
          //     url: e.target.result,
          //   });
          // } else {
          //   this.selectedFiles.push({
          //     type: 2,
          //     url: e.target.result,
          //   });
          // }
        };
        this.media?.setValue(file)
        reader.readAsDataURL(file);
      }
    }
  }

  /**
   * onchange varient name.
   */
  onVarientChange(): void {
    const varientNameId = this.varientName?.value
    // this.varientNameObj = this.varientNamelist.find((obj) => obj.id === variantNameId);
    if (varientNameId) {
      this.isShowVarient2 = false;
      this.varientName2?.setValue(null);
      this.varientOption?.setValue(null)
      this.varientOption2?.setValue(null)
      //Reset varient name and list/
      this.varientNameObj = {};
      this.selectedVarientOptionList = [];
      this.selectedVarientOption2List = [];
      this.varientName2list = this.varientNamelist.filter((varient: any) => varient.id !== varientNameId);
      this.getVarientOptionListById()
    }
  }

  /**
   * on change varient 2.
   */
  onChangeVarientName2(): void {
    const varientName2Id = this.varientName2?.value;
    if (varientName2Id) {
      this.varientOption2?.setValue(null)
      //Reset varient name and list/
      this.varientName2Obj = {};
      this.selectedVarientOption2List = [];
      // this.varientNamelist = this.varientName2list.filter((varient: any) => varient.id !== varientName2Id);
      this.getVarientOption2ListById();
    }
  }

  /**
   * select varient option.
   * @param variant 
   */
  isSelected(variant: any): void {
    this.selectedItemList = variant.value;
    this.varientOption1List()
  }

  /**
   * TO Show and Hide the Variant 
   */
  openVariant() {
    this.showVariant = !this.showVariant;
  }

  varientOption1List() {
    const variantNameId = this.varientName?.value
    this.varientNameObj = this.varientNamelist.find((obj) => obj.id === variantNameId);
    if (this.varientNameObj?.name) {
      this.selectedVarientOptionList = this.varientNameOptionList.filter((varient: any) => this.selectedItemList.includes(varient.id))
      if (this.selectedVarientOptionList.length > 0) {
        this.isShowVarient2 = true;
      }
    } else {
      // this.toast.error('Select Varient Name');
    }
  }

  /**
   * select varient option 2.
   * @param event 
   */
  isSelectedVarientOption2(event: any): void {
    const selectedItem = event.value;
    this.varientOption2List(selectedItem)
  }

  varientOption2List(selectedItem: any) {
    const variantName2Id = this.varientName2?.value
    this.varientName2Obj = this.varientName2list.find((obj) => obj.id === variantName2Id);
    if (this.varientName2Obj?.name) {
      this.selectedVarientOption2List = this.varientNameOption2List.filter((varientOption) => selectedItem.includes(varientOption.id));
    }
  }

  /**
   * Used to reset the varient(1).
   */
  reset(): void {
    const variantNameId = this.varientName?.value;
    this.varientNameObj = {};
    this.selectedVarientOptionList = [];
    this.varientName?.setValue(null);
    this.varientOption?.setValue(null)
    this.selectedItemList = [];
    this.varientNameOptionList = [];
    if (this.selectedVarientOptionList.length == 0) {
      this.isShowVarient2 = false;
    }
  }

  /**
   * Used to open review varients.
   */
  reviewVarients(): void {
    this.isShowVarientSection = true
    this.combineVarientNameVarientOption();
  }

  /**
   * combine varinet option 1 and option 2 with unique id in single array.
   */
  combineVarientNameVarientOption(): void {
    const VarientOption1 = this.selectedVarientOptionList;
    const VarientOption2 = this.selectedVarientOption2List;

    this.combinedVarientList = VarientOption1.map(varient => ({
      varientName: varient.name,
      combineVarientList: VarientOption2.map((option: any) => ({
        ...option,
        isActive: true,
        uuId: this.generateUniqueId(), // Assign a unique ID to each option
      })),
      isActive: true,
      parent_id: this.generateUniqueId(), // Assign a unique ID to each variant
      ...varient,
    }));
    this.tempCombineVarientList = this.combinedVarientList;
  }

  /**
   * generate unique uuId string.
   * @returns 
   */
  generateUniqueId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * used go to back.
   */
  back(): void {
    this.isShowVarientSection = false;
  }

  /**
   * select varient option 2.
   */
  resetVarient2(): void {
    this.varientName2?.setValue(null);
    this.varientOption2?.setValue(null)
    this.varientName2Obj = {};
    this.selectedVarientOption2List = [];
  }

  /**
   * Used to get varient option by id.
   */
  getVarientOptionListById(): void {
    const varientValue = this.varientName?.value;
    this.productService.getVarientOptionListById(varientValue).subscribe({
      next: ((resp: any) => {
        if (resp.status) {
          this.varientNameOptionList = resp.data;
        }
      }),
      error: ((error: any) => {
        this.toast.error('Server Error');
      })
    })
  }

  /**
   * Get varient option 2 list by id. 
   */
  getVarientOption2ListById(): void {
    const varientValue = this.varientName2?.value;
    this.productService.getVarientOptionListById(varientValue).subscribe({
      next: ((resp: any) => {
        if (resp.status) {
          this.varientNameOption2List = resp.data;
        }
      }),
      error: ((error: any) => {
        this.toast.error('Server Error');
      })
    })
  }

  /**
   * show/hide add varient 2.
   */
  showHide(): void {
    this.isShowHideVarient = !this.isShowHideVarient;
  }

  /**
   * Used to delete image/video file.
   * @param index 
   */
  removeSelectedFile(file: any, index: number): void {
    if (this.productDetailId && file.id) {
      this.removeFileList.push(file.id);
    }
    if (this.productDetailId) {
      const findIndex = this.addImagesList.findIndex((image: any) => image.url === file.url)
      console.log('index', findIndex)
      if (findIndex !== -1) {
        this.addImagesList.splice(findIndex, 1)
      }
    }
    this.selectedFiles.splice(index, 1);
  }

  goBack(): void {
    this.location.back();  // Navigates to the previous page in history
  }

  /**
   * used to cancel form.
   */
  cancel() {
    this.productForm.reset(); // Call the reset method
    this.productForm.get('isReccomended')?.setValue(false);
  }
}