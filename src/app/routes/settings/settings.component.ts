import {Component, OnInit, Injector, Inject} from '@angular/core';
import {ApiService} from "../../services/api.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import { NzMessageService } from 'ng-zorro-antd/message';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { Router } from '@angular/router';
import { I18NService } from '@core';
import {environment} from "@env/environment";
import {GetCodeParams} from "../../models/users";
import {retry} from "rxjs/operators";
import {prefixDefault} from "../profile/phone";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.less']
})
export class SettingsComponent implements OnInit {

  constructor(
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private api: ApiService,
    private injector: Injector,
    public message: NzMessageService,
    private fb: FormBuilder,
    private router: Router,
    private i18nSev: I18NService,
  ) { }


  customer_ID: any = this.tokenSrv.get()?.customer_id;
  customerEmail: any = this.tokenSrv.get()?.user_Email;
  passwordForm!: FormGroup;
  verifyEmailForm!: FormGroup;
  changeEmailForm!: FormGroup;
  verifyPhoneForm!: FormGroup;
  changePhoneForm!: FormGroup;
  loader: boolean = false;
  passwordPattern = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#!@$%^&*]).{8,}$';
  passwordVisible1 = false;
  passwordVisible2 = false;
  passwordVisible3 = false;
  changePasswordSuccess!:boolean;
  changeEmailSuccess!:boolean;
  showOtpError: boolean = false;

  otpCode: any = null;
  oldEmail: any = null;
  emailOtpBtnDisable: boolean = false;
  emailVerifyBtnDisable: boolean = false;
  emailStep: any = 1;
  emailTopStep1: boolean= true;
  emailTopStep2: boolean= false;
  emailTopStep3: boolean= false;

  phones: any = prefixDefault;
  customerMobile: any = null;
  phoneVerifyBtnDisable: boolean = false;
  changePhoneSuccess!:boolean;
  mobileStep: any = 1;
  mobileTopStep1: boolean= true;
  mobileTopStep2: boolean= false;
  mobileTopStep3: boolean= false;
  phoneNumber: number | any;
  phoneNumberPrefix: number | any;

  langs = this.i18nSev.i18nUrl();

  ngOnInit(): void {
    this.passwordForm = this.fb.group({
      old_Password: [null, [Validators.required]],
      password: [null, [Validators.required, Validators.pattern(this.passwordPattern)]],
      confirmPassword: [null, [Validators.required, this.confirmationValidator]],
    });

    this.verifyEmailForm = this.fb.group({
      old_Email: [null, [Validators.required, Validators.email]],
    });
    this.changeEmailForm = this.fb.group({
      new_Email: [null, [Validators.required, Validators.email]],
    });

    this.verifyPhoneForm = this.fb.group({
      customer_Mobile: ['', [Validators.required]],
      phoneNumberPrefix: ['+971']
    });
    this.changePhoneForm = this.fb.group({
      customer_Mobile: [null, [Validators.required]],
      phoneNumberPrefix: ['+971']
    });

    this.api.getUserInfo(this.customer_ID).subscribe((res: any) => {
      const phone = res.data.user_Mobile.split(' ');
      this.phoneNumber = Number(phone[1]);
      this.phoneNumberPrefix = phone[0];
      this.verifyPhoneForm.get('phoneNumberPrefix')?.setValue(this.phoneNumberPrefix ? this.phoneNumberPrefix : '+971');
      this.verifyPhoneForm.get('customer_Mobile')?.setValue(this.phoneNumber ? this.phoneNumber : null);
    });

  }

  private get tokenSrv(): ITokenService {
    return this.injector.get(DA_SERVICE_TOKEN);
  }

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.passwordForm.controls.confirmPassword.updateValueAndValidity());
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.passwordForm.controls.password.value) {
      return { confirmPass: true, error: true };
    }
    return {};
  };

  submitFormPassword() {
    if (this.passwordForm.valid) {
      this.loader = true;
      let body = {
        customer_ID: this.customer_ID,
        old_Password: this.passwordForm.value.old_Password,
        new_Password: this.passwordForm.value.password
      };
      this.api.changePassword(body).subscribe(
        (res: any) => {
          this.changePasswordSuccess = true;
          this.loader = false;
        },
        err => {
          this.message.error(err.body.message);
          this.loader = false;
        }
      );
    } else {
      Object.values(this.passwordForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  goToDashboard() {
    this.router.navigate([`${this.langs}/dashboard`]);
  }

  goToLogin() {
    this.router.navigate([`${this.langs}/user/login`]);
  }

  onOtpChange(otp: any) {
    if (otp.length == 6) {
      this.otpCode = otp;
      this.showOtpError = false;
    }
  }

  getExistingEmailOtp(showMsg: boolean = false) {
    this.loader = true;
    if ( this.customerEmail !== null && this.customerEmail !== '' ) {
      this.api.loginGetCode({
        email: this.customerEmail,
        userName: ``,
        wL_Number: environment.wL_Number,
        Email_Type: 'EmailVerifyOTP'
      } as GetCodeParams)
        .subscribe( (res: any) => {
            if(res.data) {
              if(showMsg) {
                this.message.success(this.i18nSev.i18n('OTP sent!'));
              }
              this.emailVerifyBtnDisable = true;
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
  getNewEmailOtp(showMsg: boolean = false) {
    for (const i in this.changeEmailForm.controls) {
      if (this.changeEmailForm.controls.hasOwnProperty(i)) {
        this.changeEmailForm.controls[i].markAsDirty();
        this.changeEmailForm.controls[i].updateValueAndValidity();
      }
    }
    if (this.changeEmailForm.valid) {
      this.loader = true;
      let emailAddress = this.changeEmailForm.value.new_Email;
      if ( emailAddress !== null && emailAddress !== '' ) {
        this.api.loginGetCode({
          email: this.changeEmailForm.value.new_Email,
          userName: ``,
          wL_Number: environment.wL_Number,
          Email_Type: 'EmailChangeSendOTP'
        } as GetCodeParams)
          .subscribe( (res: any) => {
              if(res.data) {
                if(showMsg) {
                  this.message.success(this.i18nSev.i18n('OTP sent!'));
                }
                this.emailVerifyBtnDisable = true;
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
  }

  verifyExistingEmailAddress() {
    for (const i in this.verifyEmailForm.controls) {
      if (this.verifyEmailForm.controls.hasOwnProperty(i)) {
        this.verifyEmailForm.controls[i].markAsDirty();
        this.verifyEmailForm.controls[i].updateValueAndValidity();
      }
    }

    if(this.otpCode == null) {
      this.showOtpError = true
    } else {
      this.showOtpError = false;
    }

    if (this.verifyEmailForm.valid && !this.showOtpError) {
      this.loader = true;
      let body = {
        customer_ID: this.customer_ID,
        emailAddress: this.verifyEmailForm.value.old_Email,
        email_OTP: this.otpCode
      };
      this.api.verifyEmail(body).subscribe(
        (res: any) => {
          this.loader = false;
          this.emailVerifyBtnDisable = false;
          this.otpCode = null;
          this.emailStep = 2;
          this.emailTopStep2 = true;
        },
        err => {
          this.loader = false;
          this.message.error(err?.body?.message);
        }
      );
    }
  }
  changeExistingEmailAddress() {
    for (const i in this.changeEmailForm.controls) {
      if (this.changeEmailForm.controls.hasOwnProperty(i)) {
        this.changeEmailForm.controls[i].markAsDirty();
        this.changeEmailForm.controls[i].updateValueAndValidity();
      }
    }
    if(this.otpCode == null) {
      this.showOtpError = true
    } else {
      this.showOtpError = false;
    }

    if (this.changeEmailForm.valid && !this.showOtpError) {
      this.loader = true;
      let body = {
        customer_ID: this.customer_ID,
        new_Email: this.changeEmailForm.value.new_Email,
        email_OTP: this.otpCode
      };
      this.api.changeEmail(body).subscribe(
        (res: any) => {
          this.loader = false;
          this.changeEmailSuccess = true;
          this.emailTopStep3 = true;
          /*setTimeout(() => {
            this.api.getUserInfo(this.customer_ID).subscribe((res: any) => {
              this.tokenService.set({
                ...this.tokenSrv.get(),
                token: this.tokenSrv.get()?.token,
                email: res.data.user_Email,
                ...res.data
              });
              this.customerEmail = res.data.user_Email;
            });
          }, 200);*/
        },
        err => {
          this.loader = false;
          this.message.error(err?.body?.message);
        }
      );
    }
  }

  getExistingPhoneOtp(showMsg: boolean = false) {
    this.loader = true;
    const formValue = this.verifyPhoneForm.value;
    if ( formValue.customer_Mobile ) {
      this.api.getSMSTokenCode({
        customer_Mobile: `${this.verifyPhoneForm.value.phoneNumberPrefix} ${this.verifyPhoneForm.value.customer_Mobile}`,
        smS_Type: 'VerifyPhoneNumber',
        customer_ID: this.customer_ID
      })
      .subscribe((res: any) => {
          if (res.data) {
            if (showMsg) {
              this.message.success(this.i18nSev.i18n('OTP sent!'));
            }
            this.phoneVerifyBtnDisable = true;
            this.loader = false;
          }
        },
        error => {
          this.loader = false;
          this.message.error(error?.body?.message);
        }
      );
    } else {
      this.loader = false;
      this.verifyPhoneForm.get('customer_Mobile')?.markAsDirty();
      this.verifyPhoneForm.get('customer_Mobile')?.updateValueAndValidity({ onlySelf: true });
    }
  }
  getNewPhoneOtp(showMsg: boolean = false) {
    for (const i in this.changePhoneForm.controls) {
      if (this.changePhoneForm.controls.hasOwnProperty(i)) {
        this.changePhoneForm.controls[i].markAsDirty();
        this.changePhoneForm.controls[i].updateValueAndValidity();
      }
    }
    if (this.changePhoneForm.valid) {
      this.loader = true;
      let emailAddress = this.changePhoneForm.value.new_Email;
      if ( emailAddress !== null && emailAddress !== '' ) {
        this.api.getSMSTokenCode({
          customer_Mobile: `${this.changePhoneForm.value.phoneNumberPrefix} ${this.changePhoneForm.value.customer_Mobile}`,
          smS_Type: 'ChangePhoneNumber',
          customer_ID: this.customer_ID
        })
        .subscribe( (res: any) => {
            if(res.data) {
              if(showMsg) {
                this.message.success(this.i18nSev.i18n('OTP sent!'));
              }
              this.phoneVerifyBtnDisable = true;
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
  }

  verifyExistingPhoneNumber() {
    for (const i in this.verifyPhoneForm.controls) {
      if (this.verifyPhoneForm.controls.hasOwnProperty(i)) {
        this.verifyPhoneForm.controls[i].markAsDirty();
        this.verifyPhoneForm.controls[i].updateValueAndValidity();
      }
    }

    if(this.otpCode == null) {
      this.showOtpError = true
    } else {
      this.showOtpError = false;
    }

    if (this.verifyPhoneForm.valid && !this.showOtpError) {
      this.loader = true;
      let body = {
        customer_ID: this.customer_ID,
        phone: `${this.verifyPhoneForm.value.phoneNumberPrefix} ${this.verifyPhoneForm.value.customer_Mobile}`,
        code: this.otpCode
      };
      this.api.verifyPhoneNumber(body).subscribe(
        (res: any) => {
          this.loader = false;
          this.phoneVerifyBtnDisable = false;
          this.otpCode = null;
          this.mobileStep = 2;
          this.mobileTopStep2 = true;
        },
        err => {
          this.loader = false;
          this.message.error(err?.body?.message);
        }
      );
    }
  }
  changeExistingPhoneNumber() {
    for (const i in this.changePhoneForm.controls) {
      if (this.changePhoneForm.controls.hasOwnProperty(i)) {
        this.changePhoneForm.controls[i].markAsDirty();
        this.changePhoneForm.controls[i].updateValueAndValidity();
      }
    }
    if(this.otpCode == null) {
      this.showOtpError = true
    } else {
      this.showOtpError = false;
    }

    if (this.changePhoneForm.valid && !this.showOtpError) {
      this.loader = true;
      let body = {
        customer_ID: this.customer_ID,
        code: this.otpCode,
        smS_Type: 'ChangePhoneNumber'
      };
      this.api.changePhoneNumber(body).subscribe(
        (res: any) => {
          this.loader = false;
          this.changePhoneSuccess = true;
          this.mobileTopStep3 = true;
          this.otpCode = null;
        },
        err => {
          this.loader = false;
          this.message.error(err?.body?.message);
        }
      );
    }
  }


}
