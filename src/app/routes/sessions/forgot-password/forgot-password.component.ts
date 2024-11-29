import { HttpErrorResponse } from '@angular/common/http';
import { MtxButtonModule } from '@ng-matero/extensions/button';



import { AuthService } from '@core/authentication';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, JsonPipe, Location } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MtxDatetimepickerModule } from '@ng-matero/extensions/datetimepicker';
import { TranslateModule } from '@ngx-translate/core';
import { BreadcrumbComponent } from '@shared';
import { BrandingComponent } from '@theme/widgets/branding.component';
import { GithubButtonComponent } from '@theme/widgets/github.component';
import { NotificationComponent } from '@theme/widgets/notification.component';
import { TranslateComponent } from '@theme/widgets/translate.component';
import { UserComponent } from '@theme/widgets/user.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { CountryISO, SearchCountryField, PhoneNumberFormat, } from 'ngx-intl-tel-input';
import { ToastrService } from 'ngx-toastr';
import { NgxOtpInputComponent, NgxOtpInputComponentOptions } from 'ngx-otp-input';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    MtxButtonModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    TranslateModule,
    MatToolbarModule,
    BrandingComponent,
    GithubButtonComponent,
    NotificationComponent,
    TranslateComponent,
    UserComponent,
    MatSelectModule,
    MatOptionModule,
    MatMenuModule,
    MatTableModule,
    MatTabsModule,
    MatIconModule,
    MatRadioModule,
    BreadcrumbComponent,
    CommonModule,
    MatDatepickerModule,
    MtxDatetimepickerModule,
    JsonPipe,
    MatGridListModule,
    NgxIntlTelInputModule,
    NgxOtpInputComponent,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastrService);
  screenStep: number = 1;
  isSubmitting = false;
  otpTimer: number = 59;
  showPassword: boolean = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [
    CountryISO.UnitedStates,
    CountryISO.UnitedKingdom,
  ];
  separateDialCode = false;
  @ViewChild('otpInput') otpInput: NgxOtpInputComponent | undefined;
  @ViewChild('otpInput2') otpInput2: NgxOtpInputComponent | undefined;
  loginForm!: FormGroup;
  mobileNumberForm!: FormGroup;
  verify_otp!: FormGroup;
  email_verify_otp!: FormGroup;
  standardOfferForm!: FormGroup;
  selectedAddressType: string | null = null;
  emailForm!: FormGroup;
  logoURL: any;
  cirtificate1: any;
  filePreview: any = null;
  isLogoSubmited: boolean = false;
  cirtificate2: any;
  addressOption = ['HOME', 'OFFICE'];
  selectedAddress = 'HOME';
  signUpCirtificate1: any;
  signUpCirtificate2: any;
  selectedAddressType2: string | null = null;
  nameForm!: FormGroup;
  signUpLogo: any;
  setupPasswordForm!: FormGroup;
  logoForm!: FormGroup;
  addressTypeValue: string | null = null;
  addressType: number | null = null;
  addressForm!: FormGroup;
  otpFromApi: any = null;
  transactionPasswordForm!: FormGroup;
  loading = false;
  submitted = false;
  isSubmittedDocs: boolean = false;
  responseData: any;
  seconds: any;
  stageData: any;
  documentForm!: FormGroup;
  showPassword2: boolean = false;
  showConfirmPassword: boolean = false;
  isOtpValue: string[] = [];
  isSubmitDisabled: boolean = true;
  isSubmitDisabled2: boolean = true;
  isOtpValue2: string[] = [];
  certificatePreview: string | ArrayBuffer | null = null;
  validIdPreview: string | ArrayBuffer | null = null;
  phoneNumberForOtp: string = "";
  emailForOtp: string = "";
  countdown: any;
  returnUrl: string | null = null;
  error = "";
  pdfView: boolean = false
  pdfView2: boolean = false
  timerInterval: any;
  isResendDisabled: boolean | null = null;
  isResendDisabled2: boolean | null = null;
  otpOptions: NgxOtpInputComponentOptions = {
    otpLength: 4,
    autoFocus: true,
    autoBlur: true,
    hideInputValues: false,
    regexp: /^[0-9]+$/,
    showBlinkingCursor: true

  };
  constructor(
    private formBuilder: FormBuilder,
    private location: Location

  ) {


  }
  ngAfterViewInit(): void {
    // throw new Error('Method not implemented.');
  }
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]]
    });
  }


  // ng-matero
  get email() {
    return this.loginForm.get('email')!;
  }


  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;

  }
  login() {
    // if(this.email.value === 'demo-sales@gmail.com' && this.password.value==="Demo@123")
    //   {
    this.isSubmitting = true;
    console.log(this.email.value)
    this.emailForOtp = this.email.value;
    this.screenStep = 2
    this.stopAndRestartTimer()
    this.isResendDisabled2 = true;
    // First login attempt

    //  this.auth.login2(this.email.value).subscribe({

    //   next: (data: any) => {
    //     // console.log(data);
    //     if(data !== null)
    //     {

    //       this.auth.login('ng-matero', 'ng-matero', true).subscribe({
    //         next: () => {
    //           // this.router.navigateByUrl('/');
    //         },
    //         error: (errorRes: HttpErrorResponse) => {
    //           this.handleLoginError(errorRes);
    //           this.isSubmitting = false;
    //         },
    //         complete: () => {
    //           // console.log(this.email.value + this.password.value)

    //      // Second login attempt after the first one completes
    //     }
    //     });
    //       this.router.navigateByUrl('/');
    //     } 
    //   },
    //   error: (errorRes: HttpErrorResponse) => {
    //     this.handleLoginError(errorRes);
    //     this.isSubmitting = false;
    //   },
    //   complete: () => {
    //     this.isSubmitting = false;
    //   }
    // });



    // }else
    // {
    //   this.toast.error("You are not authorized");
    // }
  }
  // else
  // {
  //   this.toast.error("You are not authorized");
  // }
  // }
  formatTimer2() {
    const minutes = Math.floor(0);
    const seconds = this.otpTimer % 60;
    return `${this.padZero(minutes)}:${this.padZero(seconds)}`;
  }

  padZero(value: number) {
    return value < 10 ? "0" + value : value.toString();
  }
  startTimer() {
    this.timerInterval = setInterval(() => {
      if (this.otpTimer > 0) {
        this.otpTimer--;
      } else {
        clearInterval(this.timerInterval);
        this.isResendDisabled = false;
        this.isResendDisabled2 = false;
      }
    }, 1000);
  }
  resendEmailOTP() {
    this.otpInput2?.reset();
    this.login();
  }
  onEmailVerfyOtp() {
    console.log("OTP entered:", this.isOtpValue.join(''));
    const value = this.isOtpValue2.join('')
    console.log(typeof (value))
    console.log(value.length)

  }
  stopAndRestartTimer() {
    clearInterval(this.timerInterval); // Stop the current timer
    this.otpTimer = 60; // Reset the timer to 60 seconds
    this.startTimer(); // Restart the timer
  }
  onOtpChange2(value: string[]) {
    console.log(value)
    this.isOtpValue2 = value;
    this.isSubmitDisabled2 = value.some((otp) => otp === '');
    console.log(this.isSubmitDisabled2)
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

  goBack(): void {
    this.location.back();
  }

}

