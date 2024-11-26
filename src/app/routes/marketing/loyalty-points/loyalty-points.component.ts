import { Component } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-loyalty-points',
  standalone: true,
  imports: [
    MatFormField,
    MatLabel,
    MatInput,
    MatFormField,
  ],
  templateUrl: './loyalty-points.component.html',
  styleUrl: './loyalty-points.component.scss'
})
export class LoyaltyPointsComponent {

}
