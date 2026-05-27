import { Component, Inject, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { environment } from '@env/environment';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ClipboardService } from 'ngx-clipboard';
import { GetCodeParams } from 'src/app/models/users';
import { ApiService } from 'src/app/services/api.service';

import { prefixDefault } from '../../profile/phone';

@Component({
  selector: 'app-setting-modal',
  templateUrl: './setting-modal.component.html',
  styleUrls: ['./setting-modal.component.less']
})
export class SettingModalComponent implements OnInit {
  switchValue = false;
  isVisible = false;
  checked = true;
  loader: boolean = false;
  loading: boolean = false;
  changeLoading: boolean = false;
  changeEmail!: FormGroup;
  changePhone!: FormGroup;
  changePassword!: FormGroup;
  public customer_ID: any = this.tokenSrv.get()?.customer_id;
  countDown = false;
  countDownTime = 59; // 这里设置倒计时为60S
  public showButtonText = 'Get Code';
  interval: any;
  status: boolean | undefined;
  passwordVisible1 = false;
  passwordVisible2 = false;
  passwordVisible3 = false;
  password1?: string;
  password2?: string;
  password3?: string;
  proIndex: number = 0;
  phones: any = prefixDefault;
  passwordPattern = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#!@$%^&*]).{8,}$';
  email: string = this.tokenSrv.get()?.user_Email;
  constructor(
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private fb: FormBuilder,
    private injector: Injector,
    private common: ApiService,
    private message: NzMessageService,
    private clipboardService: ClipboardService
  ) {}

  ngOnInit(): void {
    this.changeEmail = this.fb.group({
      email_OTP: ['', [Validators.required]],
      new_Email: [null, [Validators.required, Validators.email]]
    });

    this.changePhone = this.fb.group({
      code: ['', [Validators.required]],
      customer_Mobile: [null, [Validators.required]],
      phoneNumberPrefix: ['+971']
    });

    this.common.getUserInfo(this.tokenSrv.get()?.customer_id).subscribe((res: any) => {
      this.email = res.data.user_Email;
    });

    this.changePassword = this.fb.group({
      old_Password: [null, [Validators.required]],
      password: [null, [Validators.required, Validators.pattern(this.passwordPattern)]],
      new_Password: [null, [Validators.required, this.confirmationValidator]]
    });
  //  this.getTwoFactorStatus();
    this.getDownloadLinks();
  }

  private get tokenSrv(): ITokenService {
    return this.injector.get(DA_SERVICE_TOKEN);
  }

  onIndex(index: number) {
    this.proIndex = index;
  }
  submitForm(): void {
    for (const i in this.changeEmail.controls) {
      if (this.changeEmail.controls.hasOwnProperty(i)) {
        this.changeEmail.controls[i].markAsDirty();
        this.changeEmail.controls[i].updateValueAndValidity();
      }
    }
    if (this.changeEmail.valid) {
      this.changeLoading = true;
      let body = {
        customer_ID: this.customer_ID,
        new_Email: this.changeEmail.value.new_Email,
        email_OTP: this.changeEmail.value.email_OTP
      };
      this.common.changeEmail(body).subscribe(
        (res: any) => {
          this.changeLoading = false;
          this.message.success('success');
          //code...
          this.common.getUserInfo(this.customer_ID).subscribe((res: any) => {
            this.email = res.data.user_Email;
            this.tokenService.set({
              ...this.tokenSrv.get(),
              token: this.tokenSrv.get()?.token,
              email: res.data.user_Email,
              ...res.data
            });
          });
        },
        err => {
          this.changeLoading = false;
          this.message.error(err?.body?.message);
        }
      );
    }
  }

  // change password
  changeSubmitPassword() {
    if (this.changePassword.valid) {
      this.loading = true;
      let body = {
        customer_ID: this.customer_ID,
        old_Password: this.changePassword.value.old_Password,
        new_Password: this.changePassword.value.new_Password
      };
      this.common.changePassword(body).subscribe(
        (res: any) => {
          this.message.success(res.message);
          this.loading = false;
          this.changePassword.reset();
        },
        err => {
          this.message.error(err.body.message);
          this.loading = false;
        }
      );
    } else {
      Object.values(this.changePassword.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  tabs: number = 0;
  showModal(tabs: number = 0) {
    this.tabs = tabs;
    this.isVisible = true;
    this.getCodeImages();
    this.checkGoogle();
    this.googleState = false;
  }
  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
    // this.changeEmail.reset();
    // this.changePassword.reset();
    // this.changePhone.reset();
  }
  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.changePassword.controls.new_Password.updateValueAndValidity());
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.changePassword.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };
  isSend: boolean = false;
  onGetCode() {
    this.isSend = false;
    const formValue = this.changeEmail.value;
    if (formValue.new_Email) {
      this.common
        .loginGetCode({
          email: this.changeEmail.value.new_Email,
          userName: this.changeEmail.value.new_Email,
          wL_Number: environment.wL_Number,
          Email_Type: 'EmailChangeSendOTP',
          customer_ID: this.customer_ID
        } as GetCodeParams)
        .subscribe(
          res => {
            this.sendMessage();
            this.isSend = true;
            this.loader = false;
            this.message.success('send success');
          },
          error => {
            this.loader = false;
            this.isSend = false;
          }
        );
    } else {
      this.changeEmail.get('new_Email')?.markAsDirty();
      this.changeEmail.get('new_Email')?.updateValueAndValidity({ onlySelf: true });
    }
  }

  sendMessage() {
    // 发送了短信验证码后触发本方法，开始倒计时
    this.countDown = true; // 发送验证码后一分钟内，按钮变成不可点击状态
    this.showButtonText = `（${59}s）`; // 验证码发送后的初始状态
    this.interval = setInterval(() => {
      if (this.countDownTime >= 0) {
        this.showButtonText = `(${this.countDownTime--}s)`; // 动态的进行倒计时
      } else {
        clearInterval(this.interval); // 如果超时则重新发送
        this.showButtonText = 'Get Code';
        this.countDown = false; // 按钮再次变成可点击状态
        this.countDownTime = 60;
      }
    }, 1000);
  }

  // get status
  getTwoFactorStatus() {
    this.common.getFactorStatus(this.customer_ID).subscribe(
      (res: any): void => {
        this.status = res.data.is_MultiFactorAuthentication;
      },
      error => {
        this.loading = false;
        this.message.error(error?.body?.message);
      }
    );
  }

  // change status here

  changeStatus() {
    this.loading = true;
    const params = {
      is_MultiFactorAuthentication: this.status
    };
    this.common.updateFactorStatus(this.customer_ID, params).subscribe(res => {
      this.message.success('Two Factor Authentication update success');
      this.loading = false;
    });
  }

  qrCode: string = '';
  qrImg: string = '';
  getCodeImages() {
    this.common.getGoogleAuthenticationCodes(this.customer_ID).subscribe((res: any) => {
      this.qrCode = res.data.manualCode;
      this.qrImg = res.data.qrCode;
    });
  }
  googleState: boolean = false;
  googleLoading: boolean = false;

  googleAuthCode: string = '';
  googleSwitchValue: boolean = true;
  onSettingGoogleAuth() {
    if (!this.googleAuthCode) {
      this.message.error('pls code');
      return;
    }
    this.googleLoading = true;
    this.common
      .setGoogleAuthentication({
        customer_ID: this.customer_ID,
        googleAuthCode: this.googleAuthCode,
        is_GoogleAuthentication: this.googleSwitchValue
      })
      .subscribe(
        res => {
          this.checkGoogle();
          this.googleLoading = false;
          this.googleAuthCode = '';
          this.message.success('success');
        },
        error => {
          this.googleLoading = false;
          this.message.error(error.body.message);
        }
      );
  }

  checkGoogle() {
    this.common.checkGoogleAuth(this.customer_ID).subscribe((res: any) => {
      this.googleSwitchValue = res.data?.is_GoogleAuthentication;
    });
  }

  copyContent() {
    this.clipboardService.copyFromContent(this.qrCode);
    this.message.success('copied');
  }

  android: string = '';
  ios: string = '';
  web: string = '';
  windows: string = '';
  getDownloadLinks() {
    this.common.getDownloadLinks().subscribe((res: any) => {
      res.data?.map((r: any) => {
        if (r.platform === 'Android') {
          this.android = r.downloadLink;
        }
        if (r.platform === 'IoS') {
          this.ios = r.downloadLink;
        }
        if (r.platform === 'Windows') {
          this.windows = r.downloadLink;
        }
        if (r.platform === 'Web') {
          this.web = r.downloadLink;
        }
      });
    });
  }

  openLink(url: string) {
    window.open(url);
  }

  openTrading() {
    window.open('https://investor.tradingcentral.com/learn/tc-metatrader-tools/installation-instructions-en', '_blank');
  }

  isSmsSend: boolean = false;
  onGetSMSCode() {
    const formValue = this.changePhone.value;
    if (formValue.customer_Mobile) {
      this.isSmsSend = true;
      this.common
        .getSMSCode({
          customer_Mobile: `${this.changePhone.value.phoneNumberPrefix} ${this.changePhone.value.customer_Mobile}`,
          smS_Type: 'ChangePhoneNumber',
          customer_ID: this.customer_ID
        })
        .subscribe(
          res => {
            this.sendMessage();
            this.isSmsSend = false;
            this.loader = false;
            this.message.success('send success');
          },
          error => {
            this.isSmsSend = false;
            this.message.error(error?.body?.message);
          }
        );
    } else {
      this.changePhone.get('customer_Mobile')?.markAsDirty();
      this.changePhone.get('customer_Mobile')?.updateValueAndValidity({ onlySelf: true });
    }
  }

  changeSmsLoading = false;
  submitSmsForm(): void {
    for (const i in this.changePhone.controls) {
      if (this.changePhone.controls.hasOwnProperty(i)) {
        this.changePhone.controls[i].markAsDirty();
        this.changePhone.controls[i].updateValueAndValidity();
      }
    }
    if (this.changePhone.valid) {
      this.changeSmsLoading = true;
      let body = {
        customer_ID: this.customer_ID,
        code: this.changePhone.value.code,
        smS_Type: 'ChangePhoneNumber'
      };
      this.common.changePhoneNumber(body).subscribe(
        (res: any) => {
          this.changeSmsLoading = false;
          this.message.success('success');
          this.changePhone.reset();
        },
        err => {
          this.changeSmsLoading = false;
          this.message.error(err?.body?.message);
        }
      );
    }
  }
}
