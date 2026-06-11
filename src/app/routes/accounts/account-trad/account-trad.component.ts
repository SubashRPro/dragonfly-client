import { Component, Injector, OnInit,  Inject, } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { DA_SERVICE_TOKEN, ITokenService } from "@delon/auth";
import { ApiService } from "src/app/services/api.service";
import { NzMessageService } from 'ng-zorro-antd/message';
import { I18NService, } from '@core';
@Component({
  selector: "app-account-trad",
  templateUrl: "./account-trad.component.html",
  styleUrls: ["./account-trad.component.less"],
})
export class AccountTradComponent implements OnInit {
  redirect:boolean | undefined
  reasonText:boolean = true
  menu_disable!:boolean
  formOpenAccount!: FormGroup;
  currencies: any = [];
  loader: boolean = false;
  businessTYpe: any = [];
  userInfo: any;
  isDemo: boolean = false;
  tabs = [1, 3];
  zindex = 0;
  validateForm!: FormGroup;
  validateAccountForm!: FormGroup;
  symbol: any;
  currency: any = ["USD", "EUR", "GBP"];
  leverage: any = ["1:100", "1:200", "1:400", "1:500"];
  balanceLoader: boolean = true;
  isVisible = false;
  successMessage:any
  customer_id = this.tokenSrv.get()?.customer_id;
  calculator: any = {
    longSwap: 0.0,
    marginValue: 0.0,
    pipValue: 0.0,
    shortSwap: 0.0,
    profitValue: 0.0,
  };

  calculator1: any = {
    longSwap: 0.0,
    marginValue: 0.0,
    pipValue: 0.0,
    shortSwap: 0.0,
    profitValue: 0.0,
  };

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
    route.params.subscribe((res) => {
      this.zindex = Number(res.id);
    });
    this.userInfo = JSON.parse(localStorage.getItem('loginInfo')!);
    console.log(this.userInfo)
  }

  langs = this.i18nSev.i18nUrl();

  ngOnInit(): void {
    this.formOpenAccount = this.fb.group({
      trading_Platform: ['MT5', [Validators.required]],
      account_Type: ['', [Validators.required]],
      currency: ['USD', [Validators.required]],
      account_Leverage: ['500', [Validators.required]],
      reasonForAdditionalAccount: [null],
      init_Balance: [null]
    });    
    this.common.getAllCurrencies().subscribe((res: any) => {
      this.currencies = res.data;
    });

    this.common.getBusinessType().subscribe((res: any) => {
      this.businessTYpe = res.data;
      if (res.data[0].id == 'Demo') {
        this.isDemo = true;
        this.formOpenAccount.get('init_Balance')!.setValidators(Validators.required);
      }
    });

    this.getSymbolList();
    this.validateForm = this.fb.group({
      symbol: [null, [Validators.required]],
      positionSize: [null, [Validators.required]],
      lots: [null],
      leverage: [null, [Validators.required]],
      currency: [null, [Validators.required]],
      close_Price: null,
      open_Price: null,
    });

    this.validateForm.get("currency")!.setValue("USD");
    this.common.getBalanceData().subscribe((res: any) => {
      this.balanceLoader = false;
      // console.log(res.data);
    });

    setTimeout(() => {
      const userStatus =  this.tokenService.get()?.customer_Status
      if (
        userStatus === "Funded" ||
        userStatus === "Verified" ||
        userStatus === "Active"
      ) {
        this.menu_disable = true
      } else {
        this.menu_disable = false
      }
    }, 500);

    this.changeReason('MT5')
  }

  private get tokenSrv(): ITokenService {
    return this.injector.get(DA_SERVICE_TOKEN);
  }

  openTab(e: number) {
    this.zindex = e;
  }

  positionSizeChange() {
    const MT4lot = Number(
      (this.validateForm.value.positionSize * 0.00001).toFixed(6)
    );
    this.validateForm.get("lots")!.setValue(MT4lot);
  }

  onPlus(){
    const value = this.validateForm.value.positionSize + 1;
    this.validateForm.get("positionSize")!.setValue(value);
  }

  onMinus(){
    const value = this.validateForm.value.positionSize - 1;
    if(value>=0){
      this.validateForm.get("positionSize")!.setValue(value);
    }
  }

 submitForm(): void {
 
    for (const i in this.formOpenAccount.controls) {
      if (this.formOpenAccount.controls.hasOwnProperty(i)) {
        this.formOpenAccount.controls[i].markAsDirty();
        this.formOpenAccount.controls[i].updateValueAndValidity();
      }
    }
    console.log(this.formOpenAccount)
    if (this.formOpenAccount.valid) {
      this.loader = true;
     
      if (this.userInfo?.user_Type === 'Customer') {
        this.common.addAccount({...this.formOpenAccount.value}).subscribe(
          (res: any) => {
            if(res?.body?.data?.redirect_To_ServiceRequest) {
              this.redirect = true
             // this.router.navigate([`${this.langs}/support`]);
            } else {
              this.redirect = false
              // this.router.navigate([`${this.langs}/account-list`]);
            }
           // this.message.success(res.body.message)
            this.isVisible = true
            this.successMessage = res.body.message
            this.loader = false;
          },
          error => {
            this.loader = false;
            this.message.error(error.body.message);
          }
        );
      } else {

        this.common.addDemoAccount({...this.formOpenAccount.value }).subscribe(
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

  getSymbolList() {
    this.common.getSymbol().subscribe((res: any) => {
      this.symbol = res.data;
      this.validateForm
        .get("symbol")!
        .setValue(res.data ? res.data[0].SYMBOL : "");
    });
  }

  onCalculate(type: string = "Margin") {
    if (this.validateForm.valid) {
      if (type == "Margin") {
        this.common
          .getMarginList({ ...this.validateForm.value })
          .subscribe((res: any) => {
            this.calculator = { ...res.data };
          });
      } else {
        this.common
          .getProfitList({ ...this.validateForm.value, type: "buy" })
          .subscribe((res: any) => {
            this.calculator1 = { ...res.data };
          });
      }
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }


  handleCancel(): void {
    this.isVisible = false;
    if(this.redirect) {
      this.router.navigate([`${this.langs}/support`]);
    } else {
      this.router.navigate([`${this.langs}/account-list`]);
    }
  }

  handleCancelAccount(): void {
    this.isVisibleAccount = false;
    this.router.navigate([`${this.langs}/account-list`]);
  }

  isVisibleAccount = false;

  changeReason(e:any) {
    this.common.maxAccountReach(e).subscribe((res:any)=> {
      if(res.data) {
        this.reasonText = true
        this.isVisibleAccount = true
       // this.formOpenAccount.controls['reasonForAdditionalAccount'].setValidators([Validators.required])
      } else {
        this.reasonText = false
      //  this.formOpenAccount.controls['reasonForAdditionalAccount'].clearValidators()
       // this.formOpenAccount.controls['reasonForAdditionalAccount'].updateValueAndValidity()
      }
    })
  }

}
