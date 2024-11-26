import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-branding',
  template: `
    <a class="branding">
      <img src="images/logo.png" class="branding-logo" alt="logo" />
    </a>
  `,
  styles: `
    .branding {
      display: flex;
      align-items: center;
      margin: 0 0.5rem;
      text-decoration: none;
      white-space: nowrap;
      color: inherit;
      border-radius: 50rem;
    }

    .branding-logo {
      // width: 2rem;
      // height: 2rem;
      // border-radius: 50rem;
      width: 100%;
    height: 60px;
    max-width:140px;
    margin-left: 28px;
    border-radius: 0rem;
    }

    .branding-name {
      margin: 0 0.5rem;
      font-size: 1rem;
      font-weight: 500;
    }
  `,
  standalone: true,
})
export class BrandingComponent {
  @Input() showName = true;
}
