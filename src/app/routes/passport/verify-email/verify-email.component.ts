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


@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['verify-email.component.less']
})
export class VerifyEmailComponent implements OnInit {
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

  }
  verifyEmail:boolean = true
  registertextChange?: boolean;
  registerCondition?: boolean;
  langs = this.i18nSev.i18nUrl();
  nationality: any = [];
  referrence_Code: string = '';
  registerForm!: FormGroup;
  loader: boolean = false;
  setloader:boolean = false
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
  disableInput:boolean = true
  firstScreen = true; 
  loginForm!: FormGroup;
  token : any = ''; 
  tokenGlobal:any
  successMsg:boolean = false
  reSendEmail:boolean = false
  ngOnInit(): void {
    const url = window.location.href;
    // if (url.includes('?')) {
    //   this.route.queryParamMap.subscribe((res:any)=> {
    //     console.log(res?.params?.tkn)
    //     const token = res?.params?.tkn
    //     let body = {
    //       token: token
    //     }
    //     this.api.emailVerify(body).subscribe((res:any)=> {
    //       this.message.success(res.message)
    //     },
    //     error => {
    //       this.message.error(error?.body?.message);
    //     }
    //     )
    //   })
    
    // } 
    

    const token = this.gup('tkn',window.location.href)
    console.log(token)
    // const tkn = decodeURIComponent(JSON.stringify(token))
    // const decode = JSON.parse(tkn)
    // const res = decode.split('%20').join('+');;
    // this.tokenGlobal = JSON.parse(tkn)
    this.tokenGlobal = token

    if(token){
      let body = {
         token: this.tokenGlobal
        }
      this.api.emailVerify(body).subscribe((res:any)=> {
        const data  = res?.data?.authResponse
        if(res?.data?.is_NewLink_Required === false) {
          this.successMsg = true
          this.message.success(this.i18nSev.i18n('You have verified your email successfully'));
          setTimeout(()=> {
            this.verifyEmail = false
            this.router.navigateByUrl(`${this.langs}/profile`);
            this.tokenService.clear();
            this.tokenService.set({
              token: data.token,
              refresToken: data.refresh_Token,
              // email: this.loginForm.value.email,
              login_id: data.login_ID,
              customer_id: data.customer_ID
            });
            localStorage.setItem('tokenGet', data.token);
            localStorage.setItem('refresrtokenGet', data.refresh_Token);
            const params = {
              token: data.token,
              login_id: data.login_ID,
              customer_id: data.customer_ID,
              ...data
            };
            localStorage.setItem('loginInfo', JSON.stringify(params));
          },300)
         
        } else if (res?.data?.is_NewLink_Required === true) {
          this.reSendEmail = true
          this.verifyEmail = false
        }
      },
      error => {
        this.message.error(error?.body?.message);
        this.verifyEmail = false
      }
      )
    }else{
     this.message.error("Invalid Link");  
     this.router.navigateByUrl(`${this.langs}/user/login`);
    }

    
  }

  public gup( name:any, url :any) {
    if (!url) url = location.href;
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( url );
    return results == null ? null : results[1];
}

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.registerForm.controls.confirmPassword.updateValueAndValidity());
  }


  gotoLogin() {
    this.router.navigateByUrl(`${this.langs}/user/login`);
  }

  generateLink() {
    this.loader = true
    let body = {
      token: this.tokenGlobal
     }
    this.api.resendEmailVerify(body).subscribe((res:any)=> {
      this.loader = false
      this.message.success(this.i18nSev.i18n('A verification link has been sent to your email account'))
    },
    error => {
      this.loader = false
      this.message.error(error?.body?.message);
    }
    )
  }
}
