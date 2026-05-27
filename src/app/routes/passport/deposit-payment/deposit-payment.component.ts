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
import { HttpHeaders } from '@angular/common/http';
declare var $:any

@Component({
  selector: 'app-deposit-payment',
  templateUrl: './deposit-payment.component.html',
  styleUrls: ['./deposit-payment.component.less']
})
export class DepositPaymentComponent implements OnInit {
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
  langs = this.i18nSev.i18nUrl();
  loader: boolean = false;
  private FormData:any;
  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams) => {
      console.log(queryParams)
      const data = queryParams
      this.submitForm(data)
      sessionStorage.setItem('merchant_token', queryParams?.merchant_token)
      sessionStorage.setItem('merchant_secret', queryParams?.merchant_secret)
    });

    // this.route.queryParamMap.subscribe((queryParams) => { 
    //   console.log(queryParams)
    //   const data = queryParams
    //   this.FormData = queryParams.get('form');
    //   console.log(this.FormData);
    //   setTimeout(()=> {
    //     this.submitForm(this.FormData)
    //   },500)

    //   setTimeout(()=> {
    //   console.log('merch', this.getFormData('#depositform'));
    //    this.getQueryString(); 
    //   },1000)
    // });
  }
  loginId:any
  customerId:any
  submitForm(queryValue:any) {
    this.api.merchantUserAuth({...queryValue, transaction_type: 'deposit', medium: 'form-post'},).subscribe(
      (res: any) => {
        let data = res?.data?.data
        sessionStorage.setItem('wallet', res?.data?.virtualWalletCode)
        if(res?.data?.isSuccess) {
          this.tokenService.clear();
          this.tokenService.set({
            token: data.token,
            refresToken:data.refresh_Token,
            login_id: data.login_ID,
            customer_id: data.customer_ID
          });
          localStorage.setItem('tokenGet', data?.token);
          localStorage.setItem('refresrtokenGet', data?.refresh_Token);
          const params = {
            token: data?.token,
            login_id: data?.login_ID,
            customer_id: data?.customer_ID,
            ...res.data
          };
          localStorage.setItem('loginInfo', JSON.stringify(params));
          if (!data?.is_GoogleAuthentication) {
            this.api.getUserInfo(res?.data?.data?.customer_ID).subscribe((res: any) => {
              localStorage.setItem('loginInfo', JSON.stringify({ ...params, ...res.data }));
              this.router.navigateByUrl(`${this.langs}/payment/deposit-method`);
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


//   getQueryString() {
//     var str = $( "form").serialize();
//     console.log('test', str);
//   }


//  getFormData(dom_query: any){
//     var out = {};
//     var s_data = $(dom_query).serializeArray();
//     //transform into simple data/value object
//     for(var i = 0; i<s_data.length; i++){
//         var record = s_data[i];
//         out[record.name] = record.value;
//     }
//     return out;
// }


}

