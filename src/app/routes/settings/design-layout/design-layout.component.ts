import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-design-layout',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSlideToggleModule
  ],
  templateUrl: './design-layout.component.html',
  styleUrl: './design-layout.component.scss'
})
export class DesignLayoutComponent implements OnInit{

  bannerImgFiles: any[] = [];
  homepageFiles: any[] = [];
  homepageMobileFiles: any[] = [];
  homeDeliveryFiles: any[] = [];
  selectColorForm!: FormGroup;

  constructor(public fb: FormBuilder) { }

  ngOnInit(): void {
    this.selectColorForm = this.fb.group({
      selectColor: [''],
    });
  }

  // Handle File Selection for Any Logo
  onLogoSelected(event: any, logoType: 'banner' | 'homepage'|'homepageMobile'|'homeDelivery'): void {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (logoType === 'banner') {
          this.bannerImgFiles.push({ url: e.target.result, file: files[i] });
        } else if (logoType === 'homepage') {
          this.homepageFiles.push({ url: e.target.result, file: files[i] });
        } else if (logoType === 'homepageMobile') {
          this.homepageMobileFiles.push({ url: e.target.result, file: files[i] });
        }else if (logoType === 'homeDelivery') {
          this.homeDeliveryFiles.push({ url: e.target.result, file: files[i] });
        }
      };
      reader.readAsDataURL(files[i]);
    }
  }

  // Remove Selected Logo File
  removeLogoFile(index: number, logoType: 'banner' | 'homepage'|'homepageMobile'|'homeDelivery'): void {
    if (logoType === 'banner') {
      this.bannerImgFiles.splice(index, 1);
    } else if (logoType === 'homepage') {
      this.homepageFiles.splice(index, 1);
    } else if (logoType === 'homepageMobile') {
      this.homepageMobileFiles.splice(index, 1);
    }else if (logoType === 'homeDelivery') {
      this.homeDeliveryFiles.splice(index, 1);
    }
  }

  onAdd(): void {
    const payload = {
      selectColor: this.selectColorForm.get('selectColor')?.value,

    }
    console.log(payload);
  }
}
