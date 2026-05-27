import { Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { I18NService } from '@core';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { NzI18nService } from 'ng-zorro-antd/i18n';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiService } from 'src/app/services/api.service';
@Component({
  selector: 'app-account-open',
  templateUrl: './account-open.component.html',
  styleUrls: ['./account-open.component.less']
})
export class AccountOpenComponent implements OnInit {
  formOpenAccount!: FormGroup;
  loader: boolean = false;
  public loginID: any = this.tokenSrv.get()?.customer_id;
  currencies: any = [];
  businessTYpe: any = [];
  userInfo: any;
  isDemo: boolean = false;

  constructor(
    private injector: Injector,
    private fb: FormBuilder,
    private router: Router,
    private common: ApiService,
    private message: NzMessageService,
    private i18nSev: I18NService
  ) {
    this.userInfo = JSON.parse(localStorage.getItem('loginInfo')!);
  }

  langs = this.i18nSev.i18nUrl();
  ngOnInit(): void {
    this.formOpenAccount = this.fb.group({
      Trading_Platform: ['', [Validators.required]],
      account_Type: ['', [Validators.required]],
      currency: [null, [Validators.required]],
      account_Leverage: [null, [Validators.required]],
      init_Balance: [null]
    });

    this.common.getAllCurrencies().subscribe((res: any) => {
      if (this.userInfo.user_Type === 'Customer') {
        this.currencies = res.data;
      } else {
        this.currencies = res.data.filter((item: any) => item.code === 'USD');
      }
    });

    this.common.getBusinessType().subscribe((res: any) => {
      this.businessTYpe = res.data;
      if (res.data[0].id == 'Demo') {
        this.isDemo = true;
        this.formOpenAccount.get('init_Balance')!.setValidators(Validators.required);
      }
    });
  }

  private get tokenSrv(): ITokenService {
    return this.injector.get(DA_SERVICE_TOKEN);
  }

  cancel() {
    this.router.navigateByUrl(`${this.langs}/account-list`);
  }

  submitForm(): void {
    for (const i in this.formOpenAccount.controls) {
      if (this.formOpenAccount.controls.hasOwnProperty(i)) {
        this.formOpenAccount.controls[i].markAsDirty();
        this.formOpenAccount.controls[i].updateValueAndValidity();
      }
    }
    if (this.formOpenAccount.valid) {
      this.loader = true;
      let body = {
        customer_ID: this.loginID,
        Trading_Platform: this.formOpenAccount.value.Trading_Platform,
        account_Type: this.formOpenAccount.value.account_Type,
        currency: this.formOpenAccount.value.currency,
        account_Leverage: this.formOpenAccount.value.account_Leverage,
        init_Balance: this.isDemo ? this.formOpenAccount.value.init_Balance : 0
      };

      if (this.userInfo?.user_Type === 'Customer') {
        this.common.addAccount(body).subscribe(
          (res: any) => {
            this.message.success(res.body.message);
            this.loader = false;
            this.router.navigate([`${this.langs}/account-list`]);
          },
          error => {
            this.loader = false;
            this.message.error(error.body.message);
          }
        );
      } else {
        this.common.addDemoAccount(body).subscribe(
          (res: any) => {
            this.message.success(res.body.message);
            this.loader = false;
            this.router.navigate([`${this.langs}/account-list`]);
          },
          error => {
            this.loader = false;
            this.message.error(error.body.message);
          }
        );
      }
    }
  }
}
