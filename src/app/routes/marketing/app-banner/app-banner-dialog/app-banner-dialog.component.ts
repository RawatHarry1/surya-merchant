import { Component, inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { BannersService } from '@shared/services/banners.service';
import { CommonService } from '@shared/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-app-banner-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormField,
    MatInputModule,
    MatIcon,
    TranslateModule
  ],
  templateUrl: './app-banner-dialog.component.html',
  styleUrl: './app-banner-dialog.component.scss'
})
export class AppBannerDialogComponent {
  @Input() bannerData: any;
  @Input() isUpdate: boolean = false;
  appBannerForm!: FormGroup;
  selectedFile: any = {};
  private readonly toast = inject(ToastrService);

  constructor(
    private fb: FormBuilder,
    private bannerService: BannersService,
    private commonService: CommonService,
    public dialogRef: MatDialogRef<AppBannerDialogComponent>
  ) { }

  ngOnInit(): void {
    this.valiadteBannerForm();
    if (this.isUpdate) {
      this.getBannerDetails()
    }
  }

  getBannerDetails() {
    this.title?.patchValue(this.bannerData.title);
    this.media?.patchValue(this.bannerData.image);
    this.selectedFile = this.bannerData.image;
  }

  /**
   * Used to validate the form.
   */
  valiadteBannerForm() {
    this.appBannerForm = this.fb.group({
      title: ['', [Validators.required]],
      media: ['', [Validators.required]]
    })
  }

  get title() {
    return this.appBannerForm.get('title');
  }

  get media() {
    return this.appBannerForm.get('media');
  }

  /**
   * Image file upload.
   * @param event 
   */
  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files.length > 0) {
      const file = files[0]; // Only process the first file
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.commonService.uploadImage(file, true).subscribe({
          next: res => {
            if (res.status) {
              const fileObj = {
                file,
                url: res.data?.image,
              };
              this.selectedFile = fileObj;
            } else {
              console.error('Image upload failed', res.message);
            }
          },
          error: error => {
            console.error('Error during image upload:', error);
          },
        });
        this.appBannerForm.patchValue({ media: file }); // Update form control
      };

      reader.readAsDataURL(file); // Read the file as Data URL
    } else {
      console.warn('No files selected');
      this.selectedFile = {};
      this.media?.setErrors({ required: true })
    }
  }

  /**
   * Used to add banner.
   */
  createBanner() {
    if (this.appBannerForm.valid) {
      const payload = { title: this.title?.value, image: this.selectedFile.url }

      if (!this.isUpdate) {
        this.bannerService.addAppBanner(payload).subscribe((res: any) => {
          if (res.status) {
            console.log(res)
            this.closeDialog(true);
            this.toast.success(res.message, 'Success');
          }
        })
      } else {
        this.bannerService.updateAppBanner(this.bannerData.id, payload).subscribe((res: any) => {
          if (res.status) {
            console.log(res)
            this.closeDialog(true);
            this.toast.success(res.message, 'Success');
          }
        })
      }
    } else {
      this.appBannerForm.markAllAsTouched();
    }
  }

  /**
   * Used to modified file name.
   * @param image 
   * @returns 
   */
  getModifiedFilename(image: any) {
    const imageUrl = image.url ? image.url : image;
    try {
      const parsedUrl = new URL(imageUrl);
      const filename = parsedUrl.pathname.split('/').pop();
      return `${filename}`;
    } catch (error) {
      console.error('Invalid URL:', error);
      return null;
    }
  }

  /**
   * Used to close the dialog.
   */
  closeDialog(isBoolean: any) {
    this.dialogRef.close({ isClose: isBoolean });
  }
}
