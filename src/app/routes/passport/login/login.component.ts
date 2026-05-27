import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { I18NService, StartupService } from '@core';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { SettingsService } from '@delon/theme';
import { error } from 'ajv/dist/vocabularies/applicator/dependencies';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ApiService } from 'src/app/services/api.service';
import * as CryptoJS from 'crypto-js';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class UserLoginComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private modal: NzModalService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private startupSrv: StartupService,
    public message: NzMessageService,
    private i18nSev: I18NService,
    private settings: SettingsService,
    private route: ActivatedRoute,
  ) {
    // if(localStorage.getItem('rememberMe')){
    //   const eText = localStorage.getItem('rememberMe') || '';
    //   const decryptedWord = CryptoJS.AES.decrypt(eText, 'data_key');
    //   this.Formdata = JSON.parse(decryptedWord.toString(CryptoJS.enc.Utf8))
    //    if(this.Formdata?.rememberMe === true) {
    //       this.Formdata = {
    //          userEmail: this.Formdata?.email,
    //          login_Password: this.Formdata?.password,
    //          rememberMe: this.Formdata?.rememberMe
    //        }
    //    }
    // }
   
    this.cookiesInfo = JSON.parse(localStorage.getItem("rememberMe")!);
     if(this.cookiesInfo?.rememberMe === true)
     this.Formdata = {
       email: this.cookiesInfo?.email,
       login_Password: this.cookiesInfo?.password,
       rememberMe: this.cookiesInfo?.rememberMe
     }
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
    if (localStorage.getItem("eventModal") === null) {
      this.isVisible = false // when to add new launch change to true
    } else {
      this.isVisible = false
    };
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      login_Password: [null, [Validators.required]],
      rememberMe: [false]
    });
    this.route.queryParams.subscribe((queryParams) => {
      console.log(queryParams)
    });
  }
  loginId:any
  customerId:any
  submitForm(): void {
    for (const i in this.loginForm.controls) {
      if (this.loginForm.controls.hasOwnProperty(i)) {
        this.loginForm.controls[i].markAsDirty();
        this.loginForm.controls[i].updateValueAndValidity();
      }

    }

    if (this.loginForm.valid) {
      this.loader = true;
      this.api.login(this.loginForm.value).subscribe(
        (res: any) => {
          if(res?.data?.is_EmailNotverified) {
            this.loginId = res?.data?.login_ID
            this.customerId = res?.data?.customer_ID
            this.currentStep = 2
            this.loader = false
          } 
          else if (res?.data?.forceToForgotPassword) {
            this.loader = false;
            this.message.error(this.i18nSev.i18n('Due to security reason you are kindly requested to reset the password'));
            this.router.navigateByUrl(`${this.langs}/user/forgot-password`);
          }
          else {
            this.tokenService.clear();
            this.tokenService.set({
              token: res.data.token,
              refresToken:res.data.refresh_Token,
              email: this.loginForm.value.email,
              login_id: res.data.login_ID,
              customer_id: res.data.customer_ID
            });
            localStorage.setItem('tokenGet', res.data.token);
            localStorage.setItem('refresrtokenGet', res.data.refresh_Token);
            const params = {
              token: res.data.token,
              email: this.loginForm.value.email,
              login_id: res.data.login_ID,
              customer_id: res.data.customer_ID,
              ...res.data
            };
            // cookies service set
            const cookiesService = {
              email: this.loginForm.value.email,
              password: this.loginForm.value.login_Password,
              rememberMe: this.loginForm.value.rememberMe
            }
         //   const ecntyptedData = CryptoJS.AES.encrypt(JSON.stringify(cookiesService), 'data_key').toString();
            localStorage.setItem('rememberMe',  JSON.stringify(cookiesService));
            localStorage.setItem('loginInfo', JSON.stringify(params));
            if (!res.data.is_GoogleAuthentication) {
              this.api.getUserInfo(res.data.customer_ID).subscribe((res: any) => {
                this.message.success(this.i18nSev.i18n('login success'));
                localStorage.setItem('loginInfo', JSON.stringify({ ...params, ...res.data }));
                 // sunsub token generate after user login
                //  this.getSumSubToken();
                // if (res.data.afterLogin_Popup === 101 ) {
                //   this.router.navigateByUrl(`${this.langs}/dashboard`);
                // }
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
          }
         
        },
        error => {
          this.loader = false;
          this.message.error(error?.body?.message);
        }
      );
    }
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


  // getSumSubToken() {
  //   this.api.getSumSubAccessToken().subscribe((res:any)=> {
  //     localStorage.setItem('sumSubToken', res?.accessToken)
  //   })
  // }
}


