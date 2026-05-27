import {Component, Inject, OnInit, TemplateRef} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { I18NService } from '@core';
import { environment } from '@env/environment';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { GetCodeParams } from 'src/app/models/users';
import { ApiService } from 'src/app/services/api.service';
import {DA_SERVICE_TOKEN, ITokenService} from "@delon/auth";
import {prefixDefault} from "../../profile/phone";
import { CustomValidators } from '../../../shared/custom-validators';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['forgot-password.component.less']
})
export class ForgotPasswordComponent implements OnInit {
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

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null],
      confirmPassword: [null]
    });
  }


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

      if(this.registerForm.valid) {
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
        this.verifyOtp();
        this.registerForm.get('password')!.setValidators( Validators.compose([
          Validators.required,
          // check whether the entered password has a number
          CustomValidators.patternValidator(/\d/, {
            hasNumber: true
          }),
          // check whether the entered password has upper case letter
          CustomValidators.patternValidator(/[A-Z]/, {
            hasCapitalCase: true
          }),
          // check whether the entered password has a lower case letter
          CustomValidators.patternValidator(/[a-z]/, {
            hasSmallCase: true
          }),
          // check whether the entered password has a special character
          CustomValidators.patternValidator(
            /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
            {
              hasSpecialCharacters: true
            }
          ),
          Validators.minLength(8)
        ]));
         this.registerForm.get('password')!.markAsDirty();
         this.registerForm.get('password')!.updateValueAndValidity();
         this.registerForm.get('confirmPassword')!.setValidators([Validators.required, this.confirmationValidator]);
         this.registerForm.get('confirmPassword')!.markAsDirty();
         this.registerForm.get('confirmPassword')!.updateValueAndValidity();
      }
    }

    if(this.proceedStepNo == 3) {
      if(this.registerForm.valid) {
        this.loader = true;
        let formData = {
          email: this.registerForm.value.email,
          verification_Code: this.emailOtp,
          change_Password: this.registerForm.value.password
        };
        this.api.forgetPassword(formData).subscribe(
          (res: any) => {
            this.currentStep = 4;
            this.topStep4 = true;
            this.loader = false;
            /*this.tokenService.clear();
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
            this.message.success(this.content, this.options);
            if (this.registerForm.value.accountType === 'CTJNT_0002_0422') {
              this.router.navigateByUrl(`${this.langs}/profile-joint`);
            } else {
              this.router.navigateByUrl(`${this.langs}/profile`);
            }*/
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

  nextStep(val: any) {
    this.proceedStepNo = val;
    if(val == 4) {
      this.router.navigateByUrl(`${this.langs}/user/login`);
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
        Email_Type: 'ForgetPasswordSendOTP'
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
            this.message.error('The provided email address is not registered. Kindly register before proceeding.');
             this.router.navigateByUrl(`${this.langs}/user/register`);
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
        email_OTP: this.emailOtp,
        email_Type: 'ForgetPasswordSendOTP'
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

}
