import {
  Component,
  Injector,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
  ElementRef,
  HostListener,
  AfterViewInit,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { TagTwoTone } from "@ant-design/icons-angular/icons";
import { I18NService, throwIfAlreadyLoaded } from "@core";
import { DA_SERVICE_TOKEN, ITokenService } from "@delon/auth";
import { NzMessageService } from "ng-zorro-antd/message";
import { InitiateDepositParams } from "src/app/models/funds";
import { ApiService } from "src/app/services/api.service";

import { BankDetailsComponent } from "../bank-details/bank-details.component";
import { QuickPayComponent } from "../quick-pay/quick-pay.component";
import { CryptoWalletComponent } from "../crypto-wallet/crypto-wallet.component";
import { SuccessModalComponent } from "../success-modal/success-modal.component";
import { CountdownComponent } from "ngx-countdown";
import { environment } from "@env/environment";
declare var $: any;
declare var Epay: any;
declare var Lean: any;

interface nationalityOption1 {
  img: string;
  code: string;
  description: string;
}

@Component({
  selector: "app-deposit-modal",
  templateUrl: "./deposit-modal.component.html",
  styleUrls: ["./deposit-modal.component.less"],
})
export class DepositModalComponent implements OnInit {
  @ViewChild("cd", { static: false }) private countdown: CountdownComponent;
  @ViewChild("quickPayComponent")
  quickPayComponent!: QuickPayComponent;

  @ViewChild("bankDetailsComponent")
  bankDetailsComponent!: BankDetailsComponent;

  @ViewChild("successModalComponent")
  successModalComponent!: SuccessModalComponent;

  @ViewChild("cryptoWalletComponent")
  cryptoWalletComponent!: CryptoWalletComponent;

  @ViewChild('depositHistory', { static: false })
  depositHistory!: ElementRef;
  loadDepositHistory = false
  @Output() readonly toParent = new EventEmitter();
  curDisable: boolean = false;
  onetwoPay: any = {};
  mtpayCharges:boolean = false
  pspAllowed: boolean | undefined;
  cheezeUrl: any;
  copUrl: any;
  oneTwoUrl: any;
  paymentMethod: any;
  selectAccount: any;
  bvnkURL: any;
  kycMessage!: boolean;
  exceedMsg: string = "Deposit_is_not_allowed_Exceed_Limit"; //! do not change this based on message condition working
  exceedLimitMsg: string = "Deposit_is_not_allowed_Exceed_Amount"; //! do not change this based on message condition working
  exceed: boolean = false;
  dataLoad: boolean = true;
  account: any;
  params: any = {};
  accountDetails: any = {};
  isConfirmLoadingf?: boolean;
  loadingpayment: boolean = true;
  loaderSubmit?: boolean;
  buttonColor = "black";
  buttonType = "buy";
  isCustomSize = false;
  buttonWidth = 240;
  buttonHeight = 40;
  method: boolean = false;
  methodValue: string = "";
  isVisible = false;
  isVisiblef = false;
  isVisiblePayHub=false
  validateForm!: FormGroup;
  cryptoForm!: FormGroup;
  depositTo: any = [];
  walletBalance: any = {};
  accounts: any = [];
  bankList: any = [];
  tradingBalance: any = {};
  currencies: any = [];
  paymentList: any = [];
  paymentHubList:any = [];
  exchangeRate: any = {};
  gpayInfo: any = {};
  radioValue: string = "";
  egValue: string = "1";
  loadding: boolean = false;
  isAccount: boolean = false;
  balanceLoader?: boolean;
  ifromUrl: any = "";
  langs = this.i18nSev.i18nUrl();
  isConfirmLoading: boolean = false;
  wireHide?: boolean;
  egLocalPay?: boolean;
  bridgePayForm: boolean = false;
  egWalletPay: boolean = false;
  alterHide?: boolean;
  bridgerpayHide?: boolean;
  blizzardpayHide?: boolean;
  quickpayHide?: boolean;
  coinHide?: boolean;
  tripleHide?: boolean;
  gpayHide?: boolean;
  upiHide?: boolean;
  paymentRequest?: any = [];
  gpayBtn: boolean = false;
  epayHide: boolean = false;
  fatoorahHide: boolean = false;
  helpPayHide: boolean = false;
  hyperBCHide: boolean = false;
  transactionID?: string;
  callSign?: string;
  paymentCurrency: any;
  helpPayForm: any;
  @ViewChild("myButton")
  myButton!: ElementRef;
  helpPay: boolean = false;
  wirePay: boolean = false;
  moniPay: boolean = false;
  payHubPay: boolean = false;
  alterPayAus: boolean = false;
  egpayHide: boolean = false;
  bvnkPay: boolean = false;
  isHyperBCList: boolean = false;
  userCountry = this.tokenSrv.get()?.user_Country;
  user_Nationality = this.tokenSrv.get()?.user_Nationality;
  user_State = this.tokenSrv.get()?.user_State;
  isVisibleHyperModal = false;
  hyperQrCode?: string;
  hyperQrAmount?: string;
  hyperCoinAddress?: string;
  hyperCoinSelected?: string;
  polling: any;
  instant: boolean = true;
  depositScreen: boolean = false;
  imageName?: string;
  imageSrc?: string;
  userNationalDeposit: any;
  userStateDeposit: any;
  pspList: any = [];
  isVisibleCheeze: boolean = false;
  isVisibleCop: boolean = false;
  isVisibleOneTwo: boolean = false;
  summaryLoader: boolean = false;
  MtPay: boolean = false;
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
  isVisibleLean = false;
  leanInitData: any;
  globeHide: boolean = false;
  vnPayHide: boolean = false;
  paySafeHide: boolean = false;
  bvnkHide: boolean = false;
  expayHide: boolean = false;
  isVisibleBVNK: boolean = false;
  expay: boolean = false;
  coinName: string = "USDT";
  protocol: string = "ERC20";
  minDeposit: any = 20
  maxDeposit:any
  nationality1: nationalityOption1[] = [] as nationalityOption1[];
  triggerClick() {
    let el: HTMLElement = this.myButton.nativeElement as HTMLElement;
    el.click();
    // el.click()
  }

  @ViewChild("dataContainer")
  dataContainer!: ElementRef;
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
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private i18nSev: I18NService
  ) {
    document.addEventListener("contextmenu", function (e) {
      e.preventDefault();
    });
  }
  
 ngAfterViewInit(): void {
    if (!('IntersectionObserver' in window)) {
      // Fallback: load immediately if browser doesn't support it
      this.loadDepositHistory = true;
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          this.loadDepositHistory = true;
          observer.disconnect(); // load once
        }
      },
      {
        root: null,     // viewport
        threshold: 0.1  // 10% visible
      }
    );

    observer.observe(this.depositHistory.nativeElement);
  }

  ngOnInit(): void {
    this.http.getAllNationalities().subscribe((res: any) => {
      this.nationality1 = res.data.map((item: any) => ({
        ...item,
        img: `${environment.api.baseUrl}/app_contents/country_flag/${item.code}.svg`,
      }));
    });

    this.http.getCustomerProfile().subscribe((res: any) => {
      this.userNationalDeposit = res.data[0]?.customer_Nationality;
      this.userStateDeposit = res.data[0]?.customer_State;
      this.pspAllowed = res.data[0]?.is_DepositAllowed;
      this.getAllPsp();
    });

    this.paymentRequest = {
      apiVersion: this.gpayInfo.apI_Version,
      apiVersionMinor: 0,
      allowedPaymentMethods: [
        {
          type: "CARD",
          parameters: {
            allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
            allowedCardNetworks: ["AMEX", "VISA", "MASTERCARD"],
          },
          tokenizationSpecification: {
            type: "PAYMENT_GATEWAY",
            parameters: {
              gateway: "example",
              gatewayMerchantId: "exampleGatewayMerchantId",
            },
          },
        },
      ],
      merchantInfo: {
        merchantId: this.gpayInfo.merchantID,
        merchantName: this.gpayInfo.merchantName,
      },
      transactionInfo: {
        totalPriceStatus: "FINAL",
        totalPriceLabel: "Total",
        totalPrice: "100.00",
        currencyCode: this.gpayInfo.currency,
        countryCode: this.gpayInfo.country,
        transactionId: this.gpayInfo.transactionID,
      },
    };
    // this.ifromUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    //   '${environment.api.ecUrl}/#/SessionForm?lang=${this.chatLang[this.lang]}
    // );
    // coin pay form
    this.cryptoForm = this.fb.group({
      coin_pay: [null, [Validators.required]],
    });

    this.validateForm = this.fb.group({
      amount: [null, [Validators.required]],
      wallet: [1, [Validators.required]],
      accounts: [null, [Validators.required]],
      currencie: [null, [Validators.required]],
      walletNumber: [null, [Validators.required]],
      banklist: [null],
      coinName: [null],
      protocol: [null],
      hyperBCCoin: [null],
      paymentreferID: [null],
      Customer_ChineseName: [null],
      upiId:[null],
      country: [null],
      state: [null],
      city: [null],
      street: [null],
      zipCode: [null],
      pesronalId: [null],
      walletID: [{ value: "0101 025 4485", disabled: true }],
      omType: [null],
    });
    this.getAllDepositTo();

    this.http
      .getVirtualWalletBYCustomerId(this.tokenSrv.get()?.customer_id)
      .subscribe((res: any) => {
        this.walletBalance = res.data;
        console.log(this.walletBalance);
        // this.tradingBalance = res.data;
        this.validateForm
          .get("walletNumber")!
          .setValue(res.data.virtualWallet_Code);
      });

    this.route.queryParams.subscribe((param: any) => {
      this.showModal(param.pamars);
    });
    // temp solution will remove this
    // if (!localStorage.getItem('foo')) {
    //   localStorage.setItem('foo', 'no reload')
    //   location.reload()
    // } else {
    //   localStorage.removeItem('foo')
    // }
  }

  getAllPsp() {
    this.http.getAllPSP("deposit").subscribe((res: any) => {
      this.dataLoad = false;
      let content = res?.data;
      let helpPh = content?.filter(
        (item: any) => item.groupName === "Help2Pay"
      );
      this.bankList = helpPh[0]?.availablePSPs[0]?.bankList;
      this.pspList = content;
      const setPsp = content?.filter((item: any) => item.groupName);
      this.pspdata =
        setPsp[0]?.availablePSPs[0]?.name +
        "|" +
        setPsp[0]?.availablePSPs[0]?.default_Currency;
      const currency = setPsp[0]?.availablePSPs[0]?.default_Currency;
      this.validateForm.get("currencie")!.setValue(`${currency}|${currency}`);
      this.getExchangeRate(
        "USD",
        this.validateForm.value?.currencie?.split("|")[1]
      );
      this.http.getAllCurrencies().subscribe((res: any) => {
        this.currencies = res.data;
        this.summaryLoader = true;
        this.depositScreen = true;
        //  const curr = this.currencies.filter((item: any) => item.description === this.walletBalance.currency)[0] || 'USD';
        //  this.validateForm.get('currencie')!.setValue(`${curr.code}|${curr.description}`);

        // res.data.length > 0 && this.validateForm.get('currencie')!.setValue(`${res.data[0].id}|${res.data[0].description}`);
        //  this.getExchangeRate(this.validateForm.get('currencie')?.value ?? 'USD', this.walletBalance.currency);
      });
      const tabName = setPsp[0]?.availablePSPs[0]?.name;
      if (tabName === "BankTransfer") {
        if (
          (this.userNationalDeposit === "AU" &&
            this.userStateDeposit === null) ||
          (this.userNationalDeposit === "AU" && this.userStateDeposit === "")
        ) {
          this.alterPayAus = true;
          this.validateAlterAus();
        } else {
          this.alterPayAus = false;
          this.inValidateAlterAus();
        }
      } else {
        this.alterPayAus = false;
      }

      if (tabName === "BridgerPay") {
        this.bridgePayForm = true;
      } else {
        this.bridgePayForm = false;
      }

       if (tabName === "MonetixDoc") {
        this.minDeposit = 20
        this.maxDeposit = 1000
         this.moniPay = true;
       } else {
         this.moniPay = false;
       }

    if(tabName === '1-2-Pay') {
      this.minDeposit = 20
      this.maxDeposit = 500
    }

     if(tabName === 'fatoora') {
      this.minDeposit = 20
      this.maxDeposit = 10000
    }

     if(tabName === 'OMPAY') {
      this.minDeposit = 20
      this.maxDeposit = 10000
    }

     if(tabName === 'ChipPay') {
       this.minDeposit = 120
        this.maxDeposit = 6,500
        this.curDisable = true;
         this.bankText = true;
      } else {
        this.bankText = false;
      }
      if(tabName === 'MTPay') {
       this.minDeposit = 150
        this.maxDeposit = 7000
       this.MtPay = true
      this.curDisable = true;
      } else {
        this.MtPay = false
      }
      
      if (tabName === "Nganluong" || tabName === "Help2Pay") {
        this.helpPay = true;
      } else {
        this.helpPay = false;
        this.validateForm.controls["banklist"].clearValidators();
        this.validateForm.controls["banklist"].updateValueAndValidity();
      }

      if (tabName === "hyperbc") {
        this.isHyperBCList = true;
        this.validateForm.controls["hyperBCCoin"].setValidators([
          Validators.required,
        ]);
      } else {
        this.isHyperBCList = false;
        this.validateForm.controls["hyperBCCoin"].clearValidators();
        this.validateForm.controls["hyperBCCoin"].updateValueAndValidity();
      }

      if (tabName === "Orbital") {
        this.minDeposit = 10
        this.maxDeposit = 100000
        this.expay = true;
        this.curDisable = true;
      } else {
        this.expay = false;
      }
        if (tabName === "OMPAY") {
        console.log("ompay true");
        const currency = this.validateForm.value?.currencie?.split("|")[1];
        switch (currency) {
          case "MYR":
            this.showOMPAYTypes = [
              {
                id: "offline",
                name: "Bank transfer",
              },
              {
                id: "online",
                name: "FPX channel",
              },
            ];
            break;
          case "IDR":
            this.showOMPAYTypes = [
              {
                id: "offline",
                name: "Bank transfer",
              },
              {
                id: "qr",
                name: "QR Code",
              },
            ];
            break;
          case "SGD":
            this.showOMPAYTypes = [
              {
                id: "offline",
                name: "Bank transfer",
              },
            ];
            break;
          case "THB":
            this.showOMPAYTypes = [
              {
                id: "qr",
                name: "QR Code",
              },
            ];
            break;
          case "VND":
            this.showOMPAYTypes = [
              {
                id: "qr",
                name: "QR Code",
              },
            ];
            break;
          case "USD":
            this.showOMPAYTypes = [
              {
                id: "crypto",
                name: "Crypto",
              },
            ];
            break;
          default:
            this.showOMPAYTypes = null;
            break;
        }
      } else {
        this.showOMPAYTypes = null;
      }
    });
  }

  private get tokenSrv(): ITokenService {
    return this.injector.get(DA_SERVICE_TOKEN);
  }
  onToParent() {
    this.radioValue = "";
    this.isVisible = false;
    this.toParent.emit();
    this.validateForm?.get("amount")?.reset();
  }

  payOption: any;

  onItemEgChange(e: any) {
    this.payOption = e;
  }

  pspdata = "";
  PaymentMethod:any = 0;
  onItemChange(e: any) {
    this.scroll();
    console.log(e);
    const psnName = e?.split("|")[0];
    const defaultCurrency = e?.split("|")[1];
    setTimeout(()=>{
      this.validateForm.get("currencie")!.setValue(`${defaultCurrency}|${defaultCurrency}`);
    },200)
    this.depositScreen = true;
    this.pspdata = e;
    this.minDeposit = 0;
    this.curDisable = false;
    this.MtPay = false;
    this.expay = false;
    this.wirePay = false;
    this.moniPay = false;
    this.isVisiblePayHub = false;
    this.PaymentMethod = 0;

  switch (psnName) {
    case "Orbital":
      this.minDeposit = 10;
      this.maxDeposit = 100000
      this.expay = true;
      this.curDisable = true;
      break;

    case "WireTransfer":
      this.minDeposit = 20;
       this.maxDeposit = 50000
      this.wirePay = true;
      this.curDisable = false;
      break;

    case "MonetixDoc":
      this.minDeposit = 20;
      this.maxDeposit = 1000
      this.moniPay = true;
      break;

    case "PaymentHub":
      this.minDeposit = 20;
      this.maxDeposit = 1000
      this.isVisiblePayHub = true;
      this.getPaymentHubMethods();
      break;

    case "1-2-Pay":
      this.minDeposit = 20;
       this.maxDeposit = 5000
      break;

    case "ChipPay":
      this.minDeposit = 120;
       this.maxDeposit = 6500
      this.curDisable = true;
      break;

    case "fatoora":
      this.minDeposit = 20;
       this.maxDeposit = 10000
      break;

    case "OMPAY":
      this.minDeposit = 20;
       this.maxDeposit = 10000
      break;

    case "BankTransfer":
      this.minDeposit = 20;
      this.maxDeposit = 10000
      break;

    case "neteller":
      this.minDeposit = 20;
       this.maxDeposit = 10000
      break;

    case "MTPay":
      this.minDeposit = 150;
       this.maxDeposit = 7000
      this.MtPay = true;
      this.curDisable = true;
      this.PaymentMethod = 47;   // ONLY MTPAY
      break;

    default:
      this.PaymentMethod = 0;
      break;
  }


    if (psnName === "BankTransfer") {
      if (
        (this.userNationalDeposit === "AU" && this.userStateDeposit === null) ||
        (this.userNationalDeposit === "AU" && this.userStateDeposit === "")
      ) {
        this.alterPayAus = true;
        this.validateAlterAus();
      } else {
        this.alterPayAus = false;
        this.inValidateAlterAus();
      }
    } else {
      this.alterPayAus = false;
    }

    if (psnName === "BridgerPay") {
      this.bridgePayForm = true;
    } else {
      this.bridgePayForm = false;
    }

    if (psnName === "egPay") {
      this.egpayHide = true;
    } else {
      this.egpayHide = false;
      this.egWalletPay = false;
    }

    if (psnName === "Nganluong" || psnName === "Help2Pay") {
      this.helpPay = true;
    } else {
      this.helpPay = false;
      this.validateForm.controls["banklist"].clearValidators();
      this.validateForm.controls["banklist"].updateValueAndValidity();
    }

    if (psnName === "hyperbc") {
      this.isHyperBCList = true;
      this.validateForm.controls["hyperBCCoin"].setValidators([
        Validators.required,
      ]);
    } else {
      this.isHyperBCList = false;
      this.validateForm.controls["hyperBCCoin"].clearValidators();
      this.validateForm.controls["hyperBCCoin"].updateValueAndValidity();
    }
  }
  submitForm(): void {
    const pspName = this.pspdata?.split("|")[0];
    console.log(pspName);
    if (this.validateForm.valid) {
      const {
        wallet,
        walletNumber,
        accounts,
        currencie,
        banklist,
        hyperBCCoin,
        paymentreferID,
        Customer_ChineseName,
        upiId,
        country,
        state,
        city,
        street,
        zipCode,
        pesronalId,
        walletID,
        omType
      } = this.validateForm.value;

      const amount: any = this.validateForm.value.amount / this.exchangeRate;
      // const amount = TrimAmount.toFixed(2)   // here the trim value go to PSP

      //  console.log(TrimAmount)
      if (!this.pspdata) {
        this.message.error("Please choose any one deposit method to proceed.");
        return;
      }

      if (amount < this.minDeposit) {
        this.message.error(`Minimum Amount Should be ${this.minDeposit} USD`);
        return;
      }

      if (pspName === "BankTransfer") {
        this.router.navigate([`${this.langs}/funds/alternative`], {
          queryParams: {
            customer_ID: this.tokenSrv.get()?.customer_id,
            deposiT_TO: 2,
            paymenT_DESTINATION: accounts.split("|")[0],
            deposiT_AMOUNT: amount,
            deposiT_TYPE: "2",
            wL_NO: "dragonfly",
            currency: currencie.split("|")[1],
            postType: "D",
            country: country,
            state: state,
            zip: zipCode,
            city: city,
            address: street,
          },
        });
      }
      
       else if (pspName === "WireTransfer") {
         const currencyValue =
           this.validateForm.get("wallet")?.value == 1
             ? this.walletBalance.currency
             : this.validateForm.value.accounts.split("|")[1];
         const params = {
           customer_ID: this.tokenSrv.get()?.customer_id,
           deposiT_To: 2,
           paymenT_DESTINATION: accounts.split("|")[0],
           deposiT_AMOUNT: amount,
           deposiT_TYPE: "1",
           wL_NO: "dragonfly",
           WT_PaymentReference_ID: paymentreferID,
           currency: currencie.split("|")[1],
         } as InitiateDepositParams;
         this.bankDetailsComponent.showModal({ ...params });
         // this.isVisible = false;
       } 
       else if (pspName === "MonetixDoc") {
         this.loaderSubmit = true;
         let body = {
          deposiT_TO: 2,
          paymenT_DESTINATION: accounts.split("|")[0],
          deposiT_AMOUNT: amount,
          currency: currencie.split("|")[1],
          account_Number: upiId
        };
        this.http.monetixDeposit(body).subscribe(
          (res: any) => {
           // this.loaderSubmit = false;
            const content = res.data.data;
            // here delay for 5 sec because UPI url not ready on immediate redirect
            setTimeout(()=> {
              this.http.monetixDepositURL(content.payment_id).subscribe((res:any)=> {
              const redirectUrl = res.data.data;
              window.open(redirectUrl, "_self");
            }) 
            },5000)
          },
          (error) => {
            this.loaderSubmit = false;
            if (error?.body?.message === this.exceedMsg) {
              this.exceed = true;
              this.kycMessage = true;
            } else if (error?.body?.message === this.exceedLimitMsg) {
              this.exceed = true;
            } else {
              this.message.error(error?.body?.message);
            }
          }
        );
      } 

      else if (pspName === "ChipPay") {
        this.loaderSubmit = true;
         let body = {
          deposiT_TO: 2,
          paymenT_DESTINATION: accounts.split("|")[0],
          deposiT_AMOUNT: amount,
          currency: currencie.split("|")[1]
        };
        this.http.chipPayDeposit(body).subscribe(
          (res: any) => {
            this.loaderSubmit = false;
            let content = res.data;
             window.open(content, "_self");
          },
          (error) => {
            this.loaderSubmit = false;
            if (error?.body?.message === this.exceedMsg) {
              this.exceed = true;
              this.kycMessage = true;
            } else if (error?.body?.message === this.exceedLimitMsg) {
              this.exceed = true;
            } else {
              this.message.error(error?.body?.message);
            }
          }
        );
      } 

       else if (pspName === "PaymentHub") {
        this.loaderSubmit = true;
         let body = {
          deposiT_TO: 2,
          paymenT_DESTINATION: accounts.split("|")[0],
          deposiT_AMOUNT: amount,
          currency: currencie.split("|")[1],
          gatewayId:this.gatewayid
        };
        this.http.depositHubPay(body).subscribe(
          (res: any) => {
            this.loaderSubmit = false;
            if(res?.data?.Type === 1){
              const redirectUrl = res.data.Params.RedirectUrl;
              window.open(redirectUrl, "_self");
            } 
            else if(res?.data?.Type === 4){
               const html = res.data.Params.Html;
               const win = window.open('', '_self');
                win.document.open();
                win.document.write(html);
                win.document.close();
                setTimeout(() => {
              const form = win.document.getElementById('form1') as HTMLFormElement;
              if (form) {
                form.submit();
              }
              this.loaderSubmit = false;
            }, 1000);

            }  
          },
          (error) => {
            this.loaderSubmit = false;
            if (error?.body?.message === this.exceedMsg) {
              this.exceed = true;
              this.kycMessage = true;
            } else if (error?.body?.message === this.exceedLimitMsg) {
              this.exceed = true;
            } else {
              this.message.error(error?.body?.message);
            }
          }
        );
      } 



      else if (pspName === "quickPay") {
        const currencyValue =
          this.validateForm.get("wallet")?.value == 1
            ? this.walletBalance.currency
            : this.validateForm.value.accounts.split("|")[1];
        const params = {
          customer_ID: this.tokenSrv.get()?.customer_id,
          deposiT_To: 2,
          paymenT_DESTINATION: accounts.split("|")[0],
          deposiT_AMOUNT: amount,
          deposiT_TYPE: "26",
          wL_NO: "dragonfly",
          WT_PaymentReference_ID: paymentreferID,
          currency: currencie.split("|")[1],
        } as InitiateDepositParams;
        this.quickPayComponent.showModal({ ...params });
        // this.isVisible = false;
      } else if (pspName === "CryptoWallet") {
        this.showCoinModal();
      } else if (pspName === "tripeA") {
        this.router.navigate([`${this.langs}/funds/triplea`], {
          queryParams: {
            // deposiT_TO: wallet, when wallet added need to add wallet value
            deposiT_TO: 2,
            paymenT_DESTINATION: accounts.split("|")[0],
            deposiT_AMOUNT: amount,
            currency: currencie.split("|")[1],
          },
        });
      } else if (pspName === "gpay") {
        this.loaderSubmit = true;
        let body = {
          deposiT_TO: 2,
          paymenT_DESTINATION: accounts.split("|")[0],
          deposiT_AMOUNT: amount,
          currency: currencie.split("|")[1],
        };
        this.http.depositGpay(body).subscribe((res: any) => {
          this.gpayBtn = true;
          this.gpayInfo = res.data;
          this.transactionID = res.data.transactionID;
          this.callSign = res.data.sign;
          setTimeout(() => {
            $(".gpay-card-info-container").click();
            this.loaderSubmit = false;
          }, 1000);
        });
      } else if (pspName === "ePay") {
        this.loaderSubmit = true;
        let body = {
          deposiT_TO: 2,
          paymenT_DESTINATION: accounts.split("|")[0],
          deposiT_AMOUNT: amount,
          currency: currencie.split("|")[1],
        };
        this.http.depositEpay(body).subscribe(
          (res: any) => {
            let data = res.data;
            const options = {
              channelId: data?.channelID,
              customerId: data.customerID,
              merchantType: "ECOMMERCE", // for default merchat need to change from the api also
              merchantId: data.merchantID,
              orderID: data.orderID,
              orderDescription: data.oderDescription,
              orderAmount: data.orderAmount,
              orderCurrency: data.orderCurrency,
              email: data.userEmail,
              mobilenumber: data.mobilenumber,
              countrycode: data?.countrycode,
              merchantLogo: "https://epay.me/assets/images/logo.png",
              showSavedCardsFeature: data.showSavedCardsFeature,
              showCancelButton: data.showCancelButton,
              failedHandler: async (res: any) => {
                this.router.navigateByUrl(`${this.langs}/funds/wallet`);
                this.loaderSubmit = false;
                this.http
                  .epayCallBack(res, data.callSign)
                  .subscribe((res: any) => {});
                console.log(res);
              },
              successHandler: async (res: any) => {
                this.loaderSubmit = false;
                let webHook = res.response;
                // this.http.epayCallBack(webHook, data.callSign).subscribe((res:any)=> {
                //   this.message.success('Your Deposit has been Initiated Successfully')
                this.router.navigateByUrl(`${this.langs}/funds/wallet`);
                // })
                console.log(res);
                this.message.success(
                  "Your Deposit has been Initiated Successfully"
                );
              },
            };
            console.log(options);
            setTimeout(() => {
              this.loaderSubmit = false;
              const epay = new Epay(options);
              epay.open(options);
            }, 500);
          },
          (error) => {
            if (error?.body?.message === this.exceedMsg) {
              this.exceed = true;
              this.kycMessage = true;
            } else if (error?.body?.message === this.exceedLimitMsg) {
              this.exceed = true;
            } else {
              this.message.error(error?.body?.message);
            }
          }
        );
      } else if (pspName === "upi") {
        this.loaderSubmit = true;
        let body = {
          deposiT_TO: 2,
          paymenT_DESTINATION: accounts.split("|")[0],
          deposiT_AMOUNT: amount,
          currency: currencie.split("|")[1],
        };
        this.http.depositUPI(body).subscribe(
          (res: any) => {
            let data = res.data;
            if (res.statusCode == 101) {
              window.open(data.payment_url, "_self");
            } else {
              this.message.error(res.body.message);
              this.loaderSubmit = false;
            }
            console.log(res);
          },
          (error) => {
            this.loaderSubmit = false;
            if (error?.body?.message === this.exceedMsg) {
              this.exceed = true;
              this.kycMessage = true;
            } else if (error?.body?.message === this.exceedLimitMsg) {
              this.exceed = true;
            } else {
              this.message.error(error?.body?.message);
            }
          }
        );
      } else if (pspName === "fatoora") {
        const params = {
          deposiT_TO: 2,
          paymenT_DESTINATION: accounts.split("|")[0],
          deposiT_AMOUNT: amount,
          deposiT_TYPE: "2",
          currency: currencie.split("|")[1],
        };

        this.showFatoorahModal({ ...params });
        // this.router.navigate([`${this.langs}/funds/fatoorah`], {
        //   queryParams: {
        //     deposiT_To: wallet,
        //     paymenT_DESTINATION: this.validateForm.get('wallet')?.value == 1 ? walletNumber : accounts.split('|')[0],
        //     deposiT_AMOUNT: amount,
        //     deposiT_TYPE: '2',
        //     currency: currencie.split('|')[1],
        //   }
        // });
      } else if (pspName === "Nganluong" || pspName === "Help2Pay") {
        this.loaderSubmit = true;
        let body = {
          deposiT_TO: 2,
          paymenT_DESTINATION: accounts.split("|")[0],
          deposiT_AMOUNT: amount,
          currency: currencie.split("|")[1],
          banK_CODE: banklist,
        };
        this.http.depositHelppay(body).subscribe(
          (res: any) => {
            let data = res.data;
            if (res.statusCode == 101) {
              // this.helpPayForm =  this.sanitizer.bypassSecurityTrustResourceUrl(data.formString)
              // this.helpPayForm =  data.formString
              this.dataContainer.nativeElement.innerHTML = data.formString;
              setTimeout(() => {
                $("#dForm").submit();
                this.loaderSubmit = false;
              }, 1000);
              // window.open(data.formString, '_self');
            } else {
              this.message.error(res.body.message);
              this.loaderSubmit = false;
            }
          },
          (error) => {
            this.loaderSubmit = false;
            if (error?.body?.message === this.exceedMsg) {
              this.exceed = true;
              this.kycMessage = true;
            } else if (error?.body?.message === this.exceedLimitMsg) {
              this.exceed = true;
            } else {
              this.message.error(error?.body?.message);
            }
          }
        );
      } else if (pspName === "hyperBc") {
        this.loaderSubmit = true;
        let body = {
          deposiT_TO: 2,
          paymenT_DESTINATION: accounts.split("|")[0],
          deposiT_AMOUNT: amount,
          currency: currencie.split("|")[1],
          Address_Type: hyperBCCoin,
        };
        this.http.depositHyperBC(body).subscribe(
          (res: any) => {
            let data = res.data;
            if (res.statusCode == 101) {
              this.showHyperBCModal(data);
            } else {
              this.message.error(res.body.message);
              this.loaderSubmit = false;
            }
          },
          (error) => {
            this.loaderSubmit = false;
            if (error?.body?.message === this.exceedMsg) {
              this.exceed = true;
              this.kycMessage = true;
            } else if (error?.body?.message === this.exceedLimitMsg) {
              this.exceed = true;
            } else {
              this.message.error(error?.body?.message);
            }
          }
        );
      } else if (pspName === "lean") {
        this.loaderSubmit = true;
        let body = {
          deposiT_TO: 2,
          paymenT_DESTINATION: accounts.split("|")[0],
          deposiT_AMOUNT: amount,
          currency: currencie.split("|")[1],
        };
        this.http.depositLean(body).subscribe(
          (res: any) => {
            let data = res.data;
            if (res.statusCode == 101) {
              if (data.is_Already_Connected && data.payment_intent_id != null) {
                this.leanPay(data);
              } else {
                this.leanInitData = data;
                this.isVisibleLean = true;
              }
            } else {
              this.message.error(res.body.message);
              this.loaderSubmit = false;
            }
            this.loaderSubmit = false;
          },
          (error) => {
            this.loaderSubmit = false;
            if (error?.body?.message === this.exceedMsg) {
              this.exceed = true;
              this.kycMessage = true;
            } else if (error?.body?.message === this.exceedLimitMsg) {
              this.exceed = true;
            } else {
              this.message.error(error?.body?.message);
            }
          }
        );
      } else if (pspName === "globe") {
        let body = {
          deposiT_TO: 2,
          paymenT_DESTINATION: accounts.split("|")[0],
          deposiT_AMOUNT: amount,
          currency: currencie.split("|")[1],
        };
        this.http.gpDeposit(body).subscribe(
          (res: any) => {
            if (res.statusCode === 101) {
              this.loaderSubmit = false;
              let content = res.data;
              $(document).ready(function () {
                $(content).appendTo("body").submit();
              });
            }
          },
          (error) => {
            this.loaderSubmit = false;
            if (error?.body?.message === this.exceedMsg) {
              this.exceed = true;
              this.kycMessage = true;
            } else if (error?.body?.message === this.exceedLimitMsg) {
              this.exceed = true;
            } else {
              this.message.error(error?.body?.message);
            }
          }
        );
      } 
      
      else if (pspName === "PaymentAsia") {
        let body = {
          deposiT_TO: 2,
          paymenT_DESTINATION: accounts.split("|")[0],
          deposiT_AMOUNT: amount,
          currency: currencie.split("|")[1],
        };
        this.http.paDeposit(body).subscribe(
          (res: any) => {
            this.loaderSubmit = false;
            let content = res.data;
            $(document).ready(function () {
              $(content).appendTo("body").submit();
            });
          },
          (error) => {
            this.loaderSubmit = false;
            if (error?.body?.message === this.exceedMsg) {
              this.exceed = true;
              this.kycMessage = true;
            } else if (error?.body?.message === this.exceedLimitMsg) {
              this.exceed = true;
            } else {
              this.message.error(error?.body?.message);
            }
          }
        );
      } 
      
       else if (pspName === "Orbital") {
        this.loaderSubmit = true;
        let body = {
          deposiT_TO: 2,
          paymenT_DESTINATION: accounts.split("|")[0],
          deposiT_AMOUNT: amount,
           currency: currencie.split("|")[1],
          coinName: this.coinName,
          protocol: this.protocol,
        };
        this.http.orbitalDeposit(body).subscribe(
          (res: any) => {
            this.loaderSubmit = false;
            let content = res.data;
             window.open(content, "_self");
          },
          (error) => {
            this.loaderSubmit = false;
            if (error?.body?.message === this.exceedMsg) {
              this.exceed = true;
              this.kycMessage = true;
            } else if (error?.body?.message === this.exceedLimitMsg) {
              this.exceed = true;
            } else {
              this.message.error(error?.body?.message);
            }
          }
        );
      } 

      else if (pspName === "skrill") {
        let body = {
          deposiT_TO: 2,
          paymenT_DESTINATION: accounts.split("|")[0],
          deposiT_AMOUNT: amount,
          currency: currencie.split("|")[1],
          PayType: "Skrill",
        };
        this.http.skrillDeposit(body).subscribe(
          (res: any) => {
            if (res.statusCode === 101) {
              this.loaderSubmit = false;
              let content = res.data;
              $(document).ready(function () {
                $(content).appendTo("body").submit();
              });
            }
          },
          (error) => {
            this.loaderSubmit = false;
            if (error?.body?.message === this.exceedMsg) {
              this.exceed = true;
              this.kycMessage = true;
            } else if (error?.body?.message === this.exceedLimitMsg) {
              this.exceed = true;
            } else {
              this.message.error(error?.body?.message);
            }
          }
        );
      } else if (pspName === "neteller") {
        this.loaderSubmit = true;
        this.router.navigate([`${this.langs}/funds/netellerPay`], {
          queryParams: {
            deposiT_TO: 2,
            paymenT_DESTINATION: accounts.split("|")[0],
            deposiT_AMOUNT: amount,
            currency: currencie.split("|")[1],
          },
        });
        // let body = {
        //   deposiT_TO: 2,
        //   paymenT_DESTINATION: accounts.split('|')[0],
        //   deposiT_AMOUNT: amount,
        //   currency: currencie.split('|')[1]
        // }
        // this.http.netterlerDeposit(body).subscribe((res:any)=> {
        //   if(res.statusCode === 101)  {
        //     this.loaderSubmit = false
        //     let content = res.data
        //     window.open(content, '_self');
        //   }
        // })
      }

      // else if (this.radioValue === 'bvnk') {
      //   this.router.navigate([`${this.langs}/funds/coinpay`], {
      //     queryParams: {
      //       deposiT_TO: 2,
      //       paymenT_DESTINATION: accounts.split('|')[0],
      //       deposiT_AMOUNT: amount,
      //       currency: currencie.split('|')[1],
      //       isFrmMb: false
      //     }
      //   })
      // }
      else if (pspName === "bvnk") {
        this.loaderSubmit = true;
        let body = {
          deposiT_TO: 2,
          paymenT_DESTINATION: accounts.split("|")[0],
          deposiT_AMOUNT: amount,
          currency: currencie.split("|")[1],
          isFrmMb: false,
        };
        this.http.bvnkDeposit(body).subscribe(
          (res: any) => {
            if (res.statusCode === 101) {
              this.loaderSubmit = false;
              // window.open(res?.data, '_self');
              this.isVisibleBVNK = true;
              this.bvnkURL = this.sanitizer.bypassSecurityTrustResourceUrl(
                res?.data
              );
            }
          },
          (error) => {
            this.loaderSubmit = false;
            if (error?.body?.message === this.exceedMsg) {
              this.exceed = true;
              this.kycMessage = true;
            } else if (error?.body?.message === this.exceedLimitMsg) {
              this.exceed = true;
            } else {
              this.message.error(error?.body?.message);
            }
          }
        );
      } else if (pspName === "bridgerpay") {
        this.loaderSubmit = true;
        let body = {
          deposiT_TO: 2,
          paymenT_DESTINATION: accounts.split("|")[0],
          deposiT_AMOUNT: amount,
          currency: currencie.split("|")[1],
          isFrmMb: true,
          personal_Id: pesronalId,
          isRequired_iframeLink: true,
        };
        this.http.bridgerpayDeposit(body).subscribe(
          (res: any) => {
            if (res.statusCode === 101) {
              this.loaderSubmit = false;
              window.open(res?.data, "_self");
              //  this.isVisibleBVNK = true
              // this.bvnkURL = this.sanitizer.bypassSecurityTrustResourceUrl(res?.data);
            }
          },
          (error) => {
            this.loaderSubmit = false;
            if (error?.body?.message === this.exceedMsg) {
              this.exceed = true;
              this.kycMessage = true;
            } else if (error?.body?.message === this.exceedLimitMsg) {
              this.exceed = true;
            } else {
              this.message.error(error?.body?.message);
            }
          }
        );
      } else if (pspName === "bliPay" || pspName === "Blizzard Pay") {
        this.loaderSubmit = true;
        let body = {
          deposiT_TO: 2,
          paymenT_DESTINATION: accounts.split("|")[0],
          deposiT_AMOUNT: amount,
          currency: currencie.split("|")[1],
          isFrmMb: true,
          isRequired_iframeLink: true,
        };
        this.http.blizzardpayDeposit(body).subscribe(
          (res: any) => {
            if (res.statusCode === 101) {
              this.loaderSubmit = false;
              window.open(res?.data, "_self");
              //  this.isVisibleBVNK = true
              // this.bvnkURL = this.sanitizer.bypassSecurityTrustResourceUrl(res?.data);
            }
          },
          (error) => {
            this.loaderSubmit = false;
            if (error?.body?.message === this.exceedMsg) {
              this.exceed = true;
              this.kycMessage = true;
            } else if (error?.body?.message === this.exceedLimitMsg) {
              this.exceed = true;
            } else {
              this.message.error(error?.body?.message);
            }
          }
        );
      } else if (pspName === "egPay") {
        this.loaderSubmit = true;
        let body = {
          deposiT_TO: 2,
          paymenT_DESTINATION: accounts.split("|")[0],
          deposiT_AMOUNT: amount,
          currency: currencie.split("|")[1],
          isFrmMb: false,
          isRequired_iframeLink: true,
          payOption: this.egValue,
          walletID: this.egWalletPay ? "0101 025 4485" : null,
        };
        this.http.egPayDeposit(body).subscribe(
          (res: any) => {
            if (res.statusCode === 101) {
              this.loaderSubmit = false;
              if (this.egWalletPay) {
                this.message.success(
                  this.i18nSev.i18n(
                    "Your Deposit has been Initiated Successfully, Kindly Transfer to this Vodafone Wallet from your Personal Number"
                  )
                );
              } else {
                this.message.success(
                  this.i18nSev.i18n(
                    "Your Deposit has been Initiated Successfully, We will Contact you Shortly"
                  )
                );
              }
              this.router.navigateByUrl(`${this.langs}/funds/wallet`);
            }
          },
          (error) => {
            this.loaderSubmit = false;
            if (error?.body?.message === this.exceedMsg) {
              this.exceed = true;
              this.kycMessage = true;
            } else if (error?.body?.message === this.exceedLimitMsg) {
              this.exceed = true;
            } else {
              this.message.error(error?.body?.message);
            }
          }
        );
      } else if (pspName === "expay") {
        this.loaderSubmit = true;
        let body = {
          deposiT_TO: 2,
          paymenT_DESTINATION: accounts.split("|")[0],
          deposiT_AMOUNT: amount,
          currency: currencie.split("|")[1],
          isFrmMb: false,
          isRequired_iframeLink: true,
          coinName: this.coinName,
          protocol: this.protocol,
        };
        this.http.exlinkDeposit(body).subscribe(
          (res: any) => {
            if (res.statusCode === 101) {
              this.loaderSubmit = false;
              window.open(res?.data, "_self");
            }
          },
          (error) => {
            this.loaderSubmit = false;
            if (error?.body?.message === this.exceedMsg) {
              this.exceed = true;
              this.kycMessage = true;
            } else if (error?.body?.message === this.exceedLimitMsg) {
              this.exceed = true;
            } else {
              this.message.error(error?.body?.message);
            }
          }
        );
      } else if (pspName === "UniPayment") {
        this.loaderSubmit = true;
        let body = {
          deposiT_TO: 2,
          paymenT_DESTINATION: accounts.split("|")[0],
          deposiT_AMOUNT: amount,
          currency: currencie.split("|")[1],
          isFrmMb: false,
          isRequired_iframeLink: true,
        };
        this.http.unipaydeposit(body).subscribe(
          (res: any) => {
            if (res.statusCode === 101) {
              this.loaderSubmit = false;
              window.open(res?.data, "_self");
            }
          },
          (error) => {
            this.loaderSubmit = false;
            if (error?.body?.message === this.exceedMsg) {
              this.exceed = true;
              this.kycMessage = true;
            } else if (error?.body?.message === this.exceedLimitMsg) {
              this.exceed = true;
            } else {
              this.message.error(error?.body?.message);
            }
          }
        );
      } else if (pspName === "cheeze") {
        this.loaderSubmit = true;
        let body = {
          deposiT_TO: 2,
          paymenT_DESTINATION: accounts.split("|")[0],
          deposiT_AMOUNT: amount,
          currency: currencie.split("|")[1],
          legalCoin: currencie.split("|")[1],
          isFrmMb: false,
          isRequired_iframeLink: true,
        };
        this.http.cheezePay(body).subscribe(
          (res: any) => {
            if (res.statusCode === 101) {
              this.isVisibleCheeze = true;
              this.loaderSubmit = false;
              this.cheezeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
                res?.data?.url
              );
              // window.open(res?.data?.url, '_self');
            }
          },
          (error) => {
            this.loaderSubmit = false;
            this.isVisibleCheeze = false;
            if (error?.body?.message === this.exceedMsg) {
              this.exceed = true;
              this.kycMessage = true;
            } else if (error?.body?.message === this.exceedLimitMsg) {
              this.exceed = true;
            } else {
              this.message.error(error?.body?.message);
            }
          }
        );
      } 
      
      else if (pspName === "CCoop") {
        this.loaderSubmit = true;
        let body = {
          deposiT_TO: 2,
          paymenT_DESTINATION: accounts.split("|")[0],
          deposiT_AMOUNT: amount,
          currency: currencie.split("|")[1],
          isFrmMb: false,
          isRequired_iframeLink: true,
        };
        this.http.ccoopDeposit(body).subscribe(
          (res: any) => {
            if (res.statusCode === 101) {
              this.isVisibleCop = true;
              this.loaderSubmit = false;
              this.copUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
                res?.data?.redirectUrl
              );
              // window.open(res?.data?.redirectUrl, '_blank');
            }
          },
          (error) => {
            this.loaderSubmit = false;
            // this.isVisibleCheeze = false
            if (error?.body?.message === this.exceedMsg) {
              this.exceed = true;
              this.kycMessage = true;
              this.isVisibleCop = false;
            } else if (error?.body?.message === this.exceedLimitMsg) {
              this.exceed = true;
              this.isVisibleCop = false;
            } else {
              this.message.error(error?.body?.message);
              this.isVisibleCop = false;
            }
          }
        );
      } 
       else if (pspName === "MTPay") {
        this.loaderSubmit = true;
        let body = {
          deposiT_TO: 2,
          paymenT_DESTINATION: accounts.split("|")[0],
          deposiT_AMOUNT: amount,
          currency: currencie.split("|")[1],
         // paymenT_METHOD_ID: this.egValue,
          isFrmMb: false,
          customer_ChineseName: Customer_ChineseName,
          isRequired_iframeLink: true,
        };
        this.http.mtpayDeposit(body).subscribe(
          (res: any) => {
            if (res.statusCode === 101) {
              this.isVisibleCop = true;
              this.loaderSubmit = false;
              this.copUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
                res?.data
              );
            }
          },
          (error) => {
            this.loaderSubmit = false;
            // this.isVisibleCheeze = false
            if (error?.body?.message === this.exceedMsg) {
              this.exceed = true;
              this.kycMessage = true;
              this.isVisibleCop = false;
            } else if (error?.body?.message === this.exceedLimitMsg) {
              this.exceed = true;
              this.isVisibleCop = false;
            } else {
              this.message.error(error?.body?.message);
              this.isVisibleCop = false;
            }
          }
        );
      }
      else if (pspName === "1-2-Pay") {
        this.loaderSubmit = true;
        let body = {
          deposiT_TO: 2,
          paymenT_DESTINATION: accounts.split("|")[0],
          deposiT_AMOUNT: amount,
          currency: currencie.split("|")[1],
          isFrmMb: false,
          isRequired_iframeLink: true,
        };
        this.http.oneTwopay(body).subscribe(
          (res: any) => {
            if (res.statusCode === 101) {
              this.isVisibleOneTwo = true;
              this.loaderSubmit = false;
              this.oneTwoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
                res?.data?.code_image
              );
              this.onetwoPay = res?.data;
              this.config = {
                leftTime: this.timeData,
                format: "mm:ss",
                demand: true,
              };
              this.start();
            }
          },
          (error) => {
            this.loaderSubmit = false;
            // this.isVisibleCheeze = false
            if (error?.body?.message === this.exceedMsg) {
              this.exceed = true;
              this.kycMessage = true;
              this.isVisibleCop = false;
            } else if (error?.body?.message === this.exceedLimitMsg) {
              this.exceed = true;
              this.isVisibleCop = false;
            } else {
              this.message.error(error?.body?.message);
              this.isVisibleCop = false;
            }
          }
        );
      } 
       else if (pspName === "OMPAY") {
        if (omType === null) {
          this.message.error("Please select OM Type");
        } else {
          this.loaderSubmit = true;
          let body = {
            customer_ID: this.tokenSrv.get()?.customer_id,
            deposiT_TO: 2,
            paymenT_DESTINATION: accounts.split("|")[0],
            deposiT_AMOUNT: amount,
            deposiT_TYPE: "2",
            wL_NO: "dragonfly",
            currency: currencie.split("|")[1],
            OmType: omType,
          };
          this.http.OmPay(body).subscribe(
            (res: any) => {
              this.loaderSubmit = false;
              if (res.statusCode === 101) {
                if (res.data) {
                  window.open(res.data, "_self");
                } else {
                  this.message.success(this.i18nSev.i18n(res.message));
                }
                this.start();
              } else {
                this.message.error(res.body.message);
              }
            },
            (error) => {
              this.loaderSubmit = false;
              // this.isVisibleCheeze = false
              if (error?.body?.message === this.exceedMsg) {
                this.exceed = true;
                this.kycMessage = true;
                this.isVisibleCop = false;
              } else if (error?.body?.message === this.exceedLimitMsg) {
                this.exceed = true;
                this.isVisibleCop = false;
              } else {
                this.message.error(error?.body?.message);
                this.isVisibleCop = false;
              }
            }
          );
        }
      } 
      else if (pspName === "OnlinePay") {
        this.loaderSubmit = true;
        let body = {
          DEPOSIT_TO: 2,
          PAYMENT_DESTINATION: accounts.split("|")[0],
          amount: amount,
          currency: currencie.split("|")[1],
          isFrmMb: false,
          isRequired_iframeLink: true,
        };
        this.http.OnlinePayDeposit(body).subscribe(
          (res: any) => {
            if (res.statusCode === 101) {
              this.loaderSubmit = false;
              console.log(JSON.stringify(res.data), "res--");
              this.submitActionPost(res.data);
              // window.open(res?.data, "_self");
            }
          },
          (error: any) => {
            this.loaderSubmit = false;
            // this.isVisibleCheeze = false
            if (error?.body?.message === this.exceedMsg) {
              this.exceed = true;
              this.kycMessage = true;
              this.isVisibleCop = false;
            } else if (error?.body?.message === this.exceedLimitMsg) {
              this.exceed = true;
              this.isVisibleCop = false;
            } else {
              this.message.error(error?.body?.message);
              this.isVisibleCop = false;
            }
          }
        );
      } else {
        this.message.error("Please Select any Payment Method");
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

  submitActionPost(dataObj) {
    const form = document.createElement("form");
    const actionUrl = `${dataObj.url}/?tkn=${dataObj.token}&sky=${dataObj.secretKey}`;
    form.method = "POST";
    form.action = actionUrl;

    // Convert nested object values to individual inputs
    const flattenObject = (obj: any, parentKey = "") => {
      Object.keys(obj).forEach((key) => {
        const newKey = parentKey ? `${parentKey}[${key}]` : key;
        if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
          flattenObject(obj[key], newKey);
        } else if (Array.isArray(obj[key])) {
          obj[key].forEach((item, index) =>
            flattenObject(item, `${newKey}[${index}]`)
          );
        } else {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = newKey;
          input.value = obj[key];
          form.appendChild(input);
        }
      });
    };

    flattenObject(dataObj);

    document.body.appendChild(form);
    form.submit();
  }

  showModal(id?: string): void {
    this.isAccount = true;
    this.validateForm.get("wallet")?.setValue(2);
    this.depositChange(2, id);
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
    this.router.navigateByUrl(`${this.langs}/funds/wallet`);
    this.validateForm.get("amount")!.reset();
    this.radioValue = "";
  }

  getAllDepositTo() {
    this.http.getAllDepositTo().subscribe((res: any) => {
      this.depositTo = res.data;
      this.validateForm.get("wallet")!.setValue(res.data[0]?.id);
    });
  }
  depositChange(e: any, id?: string) {
    // TradingAccount
    this.http
      .getAllAccountsByCustomerID(this.tokenSrv.get()?.customer_id)
      .subscribe((res: any) => {
        this.accounts = res.data;
        this.selectAccount = res.data[0]?.code + "|" + res.data[0]?.mT_Currency;
      });
    // if (e == 2) {
    //   this.http.getAllAccountsByCustomerID(this.tokenSrv.get()?.customer_id).subscribe((res: any) => {
    //     this.accounts = res.data;

    //     id && this.validateForm.get('accounts')?.setValue(id);
    //   });
    // } else {
    //   this.validateForm.get('accounts')?.setValue('');
    // }
  }

  tradingChange(e: any) {
    const code = e?.split("|")[0];
    this.account = code;
    if (this.validateForm.value.wallet === 2) {
      this.getMT4AccountDetail(code);
      this.http
        .getBalanceByAccountLogin({
          code,
          type: this.validateForm.value.wallet === 1 ? "W" : "C",
        })
        .subscribe((res: any) => {
          this.tradingBalance = {
            ...this.tradingBalance,
            balance: res?.data ?? 0.0,
            currency: e.split("|")[1],
          };
        });
      this.getExchangeRate(
        e?.split("|")[1],
        this.validateForm.value?.currencie?.split("|")[1]
      );
    }
  }

  getExchangeRate(FromCurrency: string, ToCurrency: string) {
    this.balanceLoader = false;
    this.http
      .getExchangeRate({
        FromCurrency,
        ToCurrency,
        TransactionType: "deposit",
        PaymentMethod: this.PaymentMethod,    // pass 47 if psp is mtpay else 0
      })
      .subscribe((res: any) => {
        // const exchangeData = res.data === 0 ? 1 : res.data;
        // this.exchangeRate = exchangeData?.toFixed(2)
        this.exchangeRate = res.data === 0 ? 1 : res.data;
        this.balanceLoader = true;
      });
  }
  showOMPAYTypes = null;
  currencieChange(e: any) {
    this.getExchangeRate(
      this.validateForm.value.accounts?.split("|")[1] ??
        this.walletBalance.currency,
      e?.split("|")[1]
    );
      const pspName = this.pspdata?.split("|")[0];
    if (pspName === "OMPAY") {
      const currency = e?.split("|")[1];
      switch (currency) {
        case "MYR":
          this.showOMPAYTypes = [
            {
              id: "offline",
              name: "Bank transfer",
            },
            {
              id: "online",
              name: "FPX channel",
            },
          ];
          break;
        case "IDR":
          this.showOMPAYTypes = [
            {
              id: "offline",
              name: "Bank transfer",
            },
            {
              id: "qr",
              name: "QR Code",
            },
          ];
          break;
        case "SGD":
          this.showOMPAYTypes = [
            {
              id: "offline",
              name: "Bank transfer",
            },
          ];
          break;
        case "THB":
          this.showOMPAYTypes = [
            {
              id: "qr",
              name: "QR Code",
            },
          ];
          break;
        case "VND":
          this.showOMPAYTypes = [
            {
              id: "qr",
              name: "QR Code",
            },
          ];
          break;
        case "USD":
          this.showOMPAYTypes = [
            {
              id: "crypto",
              name: "Crypto",
            },
          ];
          break;
        default:
          this.showOMPAYTypes = null;
          break;
      }
    } else {
      this.showOMPAYTypes = null;
    }
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
  getMT4AccountDetail(code: any) {
    this.http.getMT4AccountDetail(code).subscribe((res: any) => {
      console.log(this.total);
      this.total = res.data[0];
    });
  }

  // coin payment
  submitCoinForm(): void {
    this.isConfirmLoading = true;
    const { accounts, amount } = this.validateForm.value;
    if (this.cryptoForm.valid) {
      //  this.router.navigate([`${this.langs}/funds/coinpay`], {
      //    queryParams: {
      //      paymenT_DESTINATION: accounts.split('|')[0],
      //     deposiT_AMOUNT: amount,
      //     deposiT_TYPE: '3',
      //     coin: this.cryptoForm.value.coin_pay,
      //     name: 'CoinPayments'
      //    }
      //  })

      const params = {
        paymenT_DESTINATION: accounts.split("|")[0],
        deposiT_AMOUNT: amount,
        deposiT_TYPE: "3",
        coin: this.cryptoForm.value.coin_pay,
      };

      this.http.coinDeposit(params).subscribe(
        (res: any) => {
          let data = res.data;
          if (res.statusCode == 101) {
            window.open(data.result.checkout_url, "_self");
            this.isVisible = false;
            this.isConfirmLoading = false;
          } else {
            this.message.error(res.body.message);
            this.isConfirmLoading = false;
          }
        },
        (error) => {
          this.isConfirmLoading = false;
          if (error?.body?.message === this.exceedMsg) {
            this.exceed = true;
            this.kycMessage = true;
          } else if (error?.body?.message === this.exceedLimitMsg) {
            this.exceed = true;
          } else {
            this.message.error(error?.body?.message);
          }
        }
      );
    } else {
      Object.values(this.cryptoForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      this.isConfirmLoading = false;
    }
  }

  showCoinModal(): void {
    this.isVisible = true;
  }

  showFatoorahModal(param: any): void {
    this.params = param;
    this.isVisiblef = true;
    console.log(param);
    this.http.getAvailablePaymentMethods(param).subscribe(
      (res: any) => {
        if (res.statusCode === 101) {
          this.paymentCurrency = param.currency;
          this.paymentList = res.data;
          this.loadingpayment = false;
          console.log(res);
        } else {
          this.message.error(res?.message);
        }
      },
      (error) => {
        this.loaderSubmit = false;
        if (error?.body?.message === this.exceedMsg) {
          this.exceed = true;
          this.kycMessage = true;
        } else if (error?.body?.message === this.exceedLimitMsg) {
          this.exceed = true;
        } else {
          this.message.error(error?.body?.message);
        }
      }
    );
  }

  handleCancelf(): void {
    this.isVisiblef = false;
  }

  handleCancelP(): void {
    this.isVisiblePayHub = false;
  }

  showHyperBCModal(param: any): void {
    this.params = param;
    this.isVisibleHyperModal = true;
    this.loadingpayment = false;
    this.hyperQrAmount = param.amount;
    this.hyperQrCode = param.qrCode;
    this.hyperCoinAddress = param.address;
    this.hyperCoinSelected =
      this.hyperBCCoinList[this.validateForm.controls["hyperBCCoin"].value];
    this.polling = setInterval(() => {
      this.getDepositStatusByID(param.depositID);
    }, 3000);
  }

  closeHyperBCModal(): void {
    this.resetInterval();
    this.isVisibleHyperModal = false;
    this.loaderSubmit = false;
    this.router.navigateByUrl(`${this.langs}/funds/wallet`);
  }

  getDepositStatusByID(param: any): void {
    console.log(param);
    this.http.GetDepositById(param).subscribe(
      (res: any) => {
        let data = res.data;
        console.log(data);
        if (res.statusCode === 100) {
          if (data.status != 97) {
            this.resetInterval();
            this.message.success("Your payment has been processed");
            setTimeout(() => {
              this.router.navigateByUrl(`${this.langs}/funds/wallet`);
            }, 2000);
          }
        } else {
          this.message.error(res?.message);
          this.resetInterval();
        }
      },
      (error) => {
        this.loaderSubmit = false;
        this.message.error(error?.body?.message);
        this.resetInterval();
      }
    );
  }

  // handleOk(): void {
  //   console.log('Button ok clicked!');
  //   this.isVisible = false;
  // }

  handleCancelCoin(): void {
    this.isVisible = false;
    this.cryptoForm.reset();
  }

  resetInterval() {
    clearInterval(this.polling);
  }

  cancel() {
    this.isVisible = false;
  }

  onLoadPaymentData(event: any) {
    console.log("payment success", event);
    let data = {
      detail: event?.detail,
    };
    let body = {
      transactionID: this.transactionID,
      statusCode: "SUCCESS",
      message: "Your Deposit has been Initiated Successfully",
      callSign: this.callSign,
      responseString: data,
      paymentMethodData: {
        type: event?.detail?.paymentMethodData?.type,
        description: event?.detail?.paymentMethodData?.description,
        cardNetwork:
          event?.detail?.paymentMethodData?.description?.info?.cardNetwork,
        cardDetails:
          event?.detail?.paymentMethodData?.description?.info?.cardDetails,
      },
    };
    this.http.gpayCallBack(body).subscribe((res: any) => {
      this.message.success("Your Deposit has been Initiated Successfully");
      this.router.navigateByUrl(`${this.langs}/funds/wallet`);
    });
  }

  onCancel(event: any) {
    console.log(event);
    let body = {
      transactionID: this.transactionID,
      statusCode: event.detail.statusCode,
      message: event.detail.message,
      callSign: this.callSign,
    };
    this.http.gpayCallBack(body).subscribe((res: any) => {
      console.log(res);
    });
  }

  submitFatoorah() {
    this.isConfirmLoadingf = true;
    // this.router.navigate([`${this.langs}/funds/fatoorapay`], {
    //      queryParams: {
    //       ...this.params,
    //       paymenT_METHOD_ID: this.accountDetails.paymentMethodId
    //      }
    // })

    this.http
      .depositFatoora({
        ...this.params,
        paymenT_METHOD_ID: this.accountDetails.paymentMethodId,
      })
      .subscribe(
        (res: any) => {
          window.open(res.data, "_self");
          this.isConfirmLoadingf = false;
        },
        (error) => {
          this.isConfirmLoadingf = false;
          this.message.error(error?.body?.message);
        }
      );
  }

  selectBankAccount(data: any) {
    console.log(data);
    this.accountDetails = data;
    const res = this.paymentList.map((i: any) => {
      if (i.paymentMethodId == data.paymentMethodId) {
        return {
          ...i,
          isDefault: true,
        };
      } else {
        return {
          ...i,
          isDefault: false,
        };
      }
    });
    this.paymentList = [...res];
  }

  handleCancelLean(): void {
    this.isVisibleLean = false;
  }

  handleCancelBVNK(): void {
    this.isVisibleBVNK = false;
  }

  leanConnect(data: any) {
    this.isVisibleLean = false;
    Lean.connect({
      app_token: data.lean_App_Token,
      customer_id: data.customer_id,
      payment_destination_id: data.lean_DestinatinID,
      permissions: data.permissions,
      sandbox: data.sandbox,
    });
  }

  leanPay(data: any) {
    Lean.pay({
      app_token: data.lean_App_Token,
      payment_intent_id: data.payment_intent_id,
      sandbox: data.sandbox,
    });
  }

  goVerify() {
    this.router.navigate([`${this.langs}/profile`]);
  }

  validateAlterAus() {
    this.validateForm.controls["country"]?.setValidators([Validators.required]);
    this.validateForm.controls["state"]?.setValidators([
      Validators.required,
      Validators.pattern("^.{1,3}$"),
    ]);
    this.validateForm.controls["city"]?.setValidators([Validators.required]);
    this.validateForm.controls["street"]?.setValidators([
      Validators.required,
      Validators.pattern("^.{5,100}$"),
    ]);
    this.validateForm.controls["zipCode"]?.setValidators([Validators.required]);
  }

  inValidateAlterAus() {
    this.validateForm.controls["country"]?.clearValidators();
    this.validateForm.controls["country"]?.updateValueAndValidity();
    this.validateForm.controls["state"]?.clearValidators();
    this.validateForm.controls["state"]?.updateValueAndValidity();
    this.validateForm.controls["city"]?.clearValidators();
    this.validateForm.controls["city"]?.updateValueAndValidity();
    this.validateForm.controls["street"]?.clearValidators();
    this.validateForm.controls["street"]?.updateValueAndValidity();
    this.validateForm.controls["zipCode"]?.clearValidators();
    this.validateForm.controls["zipCode"]?.updateValueAndValidity();
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

  handleCancelCheeze(): void {
    this.isVisibleCheeze = false;
    this.loaderSubmit = false;
  }

  handleCancelCop(): void {
    this.isVisibleCop = false;
    this.loaderSubmit = false;
    this.router.navigateByUrl(`${this.langs}/funds/wallet`);
  }

  handleCancelOneTwo() {
    this.isVisibleOneTwo = false;
    this.loaderSubmit = false;
    this.showBtn = true;
  }
  bankText: boolean = true;
  cryptoText: boolean = false;
  cardText: boolean = false;
  tableClick(tab: any) {
    console.log(
      tab.availablePSPs[0]?.name + "|" + tab.availablePSPs[0]?.default_Currency
    );
    const tabName = tab.availablePSPs[0]?.name;
    console.log(tabName)
    const tabSelect =
      tab.availablePSPs[0]?.name + "|" + tab.availablePSPs[0]?.default_Currency;
    this.pspdata = tabSelect;
    const currency = tab.availablePSPs[0]?.default_Currency;
    this.validateForm.get("currencie")!.setValue(`${currency}|${currency}`);

    if (tabName === "WireTransfer") {
      this.minDeposit = 20
      this.maxDeposit = 50000
      this.wirePay = true;
      this.cryptoText = false;
       this.curDisable = false
    } else {
      this.instant = true;
      this.wirePay = false;
    }

     if (tabName === "BankTransfer") {
      this.minDeposit = 20
      this.maxDeposit = 50000
      this.cryptoText = false;
       this.curDisable = false
    } else {
      this.instant = false;
      this.wirePay = false;
    }


    if(tabName === 'ChipPay') {
      this.minDeposit = 120
      this.maxDeposit = 6500
      this.bankText = true;
    } else {
      this.bankText = false;
    }

    if(tabName === 'fatoora') {
      this.minDeposit = 20
       this.maxDeposit = 10000
       this.cardText = true;
    } else {
      this.cardText = false;
    }

     if(tabName === '1-2-Pay') {
      this.minDeposit = 20
       this.maxDeposit = 5000
    }

    if(tabName === 'MTPay') {
       this.minDeposit = 150
       this.MtPay = true
       this.maxDeposit = 7000
      } else {
         this.MtPay = false
      }

   if (tabName === "MonetixDoc") {
     this.minDeposit = 20
      this.moniPay = true;
       this.maxDeposit = 1000
    } else {
      this.moniPay = false;
    }

    if (tabName === "Orbital") {
      this.cryptoText = true;
      setTimeout(()=> {
        this.curDisable = true;
      },200)
    } else {
      this.cryptoText = false;
       this.curDisable = false;
    }

    if (tabName === "egPay") {
      this.egpayHide = true;
    } else {
      this.egpayHide = false;
      this.egWalletPay = false;
    }

    if (tabName === "Nganluong" || tabName === "Help2Pay") {
      this.helpPay = true;
    } else {
      this.helpPay = false;
      this.validateForm.controls["banklist"].clearValidators();
      this.validateForm.controls["banklist"].updateValueAndValidity();
    }

    if (tabName === "hyperbc") {
      this.isHyperBCList = true;
      this.validateForm.controls["hyperBCCoin"].setValidators([
        Validators.required,
      ]);
    } else {
      this.isHyperBCList = false;
      this.validateForm.controls["hyperBCCoin"].clearValidators();
      this.validateForm.controls["hyperBCCoin"].updateValueAndValidity();
    }

    if (tabName === "Orbital") {
      this.minDeposit = 10
      this.maxDeposit = 100000
      this.expay = true;
      this.cryptoText = true;
      this.bankText = false;
      this.curDisable = false;
    } else {
      this.expay = false;
    }
  }

  timeData = "900";
  config: any;
  showBtn: boolean = true;

  onTimerFinished(e: any) {
    if (e["action"] == "done") {
      this.showBtn = false;
    }
  }

  start() {
    this.config = { leftTime: this.timeData, format: "mm:ss", demand: false };
  }

  paymentComplete() {
    this.router.navigateByUrl(`${this.langs}/funds/wallet`);
  }

  getPaymentHubMethods() {
    this.http.getAllPaymentHubMethods().subscribe((res: any) => {
      this.paymentHubList = res.data[0].gateways;
      this.loadingpayment = false
    });
  }
    gatewayid:any
    selectPayHub(data: any) {
    console.log(data);
    this.gatewayid = data.gatewayid;
    this.isVisiblePayHub = false;
    this.maxDeposit = 2000
  }

   getGatewayIcon(name: string): string {
    switch (name?.toLowerCase()) {
      case 'hclever':
        return 'assets/payment-icons/hclever.svg';
      case 'chippay':
        return 'assets/images/funds/chippay.png';
      case 'jpay':
        return 'assets/images/funds/jpay.png';
      default:
        return 'assets/images/funds/default.png';
    }
  }


}