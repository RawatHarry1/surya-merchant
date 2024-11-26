import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { MtxButtonModule } from '@ng-matero/extensions/button';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService, LoginService } from '@core/authentication';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { SettingsService } from '@core/bootstrap/settings.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MtxButtonModule,
    TranslateModule,
    MatIconModule
  ],
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);

  isSubmitting = false;
  showPassword: boolean = false;

  constructor(private auth2: LoginService, private http: HttpClient,
    public settingsService:SettingsService
  ) { }


  loginForm = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
    rememberMe: [false],
  });

  get username() {
    return this.loginForm.get('username')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }

  get rememberMe() {
    return this.loginForm.get('rememberMe')!;
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;

  }


  login() {
    this.isSubmitting = true;
    // First login attempt
    this.auth.login('ng-matero', 'ng-matero', true).subscribe({
      next: () => {
        // Second login attempt
        this.auth.login2(this.username.value, this.password.value).pipe(
          tap((data: any) => {
            console.log('Login2 response:', data);
          })
        ).subscribe({
          next: (data: any) => {
            if (data !== null) {
              
              this.router.navigateByUrl('/');
            }
          },
          error: (errorRes: HttpErrorResponse) => {
            this.handleLoginError(errorRes);
            this.isSubmitting = false;
          },
          complete: () => {
            this.isSubmitting = false;
          }
        });
      },
      error: (errorRes: HttpErrorResponse) => {
        this.handleLoginError(errorRes);
        this.isSubmitting = false;
      }
    });
  }
  private handleLoginError(errorRes: HttpErrorResponse) {
    if (errorRes.status === 422) {
      const form = this.loginForm;
      const errors = errorRes.error.errors;
      Object.keys(errors).forEach(key => {
        form.get(key === 'email' ? 'username' : key)?.setErrors({
          remote: errors[key][0],
        });
      });
    }
  }
}
