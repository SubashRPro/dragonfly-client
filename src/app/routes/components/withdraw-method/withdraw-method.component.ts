import {
  Component,
  EventEmitter,
  Injector,
  OnInit,
  Output,
  ViewChild,
  HostListener,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { I18NService } from "@core";
import { DA_SERVICE_TOKEN, ITokenService } from "@delon/auth";
import { NzMessageService } from "ng-zorro-antd/message";
import {
  InitiateDepositParams,
  InitiateWithdrawParams,
} from "src/app/models/funds";
import { ApiService } from "src/app/services/api.service";
import { NzModalRef, NzModalService } from "ng-zorro-antd/modal";
import { BankDetailsComponent } from "../bank-details/bank-details.component";
import { SuccessModalComponent } from "../success-modal/success-modal.component";
import { VnBankModel, bridgeModel } from "./vnbank-list";
import { environment } from "@env/environment";
import { DomSanitizer } from "@angular/platform-browser";
import { NzSelectSizeType } from "ng-zorro-antd/select";
declare var $: any;
@Component({
  selector: "app-withdraw-method",
  templateUrl: "./withdraw-method.component.html",
  styleUrls: ["./withdraw-method.component.less"],
})
export class WithdrawMethodComponent implements OnInit {
  @ViewChild("bankDetailsComponent")
  bankDetailsComponent!: BankDetailsComponent;

  @ViewChild("successModalComponent")
  successModalComponent!: SuccessModalComponent;

  @Output() readonly toParent = new EventEmitter();
  exchangeText: boolean = true;
  pspAllowed: boolean | undefined;
  accountName: any;
  vnMsg: boolean = false;
  egValue: string = "1";
  egpayHide: boolean = false;
  egLocalPay?: boolean;
  selectAccount: any;
  blizzardpayHide?: boolean;
  exceed: boolean = false;
  bvnkHide: boolean = false;
  dataLoad: boolean = true;
  provideLoader!: boolean;
  account: any;
  depositScreen: boolean = false;
  instant: boolean = true;
  loaderSubmit?: boolean;
  method: boolean = false;
  methodValue: string = "";
  isVisible = false;
  validateForm!: FormGroup;
  depositTo: any = [];
  walletBalance: any = {};
  accounts: any = [];
  tradingBalance: any = {};
  currencies: any = [];
  providers: any = [];
  exchangeRate: any = {};
  radioValue: string = "";
  isConfirmLoading: boolean = false;
  langs = this.i18nSev.i18nUrl();
  coinPayForm: boolean = false;
  bvnkPayForm: boolean = false;
  globeForm: boolean = false;
  skrillForm: boolean = false;
  netellerForm: boolean = false;
  sirPagaForm: boolean = false;
  billPayForm: boolean = false;
  triplePayForm: boolean = false;
  bridgePayForm: boolean = false;
  confirmModal?: NzModalRef;
  loaderWithdraw: boolean = false;
  balanceLoader?: boolean;
  wireHide?: boolean;
  alterHide?: boolean;
  bridgerpayHide?: boolean;
  quickpayHide?: boolean;
  coinHide?: boolean;
  tripleHide?: boolean;
  gpayHide?: boolean;
  upiHide?: boolean;
  epayHide: boolean = false;
  fatoorahHide: boolean = false;
  helpPayHide: boolean = false;
  helpPay: boolean = false;
  copPay: boolean = false;
  sirPagaHide: boolean = false;
  bankList: any = [];
  bankListCop: any = [];
  bankListPrompt: any = [];
  userCountry = this.tokenSrv.get()?.user_Country;
  user_Nationality = this.tokenSrv.get()?.user_Nationality;
  successW = this.tokenSrv.get()?.successfullWithdrawals;
  hyperBCHide: boolean = false;
  isHyperBCList: boolean = false;
  reachedTitle = this.i18nSev.i18n(
    "You have reached the monthly withdrawal limit!"
  );
  reachedContent = this.i18nSev.i18n(
    'You will be charged <span class="usd-fee"> USD 20 Fee </span> , if you wish to continue click proceed'
  );
  hyperBCCoinList: { [key: string]: any } = {
    usdt_trc20: "USDT(TRC20)",
    usdt_erc20: "USDT(ERC20)",
    trx: "TRX",
    eth: "ETH",
    xrp: "XRP",
    btc: "BTC",
    matic_polygon: "Polkgan",
    doge: "Dogecoin",
  };
  leanHide: boolean = false;
  globeHide: boolean = false;
  skrillHide: boolean = false;
  leanForm: boolean = false;
  countries: any = [];
  vnPayHide: boolean = false;
  vnPayForm: boolean = false;
  expay: boolean = true;
  coinName: string = "USDT";
  isVisiblePA: boolean = false;
  vnBankList?: VnBankModel[];
  vnBankName: any;
  vnBankCode: any;
  imageName?: string;
  imageSrc?: string;
  isVisibleBVNK: boolean = false;
  bridgeUrl: any;
  pspList: any = [];
  cheezePayForm: boolean = false;
  summaryLoader: boolean = false;
  globalBridgeData: bridgeModel = {} as bridgeModel;
  isVisibleBank = false;
  transferOptions: any = [];
  loading: boolean = false;
  loadingdata?: boolean;
  radioValueBank: string = "existing";
  allbankDetails: boolean = true;
  accountDetails: any = {};
  accountBank: any[] = [];
  checked?: boolean;
  info: any;
  transferFrom: any = {
    currency: "--",
    balance: 0,
  };
  transferTo: any = {
    currency: "--",
    balance: 0,
  };
  params: any = {};
  countriesOptios: any = [];

  handleKeyboardEvent(e: KeyboardEvent) {
    if (e.key === "F12") {
      return false;
    }
    if (e.ctrlKey && e.shiftKey && e.key === "I") {
      return false;
    }
    if (e.ctrlKey && e.shiftKey && e.key === "C") {
      return false;
    }
    if (e.ctrlKey && e.shiftKey && e.key === "J") {
      return false;
    }
    if (e.ctrlKey && e.key == "U") {
      return false;
    }
    return true;
  }

  constructor(
    private router: Router,
    private injector: Injector,
    private fb: FormBuilder,
    private http: ApiService,
    private message: NzMessageService,
    private i18nSev: I18NService,
    private modal: NzModalService,
    private sanitizer: DomSanitizer
  ) {
    document.addEventListener("contextmenu", function (e) {
      e.preventDefault();
    });

    if (
      this.tokenSrv.get()?.customer_MiddleName === "" ||
      this.tokenSrv.get()?.customer_MiddleName === null
    ) {
      this.accountName =
        this.tokenSrv.get()?.customer_FirstName +
        " " +
        this.tokenSrv.get()?.customer_LastName;
    } else {
      this.accountName =
        this.tokenSrv.get()?.customer_FirstName +
        " " +
        this.tokenSrv.get()?.customer_MiddleName +
        " " +
        this.tokenSrv.get()?.customer_LastName;
    }
  }

  payOption: any;
  egWalletPay: boolean = false;
  isCrypto: boolean = true;
  pspdata = "crypto";
  onItemChange(e: any) {
    this.scroll();
    this.pspdata = e;
    if (e === "crypto") {
      this.expay = true;
      this.copPay = false;
      this.isCrypto = true;
      this.validateCrypto();
    } else {
      this.expay = false;
      this.copPay = true;
      this.isCrypto = false;
      this.InvalidateCrypto();
      this.validateBank();
    }
  }

  validateCrypto() {
    this.validateForm.controls["coinName"].setValidators([Validators.required]);
    this.validateForm.controls["chainName"].setValidators([
      Validators.required,
    ]);
    this.validateForm.controls["toAddress"].setValidators([
      Validators.required,
    ]);
  }

  validateBank() {
    this.validateForm.controls["bank_Account_Name"].setValidators([
      Validators.required,
    ]);
    this.validateForm.controls["bank_Account_Number"].setValidators([
      Validators.required,
    ]);
    this.validateForm.controls["bank_Name"].setValidators([
      Validators.required,
    ]);

    this.validateForm.controls["bank_branch"].setValidators([
      Validators.required,
    ]);

    this.validateForm.controls["bank_Address"].setValidators([
      Validators.required,
    ]);

    this.validateForm.controls["bank_Code"].setValidators([
      Validators.required,
    ]);

    this.validateForm.controls["bank_IBAN"].setValidators([
      Validators.required,
    ]);

    this.validateForm.controls["reciever_Email"].setValidators([
      Validators.required,
    ]);
  }

  inValidateBank() {
    Object.keys(this.validateForm.controls).forEach((key) => {
      if (
        [
          "bank_Account_Name",
          "bank_Account_Number",
          "bank_Name",
          "bank_branch",
          "bank_Address",
          "bank_Code",
          "bank_IBAN",
          "reciever_Email",
        ].includes(key)
      ) {
        const control = this.validateForm.get(key);
        if (control) {
          control.clearValidators();
          control.updateValueAndValidity();
        }
      }
    });
  }
  changeBank(type) {
    switch (type) {
      case "Bank":
        this.validateBank();
        break;

      case "Card":
        this.inValidateBank();
        break;

      default:
        break;
    }
  }

  InvalidateCrypto() {
    this.validateForm.controls["coinName"]?.clearValidators();
    this.validateForm.controls["coinName"]?.updateValueAndValidity();
    this.validateForm.controls["chainName"]?.clearValidators();
    this.validateForm.controls["chainName"]?.updateValueAndValidity();
    this.validateForm.controls["toAddress"]?.clearValidators();
    this.validateForm.controls["toAddress"]?.updateValueAndValidity();
  }

  handleCancelPA(): void {
    this.isVisiblePA = false;
  }
  redirectToBank(): void {
    this.router.navigate([`${this.langs}/funds/bankdetail`], {
      queryParams: {
        addBank: true,
      },
    });
  }

  ngOnInit(): void {
    // temp solution will remove this
    // if (!localStorage.getItem('foo')) {
    //   localStorage.setItem('foo', 'no reload')
    //   location.reload()
    // } else {
    //   localStorage.removeItem('foo')
    // }

    this.http.getBankDetails().subscribe((res: any) => {
      let content = res.data;
      let curr = content.filter((item: any) => item.is_Default);
      let obj = Object.assign({}, curr);
      this.accountDetails = obj[0];
    });

    this.getBankList();
    this.validateForm = this.fb.group({
      amount: [null, [Validators.required]],
      wallet: [2, [Validators.required]],
      accounts: [null],
      currencie: [null, [Validators.required]],
      coinName: [null],
      chainName: ["TRC20"],
      toAddress: [null],
      bank_Account_Name: [null],
      bank_Account_Number: [null, [Validators.pattern('^[0-9a-zA-Z_]{1,34}$')]],
      bank_Name: [null],
      bank_branch: [null],
      bank_Code: [null],
      bank_IBAN: [null],
      bank_Address: [null],
      reciever_Email: [null],
      fiatSelection: ["Bank"],
    });
    this.validateCrypto();

    this.getAllDepositTo();
    this.getAllAccountsTotalBalance();
    this.http.getAllCountries().subscribe((res: any) => {
      this.countries = res.data.map((item: any) => ({
        ...item,
        img: `${environment.api.baseUrl}/app_contents/country_flag/${item.code}.svg`,
      }));
    });
    this.http
      .getAllAccountsByCustomerID(this.tokenSrv.get()?.customer_id)
      .subscribe((res: any) => {
        this.accounts = res.data;
        this.selectAccount = res.data[0]?.code + "|" + res.data[0].mT_Currency;
      });
    this.http
      .getVirtualWalletBYCustomerId(this.tokenSrv.get()?.customer_id)
      .subscribe((res: any) => {
        this.walletBalance = res.data;
        // this.tradingBalance = res.data;
        this.validateForm
          .get("walletNumber")!
          ?.setValue(res.data.virtualWallet_Code);
      });

    this.http.getCustomerProfile().subscribe((res: any) => {
      this.dataLoad = false;
      this.pspAllowed = res.data[0]?.is_WithdrawalAllowed;
      const currency = "USD";
      this.validateForm.get("currencie")!.setValue(`${currency}|${currency}`);
      this.getExchangeRate(
        "USD",
        this.validateForm.value?.currencie?.split("|")[1]
      );
      this.http.getAllCurrencies().subscribe((res: any) => {
        this.currencies = res.data;
        this.summaryLoader = true;
        this.depositScreen = true;
      });
    });
  }

  private get tokenSrv(): ITokenService {
    return this.injector.get(DA_SERVICE_TOKEN);
  }
  onToParent() {
    this.validateForm.get("amount")?.reset();
    this.radioValue = "";
    this.toParent.emit();
    this.isVisible = false;
  }

  // Function to add validation
  clearValid() {
    this.validateForm.controls["address"].clearValidators();
    this.validateForm.controls["toCoin"].clearValidators();
    this.validateForm.get("address")?.updateValueAndValidity();
    this.validateForm.get("toCoin")?.updateValueAndValidity();
  }

  clearValidTriple() {
    this.validateForm.controls["addressTrip"].clearValidators();
    this.validateForm.controls["toCoinTrip"].clearValidators();
    this.validateForm.get("addressTrip")?.updateValueAndValidity();
    this.validateForm.get("toCoinTrip")?.updateValueAndValidity();
  }

  submitForm(): void {
    const pspName = this.pspdata;
    if (this.validateForm.valid) {
      this.loaderSubmit = true;
      const {
        wallet,
        accounts,
        currencie,
        coinName,
        chainName,
        toAddress,
        bank_Account_Name,
        bank_Account_Number,
        bank_Name,
        bank_branch,
        bank_Code,
        bank_IBAN,
        bank_Address,
        reciever_Email,
        fiatSelection,
      } = this.validateForm.value;

      const amount: any = this.validateForm.value.amount / this.exchangeRate;

      if (!this.pspdata) {
        this.loaderSubmit = false;
        this.message.error("Please choose any one Withdraw method to proceed.");
        return;
      }
      if (wallet !== 1 && this.tradingBalance?.balance <= 0) {
        this.loaderSubmit = false;
        this.message.error(this.i18nSev.i18n("Your balance is insufficient"));
        return;
      }

      if (pspName === "crypto") {
        let body = {
          paymenT_SOURCE: sessionStorage.getItem('walletWithdraw'),
          withdraW_AMOUNT: amount,
          withdraW_TYPE: 1,
          currency: "USD", // currencie.split("|")[1],
          isCrypto: this.isCrypto,
          coin_Name: coinName,
          chain_Name: chainName,
          address: toAddress,
          requested_PaymentType: "Crypto",
        };
        if (this.successW >= 5) {
          this.loaderSubmit = false;
          this.confirmModal = this.modal.info({
            nzClassName: "reached-confirm",
            nzOkText: this.i18nSev.i18n("Proceed"),
            nzCancelText: this.i18nSev.i18n("No"),
            nzTitle: this.reachedTitle,
            nzContent: this.reachedContent,
            nzWidth: "600px",
            nzOnOk: () => {
              this.http.CryptoAndOtherPay(body).subscribe(
                (res: any) => {
                  this.loaderSubmit = false;
                  this.message.success(
                    "Your Withdraw has been Initiated Successfully"
                  );
                  // redirect to merchant
                  setTimeout(()=> {
                    this.redirectMerchant()
                  },500)
                },
                (error) => {
                  this.loaderSubmit = false;
                  this.message.error(error?.body?.message);
                }
              );
            },
          });
        } else {
          this.http.CryptoAndOtherPay(body).subscribe(
            (res: any) => {
              this.loaderSubmit = false;
              this.message.success(
                "Your Withdraw has been Initiated Successfully"
              );
               // redirect to merchant
               setTimeout(()=> {
                this.redirectMerchant()
              },500)
            },
            (error) => {
              this.loaderSubmit = false;
              this.message.error(error?.body?.message);
            }
          );
        }
      } else if (pspName === "fiat") {
        let body = {
          paymenT_SOURCE: sessionStorage.getItem('walletWithdraw'),
          withdraW_AMOUNT: amount,
          withdraW_TYPE: 1,
          currency: currencie.split("|")[1],
          isCrypto: this.isCrypto,
          bank_Account_Name: bank_Account_Name,
          bank_Account_Number: bank_Account_Number,
          bank_Name: bank_Name,
          bank_branch: bank_branch,
          bank_Code: bank_Code,
          bank_IBAN: bank_IBAN,
          bank_Address: bank_Address,
          reciever_Email: reciever_Email,
          requested_PaymentType: fiatSelection,
        };

        if (this.successW >= 5) {
          this.loaderSubmit = false;
          this.confirmModal = this.modal.info({
            nzClassName: "reached-confirm",
            nzOkText: this.i18nSev.i18n("Proceed"),
            nzCancelText: this.i18nSev.i18n("No"),
            nzTitle: this.reachedTitle,
            nzContent: this.reachedContent,
            nzWidth: "600px",
            nzOnOk: () => {
              this.http.CryptoAndOtherPay(body).subscribe(
                (res: any) => {
                  this.loaderSubmit = false;
                  this.message.success(
                    "Your Withdraw has been Initiated Successfully"
                  );
                  // redirect to merchant
                  setTimeout(()=> {
                    this.redirectMerchant()
                  },500)
                },
                (error) => {
                  this.loaderSubmit = false;
                  this.message.error(error?.body?.message);
                }
              );
            },
          });
        } else {
          this.http.CryptoAndOtherPay(body).subscribe(
            (res: any) => {
              this.loaderSubmit = false;
              this.message.success(
                "Your Withdraw has been Initiated Successfully"
              );
               // redirect to merchant
               setTimeout(()=> {
                this.redirectMerchant()
              },500)
            },
            (error) => {
              this.loaderSubmit = false;
              this.message.error(error?.body?.message);
            }
          );
        }
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

  showModal(): void {
    this.isVisible = true;
    this.validateForm.get("wallet")?.setValue(1);
  }
  hideModal(): void {
    this.isVisible = false;
  }

  handleOk(): void {
    // this.successModalComponent.showModal();
    // this.isVisible = false;
    this.submitForm();
  }

  handleCancel(): void {
    this.isVisible = false;
    // redirect to merchant
    setTimeout(()=> {
      this.redirectMerchant()
    },500)
    this.validateForm.get("amount")!.reset();
    this.radioValue = "";
  }

  getAllDepositTo() {
    this.http.getAllDepositTo().subscribe((res: any) => {
      this.depositTo = res.data;
    });
  }
  depositChange(e: any) {
    // TradingAccount
    if (e == 2) {
      this.http
        .getAllAccountsByCustomerID(this.tokenSrv.get()?.customer_id)
        .subscribe((res: any) => {
          this.accounts = res.data;
        });
    } else {
      this.validateForm.get("accounts")?.setValue("");
    }
  }

  tradingChange(e: any) {
    const code = e.split("|")[0];
    this.account = code;
    this.http
      .getBalanceByAccountLogin({
        code,
        type: this.validateForm.value.wallet === 1 ? "W" : "C",
      })
      .subscribe((res: any) => {
        this.tradingBalance = {
          ...this.tradingBalance,
          balance: res.data ?? 0,
          currency: e.split("|")[1],
        };
      });

    this.getExchangeRate(
      e?.split("|")[1],
      this.validateForm.value?.currencie?.split("|")[1]
    );
  }

  getExchangeRate(FromCurrency: string, ToCurrency: string) {
    this.balanceLoader = false;
    this.http
      .getExchangeRate({
        FromCurrency,
        ToCurrency,
        TransactionType: "withdraw",
        PaymentMethod: this.egpayHide ? 29 : 0,
      })
      .subscribe((res: any) => {
        this.exchangeRate = res.data === 0 ? 1 : res.data;
        this.balanceLoader = true;
      });
  }

  currencieChange(e: any) {
    this.getExchangeRate(
      this.validateForm.value.accounts?.split("|")[1] ??
        this.walletBalance.currency,
      e?.split("|")[1]
    );
  }

  resetForm(): void {
    this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(key)) {
        this.validateForm.controls[key].markAsPristine();
        this.validateForm.controls[key].updateValueAndValidity();
      }
    }
  }

  total: any = {};
  getAllAccountsTotalBalance() {
    this.http
      .getAllAccountsTotalBalance(this.tokenSrv.get()?.customer_id)
      .subscribe((res: any) => {
        this.total = res.data;
      });
  }

  changeVnBank(e: VnBankModel) {
    this.vnBankCode = e.code;
    this.vnBankName = e.name;
  }

  goProceed() {
    this.exceed = false;
  }

  handleCanceExceed() {
    this.exceed = false;
  }

  handleCancelBVNK(): void {
    this.isVisibleBVNK = false;
    this.loaderSubmit = false;
  }

  //  scroll to payment page in mobile
  scroll() {
    setTimeout(() => {
      if ($(window).width() <= 767) {
        let abc: any = document.getElementById("scroll-payment");
        abc.scrollIntoView({
          behavior: "smooth",
        });
      }
    }, 500);
  }

  handleCancelBank(): void {
    this.isVisibleBank = false;
  }

  public getBankList() {
    this.loading = true;
    this.http.getBankDetails().subscribe(
      (res: any) => {
        this.accountBank = res.data;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.message.error(error);
      }
    );
  }

  showBank() {
    this.isVisibleBank = true;
  }

  onItemBankChange(e: any) {
    if (e === "existing") {
      this.allbankDetails = true;
    } else {
      this.allbankDetails = false;
      this.router.navigateByUrl(
        `${this.langs}/funds/bankdetail?addnewBank=true`
      );
    }
  }

  selectBankAccount(data: any) {
    // this.getBankList()
    this.accountDetails = data;
    const res = this.accountBank.map((i) => {
      if (i.bankDetailsID == data.bankDetailsID) {
        return {
          ...i,
          is_Default: true,
        };
      } else {
        return {
          ...i,
          is_Default: false,
        };
      }
    });

    this.accountBank = [...res];
  }

  submitBankForm(): void {
    this.loadingdata = true;
    if (this.accountDetails === undefined) {
      this.message.error("Please Select any bank to proceed");
      this.loadingdata = false;
    } else {
      this.validateForm.patchValue({
        bank_Account_Number: this.accountDetails.accountNumber,
        bank_Name: this.accountDetails.bankName,
        bank_branch: this.accountDetails.bankAddress,
        bank_Code: this.accountDetails.swiftCode,
        bank_IBAN: this.accountDetails.iban,
        bank_Address: this.accountDetails.bankAddress,
      });
      this.loadingdata = false;
      this.isVisibleBank = false;
    }
  }

  redirectMerchant() {
    const body = {
      merchant_token: sessionStorage.getItem('merchant_token'),
      merchant_secret: sessionStorage.getItem('merchant_secret'),
      transaction_type: 'withdraw'
    }
    this.http.redirectMerchant(body).subscribe(
      (res: any) => {
       let data = res?.data
      setTimeout(()=> {
        window.open(`${data.redirect_url}?email=${data?.email}&first_name=${data?.first_name}&last_name=${data?.last_name}&merchant_reference_id=${data?.merchant_reference_id}&transaction_id=${data?.transaction_id}&status=success&remarks=success`, "_self");
      },500)
      },
      (error) => {
        this.loading = false;
        this.message.error(error);
      }
    );
  }
}
