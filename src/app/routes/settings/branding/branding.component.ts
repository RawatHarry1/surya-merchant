import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

interface SelectedFile {
  file: File;
  url: string;
}

@Component({
  selector: 'app-branding',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatInputModule
  ],
  templateUrl: './branding.component.html',
  styleUrl: './branding.component.scss'
})
export class BrandingComponent {
  activeContent: string | null = 'web';
  webLogoFiles: any[] = [];
  favLogoFiles: any[] = [];
  dashboardLogoFiles: any[] = [];
  dashboardFavLogoFiles: any[] = [];
  loginLogoFiles: any[] = [];
  loginPageFiles: any[] = [];
  customDashboardLogoFiles: any[] = [];
  customDashboardFavLogoFiles: any[] = [];
  customLoginLogoFiles: any[] = [];
  customLoginPageFiles: any[] = [];



  toggleContent(content: string) {
    this.activeContent = this.activeContent === content ? null : content;
  }

  // Handle File Selection for Any Logo
  onLogoSelected(event: any, logoType: 'web' | 'fav' | 'dashboard' | 'dashboardFav' | 'loginLogo' | 'loginPage' | 'customDashboard' | 'customDashboardFav' | 'customLoginLogo' | 'customLoginPage'): void {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (logoType === 'web') {
          this.webLogoFiles.push({ url: e.target.result, file: files[i] });
        } else if (logoType === 'fav') {
          this.favLogoFiles.push({ url: e.target.result, file: files[i] });
        } else if (logoType === 'dashboard') {
          this.dashboardLogoFiles.push({ url: e.target.result, file: files[i] });
        } else if (logoType === 'dashboardFav') {
          this.dashboardFavLogoFiles.push({ url: e.target.result, file: files[i] });
        } else if (logoType === 'loginLogo') {
          this.loginLogoFiles.push({ url: e.target.result, file: files[i] });
        } else if (logoType === 'loginPage') {
          this.loginPageFiles.push({ url: e.target.result, file: files[i] });
        }else if (logoType === 'customDashboard') {
          this.customDashboardLogoFiles.push({ url: e.target.result, file: files[i] });
        } else if (logoType === 'customDashboardFav') {
          this.customDashboardFavLogoFiles.push({ url: e.target.result, file: files[i] });
        } else if (logoType === 'customLoginLogo') {
          this.customLoginLogoFiles.push({ url: e.target.result, file: files[i] });
        } else if (logoType === 'customLoginPage') {
          this.customLoginPageFiles.push({ url: e.target.result, file: files[i] });
        }
      };
      reader.readAsDataURL(files[i]);
    }
  }

  // Remove Selected Logo File
  removeLogoFile(index: number, logoType: 'web' | 'fav' | 'dashboard' | 'dashboardFav' | 'loginLogo' | 'loginPage'| 'customDashboard' | 'customDashboardFav' | 'customLoginLogo' | 'customLoginPage'): void {
    if (logoType === 'web') {
      this.webLogoFiles.splice(index, 1);
    } else if (logoType === 'fav') {
      this.favLogoFiles.splice(index, 1);
    } else if (logoType === 'dashboard') {
      this.dashboardLogoFiles.splice(index, 1);
    } else if (logoType === 'dashboardFav') {
      this.dashboardFavLogoFiles.splice(index, 1);
    } else if (logoType === 'loginLogo') {
      this.loginLogoFiles.splice(index, 1);
    } else if (logoType === 'loginPage') {
      this.loginPageFiles.splice(index, 1);
    }else if (logoType === 'customDashboard') {
      this.customDashboardLogoFiles.splice(index, 1);
    } else if (logoType === 'customDashboardFav') {
      this.customDashboardFavLogoFiles.splice(index, 1);
    } else if (logoType === 'customLoginLogo') {
      this.customLoginLogoFiles.splice(index, 1);
    } else if (logoType === 'customLoginPage') {
      this.customLoginPageFiles.splice(index, 1);
    }
  }
}
