import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { I18NService } from '@core';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { SettingsService, _HttpClient } from '@delon/theme';
import { environment } from '@env/environment';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CountdownConfig, CountdownEvent } from 'ngx-countdown';
import { GetCodeParams } from 'src/app/models/users';
import { ApiService } from 'src/app/services/api.service';

import { prefixDefault } from '../../profile/phone';

@Component({
  selector: 'passport-register',
  templateUrl: './register-demo.component.html',
  styleUrls: ['./register-demo.component.less']
})
export class UserRegisterDemoComponent implements OnInit {
  config: CountdownConfig = {
    format: `s`,
    leftTime: 30
  };
  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private modal: NzModalService,
    public message: NzMessageService,
    private route: ActivatedRoute,
    private i18nSev: I18NService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService
  ) {
    this.api.getAllCountries().subscribe((res: any) => {
      this.nationality = res.data.map((item: any) => ({
        ...item,
        img: `${environment.api.baseUrl}/app_contents/country_flag/${item.code}.svg`
      }));
    });
  }
  registertextChange?: boolean;
  registerCondition?: boolean;
  langs = this.i18nSev.i18nUrl();
  nationality: any = [];
  referrence_Code: string = '';
  registerForm!: FormGroup;
  loader: boolean = false;
  loading: boolean = false;
  smsloading: boolean = false;
  isReferer = false;
  isError = true;
  countDown = false;
  countSmsDown = false;
  countDownTime = 59; // 这里设置倒计时为60S
  countSmsDownTime = 59; // 这里设置倒计时为60S
  public showButtonText = 'Get Code';
  public showSmsButtonText = 'Get Code';
  passwordPattern = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#!@$%^&*]).{8,}$';
  passwordVisible = false;
  confirmPasswordVisible = false;
  account: any = [];
  phones: any = prefixDefault;
  content = 'Register Successfully Please Complete your profile';
  options = {
    nzDuration: 5000
  };
  data: any = {
    otherdata: 1,
    time: new Date()
  };
  isRead: any = [];
  linkSource: string = '';
  proceedStepNo: any = 0;
  currentStep: any = 1;
  topStep1: boolean= true;
  topStep2: boolean= false;
  topStep3: boolean= false;
  topStep4: boolean= false;
  emailOtp: any = null;
  showOtpError: boolean = false;
  emailValidationStatus: any = null;
  emailValidationMsg: string = 'Please enter valid email id';

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      customer_FirstName: [null, [Validators.required, Validators.pattern('^[\u4E00-\u9FA5a-zA-Z_ ]{1,60}$')]],
      customer_LastName: [null],
      password: [null],
      confirmPassword: [null],
      email: [null, [Validators.required, Validators.email]],
      phone: [null, [Validators.required, this.phoneNumberValidator]],
      phoneNumberPrefix: ['+971'],
      verificationCode: [null],
      verificationPhoneCode: [null],
      customer_Nationality: [null, [Validators.required]],
      usCitizen: [null],
      tpi: [null],
      agree: [false, [Validators.required]],
      Trading_Platform: ['MT4', [Validators.required]]
    });
    this.route.queryParams.subscribe(queryParams => {
      this.referrence_Code = queryParams?.referrence_Code;
      this.isReferer = this.referrence_Code !== undefined && this.referrence_Code !== '' ? true : false;
      if (this.isReferer) {
        this.registerForm.addControl(`refChecked`, new FormControl(true));
        this.registerForm.addControl(`referCode`, new FormControl(this.referrence_Code));
      } else {
        this.registerForm.addControl(`refChecked`, new FormControl(false));
        this.registerForm.addControl(`referCode`, new FormControl(null));
      }
      this.linkSource = queryParams?.src;
    });
  }

  phoneNumberValidator = (control: FormControl): { [s: string]: boolean } => {
    var re =
      /^((?:\+|00)[17](?: |\-)?|(?:\+|00)[1-9]\d{0,2}(?: |\-)?|(?:\+|00)1\-\d{3}(?: |\-)?)?(0\d|\([0-9]{3}\)|[1-9]{0,3})(?:((?: |\-)[0-9]{2}){4}|((?:[0-9]{2}){4})|((?: |\-)[0-9]{3}(?: |\-)[0-9]{4})|([0-9]{7}))$/;
    if (!control.value) {
      return { required: true };
    } else if (control.value.toString().length > 11 || control.value.toString().length < 7) {
      return { pattern: true, error: true };
    }
    return {};
  };

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.registerForm.controls.confirmPassword.updateValueAndValidity());
  }

  submitForm(): void {
    if(this.proceedStepNo == 1) {
      this.isError = this.registerForm.valid;
      for (const i in this.registerForm.controls) {
        if (this.registerForm.controls.hasOwnProperty(i)) {
          this.registerForm.controls[i].markAsDirty();
          this.registerForm.controls[i].updateValueAndValidity();
        }
      }

      this.usCitizenCheck(this.isUsCitizen);

      if (this.registerForm.valid) {
        if (!this.registerForm.value.agree) {
          this.message.error(this.i18nSev.i18n('agree_tc'));
          return;
        }
      }

      if(this.registerForm.valid) {
        // this.currentStep = 3;
        // this.topStep3 = true;
        this.getEmailOtp(false);
      }
    }

    if(this.proceedStepNo == 2) {
      if(this.emailOtp == null) {
        this.showOtpError = true
      } else {
        this.showOtpError = false;
      }
      if(!this.showOtpError) {
        this.verifyOtp()
      }
    }

    if(this.proceedStepNo == 3) {
      this.registerForm.get('password')!.setValidators([Validators.required, Validators.pattern(this.passwordPattern)]);
      this.registerForm.get('password')!.markAsDirty();
      this.registerForm.get('password')!.updateValueAndValidity();
      this.registerForm.get('confirmPassword')!.setValidators([Validators.required, this.confirmationValidator]);
      this.registerForm.get('confirmPassword')!.markAsDirty();
      this.registerForm.get('confirmPassword')!.updateValueAndValidity();

      if(this.registerForm.valid) {
        this.loader = true;
        let formData = {
          customer_FirstName: this.registerForm.value.customer_FirstName,
          customer_LastName: this.registerForm.value.customer_LastName,
          login_Password: this.registerForm.value.password,
          email: this.registerForm.value.email,
          verification_Code: this.emailOtp,
          referrer_ID: this.referrence_Code,
          customer_Nationality: this.registerForm.value.customer_Nationality,
          phoneNumber: `${this.registerForm.value.phoneNumberPrefix} ${this.registerForm.value.phone}`,
          tax_PayerIdentification: `${this.registerForm.value.tpi}`,
          Customer_Type: 'CTINDV_0001_0422',
          user_Type: 'Demo',
          Trading_Platform: this.registerForm.value.Trading_Platform,
          source: this.linkSource ? this.linkSource : ''
        };
        this.api.register(formData).subscribe(
          (res: any) => {
            this.message.success(this.i18nSev.i18n('Your demo account has been registered successfully.'));
            this.currentStep = 4;
            this.topStep4 = true;
            this.tokenService.clear();
            this.tokenService.set({
              token: res.data.token,
              refresToken: res.data.refresh_Token,
              // email: this.loginForm.value.email,
              login_id: res.data.login_ID,
              customer_id: res.data.customer_ID
            });
            localStorage.setItem('tokenGet', res.data.token);
            localStorage.setItem('refresrtokenGet', res.data.refresh_Token);
            const params = {
              token: res.data.token,
              //email: this.loginForm.value.email,
              login_id: res.data.login_ID,
              customer_id: res.data.customer_ID,
              ...res.data
            };
            localStorage.setItem('loginInfo', JSON.stringify(params));
            this.loader = false;
          },
          err => {
            this.loader = false;
            this.message.error(err.body.message);
          }
        );
      }
    }
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.registerForm.controls.password.value) {
      return { confirmPass: true, error: true };
    }
    return {};
  };

  isUsCitizen: boolean = false;
  usCitizenToggle(event: any) {
    if (Number(event)) {
      this.isUsCitizen = true;
    } else {
      this.isUsCitizen = false;
    }
  }

  usCitizenCheck(usCitizen: boolean): void {
    if (usCitizen) {
      this.isUsCitizen = true;
      //  this.registerForm.get('tpi')!.setValidators(Validators.required);
      //  this.registerForm.get('tpi')!.markAsDirty();
    } else {
      this.isUsCitizen = false;
      this.registerForm.get('tpi')!.clearValidators();
      this.registerForm.get('tpi')!.markAsPristine();
    }
    this.registerForm.get('tpi')!.updateValueAndValidity();
  }

  links: any = [];
  getLinks() {
    this.api.getTnCLinks().subscribe((res: any) => {
      this.links = res.data;
    });
  }

  nextStep(val: any) {
    this.proceedStepNo = val;
    if(val == 4) {
      this.router.navigateByUrl(`${this.langs}/dashboard`);
    }
  }

  prevStep(val: any) {
    if(val == 1) {
      this.currentStep = 1;
      this.topStep2 = false;
    }
    if(val == 2) {
      this.emailOtp = null;
      this.currentStep = 2;
      this.topStep3 = false;
    }
  }

  onOtpChange(otp: any) {
    if (otp.length == 6) {
      this.emailOtp = otp;
      this.showOtpError = false;
    }
  }

  getEmailOtp(showMsg: boolean) {
    this.loader = true;
    const formValue = this.registerForm.value;
    if ( formValue.email !== null && formValue.email !== '' ) {
      this.showButtonText = '...';
      this.api.loginGetCode({
        email: formValue.email,
        userName: `${formValue.customer_FirstName}`,
        wL_Number: environment.wL_Number,
        Email_Type: 'RegistrationSendOTP'
      } as GetCodeParams)
        .subscribe( (res: any) => {
            if(res.data) {
              if(showMsg) {
                this.message.success(this.i18nSev.i18n('OTP sent!'));
              }
              this.currentStep = 2;
              this.topStep2 = true;
              this.loader = false;
            }
          },
          error => {
            this.loader = false;
            this.message.error(error?.body?.message);
          }
        );
    }
  }

  verifyOtp() {
    this.loader = true;
    const formValue = this.registerForm.value;
    if ( formValue.email !== null && formValue.email !== '' ) {
      let formData = {
        emailAddress: formValue.email,
        email_OTP: this.emailOtp
      };
      this.api.VerifyEmailCode(formData).subscribe( (res: any) => {
        if(res.data) {
          this.currentStep = 3;
          this.topStep3 = true;
          this.loader = false;
        }
      },
      error => {
        this.loader = false;
        this.message.error(error?.body?.message);
      });
    }
  }

  validateEmail() {
    let regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    let emailAddress = this.registerForm.value.email;
    if(regEx.test(emailAddress)) {
      let formData = {
        email: emailAddress,
      };
      this.api.ValidateUserEmail(formData).subscribe(
        (res: any) => {
          this.emailValidationStatus = 'success';
        },
        error => {
          this.emailValidationStatus = 'error';
          this.emailValidationMsg = 'This email already exists';
        }
      );
    } else {
      this.emailValidationStatus = 'error';
      this.emailValidationMsg = 'Please enter valid email id';
    }
  }

}
