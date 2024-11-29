import { CommonModule, JsonPipe } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BreadcrumbComponent } from '@shared';
import { BrandingComponent } from '@theme/widgets/branding.component';
import { GithubButtonComponent } from '@theme/widgets/github.component';
import { NotificationComponent } from '@theme/widgets/notification.component';
import { TranslateComponent } from '@theme/widgets/translate.component';
import { UserComponent } from '@theme/widgets/user.component';
import { CountryISO, NgxIntlTelInputModule, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { ToastrService } from 'ngx-toastr';
import { MtxDatetimepickerModule } from '@ng-matero/extensions/datetimepicker';
import { NgxOtpInputComponent, NgxOtpInputComponentOptions } from 'ngx-otp-input';
import { CommonService } from '@shared/services/common.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  standalone: true,
  imports: [
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
    NgxOtpInputComponent
  ],
})
export class RegisterComponent {
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
  bankDetailsForm!: FormGroup;
  merchantForm!: FormGroup;
  emailForm!: FormGroup;
  nameForm!: FormGroup;
  setupPasswordForm!: FormGroup;
  logoForm!: FormGroup;
  addressForm!: FormGroup;
  transactionPasswordForm!: FormGroup;
  documentForm!: FormGroup;

  selectedAddressType: string | null = null;
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
  signUpLogo: any;
  addressTypeValue: string | null = null;
  addressType: number | null = null;
  otpFromApi: any = null;
  loading = false;
  submitted = false;
  isSubmittedDocs: boolean = false;
  responseData: any;
  seconds: any;
  stageData: any;
  showPassword: boolean = false;
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
  screenStep: number = 1;
  returnUrl: string | null = null;
  error = "";
  otpTimer: number = 59;
  pdfView: boolean = false
  pdfView2: boolean = false
  timerInterval: any;
  isResendDisabled: boolean | null = null;
  isResendDisabled2: boolean | null = null;
  selectedFiles: any = [];
  selectedFiles2: any = [];

  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('fileInput2') fileInput2!: ElementRef;

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
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private _Activatedroute: ActivatedRoute,
    private commonService: CommonService

  ) {
    this.initialization();
  }

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {

  }
  /**
   * All Forms Are initialized Start
   */
  initialization(): void {

    this.mobileNumberForm = this.formBuilder.group(
      {
        phoneNumber: ['', [Validators.required]],
      }
    );

    this.setupPasswordForm = this.formBuilder.nonNullable.group(
      {
        password: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: [this.matchValidator('password', 'confirmPassword')],
      }
    );


    this.nameForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      userName: ['', [Validators.required]],
    });


    this.emailForm = this.formBuilder.group({
      email: [
        "",
        [
          Validators.required,
          // Validators.email
        ],
      ],
    });


    this.merchantForm = this.formBuilder.group({
      businessName: ['', [Validators.required]],
      businessType: ['', [Validators.required]],
    });


    this.addressForm = this.formBuilder.group({
      flatNumber: ["", Validators.required],
      streetAddress: ["", Validators.required],
      city: ["", Validators.required],
      state: ["", Validators.required],
      postalCode: ["", [Validators.required]],
      selectedAddress: ["", [Validators.required]],
    });


    this.bankDetailsForm = this.formBuilder.group({
      bankName: ['', [Validators.required]],
      accountHolderName: ['', [Validators.required]],
      accountNumber: ['', [Validators.required]],
      ifscCode: ['', [Validators.required]],
    });


    this.documentForm = this.formBuilder.group({
      businessLicenseNumber: ['', Validators.required],
      businessLicenseImage: ['', Validators.required],
      taxIdentificationNumber: ['', Validators.required],
      taxIdentificationImage: ['', Validators.required],
    });
  }
  /**
   * All Forms Are initialized End
   */

  matchValidator(source: string, target: string) {
    return (control: AbstractControl) => {
      const sourceControl = control.get(source)!;
      const targetControl = control.get(target)!;
      if (targetControl.errors && !targetControl.errors.mismatch) {
        return null;
      }
      if (sourceControl.value !== targetControl.value) {
        targetControl.setErrors({ mismatch: true });
        return { mismatch: true };
      } else {
        targetControl.setErrors(null);
        return null;
      }
    };
  }

  togglePasswordVisibility(value: number) {
    if (value === 1) {
      this.showPassword = !this.showPassword;
    } else {
      this.showPassword2 = !this.showPassword2;
    }


  }

  onContactChange() {
  }

  phoneSubmit() {
    this.phoneNumberForOtp =
      this.mobileNumberForm.value.phoneNumber.dialCode +
      this.mobileNumberForm.value.phoneNumber.number;
    console.log(this.mobileNumberForm.get('phoneNumber')?.value.number)
    if (this.mobileNumberForm.valid) {
      var payload = {
        phone: {
          countryCode: this.mobileNumberForm.value.phoneNumber.dialCode,
          phoneNumber: this.mobileNumberForm.value.phoneNumber.number,
          countryCodeIso: this.mobileNumberForm.value.phoneNumber.countryCode,
        },
      };
      console.log(payload)
      if (this.mobileNumberForm.value.phoneNumber.dialCode && this.mobileNumberForm.value.phoneNumber.number && this.mobileNumberForm.value.phoneNumber.countryCode) {
        this.screenStep = 2;
        this.stopAndRestartTimer();
        this.isResendDisabled = true;
      } else {
        return
      }
      // this.SERVER.PATCH_DATA(
      //   this.SERVER.END_POINT.signupOnboarding,
      //   payload,
      // ).subscribe((res) => {
      //   this.stopAndRestartTimer();
      //   this.responseData = res;
      //    
      //   this.isResendDisabled = true;
      //   this.toastr.success("", this.responseData.message);
      // });
    }
  }

  onOtpChange(value: string[]) {
    console.log(value)
    this.isOtpValue = value;
    this.isSubmitDisabled = value.some((otp) => otp === '');
    console.log(this.isSubmitDisabled)
  }
  onOtpChange2(value: string[]) {
    console.log(value)
    this.isOtpValue2 = value;
    this.isSubmitDisabled2 = value.some((otp) => otp === '');
    console.log(this.isSubmitDisabled2)
  }
  onVerfyOtp() {
    console.log("OTP entered:", this.isOtpValue.join(''));
    const value = this.isOtpValue.join('')
    console.log(typeof (value))
    console.log(value.length)
    if (value.length === 4) {
      this.screenStep = 3;
    }
    // if (this.isOtpValue.length === 4) {
    //   var payload = {
    //     countryCode: this.mobileNumberForm.value.phoneNumber.dialCode,
    //     phoneNumber: this.mobileNumberForm.value.phoneNumber.number,
    //     countryCodeIso: this.mobileNumberForm.value.phoneNumber.countryCode,
    //     otp: this.isOtpValue,
    //   };
    //   this.SERVER.PATCH_DATA(
    //     this.SERVER.END_POINT.signupOnboardingOtp,
    //     payload,
    //   ).subscribe((res) => {
    //     localStorage.setItem(
    //       "signup-accestoken",
    //       JSON.stringify(res?.data?.accessToken),
    //     );
    //     this.toastr.success("", res.message);
    //     this.getMechantDetails();

    //   });
    // } else {
    //   this.toastr.error("", "Please enter otp");
    // }
  }
  selectWorkType() {
    if (this.selectedAddress === 'HOME') {
      this.addressTypeValue = this.selectedAddress === 'HOME' ? 'HOME' : 'OFFICE';
      this.addressType = this.selectedAddress === 'HOME' ? 1 : 2;
    }

  }

  onEmailVerfyOtp() {
    console.log("OTP entered:", this.isOtpValue.join(''));
    const value = this.isOtpValue2.join('')
    console.log(typeof (value))
    console.log(value.length)
    if (value.length === 4) {
      this.screenStep = 7;
    }
    // if (this.isOtpValue2.length === 4) {
    //   var payload = {
    //     email: this.emailForm.value.email,
    //     otp: this.isOtpValue2,
    //     role: "2",
    //     alreadyHasToken:true
    //   };
    //   this.SERVER.POST_DATA(
    //     this.SERVER.END_POINT.signupOnboardingEmailOtp,
    //     payload,
    //   ).subscribe((res) => {
    //     if(res.status === 200)
    //       {
    //         this.toastr.success("", res.message);
    //         this.screenStep = 7;
    //       }

    //   });
    //   // this.screenStep = 6;
    // } else {
    //   this.toastr.error("", "Please enter otp");
    // }
  }

  submitSetupPasswordForm() {
    if (this.setupPasswordForm.valid) {
      if (
        this.setupPasswordForm.value.password ===
        this.setupPasswordForm.value.confirmPassword
      ) {
        this.screenStep = 4;
        // var payload = {
        //   password: this.setupPasswordForm.value.password,
        // };
        // this.SERVER.PATCH_DATA_WITH_HEADER(
        //   this.SERVER.END_POINT.signupOnboarding,
        //   payload,
        // ).subscribe((res) => {
        //   this.toastr.success("", res.message);
        //   this.screenStep = 4;
        // });
      } else {
        this.toastr.error("", "Confirm password did not match with password");
        return;
      }
    }
  }

  /**
   * This is Merechant Personal Details Start
   */
  submitMerchantInfo(): void {
    if (this.merchantForm.valid) {
      console.log(this.merchantForm.value);
      this.screenStep = 8;

    }
  }
  /**
   * This is Merechant Personal Details End
   */

  handeOtpChange(value: string[]): void {
    // console.log(value);
  }
  // handleFillEvent(value: string): void {
  //   // console.log(value.length);
  //   // this.isOtpValue = value;
  // }
  resendOTP() {
    this.otpInput?.reset();
    this.phoneSubmit();
  }
  resendEmailOTP() {
    this.otpInput2?.reset();
    this.submitEmailForm();
  }

  mobileNumberCustomCss() {
    //   let telInput: HTMLInputElement | null =
    //   document.querySelector('input[type="tel"]');
    // let itiInput: HTMLInputElement | null = document.querySelector(".iti");
    // if (itiInput) {
    //   telInput.style.display = "block !important";
    // }
    // // Check if the element is found before trying to access its properties
    // if (telInput) {
    //   telInput.style.border = "1px solid #6c757d";
    //   telInput.style.height = "42px";
    //   telInput.style.borderRadius = "5px";
    //   telInput.style.width = "100%";
    // }
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


  stopAndRestartTimer() {
    clearInterval(this.timerInterval);
    this.otpTimer = 60;
    this.startTimer();
  }
  preventStartingSpace(event: KeyboardEvent) {
    const inputElement = event.target as HTMLInputElement;
    const currentValue = inputElement.value;

    if (currentValue.length === 0 && event.key === ' ') {
      event.preventDefault();
    }
  }

  formatTimer() {
    const minutes = Math.floor(0);
    const seconds = this.otpTimer % 60;
    return `${this.padZero(minutes)}:${this.padZero(seconds)}`;
  }

  formatTimer2() {
    const minutes = Math.floor(0);
    const seconds = this.otpTimer % 60;
    return `${this.padZero(minutes)}:${this.padZero(seconds)}`;
  }

  padZero(value: number) {
    return value < 10 ? "0" + value : value.toString();
  }


  phoneValidator(control: any) {
    const phoneNumber = control.value;
    if (phoneNumber) {
      // You can add additional validation logic here if needed
      // For example, you might want to check if the phone number is valid based on your requirements
    }
    return null;
  }
  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }
  /**
   * Here It's for the Upload the Document Start
   */
  // onFileSelected(event: Event): void {
  //   const fileInput = event.target as HTMLInputElement;
  //   if (fileInput && fileInput.files && fileInput.files[0]) {
  //     const file = fileInput.files[0];
  //     this.commonService.uploadImage(file, true).subscribe({
  //       next: res => {
  //         if (res.status) {
  //           this.selectedFiles = res.data
  //           console.log(this.selectedFiles);
  //         } else {
  //           console.error('Image upload failed', res.message);
  //         }
  //       },
  //       error: error => {
  //         console.error('Error during image upload:', error);
  //       },
  //     });
  //   }
  // }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        console.log('File preview URL:', reader.result);
        this.selectedFiles.thumbnail = reader.result as string;
        this.documentForm.patchValue({ businessLicenseImage: file });
      };
      reader.readAsDataURL(file);
    }
  }

  onFileSelected2(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        console.log('File preview URL:', reader.result);
        this.selectedFiles2.thumbnail = reader.result as string;
        this.documentForm.patchValue({ taxIdentificationImage: file });
      };
      reader.readAsDataURL(file);
    }
  }
  // onFileSelected2(event: Event): void {
  //   const fileInput2 = event.target as HTMLInputElement;
  //   if (fileInput2 && fileInput2.files && fileInput2.files[0]) {
  //     const file = fileInput2.files[0];
  //     this.commonService.uploadImage(file, true).subscribe({
  //       next: res => {
  //         if (res.status) {
  //           this.selectedFiles2 = res.data
  //           console.log(this.selectedFiles2);
  //         } else {
  //           console.error('Image upload failed', res.message);
  //         }
  //       },
  //       error: error => {
  //         console.error('Error during image upload:', error);
  //       },
  //     });
  //   }
  // }

  removeSelectedFile(): void {
    this.selectedFiles = [];
    this.fileInput.nativeElement.value = '';
  }

  removeSelectedFile2(): void {
    this.selectedFiles2 = [];
    this.fileInput2.nativeElement.value = '';
  }

  fileValidator(control: any) {
    const file = control.value;
    if (file) {
      const allowedExtensions = ["jpg", "jpeg", "png", "gif"]; // Add more allowed extensions if needed
      const extension = file.name.split(".").pop().toLowerCase();
      if (allowedExtensions.indexOf(extension) === -1) {
        return { invalidFileType: true };
      }
    }
    return null;
  }

  /**
   * Here It's for the Upload the Document Start
   */



  submitDocsForm() {
    this.router.navigate(["/"]);

    if (this.documentForm.valid) {
      console.log('Form Submitted:', this.documentForm.value);
    } else {
      this.documentForm.markAllAsTouched();
    }
  }


  onSubmitStandard(): void {
    if (this.bankDetailsForm.valid) {
      console.log(this.bankDetailsForm.value);

      this.screenStep = 10;

    }
  }


  submitEmailForm() {
    if (this.emailForm.valid) {


      var payload = {
        email: this.emailForm.value.email,
      };
      console.log(payload)

      this.emailForOtp = this.emailForm.value.email;
      this.stopAndRestartTimer();
      this.isResendDisabled2 = true;
      this.screenStep = 6;
    }
  }


  submitNameForm() {
    if (this.nameForm.valid) {
      // if (this.stageData?.name?.first && this.stageData?.userName) {
      //   if (
      //     this.stageData?.name?.first === this.nameForm.value.name &&
      //     this.stageData?.userName === this.nameForm.value.userName
      //   ) {
      //     this.screenStep = 5;
      //   }
      // } else {

      var payload = {
        userName: this.nameForm.value.userName,
        name: {
          first: this.nameForm.value.name,
        },
      };
      console.log(payload)
      this.screenStep = 5;
      // this.SERVER.PATCH_DATA_WITH_HEADER(
      //   this.SERVER.END_POINT.signupOnboarding,
      //   payload,
      // ).subscribe((res) => {
      //   this.toastr.success("", res.message);
      //   this.screenStep = 5;
      // });
    }
    // }
  }


  handeOtpChange2(value: string[]): void {
    // console.log(value);
  }


  handleFillEvent2(value: string): void {
    // console.log(value.length);
    // this.isOtpValue2 = value;
  }


  gobackArraw(value: number) {
    // console.log(value)
    if (value > 1 && value !== 3 && value !== 7) {
      this.screenStep = this.screenStep - 1;
    }
    if (value > 1 && value === 3) {
      this.screenStep = this.screenStep - 2;
    }
    if (value > 1 && value === 7) {
      // this.screenStep = this.screenStep - 2;
      this.screenStep = this.screenStep - 2;
    }
  }
  // togglePasswordVisibility(value) {
  //   if (value === 1) {
  //     this.showPassword = !this.showPassword;
  //   } else if (value === 2) {
  //     this.showConfirmPassword = !this.showConfirmPassword;
  //   } else if (value === 3) {
  //     this.showPassword3 = !this.showPassword3;
  //   }
  // }


  submitAddressForm() {
    if (this.addressForm.valid) {
      var payload = {
        address: {
          addressType: this.addressTypeValue,
          addressTypeValue: this.addressType,
          city: this.addressForm.value.city,
          country: this.addressForm.value.state,
          flatNo: this.addressForm.value.flatNumber,
          streetName: this.addressForm.value.streetAddress,
          zipCode: this.addressForm.value.postalCode,
        },
      };
      this.screenStep = 9;
      console.log(payload)
      // if (
      //   this.stageData?.address?.flatNo &&
      //   this.stageData?.address?.streetName &&
      //   this.stageData?.address?.city &&
      //   this.stageData?.address?.country &&
      //   this.stageData?.address?.zipCode
      // ) {
      //   if (
      //     this.stageData?.address?.flatNo ===
      //       this.addressForm.value.flatNumber &&
      //     this.stageData?.address?.streetName ===
      //       this.addressForm.value.streetAddress &&
      //     this.stageData?.address?.city === this.addressForm.value.city &&
      //     this.stageData?.address?.country === this.addressForm.value.state &&
      //     this.stageData?.address?.zipCode === this.addressForm.value.postalCode
      //   ) {
      //     this.screenStep = 9;
      //   }
      // } else {
      //   var payload = {
      //     address: {
      //       addressType: this.addressTypeValue,
      //       addressTypeValue: this.addressType,
      //       city: this.addressForm.value.city,
      //       country: this.addressForm.value.state,
      //       flatNo: this.addressForm.value.flatNumber,
      //       streetName: this.addressForm.value.streetAddress,
      //       zipCode: this.addressForm.value.postalCode,
      //     },
      //   };
      //   this.SERVER.PATCH_DATA_WITH_HEADER(
      //     this.SERVER.END_POINT.signupOnboarding,
      //     payload,
      //   ).subscribe((res) => {
      //     this.toastr.success("", res.message);
      //     this.screenStep = 9;
      //   });
      // }
    }
  }
}
