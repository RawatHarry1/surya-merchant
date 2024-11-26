import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, inject, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { BannersService } from '@shared/services/banners.service';
import { strict } from 'assert';

export interface Banner {
  name: string;
  storeId: string;
  externalLink: string;
  text: string;
  id: string;
}

@Component({
  selector: 'app-banners-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatFormField,
    MatLabel,
    MatSlideToggle,
    MatIcon,
    MatInput,
    ReactiveFormsModule

  ],
  templateUrl: './banners-dialog.component.html',
  styleUrl: './banners-dialog.component.scss'
})
export class BannersDialogComponent implements OnInit, AfterViewInit {
  public readonly httpClient = inject(HttpClient);
  public readonly dialogRef = inject(MatDialogRef<BannersDialogComponent>);
  @Input() bannerData: any

  bannersForm!: FormGroup;
  // Separate arrays for each file input
  selectedFilesWeb: any[] = [];
  selectedFilesMobile: any[] = [];
  selectedFilesNative: any[] = [];
  isAddOpen: Boolean;
  isEditOpen: Boolean;
  id: string;


  constructor(public fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private bannerServices: BannersService,
  ) {
    this.isAddOpen = data.isAddOpen;
    this.isEditOpen = data.isEditOpen;
    this.id = data.id;
  }

  ngAfterViewInit(): void {

  }

  ngOnInit(): void {
    this.bannersForm = this.fb.group({
      name: ['', Validators.required],
      storeId: ['', Validators.required],
      externalLink: ['', Validators.required],
      text: ['', Validators.required],
    });

    if (this.isEditOpen) {
      this.bannersForm.patchValue({
        name: this.bannerData.name,
        storeId: this.bannerData.storeId,
        externalLink: this.bannerData.externalLink,
        text: this.bannerData.text,
      })
    }

  }

  onAdd() {
    const payload = {
      name: this.bannersForm.get('name')?.value,
      storeId: this.bannersForm.get('storeId')?.value,
      externalLink: this.bannersForm.get('externalLink')?.value,
      text: this.bannersForm.get('text')?.value,
      //     // Add base64-encoded image data to the payload
      //   webImages: this.selectedFilesWeb,
      //   mobileImages: this.selectedFilesMobile,
      //   nativeImages: this.selectedFilesNative
    }
    if (this.bannersForm.valid) {
      if (this.isAddOpen) {
        this.bannerServices.addBanner(payload).subscribe((data) => {
          alert("Banner Added Succsfully!");
          this.closeDialog();
        });
      }
      if (this.isEditOpen) {
        console.log(this.id)
        this.bannerServices.updateBanner(payload, this.id).subscribe((data) => {
          alert("Banner updated Succsfully!");
          this.closeDialog();
        });
      }
    }
  }


  onFileSelected(event: any, type: string): void {
    const files = event.target.files;
    const tempFiles: any[] = [];


    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const fileObj = {
          file,
          url: e.target.result,
        };
        tempFiles.push(fileObj);
      };

      reader.readAsDataURL(file);
    }


    switch (type) {
      case 'web':
        this.selectedFilesWeb = tempFiles;
        break;
      case 'mobile':
        this.selectedFilesMobile = tempFiles;
        break;
      case 'native':
        this.selectedFilesNative = tempFiles;
        break;
    }
  }


  removeSelectedFile(index: number, type: string): void {
    switch (type) {
      case 'web':
        this.selectedFilesWeb.splice(index, 1);
        break;
      case 'mobile':
        this.selectedFilesMobile.splice(index, 1);
        break;
      case 'native':
        this.selectedFilesNative.splice(index, 1);
        break;
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
