import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Location } from '@angular/common';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-view-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule
  ],
  templateUrl: './view-profile.component.html',
  styleUrl: './view-profile.component.scss'
})
export class ViewProfileComponent {

  private readonly location = inject(Location)
  public dialog = inject(MatDialog);
  
  constructor() { }

  editProfile() {
    const dialogRef = this.dialog.open(EditProfileComponent, {
      data: {
        isEditOpen: false,
        isAddOpen: true
      }
    });
  }

  goBack(): void {
    this.location.back();  // Navigates to the previous page in history
  }
}
