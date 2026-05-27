import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ActivatedRoute, Router } from '@angular/router';
import { I18NService, StartupService } from '@core';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { SettingsService } from '@delon/theme';
import { error } from 'ajv/dist/vocabularies/applicator/dependencies';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ApiService } from 'src/app/services/api.service';
import * as CryptoJS from 'crypto-js';
@Component({
  selector: 'app-unipath',
  templateUrl: './uniauth.component.html',
  styleUrls: ['./uniauth.component.less']
})
export class UniPathComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private modal: NzModalService,
    private route: ActivatedRoute,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private startupSrv: StartupService,
    public message: NzMessageService,
    private i18nSev: I18NService,
    private settings: SettingsService
  ) {
   
   }
   emailOtp: any = null;
   showOtpError: boolean = false;
  isVisible:boolean = false   // when to add new launch change to true
  langs = this.i18nSev.i18nUrl();
  loginForm!: FormGroup;
  loader: boolean = false;
  verifyLoader:boolean = false
  passwordVisible = false;
  public Formdata:any = {};
  cookiesInfo: any;
  currentStep: any = 1;
  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams) => {
      console.log(queryParams)
      const data = queryParams
      this.submitForm(data)
    });
  }
  loginId:any
  customerId:any
 
  submitForm(queryValue:any) {
    this.api.uniAuth(queryValue).subscribe(
      (res: any) => {
        let data = res.data
        if(res?.data?.login_Result) {
          this.tokenService.clear();
          this.tokenService.set({
            token: data?.login_Data?.token,
            refresToken:data?.login_Data?.refresh_Token,
            login_id: data?.login_Data?.login_ID,
            customer_id: data?.login_Data?.customer_ID
          });
          localStorage.setItem('tokenGet', data?.login_Data?.token);
          localStorage.setItem('refresrtokenGet', data?.login_Data?.refresh_Token);
          const params = {
            token: data?.login_Data?.token,
            login_id: data?.login_Data?.login_ID,
            customer_id: data?.login_Data?.customer_ID,
            ...res.data
          };
          localStorage.setItem('loginInfo', JSON.stringify(params));
          if (!data?.login_Data?.is_GoogleAuthentication) {
            this.api.getUserInfo(res.data.customer_ID).subscribe((res: any) => {
              this.message.success(this.i18nSev.i18n('login success'));
              localStorage.setItem('loginInfo', JSON.stringify({ ...params, ...res.data }));
              if (res.data.customer_Status == 'Verified' || res.data.customer_Status == 'Funded' || res.data.customer_Status == 'Active') {
                this.router.navigateByUrl(`${this.langs}/dashboard`);
              } else {
                this.startupSrv.load().subscribe(() => {
                  this.router.navigateByUrl(`${this.langs}/profile`);
                });
              }
            });
          } else {
            this.loader = false;
            this.router.navigateByUrl(`${this.langs}/user/email`);
          }
        } else {
            window.open(`${data.redirectUrl}?sign=${data?.login_Data?.sign}&ts=${data?.login_Data?.ts}&uid=${data?.login_Data?.uid}&code=${data?.login_Data?.code}`, '_self');
        } 
        },
      error => {
        this.loader = false;
        this.message.error(error?.body?.message);
      }
    );
  }

  handleCancel():void {
    this.isVisible = false
    localStorage.setItem('eventModal', 'true')
  }

  liveAccount() {
    localStorage.setItem('eventModal', 'true')
    this.isVisible = false
    this.router.navigate([`${this.langs}/user/register-list`])
  }


  downloadTrader() {
    localStorage.setItem('eventModal', 'true')
    this.isVisible = false
    window.open('#', '_blank');
  }

  verifyEmail() {
    if(this.emailOtp == null) {
      this.showOtpError = true
    } else {
      this.showOtpError = false;
    }
    if(!this.showOtpError) {
      this.verifyOtp()
    }
  }

  verifyOtp() {
    this.verifyLoader = true
    let formData = {
      login_ID: this.loginId,
      customer_ID:this.customerId,
      otp: this.emailOtp
    };
    this.api.VerifyRegisteredCustomerOTP(formData).subscribe( (res: any) => {
      if(res.data) {
        this.message.success(this.i18nSev.i18n('You have verified your email successfully'));
        this.router.navigateByUrl(`${this.langs}/profile`);
        this.verifyLoader = false;
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
          login_id: res.data.login_ID,
          customer_id: res.data.customer_ID,
          ...res.data
        };
        localStorage.setItem('loginInfo', JSON.stringify(params));
      }
    },
    error => {
      this.verifyLoader = false;
      this.message.error(error?.body?.message);
    });
  }

  onOtpChange(otp: any) {
    if (otp.length == 6) {
      this.emailOtp = otp;
      this.showOtpError = false;
    }
  }

  resendOtp() {
    this.api.ResendEmailVerificationOTP(this.loginId).subscribe((res:any)=> {
      this.message.success(this.i18nSev.i18n('OTP sent!'));
      this.emailOtp = ''
    },
    error => {
      this.message.error(error?.body?.message);
    }
    )
  }

}


