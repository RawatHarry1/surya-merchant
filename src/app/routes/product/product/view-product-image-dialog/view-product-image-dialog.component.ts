import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-view-product-image-dialog',
  standalone: true,
  imports: [],
  templateUrl: './view-product-image-dialog.component.html',
  styleUrl: './view-product-image-dialog.component.scss'
})
export class ViewProductImageDialogComponent {
  @Input() productImageUrl: any;

  constructor(public dialogRef: MatDialogRef<ViewProductImageDialogComponent>) { }
  
  closeDialog() {
    this.dialogRef.close();
  }
}
