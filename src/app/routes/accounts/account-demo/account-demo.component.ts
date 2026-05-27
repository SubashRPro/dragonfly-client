import { Component, Injector, OnInit,  Inject, } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { DA_SERVICE_TOKEN, ITokenService } from "@delon/auth";
import { ApiService } from "src/app/services/api.service";
import { NzMessageService } from 'ng-zorro-antd/message';
import { I18NService, } from '@core';
@Component({
  selector: "app-account-trad",
  templateUrl: "./account-demo.component.html",
  styleUrls: ["./account-demo.component.less"],
})
export class AccountDemoComponent implements OnInit {
  loader: boolean = false;
  formOpenAccount!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private common: ApiService,
    private injector: Injector,
    public route: ActivatedRoute,
    private router: Router,
    private message: NzMessageService,
    private i18nSev: I18NService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService
  ) {
   
  }

  langs = this.i18nSev.i18nUrl();

  ngOnInit(): void {
    this.formOpenAccount = this.fb.group({
      Trading_Platform: ['MT4', [Validators.required]],
      account_Type: ['demo', [Validators.required]],
      currency: ['USD', [Validators.required]],
      account_Leverage: ['100', [Validators.required]],
      init_Balance: ['5000']
    });
  }

  private get tokenSrv(): ITokenService {
    return this.injector.get(DA_SERVICE_TOKEN);
  }

  public loginID: any = this.tokenSrv.get()?.customer_id;
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
        trading_Platform: this.formOpenAccount.value.Trading_Platform,
        currency: this.formOpenAccount.value.currency,
        account_Leverage: this.formOpenAccount.value.account_Leverage,
        init_Balance: this.formOpenAccount.value.init_Balance
      };

      this.common.addDemoAccount(body).subscribe(
        (res: any) => {
          this.message.success(res.body.message);
          this.loader = false;
          this.router.navigateByUrl(
            `${this.langs}/demo-accounts`
          );
        },
        error => {
          this.loader = false;
          this.message.error(error.body.message);
        }
      );
    }
  }
}
