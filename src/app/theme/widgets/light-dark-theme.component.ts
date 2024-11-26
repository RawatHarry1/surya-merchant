import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
    selector: 'app-light-dark-theme',
    template: `
    <!-- <div class="theme-toggle">
    <div>
  <mat-icon class="theme_change" *ngIf="!isDarkTheme" (click)="toggleTheme()">toggle_off</mat-icon>
  <mat-icon class="theme_change" *ngIf="isDarkTheme" (click)="toggleTheme()">toggle_on</mat-icon>
</div>

    </div> -->
  `,
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatIconModule, MatMenuModule, MatSlideToggleModule, FormsModule],
    styles: [
        `
    .theme_change {
        display:flex;
        align-items: center;
        font-size: 40px;
        width: 40px;
        height: 40px;
    }
    body {
  margin: 0;
  transition: filter 0.3s ease, background-color 0.3s ease;
}

/* Apply the invert filter to the entire body */
// body.invert-theme {
//   filter: invert(1) hue-rotate(180deg);
// }
    `,
    ],
})
export class LightDarkThemeComponent {
    isDarkTheme: boolean = false;

    constructor() { }

    ngOnInit() {
        const savedTheme = localStorage.getItem('app-theme');
        if (savedTheme) {
            this.isDarkTheme = savedTheme === 'dark';
            this.applyTheme(savedTheme);
        } else {
            this.applyTheme('light');
        }
    }

    toggleTheme() {
        const newTheme = this.isDarkTheme ? 'light' : 'dark';
        localStorage.setItem('app-theme', newTheme);
        this.applyTheme(newTheme);
        this.isDarkTheme = !this.isDarkTheme;
    }

    applyTheme(theme: string) {
        const body = document.body;
        body.classList.remove('light-theme', 'dark-theme');
        body.classList.add(`${theme}-theme`);
        // body.style.backgroundColor = this.isDarkTheme ? 'black' : 'white';
        // body.style.color = this.isDarkTheme ? 'white' : 'black';
    }
}
