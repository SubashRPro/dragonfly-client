import { Component, EventEmitter, Injector, OnInit, Output, ViewChild, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { I18NService } from '@core';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { NzMessageService } from 'ng-zorro-antd/message';
import { InitiateDepositParams, InitiateWithdrawParams } from 'src/app/models/funds';
import { ApiService } from 'src/app/services/api.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { BankDetailsComponent } from '../bank-details/bank-details.component';
import { SuccessModalComponent } from '../success-modal/success-modal.component';
import { WireTransferModalComponent } from '../wire-transfer-modal/wire-transfer-modal.component';
import { VnBankModel, bridgeModel } from "./vnbank-list";
import {environment} from "@env/environment";
import { DomSanitizer } from '@angular/platform-browser';
declare var $:any
@Component({
  selector: 'app-withdraw-modal',
  templateUrl: './withdraw-modal.component.html',
  styleUrls: ['./withdraw-modal.component.less']
})
export class WithdrawModalComponent implements OnInit {

  @ViewChild('bankDetailsComponent')
  bankDetailsComponent!: BankDetailsComponent;

  @ViewChild('successModalComponent')
  successModalComponent!: SuccessModalComponent;

  @ViewChild('wireTransferModalComponent')
  wireTransferModalComponent!: WireTransferModalComponent;

  @Output() readonly toParent = new EventEmitter();
  exchangeText:boolean = true
  pspAllowed:boolean | undefined
  accountName:any
  vnMsg:boolean = false
  egValue:string = '1';
  egpayHide:boolean = false
  egLocalPay?:boolean
  selectAccount: any
  blizzardpayHide?:boolean
  exceed:boolean = false
  bvnkHide:boolean = false
  dataLoad: boolean = true;
  provideLoader!:boolean
  account:any
  depositScreen:boolean = false
  instant:boolean= true
  loaderSubmit?:boolean
  method:boolean = false
  methodValue: string = '';
  isVisible = false;
  validateForm!: FormGroup;
  depositTo: any = [];
  walletBalance: any = {};
  accounts: any = [];
  tradingBalance: any = {};
  currencies: any = [];
  providers: any = [];
  exchangeRate: any = {};
  radioValue: string = '';
  isConfirmLoading:boolean = false;
  langs = this.i18nSev.i18nUrl();
  coinPayForm:boolean = false
  bvnkPayForm:boolean = false
  globeForm:boolean = false
  skrillForm:boolean = false
  netellerForm:boolean = false
  sirPagaForm:boolean = false
  billPayForm:boolean = false
  triplePayForm:boolean = false
  bridgePayForm:boolean = false
  confirmModal?: NzModalRef;
  loaderWithdraw:boolean = false
  balanceLoader?: boolean;
  wireHide?:boolean
  alterHide?:boolean
  bridgerpayHide?:boolean
  quickpayHide?:boolean
  coinHide?:boolean
  tripleHide?:boolean
  gpayHide?:boolean
  upiHide?:boolean
  epayHide:boolean = false
  fatoorahHide: boolean = false
  helpPayHide: boolean = false
  helpPay:boolean = false
  copPay:boolean = false
  sirPagaHide:boolean = false
  bankList: any = [];
  bankListCop: any = [];
  bankListPrompt: any = [];
  userCountry = this.tokenSrv.get()?.user_Country
  user_Nationality = this.tokenSrv.get()?.user_Nationality
  successW = this.tokenSrv.get()?.successfullWithdrawals
  hyperBCHide: boolean = false
  isHyperBCList:boolean = false
  reachedTitle = this.i18nSev.i18n('You have reached the monthly withdrawal limit!')
  reachedContent = this.i18nSev.i18n('You will be charged <span class="usd-fee"> USD 20 Fee </span> , if you wish to continue click proceed')
  hyperBCCoinList: { [key: string]: any } = {
    usdt_trc20: 'USDT(TRC20)',
    usdt_erc20: 'USDT(ERC20)',
    trx: 'TRX',
    eth: 'ETH',
    xrp: 'XRP',
    btc: 'BTC',
    matic_polygon: 'Polkgan',
    doge: 'Dogecoin'
  };
  leanHide: boolean = false;
  globeHide:boolean= false;
  skrillHide:boolean= false
  leanForm: boolean = false;
  countries: any = [];
  vnPayHide:boolean= false
  vnPayForm: boolean = false;
  expay:boolean = false
  coinName:string = "USDT";
  isVisiblePA: boolean = false;
  vnBankList?: VnBankModel[];
  vnBankName: any;
  vnBankCode: any;
  imageName?:string
  imageSrc?:string
  isVisibleBVNK:boolean = false
  bridgeUrl:any
  pspList: any = [];
  cheezePayForm:boolean = false
  summaryLoader:boolean = false
  globalBridgeData: bridgeModel = {} as bridgeModel;
  handleKeyboardEvent(e: KeyboardEvent) {
    if (e.key === 'F12') {
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
    private sanitizer: DomSanitizer,
  ) {
    document.addEventListener('contextmenu', function(e) {
      e.preventDefault();
    });

    if(this.tokenSrv.get()?.customer_MiddleName === '' || this.tokenSrv.get()?.customer_MiddleName === null) {
      this.accountName = this.tokenSrv.get()?.customer_FirstName +' '+ this.tokenSrv.get()?.customer_LastName
    } else {
     this.accountName = this.tokenSrv.get()?.customer_FirstName +' '+ this.tokenSrv.get()?.customer_MiddleName +' '+ this.tokenSrv.get()?.customer_LastName
    }
   
  }

//   onItemChange(e: any){
//     if(e === 'CryptoWallet') {
//      this.coinPayForm = true
//      this.method = false
//      this.methodValue = ''
//      this.validateForm.get('address')?.markAsDirty();
//      this.validateForm.get('toCoin')?.markAsDirty();
//      this.triplePayForm = false
//      this.clearValidTriple()
//     }
//     else if(e === 'BankTransfer') {
//       this.method = true
//       this.coinPayForm = false
//       this.clearValid()
//     }
//     else {
//     this.method = false
//     this.methodValue = ''
//     this.coinPayForm = false
//     this.triplePayForm = false
//     this.clearValid()
//     this.clearValidTriple()
//     }
//  }

payOption:any
egWalletPay:boolean = false
onItemEgChange(e: any) {
  this.payOption = e
  if(e === "2") {
    this.egWalletPay = true
  } else {
    this.egWalletPay = false  
  }
}

pspdata = ''
onItemChange(e: any){
  console.log(e)
  this.scroll()
  const psnName = e?.split('|')[0]
  const defaultCurrency = e?.split('|')[1]
   this.depositScreen = true
    this.validateForm.get('currencie')!.setValue(`${defaultCurrency}|${defaultCurrency}`)
    this.getExchangeRate('USD', this.validateForm.value?.currencie?.split('|')[1]);
    this.pspdata = e
  if(psnName === 'WireTransfer') {
    this.instant = false
  } else {
    this.instant = true
  }

  if(psnName === 'egPay') {
    this.egpayHide = true
  } else {
    this.egpayHide = false
    this.egValue = ''
    this.egWalletPay = false
  }

  if(psnName === 'expay') {
    this.expay = true  
   } else {
     this.expay = false
  }


  if(psnName === 'cheeze') {
    this.cheezePayForm = true
  } else {
    this.cheezePayForm = false
    this.cheezeBankPayForm = false
    this.cheezeUPIPayForm = false
  }


  if(psnName === 'CryptoWallet') {
   this.coinPayForm = true
   this.triplePayForm = false
   this.helpPay = false
   this.validateForm.get('address')?.updateValueAndValidity();
   this.validateForm.get('toCoin')?.updateValueAndValidity();
   this.validateForm.controls['addressTrip'].clearValidators();
    this.validateForm.controls['toCoinTrip'].clearValidators();
    this.validateForm.get('addressTrip')?.updateValueAndValidity();
    this.validateForm.get('toCoinTrip')?.updateValueAndValidity();
    this.helpPayClear()
  }

  else if(psnName === 'tripeA' ) {
    this.triplePayForm = true
    this.coinPayForm = false
    this.helpPay = false
    this.validateForm.controls['addressTrip'].clearValidators();
    this.validateForm.controls['toCoinTrip'].clearValidators();
    this.validateForm.get('addressTrip')?.updateValueAndValidity();
    this.validateForm.get('toCoinTrip')?.updateValueAndValidity();
    this.validateForm.controls['address'].clearValidators();
    this.validateForm.controls['toCoin'].clearValidators();
    this.helpPayClear()
  }
  else if(psnName === 'Nganluong' || psnName === 'Help2Pay') {
    this.triplePayForm = false
    this.coinPayForm = false
    this.helpPay = true
    this.payClear()
  }

  else {
   this.coinPayForm = false
   this.triplePayForm = false
   this.helpPay = false
    this.validateForm.controls['address'].clearValidators();
    this.validateForm.controls['toCoin'].clearValidators();
    this.validateForm.get('address')?.updateValueAndValidity();
    this.validateForm.get('toCoin')?.updateValueAndValidity();
    this.validateForm.controls['addressTrip'].clearValidators();
    this.validateForm.controls['toCoinTrip'].clearValidators();
    this.validateForm.get('addressTrip')?.updateValueAndValidity();
    this.validateForm.get('toCoinTrip')?.updateValueAndValidity();
    this.helpPayClear()
  }

  if (psnName === 'hyperBc') {
    this.isHyperBCList = true;
    this.validateForm.controls['hyperBCCoin']?.setValidators([Validators.required]);
    this.validateForm.controls['hyperAddress']?.setValidators([Validators.required]);
  } else {
    this.isHyperBCList = false;
    this.validateForm.controls['hyperBCCoin']?.clearValidators();
    this.validateForm.controls['hyperBCCoin']?.updateValueAndValidity();
    this.validateForm.controls['hyperAddress']?.clearValidators();
    this.validateForm.controls['hyperAddress']?.updateValueAndValidity();
  }

  if (psnName === 'lean') {
    this.validateLean();
  } else {
    this.inValidateLean();
  }

  if (psnName === 'globe') {
    this.validateGlobePay();
  } else {
    this.inValidateGlobePay();
  }

  if (psnName === 'skrill') {
    this.validateSkrillPay();
  } else {
    this.inValidatekrillPay();
  }

  if (psnName === 'bridgerpay') {
    this.validateBridgePay();
  } else {
    this.invalidateBridgePay();
  }

  if (psnName === 'bliPay' || psnName === 'Blizzard Pay') {
    this.validateBillPay();
  } else {
    this.invalidateBillPay();
  }

  if (psnName === 'CCoop') {
    this.validatecopPay();
  } else {
    this.invalidatecopPay();
  }


  if (psnName === 'neteller') {
    this.validateNetellerPay();
  } else {
    this.invalidateNetellerPay();
  }

  if (psnName === 'sirPaga') {
    this.validatesirPagaPay();
  } else {
    this.invalidatesirPagaPay();
  }


  if (psnName === 'PaymentAsia') {
    this.validateVnPay();
  } else {
    this.inValidateVnPay();
  }

  if(psnName === 'bvnk' ) {
    this.bvnkPayForm = true
    this.triplePayForm = false
    this.coinPayForm = false
    this.helpPay = false
    this.validateForm.controls['addressTrip'].clearValidators();
    this.validateForm.controls['toCoinTrip'].clearValidators();
    this.validateForm.get('addressTrip')?.updateValueAndValidity();
    this.validateForm.get('toCoinTrip')?.updateValueAndValidity();
    this.validateForm.controls['address'].clearValidators();
    this.validateForm.controls['toCoin'].clearValidators();
    this.helpPayClear()
  } else {
    this.bvnkPayForm = false
  }


  
}

payClear() {
  this.validateForm.controls['ToBankAccount_Name'].setValidators([Validators.required])
  this.validateForm.controls['ToBankAccount_Number'].setValidators([Validators.required])
  this.validateForm.controls['banklist'].setValidators([Validators.required])
  this.validateForm.controls['addressTrip'].clearValidators();
  this.validateForm.controls['toCoinTrip'].clearValidators();
  this.validateForm.get('addressTrip')?.updateValueAndValidity();
  this.validateForm.get('toCoinTrip')?.updateValueAndValidity();
  this.validateForm.controls['address'].clearValidators();
  this.validateForm.controls['toCoin'].clearValidators();
}

helpPayClear() {
  this.validateForm.controls['ToBankAccount_Name'].clearValidators()
  this.validateForm.controls['ToBankAccount_Name'].updateValueAndValidity()
  this.validateForm.controls['ToBankAccount_Number'].clearValidators()
  this.validateForm.controls['ToBankAccount_Number'].updateValueAndValidity()
  this.validateForm.controls['banklist'].clearValidators()
  this.validateForm.controls['banklist'].updateValueAndValidity()
}

  validateLean() {
    this.leanForm = true;
    this.validateForm.controls['leanBankIdentifier']?.setValidators([Validators.required]);
    this.validateForm.controls['leanName']?.setValidators([Validators.required]);
    this.validateForm.controls['leanIban']?.setValidators([Validators.required]);
    this.validateForm.controls['leanAccountNumber']?.setValidators([Validators.required]);
    this.validateForm.controls['leanSwiftCode']?.setValidators([Validators.required]);
  }
  inValidateLean() {
    this.leanForm = false;
    this.validateForm.controls['leanBankIdentifier']?.clearValidators()
    this.validateForm.controls['leanBankIdentifier']?.updateValueAndValidity()
    this.validateForm.controls['leanName']?.clearValidators()
    this.validateForm.controls['leanName']?.updateValueAndValidity()
    this.validateForm.controls['leanIban']?.clearValidators()
    this.validateForm.controls['leanIban']?.updateValueAndValidity()
    this.validateForm.controls['leanAccountNumber']?.clearValidators()
    this.validateForm.controls['leanAccountNumber']?.updateValueAndValidity()
    this.validateForm.controls['leanSwiftCode']?.clearValidators()
    this.validateForm.controls['leanSwiftCode']?.updateValueAndValidity()
  }

  validateVnPay() {
    this.vnMsg = true
    this.vnPayForm = true;
    this.validateForm.controls['vnBank_code']?.setValidators([Validators.required]);
    this.validateForm.controls['account_Number']?.setValidators([Validators.required]);
  }
  inValidateVnPay() {
    this.vnMsg = false
    this.vnPayForm = false;
    this.validateForm.controls['vnBank_code']?.clearValidators()
    this.validateForm.controls['vnBank_code']?.updateValueAndValidity()
    this.validateForm.controls['account_Number']?.clearValidators()
    this.validateForm.controls['account_Number']?.updateValueAndValidity()
  }

  validateGlobePay() {
    this.globeForm = true;
    this.validateForm.controls['receiver_Email']?.setValidators([Validators.required]);
  }
  inValidateGlobePay() {
    this.globeForm = false;
    this.validateForm.controls['receiver_Email']?.clearValidators()
    this.validateForm.controls['receiver_Email']?.updateValueAndValidity()
  }

  validateSkrillPay() {
    this.skrillForm = true;
    this.validateForm.controls['skrill_Email']?.setValidators([Validators.required]);
  }
  inValidatekrillPay() {
    this.skrillForm = false;
    this.validateForm.controls['skrill_Email']?.clearValidators()
    this.validateForm.controls['skrill_Email']?.updateValueAndValidity()
  }

  validateNetellerPay() {
    this.netellerForm = true;
    this.validateForm.controls['neteller_Email']?.setValidators([Validators.required]);
  }
  invalidateNetellerPay() {
    this.netellerForm = false;
    this.validateForm.controls['neteller_Email']?.clearValidators()
    this.validateForm.controls['neteller_Email']?.updateValueAndValidity()
  }

  validateBridgePay() {
    this.bridgePayForm = true;
    this.validateForm.controls['providers']?.setValidators([Validators.required]);
  }
  invalidateBridgePay() {
    this.bridgePayForm = false;
    this.validateForm.controls['providers']?.clearValidators()
    this.validateForm.controls['providers']?.updateValueAndValidity()
  }

  validatesirPagaPay() {
    this.sirPagaForm = true;
    this.validateForm.controls['payId']?.setValidators([Validators.required]);
  }
  invalidatesirPagaPay() {
    this.sirPagaForm = false;
    this.validateForm.controls['payId']?.clearValidators()
    this.validateForm.controls['payId']?.updateValueAndValidity()
  }


  validateBillPay() {
    this.billPayForm = true;
    this.validateForm.controls['walletAccount']?.setValidators([Validators.required]);
  }

  invalidateBillPay() {
    this.billPayForm = false;
    this.validateForm.controls['walletAccount']?.clearValidators()
    this.validateForm.controls['walletAccount']?.updateValueAndValidity()
  }

  validatecopPay() {
    this.copPay = true;
    this.validateForm.controls['banklistCop']?.setValidators([Validators.required]);
    this.validateForm.controls['ToBankAccount_NumberCop']?.setValidators([Validators.required]);
    this.validateForm.controls['bankBranchCop']?.setValidators([Validators.required]);
  }

  invalidatecopPay() {
    this.copPay = false;
    this.validateForm.controls['banklistCop']?.clearValidators()
    this.validateForm.controls['banklistCop']?.updateValueAndValidity()
    this.validateForm.controls['ToBankAccount_NumberCop']?.clearValidators()
    this.validateForm.controls['ToBankAccount_NumberCop']?.updateValueAndValidity()
    this.validateForm.controls['bankBranchCop']?.clearValidators()
    this.validateForm.controls['bankBranchCop']?.updateValueAndValidity()
  }


  handleCancelPA():void {
    this.isVisiblePA = false
  }
  redirectToBank():void {
    this.router.navigate([`${this.langs}/funds/bankdetail`], {
      queryParams: {
        addBank: true
      }
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
    this.validateForm = this.fb.group({
      amount: [null, [Validators.required]],
      wallet: [2, [Validators.required]],
      accounts: [null, [Validators.required]],
      currencie: [null, [Validators.required]],
      walletNumber: [null, [Validators.required]],
      address: [null],
      toCoin: [null],
      addressTrip: [null],
      toCoinTrip: [null],
      remarks: [null],
      ToBankAccount_Name:[null],
      ToBankAccount_Number: [null],
      banklist: [null],
      hyperBCCoin: [null],
      leanBankIdentifier: [null],
      leanName: [null],
      leanIban: [null],
      leanDisplayName: [null],
      leanAccountNumber: [null],
      leanSwiftCode: [null],
      leanSortCode: [null],
      leanTransitCode: [null],
      leanAddress: [null],
      leanBranchAddress: [null],
      leanCountry: [null],
      leanCity: [null],
      receiver_Email: [null],
      vnBank_code: [null],
      identity_Card: [null],
      account_Number: [null],
      skrill_Email: [null],
      neteller_Email:[null],
      addressBVNK: [null],
      toCoinBVNK: [null],
      providers:[null],
      payId: [null],
      walletID: [null],
      paymentMethodId: [null],
      mobile_AccountHolderName: [null],
      mobile_AccountNumber: [null],
      bank_AccountHolderName: [null],
      bank_AccountNumber: [null],
      bacnk_IFSCCode: [null],
      bank_AccountType: [null],
      bank_Name: [null],
      bank_BranchName: [null],
      walletAccount: [null],
      coinName: [null],
      chainName: [null],
      toAddress: [null],
      banklistCop: [null],
      bankListPrompt: [null],
      ToBankAccount_NameCop: [null],
      ToBankAccount_NumberCop: [null],
      bankBranchCop: [null]
    });
    this.getAllDepositTo();
    this.getAllAccountsTotalBalance();
    this.http.getAllCountries().subscribe((res: any) => {
      this.countries = res.data.map((item: any) => ({
        ...item,
        img: `${environment.api.baseUrl}/app_contents/country_flag/${item.code}.svg`
      }));
    });
    this.http.getAllAccountsByCustomerID(this.tokenSrv.get()?.customer_id).subscribe((res: any) => {
      this.accounts = res.data;
      this.selectAccount = res.data[0]?.code + '|' + res.data[0].mT_Currency
    });
    this.http.getVirtualWalletBYCustomerId(this.tokenSrv.get()?.customer_id).subscribe((res: any) => {
      this.walletBalance = res.data;
      // this.tradingBalance = res.data;
      this.validateForm.get('walletNumber')!.setValue(res.data.virtualWallet_Code);
    });

    this.http.getCustomerProfile().subscribe((res: any) => {
      this.pspAllowed = res.data[0]?.is_WithdrawalAllowed
      this.getAllPsp();
    })
  }

  // get all psps
  getAllPsp() {
    this.http.getAllPSP('withdraw').subscribe((res:any)=> {
      this.dataLoad = false
      let content = res?.data
      let helpPh = content?.filter((item: any) => item.groupName === 'Help2Pay');
      this.bankList = helpPh[0]?.availablePSPs[0]?.bankList
      let copPay = content?.filter((item: any) => item.groupName === 'Cooperation');
      this.bankListCop = copPay[0]?.availablePSPs[0]?.bankList

      let propmtPay = content?.filter((item: any) => item.groupName === 'PromptPay');
      this.bankListPrompt = propmtPay[0]?.availablePSPs[0]?.bankList
      
      let vnpay = content?.filter((item: any) => item.groupName === 'VN Pay' ||  item.groupName === 'Dragon Pay' || item.groupName === 'Durian Pay');
      this.vnBankList = vnpay[0]?.availablePSPs[0]?.bankList
      this.pspList = content
      const setPsp = content?.filter((item: any) => item.groupName);
      this.pspdata = setPsp[0]?.availablePSPs[0]?.name + '|' + setPsp[0]?.availablePSPs[0]?.default_Currency
      const currency = setPsp[0]?.availablePSPs[0]?.default_Currency
      this.validateForm.get('currencie')!.setValue(`${currency}|${currency}`)
      this.getExchangeRate('USD', this.validateForm.value?.currencie?.split('|')[1]);

      this.http.getAllCurrencies().subscribe((res: any) => {
        this.currencies = res.data;
        this.getProviders(this.validateForm.get('currencie')?.value?.split('|')[0])
        this.summaryLoader = true
        this.depositScreen = true
      });

      const tabName = setPsp[0]?.availablePSPs[0]?.name
      if(tabName === 'egPay') {
        this.egpayHide = true
      } else {
        this.egpayHide = false
        this.egValue = ''
        this.egWalletPay = false
      }
    
      if(tabName === 'cheeze') {
        this.cheezePayForm = true
      } else {
        this.cheezePayForm = false
        this.cheezeBankPayForm = false
        this.cheezeUPIPayForm = false
      }
    
    
      if(tabName === 'CryptoWallet') {
      this.coinPayForm = true
      this.triplePayForm = false
      this.helpPay = false
      this.validateForm.get('address')?.updateValueAndValidity();
      this.validateForm.get('toCoin')?.updateValueAndValidity();
      this.validateForm.controls['addressTrip'].clearValidators();
        this.validateForm.controls['toCoinTrip'].clearValidators();
        this.validateForm.get('addressTrip')?.updateValueAndValidity();
        this.validateForm.get('toCoinTrip')?.updateValueAndValidity();
        this.helpPayClear()
      }
    
      else if(tabName === 'tripeA' ) {
        this.triplePayForm = true
        this.coinPayForm = false
        this.helpPay = false
        this.validateForm.controls['addressTrip'].clearValidators();
        this.validateForm.controls['toCoinTrip'].clearValidators();
        this.validateForm.get('addressTrip')?.updateValueAndValidity();
        this.validateForm.get('toCoinTrip')?.updateValueAndValidity();
        this.validateForm.controls['address'].clearValidators();
        this.validateForm.controls['toCoin'].clearValidators();
        this.helpPayClear()
      }
      else if(tabName === 'Nganluong' || tabName === 'Help2Pay') {
        this.triplePayForm = false
        this.coinPayForm = false
        this.helpPay = true
        this.payClear()
      }
    
      else {
      this.coinPayForm = false
      this.triplePayForm = false
      this.helpPay = false
        this.validateForm.controls['address'].clearValidators();
        this.validateForm.controls['toCoin'].clearValidators();
        this.validateForm.get('address')?.updateValueAndValidity();
        this.validateForm.get('toCoin')?.updateValueAndValidity();
        this.validateForm.controls['addressTrip'].clearValidators();
        this.validateForm.controls['toCoinTrip'].clearValidators();
        this.validateForm.get('addressTrip')?.updateValueAndValidity();
        this.validateForm.get('toCoinTrip')?.updateValueAndValidity();
        this.helpPayClear()
      }
    
      if (tabName === 'hyperBc') {
        this.isHyperBCList = true;
        this.validateForm.controls['hyperBCCoin']?.setValidators([Validators.required]);
        this.validateForm.controls['hyperAddress']?.setValidators([Validators.required]);
      } else {
        this.isHyperBCList = false;
        this.validateForm.controls['hyperBCCoin']?.clearValidators();
        this.validateForm.controls['hyperBCCoin']?.updateValueAndValidity();
        this.validateForm.controls['hyperAddress']?.clearValidators();
        this.validateForm.controls['hyperAddress']?.updateValueAndValidity();
      }
    
      if (tabName === 'lean') {
        this.validateLean();
      } else {
        this.inValidateLean();
      }
    
      if (tabName === 'globe') {
        this.validateGlobePay();
      } else {
        this.inValidateGlobePay();
      }
    
      if (tabName === 'skrill') {
        this.validateSkrillPay();
      } else {
        this.inValidatekrillPay();
      }
    
      if (tabName === 'bridgerpay') {
        this.validateBridgePay();
      } else {
        this.invalidateBridgePay();
      }
    
      if (tabName === 'bliPay' || tabName === 'Blizzard Pay') {
        this.validateBillPay();
      } else {
        this.invalidateBillPay();
      }
    
      if (tabName === 'CCoop') {
        this.validatecopPay();
      } else {
        this.invalidatecopPay();
      }

    
      if (tabName === 'neteller') {
        this.validateNetellerPay();
      } else {
        this.invalidateNetellerPay();
      }
    
      if (tabName === 'sirPaga') {
        this.validatesirPagaPay();
      } else {
        this.invalidatesirPagaPay();
      }

      if(tabName === 'expay') {
        this.expay = true  
       } else {
         this.expay = false
      }
    
    
      if (tabName === 'PaymentAsia') {
        this.validateVnPay();
      } else {
        this.inValidateVnPay();
      }
    
      if(tabName === 'bvnk' ) {
        this.bvnkPayForm = true
        this.triplePayForm = false
        this.coinPayForm = false
        this.helpPay = false
        this.validateForm.controls['addressTrip'].clearValidators();
        this.validateForm.controls['toCoinTrip'].clearValidators();
        this.validateForm.get('addressTrip')?.updateValueAndValidity();
        this.validateForm.get('toCoinTrip')?.updateValueAndValidity();
        this.validateForm.controls['address'].clearValidators();
        this.validateForm.controls['toCoin'].clearValidators();
        this.helpPayClear()
      } else {
        this.bvnkPayForm = false
      }
    })
  }
  
  private get tokenSrv(): ITokenService {
    return this.injector.get(DA_SERVICE_TOKEN);
  }
  onToParent() {
    this.validateForm.get('amount')?.reset();
    this.radioValue = '';
    this.toParent.emit();
    this.isVisible = false;
  }

 clearValid() {
  this.validateForm.controls['address'].clearValidators();
  this.validateForm.controls['toCoin'].clearValidators();
  this.validateForm.get('address')?.updateValueAndValidity();
  this.validateForm.get('toCoin')?.updateValueAndValidity();
 }


 clearValidTriple() {
  this.validateForm.controls['addressTrip'].clearValidators();
  this.validateForm.controls['toCoinTrip'].clearValidators();
  this.validateForm.get('addressTrip')?.updateValueAndValidity();
  this.validateForm.get('toCoinTrip')?.updateValueAndValidity();
 }

  submitForm(): void {
    const pspName = this.pspdata?.split('|')[0]
    if (this.validateForm.valid) {
      this.loaderSubmit = true
      const { wallet, walletNumber, accounts, currencie, address, toCoin, addressTrip, toCoinTrip, remarks, ToBankAccount_Name, ToBankAccount_Number, banklist, hyperBCCoin, hyperAddress, leanBankIdentifier, leanName, leanIban, leanDisplayName, leanAccountNumber, leanSwiftCode, leanSortCode, leanTransitCode, leanAddress, leanBranchAddress, leanCountry, leanCity, receiver_Email, identity_Card, account_Number, skrill_Email, neteller_Email, addressBVNK, toCoinBVNK, providers, payId , walletAccount, walletID, paymentMethodId, mobile_AccountHolderName, mobile_AccountNumber, bank_AccountHolderName, bank_AccountNumber,  bacnk_IFSCCode, bank_AccountType, bank_Name, bank_BranchName, coinName, chainName, toAddress, banklistCop, ToBankAccount_NameCop, ToBankAccount_NumberCop, bankBranchCop, bankListPrompt} = this.validateForm.value;
     
      const amount:any = (this.validateForm.value.amount / this.exchangeRate) 
    // const amount = TrimAmount.toFixed(2)   // here the trim value go to PSP

      if (!this.pspdata) {
        this.loaderSubmit = false
        this.message.error('Please choose any one Withdraw method to proceed.');
        return;
      }
      if (wallet !== 1 && this.tradingBalance?.balance <= 0) {
        this.loaderSubmit = false
        this.message.error(this.i18nSev.i18n('Your balance is insufficient'));
        return;
      }

     if (pspName === 'BankTransfer') {
      if(this.successW >= 5 ) {
        this.loaderSubmit = false
        this.confirmModal = this.modal.info({
          nzClassName: 'reached-confirm',
          nzOkText: this.i18nSev.i18n('Proceed'),
          nzCancelText: this.i18nSev.i18n('No'),
          nzTitle: this.reachedTitle,
          nzContent: this.reachedContent,
          nzWidth: '600px',
          nzOnOk: () => {
            this.router.navigate([`${this.langs}/funds/alternative`], {
              queryParams: {
                customer_ID: this.tokenSrv.get()?.customer_id,
                withdraW_From: wallet,
                withdraW_AMOUNT: amount,
                wL_NO: 'CPT',
                currency: currencie.split('|')[1],
                paymenT_SOURCE: accounts.split('|')[0],
                withdraW_TYPE: wallet,
                postType: 'W'
              }
            });
          }
        });
      } else {
        this.router.navigate([`${this.langs}/funds/alternative`], {
          queryParams: {
            customer_ID: this.tokenSrv.get()?.customer_id,
            withdraW_From: wallet,
            withdraW_AMOUNT: amount,
            wL_NO: 'CPT',
            currency: currencie.split('|')[1],
            paymenT_SOURCE: accounts.split('|')[0],
            withdraW_TYPE: wallet,
            postType: 'W'
          }
        });
      }
       
       }

      else if (pspName === 'WireTransfer') {
        if(this.successW >= 5 ) {
          this.loaderSubmit = false
          this.confirmModal = this.modal.info({
            nzClassName: 'reached-confirm',
            nzOkText: this.i18nSev.i18n('Proceed'),
            nzCancelText: this.i18nSev.i18n('No'),
            nzTitle: this.reachedTitle,
            nzContent: this.reachedContent,
            nzWidth: '600px',
            nzOnOk: () => {
              this.wireTransferModalComponent.showModal({
                customer_ID: this.tokenSrv.get()?.customer_id,
                withdraW_From: wallet,
                paymenT_SOURCE: accounts.split('|')[0],
                paymenT_DESTINATION: 'test',
                withdraW_AMOUNT: amount,
                withdraW_TYPE: 1,
                wL_NO: 'CPT',
                pspType: 'WireTransfer',
                currency: currencie.split('|')[1]
              });
            }
          });
        }
        else {
          this.wireTransferModalComponent.showModal({
            customer_ID: this.tokenSrv.get()?.customer_id,
            withdraW_From: wallet,
            paymenT_SOURCE: accounts.split('|')[0],
            paymenT_DESTINATION: 'test',
            withdraW_AMOUNT: amount,
            withdraW_TYPE: 1,
            wL_NO: 'CPT',
            pspType: 'WireTransfer',
            currency: currencie.split('|')[1]
          });
        }
      
        this.loaderSubmit = false
      }

      else if (pspName === 'quickPay') {
        if(this.successW >= 5 ) {
          this.loaderSubmit = false
          this.confirmModal = this.modal.info({
            nzClassName: 'reached-confirm',
            nzOkText: this.i18nSev.i18n('Proceed'),
            nzCancelText: this.i18nSev.i18n('No'),
            nzTitle: this.reachedTitle,
            nzContent: this.reachedContent,
            nzWidth: '600px',
            nzOnOk: () => {
              this.wireTransferModalComponent.showModal({
                customer_ID: this.tokenSrv.get()?.customer_id,
                withdraW_From: wallet,
                paymenT_SOURCE: accounts.split('|')[0],
                paymenT_DESTINATION: 'test',
                withdraW_AMOUNT: amount,
                withdraW_TYPE: '26',
                wL_NO: 'CPT',
                pspType: 'QuickPay',
                currency: currencie.split('|')[1]
              });
            }
          });
        }
        else {
          this.wireTransferModalComponent.showModal({
            customer_ID: this.tokenSrv.get()?.customer_id,
            withdraW_From: wallet,
            paymenT_SOURCE: accounts.split('|')[0],
            paymenT_DESTINATION: 'test',
            withdraW_AMOUNT: amount,
            withdraW_TYPE: '26',
            wL_NO: 'CPT',
            pspType: 'QuickPay',
            currency: currencie.split('|')[1]
          });
        }
      
        this.loaderSubmit = false
      }

      else if (pspName === 'CryptoWallet') {
        if(this.successW >= 5 ) {
          this.loaderSubmit = false
          this.confirmModal = this.modal.info({
            nzClassName: 'reached-confirm',
            nzOkText: this.i18nSev.i18n('Proceed'),
            nzCancelText: this.i18nSev.i18n('No'),
            nzTitle: this.reachedTitle,
            nzContent: this.reachedContent,
            nzWidth: '600px',
            nzOnOk: () => {
              this.isConfirmLoading = true;
              let body = {
              withdraW_From: wallet,
              paymenT_SOURCE: accounts.split('|')[0],
              withdraW_AMOUNT: amount,
              currency: currencie.split('|')[1],
              coin: toCoin,
              address: address
             }
             this.loaderSubmit = false
             this.confirmModal = this.modal.confirm({
              nzTitle: 'Are you sure to withdraw money?',
              nzContent: `withdraw to this Address: <b>${address} </b>`,
              nzOnOk: () => {
                this.loaderWithdraw = true
                this.http.coinWithdraw(body).subscribe((res:any) => {
                  if (res.statusCode == 101) {
                    this.isConfirmLoading = false;
                    this.message.success(res.message);
                    this.router.navigateByUrl(`${this.langs}/funds/wallet`);
                    this.validateForm.reset()
                    this.loaderWithdraw = false
                  } else {
                    this.message.error(res.body.message);
                    this.isConfirmLoading = false;
                    this.loaderWithdraw = false
                  }
                },
                error => {
                  this.loaderWithdraw = false
                  this.isConfirmLoading = false;
                  this.message.error(error?.body?.message);
                  this.loaderSubmit = false
                }
      
                );
              }
             });
            }
          });
        } 
        
        else {
          this.isConfirmLoading = true;
          let body = {
          withdraW_From: wallet,
          paymenT_SOURCE: accounts.split('|')[0],
          withdraW_AMOUNT: amount,
          currency: currencie.split('|')[1],
          coin: toCoin,
          address: address
         }
         this.loaderSubmit = false
         this.confirmModal = this.modal.confirm({
          nzTitle: 'Are you sure to withdraw money?',
          nzContent: `withdraw to this Address: <b>${address} </b>`,
          nzOnOk: () => {
            this.loaderWithdraw = true
            this.http.coinWithdraw(body).subscribe((res:any) => {
              if (res.statusCode == 101) {
                this.isConfirmLoading = false;
                this.message.success(res.message);
                this.router.navigateByUrl(`${this.langs}/funds/wallet`);
                this.validateForm.reset()
                this.loaderWithdraw = false
              } else {
                this.message.error(res.body.message);
                this.isConfirmLoading = false;
                this.loaderWithdraw = false
              }
            },
            error => {
              this.loaderWithdraw = false
              this.isConfirmLoading = false;
              this.message.error(error?.body?.message);
              this.loaderSubmit = false
            }
  
            );
          }
         });
        }
       

      }

      else if (pspName === 'bvnk') {
        if(this.successW >= 5 ) {
          this.loaderSubmit = false
          this.confirmModal = this.modal.info({
            nzClassName: 'reached-confirm',
            nzOkText: this.i18nSev.i18n('Proceed'),
            nzCancelText: this.i18nSev.i18n('No'),
            nzTitle: this.reachedTitle,
            nzContent: this.reachedContent,
            nzWidth: '600px',
            nzOnOk: () => {
              this.isConfirmLoading = true;
              let body = {
              withdraW_From: wallet,
              paymenT_SOURCE: accounts.split('|')[0],
              withdraW_AMOUNT: amount,
              currency: currencie.split('|')[1],
              coin: toCoinBVNK,
              address: addressBVNK
             }
             this.loaderSubmit = false
             this.confirmModal = this.modal.confirm({
              nzTitle: 'Are you sure to withdraw money?',
              nzContent: `withdraw to this Address: <b>${addressBVNK} </b>`,
              nzOnOk: () => {
                this.loaderWithdraw = true
                this.http.bvnkWithdraw(body).subscribe((res:any) => {
                  if (res.statusCode == 101) {
                    this.isConfirmLoading = false;
                    this.message.success(res.message);
                    this.router.navigateByUrl(`${this.langs}/funds/wallet`);
                    this.validateForm.reset()
                    this.loaderWithdraw = false
                  } else {
                    this.message.error(res.body.message);
                    this.isConfirmLoading = false;
                    this.loaderWithdraw = false
                  }
                },
                error => {
                  this.loaderWithdraw = false
                  this.isConfirmLoading = false;
                  this.message.error(error?.body?.message);
                  this.loaderSubmit = false
                }
      
                );
              }
            });
            }
          });
        } else {
          this.isConfirmLoading = true;
          let body = {
          withdraW_From: wallet,
          paymenT_SOURCE: accounts.split('|')[0],
          withdraW_AMOUNT: amount,
          currency: currencie.split('|')[1],
          coin: toCoinBVNK,
          address: addressBVNK
         }
         this.loaderSubmit = false
         this.confirmModal = this.modal.confirm({
          nzTitle: 'Are you sure to withdraw money?',
          nzContent: `withdraw to this Address: <b>${addressBVNK} </b>`,
          nzOnOk: () => {
            this.loaderWithdraw = true
            this.http.bvnkWithdraw(body).subscribe((res:any) => {
              if (res.statusCode == 101) {
                this.isConfirmLoading = false;
                this.message.success(res.message);
                this.router.navigateByUrl(`${this.langs}/funds/wallet`);
                this.validateForm.reset()
                this.loaderWithdraw = false
              } else {
                this.message.error(res.body.message);
                this.isConfirmLoading = false;
                this.loaderWithdraw = false
              }
            },
            error => {
              this.loaderWithdraw = false
              this.isConfirmLoading = false;
              this.message.error(error?.body?.message);
              this.loaderSubmit = false
            }
  
            );
          }
        });
        }
     

      }
      
      else if(pspName === 'tripeA') {
        let body = {
          paymenT_SOURCE: accounts.split('|')[0],
          withdraW_AMOUNT: amount,
          withdraW_TYPE: 1,
          currency: currencie.split('|')[1],
          crypto_Currency: toCoinTrip,
          address: addressTrip,
          remarks: remarks
         }

        if(this.successW >= 5 ) {
          this.loaderSubmit = false
          this.confirmModal = this.modal.info({
            nzClassName: 'reached-confirm',
            nzOkText: this.i18nSev.i18n('Proceed'),
            nzCancelText: this.i18nSev.i18n('No'),
            nzTitle: this.reachedTitle,
            nzContent: this.reachedContent,
            nzWidth: '600px',
            nzOnOk: () => {
              this.http.tripeAWithdraw(body).subscribe((res:any)=> {
                this.loaderSubmit = false
                 this.message.success('Your Withdraw has been Initiated Successfully');
                 this.router.navigateByUrl(`${this.langs}/funds/wallet`);
               },
               error => {
                this.loaderSubmit = false
                 this.message.error(error?.body?.message);
               })
            }
          });
        } else {
          this.http.tripeAWithdraw(body).subscribe((res:any)=> {
            this.loaderSubmit = false
             this.message.success('Your Withdraw has been Initiated Successfully');
             this.router.navigateByUrl(`${this.langs}/funds/wallet`);
           },
           error => {
            this.loaderSubmit = false
             this.message.error(error?.body?.message);
           })
        }
       
     
      }

      else if(pspName === 'gpay') {
        let body = {
          paymenT_SOURCE: accounts.split('|')[0],
          withdraW_AMOUNT: amount,
          withdraW_TYPE: 1,
          currency: currencie.split('|')[1],
         }

         if(this.successW >= 5 ) {
          this.loaderSubmit = false
          this.confirmModal = this.modal.info({
            nzClassName: 'reached-confirm',
            nzOkText: this.i18nSev.i18n('Proceed'),
            nzCancelText: this.i18nSev.i18n('No'),
            nzTitle: this.reachedTitle,
            nzContent: this.reachedContent,
            nzWidth: '600px',
            nzOnOk: () => {
              this.http.withdrawGpay(body).subscribe((res:any)=> {
                this.loaderSubmit = false
                 this.message.success('Your Withdraw has been Initiated Successfully');
                 this.router.navigateByUrl(`${this.langs}/funds/wallet`);
               },
               error => {
                this.loaderSubmit = false
                 this.message.error(error?.body?.message);
               }
               )
            }
          });
        } else {
          this.http.withdrawGpay(body).subscribe((res:any)=> {
            this.loaderSubmit = false
             this.message.success('Your Withdraw has been Initiated Successfully');
             this.router.navigateByUrl(`${this.langs}/funds/wallet`);
           },
           error => {
            this.loaderSubmit = false
             this.message.error(error?.body?.message);
           }
           )
        }

      }

      else if(pspName === 'ePay') {
        let body = {
          paymenT_SOURCE: accounts.split('|')[0],
          withdraW_AMOUNT: amount,
          withdraW_TYPE: 1,
          currency: currencie.split('|')[1],
         }

         if(this.successW >= 5 ) {
          this.loaderSubmit = false
          this.confirmModal = this.modal.info({
            nzClassName: 'reached-confirm',
            nzOkText: this.i18nSev.i18n('Proceed'),
            nzCancelText: this.i18nSev.i18n('No'),
            nzTitle: this.reachedTitle,
            nzContent: this.reachedContent,
            nzWidth: '600px',
            nzOnOk: () => {
              this.http.withdrawEpay(body).subscribe((res:any)=> {
                this.loaderSubmit = false
                 this.message.success('Your Withdraw has been Initiated Successfully');
                 this.router.navigateByUrl(`${this.langs}/funds/wallet`);
               },
               error => {
                this.loaderSubmit = false
                 this.message.error(error?.body?.message);
               }
               )
            }
          });
        } else {
          this.http.withdrawEpay(body).subscribe((res:any)=> {
            this.loaderSubmit = false
             this.message.success('Your Withdraw has been Initiated Successfully');
             this.router.navigateByUrl(`${this.langs}/funds/wallet`);
           },
           error => {
            this.loaderSubmit = false
             this.message.error(error?.body?.message);
           }
           )
        }

        

      }

      else if(pspName === 'upi') {
        let body = {
          paymenT_SOURCE: accounts.split('|')[0],
          withdraW_AMOUNT: amount,
          withdraW_TYPE: 1,
          currency: currencie.split('|')[1],
         }

         if(this.successW >= 5 ) {
          this.loaderSubmit = false
          this.confirmModal = this.modal.info({
            nzClassName: 'reached-confirm',
            nzOkText: this.i18nSev.i18n('Proceed'),
            nzCancelText: this.i18nSev.i18n('No'),
            nzTitle: this.reachedTitle,
            nzContent: this.reachedContent,
            nzWidth: '600px',
            nzOnOk: () => {
              this.http.withdrawUPI(body).subscribe((res:any)=> {
                this.loaderSubmit = false
                 this.message.success('Your Withdraw has been Initiated Successfully');
                 this.router.navigateByUrl(`${this.langs}/funds/wallet`);
               },
               error => {
                this.loaderSubmit = false
                 this.message.error(error?.body?.message);
               }
               )
            }
          });
        } else {
          this.http.withdrawUPI(body).subscribe((res:any)=> {
            this.loaderSubmit = false
             this.message.success('Your Withdraw has been Initiated Successfully');
             this.router.navigateByUrl(`${this.langs}/funds/wallet`);
           },
           error => {
            this.loaderSubmit = false
             this.message.error(error?.body?.message);
           }
           )
        }
       

      }

      else if(pspName === 'fatoora') {
        let body = {
          paymenT_SOURCE: accounts.split('|')[0],
          withdraW_AMOUNT: amount,
          withdraW_TYPE: 1,
          currency: currencie.split('|')[1],
         }

         if(this.successW >= 5 ) {
          this.loaderSubmit = false
          this.confirmModal = this.modal.info({
            nzClassName: 'reached-confirm',
            nzOkText: this.i18nSev.i18n('Proceed'),
            nzCancelText: this.i18nSev.i18n('No'),
            nzTitle: this.reachedTitle,
            nzContent: this.reachedContent,
            nzWidth: '600px',
            nzOnOk: () => {
              this.http.WithDrawFatoora(body).subscribe((res:any)=> {
                this.loaderSubmit = false
                 this.message.success('Your Withdraw has been Initiated Successfully');
                 this.router.navigateByUrl(`${this.langs}/funds/wallet`);
               },
               error => {
                this.loaderSubmit = false
                 this.message.error(error?.body?.message);
               }
               )
            }
          });
        } else {
          this.http.WithDrawFatoora(body).subscribe((res:any)=> {
            this.loaderSubmit = false
             this.message.success('Your Withdraw has been Initiated Successfully');
             this.router.navigateByUrl(`${this.langs}/funds/wallet`);
           },
           error => {
            this.loaderSubmit = false
             this.message.error(error?.body?.message);
           }
           )
        }

       

      }

      else if(pspName === 'Nganluong' || pspName === 'Help2Pay') {
        let body = {
         paymenT_SOURCE: accounts.split('|')[0],
         withdraW_AMOUNT: amount,
         withdraW_TYPE: 1,
         currency: currencie.split('|')[1],
         ToBankAccount_Name: ToBankAccount_Name,
         ToBankAccount_Number: ToBankAccount_Number,
         bank_Code: banklist
        }

        if(this.successW >= 5 ) {
          this.loaderSubmit = false
          this.confirmModal = this.modal.info({
            nzClassName: 'reached-confirm',
            nzOkText: this.i18nSev.i18n('Proceed'),
            nzCancelText: this.i18nSev.i18n('No'),
            nzTitle: this.reachedTitle,
            nzContent: this.reachedContent,
            nzWidth: '600px',
            nzOnOk: () => {
              this.http.withDrawHelpPay(body).subscribe((res:any)=> {
                this.loaderSubmit = false
                 this.message.success('Your Withdraw has been Initiated Successfully');
                 this.router.navigateByUrl(`${this.langs}/funds/wallet`);
               },
               error => {
                this.loaderSubmit = false
                 this.message.error(error?.body?.message);
               }
               )
            }
          });
        } else {
          this.http.withDrawHelpPay(body).subscribe((res:any)=> {
            this.loaderSubmit = false
             this.message.success('Your Withdraw has been Initiated Successfully');
             this.router.navigateByUrl(`${this.langs}/funds/wallet`);
           },
           error => {
            this.loaderSubmit = false
             this.message.error(error?.body?.message);
           }
           )
        }

      
      }

      else if(pspName === 'CCoop') {
        let body = {
         paymenT_SOURCE: accounts.split('|')[0],
         withdraW_AMOUNT: amount,
         withdraW_TYPE: 1,
         currency: currencie.split('|')[1],
         bankName: banklistCop,
         accountHolderName: ToBankAccount_NameCop,
         bankAccountNo: ToBankAccount_NumberCop,
         bankBranch: bankBranchCop
        }

        if(this.successW >= 5 ) {
          this.loaderSubmit = false
          this.confirmModal = this.modal.info({
            nzClassName: 'reached-confirm',
            nzOkText: this.i18nSev.i18n('Proceed'),
            nzCancelText: this.i18nSev.i18n('No'),
            nzTitle: this.reachedTitle,
            nzContent: this.reachedContent,
            nzWidth: '600px',
            nzOnOk: () => {
              this.http.ccoopWithdraw(body).subscribe((res:any)=> {
                this.loaderSubmit = false
                 this.message.success('Your Withdraw has been Initiated Successfully');
                 this.router.navigateByUrl(`${this.langs}/funds/wallet`);
               },
               error => {
                this.loaderSubmit = false
                 this.message.error(error?.body?.message);
               }
               )
            }
          });
        } else {
          this.http.ccoopWithdraw(body).subscribe((res:any)=> {
            this.loaderSubmit = false
             this.message.success('Your Withdraw has been Initiated Successfully');
             this.router.navigateByUrl(`${this.langs}/funds/wallet`);
           },
           error => {
            this.loaderSubmit = false
             this.message.error(error?.body?.message);
           }
           )
        }

      
      }

     else if(pspName === 'hyperBc') {
       let body = {
         paymenT_SOURCE: accounts.split('|')[0],
         withdraW_AMOUNT: amount,
         withdraW_TYPE: 1,
         currency: currencie.split('|')[1],
         crypto_Currency: hyperBCCoin,
         address: hyperAddress,
       }

       if(this.successW >= 5 ) {
        this.loaderSubmit = false
        this.confirmModal = this.modal.info({
          nzClassName: 'reached-confirm',
          nzOkText: this.i18nSev.i18n('Proceed'),
          nzCancelText: this.i18nSev.i18n('No'),
          nzTitle: this.reachedTitle,
          nzContent: this.reachedContent,
          nzWidth: '600px',
          nzOnOk: () => {
            this.http.hyperBCAWithdraw(body).subscribe((res:any)=> {
              this.loaderSubmit = false
              this.message.success('Your Withdraw has been Initiated Successfully');
              this.router.navigateByUrl(`${this.langs}/funds/wallet`);
            },
            error => {
              this.loaderSubmit = false
              this.message.error(error?.body?.message);
   
            }
          )
          }
        });
      } else {
        this.http.hyperBCAWithdraw(body).subscribe((res:any)=> {
          this.loaderSubmit = false
          this.message.success('Your Withdraw has been Initiated Successfully');
          this.router.navigateByUrl(`${this.langs}/funds/wallet`);
        },
        error => {
          this.loaderSubmit = false
          this.message.error(error?.body?.message);

        }
      )
      }

     
     }

     else if(pspName === 'lean') {
       let body = {
         paymenT_SOURCE: accounts.split('|')[0],
         withdraW_AMOUNT: amount,
         withdraW_TYPE: 'Lean',
         currency: currencie.split('|')[1],
         remarks: remarks,
         bank_identifier: leanBankIdentifier,
         name: leanName,
         iban: leanIban,
         display_name: leanDisplayName,
         account_number: leanAccountNumber,
         swift_code: leanSwiftCode,
         sort_code: leanSortCode,
         transit_code: leanTransitCode,
         address: leanAddress,
         branch_address: leanBranchAddress,
         country: leanCountry,
         city: leanCity
       }

       if(this.successW >= 5 ) {
        this.loaderSubmit = false
        this.confirmModal = this.modal.info({
          nzClassName: 'reached-confirm',
          nzOkText: this.i18nSev.i18n('Proceed'),
          nzCancelText: this.i18nSev.i18n('No'),
          nzTitle: this.reachedTitle,
          nzContent: this.reachedContent,
          nzWidth: '600px',
          nzOnOk: () => {
            this.http.leanWithdraw(body).subscribe((res:any)=> {
              this.loaderSubmit = false
              this.message.success('Your Withdraw has been Initiated Successfully');
              this.router.navigateByUrl(`${this.langs}/funds/wallet`);
            },
            error => {
              this.loaderSubmit = false
              this.message.error(error?.body?.message);
            }
          )
          }
        });
      } else {
        this.http.leanWithdraw(body).subscribe((res:any)=> {
          this.loaderSubmit = false
          this.message.success('Your Withdraw has been Initiated Successfully');
          this.router.navigateByUrl(`${this.langs}/funds/wallet`);
        },
        error => {
          this.loaderSubmit = false
          this.message.error(error?.body?.message);
        }
      )
      }
     
     }

     else if (pspName === 'globe') {
       let body = {
         paymenT_SOURCE: accounts.split('|')[0],
         withdraW_AMOUNT: amount,
         withdraW_TYPE:wallet,
         currency: currencie.split('|')[1],
         receiver_Email: receiver_Email
       }

       if(this.successW >= 5 ) {
        this.loaderSubmit = false
        this.confirmModal = this.modal.info({
          nzClassName: 'reached-confirm',
          nzOkText: this.i18nSev.i18n('Proceed'),
          nzCancelText: this.i18nSev.i18n('No'),
          nzTitle: this.reachedTitle,
          nzContent: this.reachedContent,
          nzWidth: '600px',
          nzOnOk: () => {
            this.http.gpWithdraw(body).subscribe((res:any)=> {
              if(res.statusCode === 101)  {
                this.loaderSubmit = false
                this.message.success('Your Withdraw has been Initiated Successfully');
               this.router.navigateByUrl(`${this.langs}/funds/wallet`);
              } else {
                this.loaderSubmit = false
                this.message.error(res.message);
              }
            },
            error => {
              this.loaderSubmit = false;
              this.message.error(error?.body?.message);
            })
          }
        });
      } else {
        this.http.gpWithdraw(body).subscribe((res:any)=> {
          if(res.statusCode === 101)  {
            this.loaderSubmit = false
            this.message.success('Your Withdraw has been Initiated Successfully');
           this.router.navigateByUrl(`${this.langs}/funds/wallet`);
          } else {
            this.loaderSubmit = false
            this.message.error(res.message);
          }
        },
        error => {
          this.loaderSubmit = false;
          this.message.error(error?.body?.message);
        })
      }

      

    }
    else if (pspName === 'skrill') {
      let body = {
        paymenT_SOURCE: accounts.split('|')[0],
        withdraW_AMOUNT: amount,
        withdraW_TYPE:wallet,
        currency: currencie.split('|')[1],
        receiver_Email: skrill_Email
      }

      if(this.successW >= 5 ) {
        this.loaderSubmit = false
        this.confirmModal = this.modal.info({
          nzClassName: 'reached-confirm',
          nzOkText: this.i18nSev.i18n('Proceed'),
          nzCancelText: this.i18nSev.i18n('No'),
          nzTitle: this.reachedTitle,
          nzContent: this.reachedContent,
          nzWidth: '600px',
          nzOnOk: () => {
            this.http.skrillWithdraw(body).subscribe((res:any)=> {
              if(res.statusCode === 101)  {
                this.loaderSubmit = false
                this.message.success('Your Withdraw has been Initiated Successfully');
               this.router.navigateByUrl(`${this.langs}/funds/wallet`);
              } else {
                this.loaderSubmit = false
                this.message.error(res.message);
              }
            },
            error => {
              this.loaderSubmit = false;
              this.message.error(error?.body?.message);
            })
          }
        });
      } else {
        this.http.skrillWithdraw(body).subscribe((res:any)=> {
          if(res.statusCode === 101)  {
            this.loaderSubmit = false
            this.message.success('Your Withdraw has been Initiated Successfully');
           this.router.navigateByUrl(`${this.langs}/funds/wallet`);
          } else {
            this.loaderSubmit = false
            this.message.error(res.message);
          }
        },
        error => {
          this.loaderSubmit = false;
          this.message.error(error?.body?.message);
        })
      }

    

   }

   else if (pspName === 'neteller') {
    let body = {
      paymenT_SOURCE: accounts.split('|')[0],
      withdraW_AMOUNT: amount,
      withdraW_TYPE:wallet,
      currency: currencie.split('|')[1],
      receiver_Email: neteller_Email,
    }

    if(this.successW >= 5 ) {
      this.loaderSubmit = false
      this.confirmModal = this.modal.info({
        nzClassName: 'reached-confirm',
        nzOkText: this.i18nSev.i18n('Proceed'),
        nzCancelText: this.i18nSev.i18n('No'),
        nzTitle: this.reachedTitle,
        nzContent: this.reachedContent,
        nzWidth: '600px',
        nzOnOk: () => {
          this.http.netellerWithdraw(body).subscribe((res:any)=> {
            if(res.statusCode === 101)  {
              this.loaderSubmit = false
              this.message.success('Your Withdraw has been Initiated Successfully');
             this.router.navigateByUrl(`${this.langs}/funds/wallet`);
            } else {
              this.loaderSubmit = false
              this.message.error(res.message);
            }
          },
          error => {
            this.loaderSubmit = false;
            this.message.error(error?.body?.message);
          })
        }
      });
    }

    else {
      this.http.netellerWithdraw(body).subscribe((res:any)=> {
        if(res.statusCode === 101)  {
          this.loaderSubmit = false
          this.message.success('Your Withdraw has been Initiated Successfully');
         this.router.navigateByUrl(`${this.langs}/funds/wallet`);
        } else {
          this.loaderSubmit = false
          this.message.error(res.message);
        }
      },
      error => {
        this.loaderSubmit = false;
        this.message.error(error?.body?.message);
      })
    }
   

 }

 else if (pspName === 'sirPaga') {
  let body = {
    paymenT_SOURCE: accounts.split('|')[0],
    withdraW_AMOUNT: amount,
    withdraW_TYPE:wallet,
    currency: currencie.split('|')[1],
    payId: payId,
  }

  if(this.successW >= 5 ) {
    this.loaderSubmit = false
    this.confirmModal = this.modal.info({
      nzClassName: 'reached-confirm',
      nzOkText: this.i18nSev.i18n('Proceed'),
      nzCancelText: this.i18nSev.i18n('No'),
      nzTitle: this.reachedTitle,
      nzContent: this.reachedContent,
      nzWidth: '600px',
      nzOnOk: () => {
        this.http.sirPagaWithdraw(body).subscribe((res:any)=> {
          if(res.statusCode === 101)  {
            this.loaderSubmit = false
            this.message.success('Your Withdraw has been Initiated Successfully');
           this.router.navigateByUrl(`${this.langs}/funds/wallet`);
          } else {
            this.loaderSubmit = false
            this.message.error(res.message);
          }
        },
        error => {
          this.loaderSubmit = false;
          this.message.error(error?.body?.message);
        })
      }
    });
  }

  else {
    this.http.sirPagaWithdraw(body).subscribe((res:any)=> {
      if(res.statusCode === 101)  {
        this.loaderSubmit = false
        this.message.success('Your Withdraw has been Initiated Successfully');
       this.router.navigateByUrl(`${this.langs}/funds/wallet`);
      } else {
        this.loaderSubmit = false
        this.message.error(res.message);
      }
    },
    error => {
      this.loaderSubmit = false;
      this.message.error(error?.body?.message);
    })
  }
 

}

else if (pspName === 'bliPay' || pspName === 'Blizzard Pay') {
  let body = {
    paymenT_SOURCE: accounts.split('|')[0],
    withdraW_AMOUNT: amount,
    withdraW_TYPE:wallet,
    currency: currencie.split('|')[1],
    bankAccount: walletAccount,
    bankName:  bankListPrompt?.split('|')[0],
    bankBranch:  bankListPrompt?.split('|')[1]
  }

  if(this.successW >= 5 ) {
    this.loaderSubmit = false
    this.confirmModal = this.modal.info({
      nzClassName: 'reached-confirm',
      nzOkText: this.i18nSev.i18n('Proceed'),
      nzCancelText: this.i18nSev.i18n('No'),
      nzTitle: this.reachedTitle,
      nzContent: this.reachedContent,
      nzWidth: '600px',
      nzOnOk: () => {
        this.http.blizardPayWithdraw(body).subscribe((res:any)=> {
          if(res.statusCode === 101)  {
            this.loaderSubmit = false
            this.message.success('Your Withdraw has been Initiated Successfully');
           this.router.navigateByUrl(`${this.langs}/funds/wallet`);
          } else {
            this.loaderSubmit = false
            this.message.error(res.message);
          }
        },
        error => {
          this.loaderSubmit = false;
          this.message.error(error?.body?.message);
        })
      }
    });
  }

  else {
    this.http.blizardPayWithdraw(body).subscribe((res:any)=> {
      if(res.statusCode === 101)  {
        this.loaderSubmit = false
        this.message.success('Your Withdraw has been Initiated Successfully');
       this.router.navigateByUrl(`${this.langs}/funds/wallet`);
      } else {
        this.loaderSubmit = false
        this.message.error(res.message);
      }
    },
    error => {
      this.loaderSubmit = false;
      this.message.error(error?.body?.message);
    })
  }
 

}

else if (pspName === 'expay') {
  let body = {
    paymenT_SOURCE: accounts.split('|')[0],
    withdraW_AMOUNT: amount,
    withdraW_TYPE:wallet,
    currency: currencie.split('|')[1],
    coinName: coinName,
    chainName: chainName,
    toAddress: toAddress
  }

  if(this.successW >= 5 ) {
    this.loaderSubmit = false
    this.confirmModal = this.modal.info({
      nzClassName: 'reached-confirm',
      nzOkText: this.i18nSev.i18n('Proceed'),
      nzCancelText: this.i18nSev.i18n('No'),
      nzTitle: this.reachedTitle,
      nzContent: this.reachedContent,
      nzWidth: '600px',
      nzOnOk: () => {
        this.http.exLinkWithdraw(body).subscribe((res:any)=> {
          if(res.statusCode === 101)  {
            this.loaderSubmit = false
            this.message.success('Your Withdraw has been Initiated Successfully');
           this.router.navigateByUrl(`${this.langs}/funds/wallet`);
          } else {
            this.loaderSubmit = false
            this.message.error(res.message);
          }
        },
        error => {
          this.loaderSubmit = false;
          this.message.error(error?.body?.message);
        })
      }
    });
  }

  else {
    this.http.exLinkWithdraw(body).subscribe((res:any)=> {
      if(res.statusCode === 101)  {
        this.loaderSubmit = false
        this.message.success('Your Withdraw has been Initiated Successfully');
       this.router.navigateByUrl(`${this.langs}/funds/wallet`);
      } else {
        this.loaderSubmit = false
        this.message.error(res.message);
      }
    },
    error => {
      this.loaderSubmit = false;
      this.message.error(error?.body?.message);
    })
  }
 

}

else if (pspName === 'egPay') {
  let body = {
    paymenT_SOURCE: accounts.split('|')[0],
    withdraW_AMOUNT: amount,
    withdraW_TYPE:wallet,
    currency: currencie.split('|')[1],
    withdrawOption: this.egValue,
    walletID: walletID
  }

  if(this.successW >= 5 ) {
    this.loaderSubmit = false
    this.confirmModal = this.modal.info({
      nzClassName: 'reached-confirm',
      nzOkText: this.i18nSev.i18n('Proceed'),
      nzCancelText: this.i18nSev.i18n('No'),
      nzTitle: this.reachedTitle,
      nzContent: this.reachedContent,
      nzWidth: '600px',
      nzOnOk: () => {
        this.http.egPayWithdraw(body).subscribe((res:any)=> {
          if(res.statusCode === 101)  {
            this.loaderSubmit = false
            this.message.success('Your Withdraw has been Initiated Successfully');
           this.router.navigateByUrl(`${this.langs}/funds/wallet`);
          } else {
            this.loaderSubmit = false
            this.message.error(res.message);
          }
        },
        error => {
          this.loaderSubmit = false;
          this.message.error(error?.body?.message);
        })
      }
    });
  }

  else {
    this.http.egPayWithdraw(body).subscribe((res:any)=> {
      if(res.statusCode === 101)  {
        this.loaderSubmit = false
        this.message.success('Your Withdraw has been Initiated Successfully');
       this.router.navigateByUrl(`${this.langs}/funds/wallet`);
      } else {
        this.loaderSubmit = false
        this.message.error(res.message);
      }
    },
    error => {
      this.loaderSubmit = false;
      this.message.error(error?.body?.message);
    })
  }
}

else if (pspName === 'cheeze') {
  let body = {
    paymenT_SOURCE: accounts.split('|')[0],
    withdraW_AMOUNT: amount,
    withdraW_TYPE:wallet,
    currency: currencie.split('|')[1],
    paymentMethodId: this.paymentMethodId,
    legalCoin: currencie.split('|')[1],
    mobile_AccountHolderName: mobile_AccountHolderName,
    mobile_AccountNumber: mobile_AccountNumber,
    bank_AccountHolderName: bank_AccountHolderName,
    bank_AccountNumber: bank_AccountNumber,
    bank_IFSCCode: bacnk_IFSCCode,
    bank_AccountType: bank_AccountType,
    bank_Name: bank_Name,
    bank_BranchName: bank_BranchName
  }

  if(this.successW >= 5 ) {
    this.loaderSubmit = false
    this.confirmModal = this.modal.info({
      nzClassName: 'reached-confirm',
      nzOkText: this.i18nSev.i18n('Proceed'),
      nzCancelText: this.i18nSev.i18n('No'),
      nzTitle: this.reachedTitle,
      nzContent: this.reachedContent,
      nzWidth: '600px',
      nzOnOk: () => {
        this.http.cheezePayWithdraw(body).subscribe((res:any)=> {
          if(res.statusCode === 101)  {
            this.loaderSubmit = false
            this.message.success('Your Withdraw has been Initiated Successfully');
           this.router.navigateByUrl(`${this.langs}/funds/wallet`);
          } else {
            this.loaderSubmit = false
            this.message.error(res.message);
          }
        },
        error => {
          this.loaderSubmit = false;
          this.message.error(error?.body?.message);
        })
      }
    });
  }

  else {
    this.http.cheezePayWithdraw(body).subscribe((res:any)=> {
      if(res.statusCode === 101)  {
        this.loaderSubmit = false
        this.message.success('Your Withdraw has been Initiated Successfully');
       this.router.navigateByUrl(`${this.langs}/funds/wallet`);
      } else {
        this.loaderSubmit = false
        this.message.error(res.message);
      }
    },
    error => {
      this.loaderSubmit = false;
      this.message.error(error?.body?.message);
    })
  }
 

}

     else if(pspName === 'PaymentAsia') {
       let body = {
         paymenT_SOURCE: accounts.split('|')[0],
         withdraW_AMOUNT: amount,
         withdraW_TYPE: 1,
         currency: currencie.split('|')[1],
         bank_Code: this.vnBankCode,
         bank_Name: this.vnBankName,
         identity_Card: identity_Card,
         account_Number: account_Number
       }

       if(this.successW >= 5 ) {
        this.loaderSubmit = false
        this.confirmModal = this.modal.info({
          nzClassName: 'reached-confirm',
          nzOkText: this.i18nSev.i18n('Proceed'),
          nzCancelText: this.i18nSev.i18n('No'),
          nzTitle: this.reachedTitle,
          nzContent: this.reachedContent,
          nzWidth: '600px',
          nzOnOk: () => {
            this.http.paWithdraw(body).subscribe((res:any)=> {
              this.loaderSubmit = false;
              this.message.success('Your Withdraw has been Initiated Successfully');
              this.router.navigateByUrl(`${this.langs}/funds/wallet`);
            },
            error => {
              this.loaderSubmit = false;
              this.message.error(error?.body?.message);
            }
          )
          }
        });
      } else {
        this.http.paWithdraw(body).subscribe((res:any)=> {
          this.loaderSubmit = false;
          this.message.success('Your Withdraw has been Initiated Successfully');
          this.router.navigateByUrl(`${this.langs}/funds/wallet`);
        },
        error => {
          this.loaderSubmit = false;
          this.message.error(error?.body?.message);
        }
      )
      }
    
     }

    else if(pspName === 'bridgerpay') {
      this.http.bridgerpayToken(true).subscribe((res:any)=> {
       this.isVisibleBVNK = true
       this.bridgeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(res?.data); 
       // Listen to the event "paymentCardToken"
       window.addEventListener('message', list => {
        if(list.data.event === '[bp]:paymentCardToken') {
          this.globalBridgeData = list.data as bridgeModel
          sessionStorage.setItem('bridgData', JSON.stringify(this.globalBridgeData))
          setTimeout(()=> {
            this.submitbridgeData()
          },1000)
        }
        });
      //  window.addEventListener('message', this.receivemessage, false);
      })
    }


    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  // bridger data post event
  submitbridgeData() {
    if(sessionStorage.getItem('bridgData') === null) {
      
    } 
    else {
      const { accounts, amount, currencie, providers } = this.validateForm.value;
      const jsonStringObj = sessionStorage.getItem('bridgData');
      const obj = JSON.parse(jsonStringObj || '{}');
      let body = {
        paymenT_SOURCE: accounts.split('|')[0],
        withdraW_AMOUNT: amount,
        withdraW_TYPE: 1,
        currency: currencie.split('|')[1],
        provider_Name: providers,
        card_Token: obj
      }
     if(this.successW >= 5 ) {
       this.loaderSubmit = false
       this.confirmModal = this.modal.info({
         nzClassName: 'reached-confirm',
         nzOkText: this.i18nSev.i18n('Proceed'),
         nzCancelText: this.i18nSev.i18n('No'),
         nzTitle: this.reachedTitle,
         nzContent: this.reachedContent,
         nzWidth: '600px',
         nzOnOk: () => {
           this.http.bridgerpayWithdraw(body).subscribe((res:any)=> {
             this.loaderSubmit = false
               this.message.success('Your Withdraw has been Initiated Successfully');
               this.router.navigateByUrl(`${this.langs}/funds/wallet`);
               sessionStorage.removeItem("bridgData");
             },
             error => {
             this.isVisibleBVNK = false
             this.loaderSubmit = false
             sessionStorage.removeItem("bridgData");
             this.message.error(error?.body?.message);
             })
         }
       });
     } 
     else {
      this.http.bridgerpayWithdraw(body).subscribe((res:any)=> {
         this.loaderSubmit = false
           this.message.success('Your Withdraw has been Initiated Successfully');
           this.router.navigateByUrl(`${this.langs}/funds/wallet`);
           sessionStorage.removeItem("bridgData");
         },
         error => {
         this.isVisibleBVNK = false
         this.loaderSubmit = false
         sessionStorage.removeItem("bridgData");
         this.message.error(error?.body?.message);
       })
     }
    }
  }

  // receivemessage(list: any) {
  //   console.log(list);
  //   if(list.data.event === '[bp]:paymentCardToken') {
  //     this.globalBridgeData = list.data as bridgeModel
  //     sessionStorage.setItem('bridgData', JSON.stringify(this.globalBridgeData))
  //   }
  // }
  
  showModal(): void {
    this.isVisible = true;
    this.validateForm.get('wallet')?.setValue(1);
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
    this.validateForm.get('amount')!.reset();
    this.radioValue = '';
  }

  getAllDepositTo() {
    this.http.getAllDepositTo().subscribe((res: any) => {
      this.depositTo = res.data;
    });
  }
  depositChange(e: any) {
    // TradingAccount
    if (e == 2) {
      this.http.getAllAccountsByCustomerID(this.tokenSrv.get()?.customer_id).subscribe((res: any) => {
        this.accounts = res.data;
      });
    } else {
      this.validateForm.get('accounts')?.setValue('');
    }
  }

  tradingChange(e: any) {
    const code = e.split('|')[0];
    this.account = code
    this.http.getBalanceByAccountLogin({ code, type: this.validateForm.value.wallet === 1 ? 'W' : 'C' }).subscribe((res: any) => {
      this.tradingBalance = {
        ...this.tradingBalance,
        balance: res.data ?? 0,
        currency: e.split('|')[1]
      };
    });

    this.getExchangeRate(e?.split('|')[1], this.validateForm.value?.currencie?.split('|')[1]);
  }

  getExchangeRate(FromCurrency: string, ToCurrency: string) {
    this.balanceLoader = false
    this.http.getExchangeRate({ FromCurrency, ToCurrency, TransactionType: 'withdraw', PaymentMethod: this.egpayHide ? 29 : 0 }).subscribe((res: any) => {
      this.exchangeRate = res.data === 0 ? 1 : res.data;
      this.balanceLoader = true
    });
  }

  getProviders(currency: string) {
    this.provideLoader = false
    this.http.bridgerpayProviders(currency).subscribe((res: any) => {
      this.provideLoader = true
      this.providers = res?.data?.result?.providers;
    });
  }

  currencieChange(e: any) {
    this.getProviders(e.split('|')[1])
    this.getExchangeRate(this.validateForm.value.accounts?.split('|')[1] ?? this.walletBalance.currency, e?.split('|')[1]);
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
    this.http.getAllAccountsTotalBalance(this.tokenSrv.get()?.customer_id).subscribe((res: any) => {
      this.total = res.data;
    });
  }

  changeVnBank(e: VnBankModel) {
    this.vnBankCode = e.code;
    this.vnBankName = e.name
  }

  goProceed() {
    this.exceed = false
  }

  handleCanceExceed() {
    this.exceed = false
  }


  handleCancelBVNK():void {
    this.isVisibleBVNK = false
    this.loaderSubmit = false
  }

    //  scroll to payment page in mobile
    scroll() {
      setTimeout(()=> {
        if($(window).width()<=767){
          let  abc:any = document.getElementById("scroll-payment");
          abc.scrollIntoView({
            behavior: 'smooth'
          });
        }
      },500)
    }
  
    cheezeUPIPayForm:boolean = false
    cheezeBankPayForm:boolean = false
    paymentMethodId:any
      changeCheezePay(e: any) {
        this.paymentMethodId = e
        console.log(e)
        if(e === '1' || e === '2' || e === '3' ) {
          this.cheezeUPIPayForm = true
          this.cheezeBankPayForm = false
        } else {
          this.cheezeUPIPayForm = false
          this.cheezeBankPayForm = true
        }
      }
  
      tableClick(tab:any) {
        const tabName = tab.availablePSPs[0]?.name
        const tabSelect = tab.availablePSPs[0]?.name + '|' + tab.availablePSPs[0]?.default_Currency
        this.pspdata = tabSelect
        const currency = tab.availablePSPs[0]?.default_Currency
        this.validateForm.get('currencie')!.setValue(`${currency}|${currency}`)
        if(tabName === 'egPay') {
          this.egpayHide = true
        } else {
          this.egpayHide = false
          this.egValue = ''
          this.egWalletPay = false
        }
      
        if(tabName === 'cheeze') {
          this.cheezePayForm = true
        } else {
          this.cheezePayForm = false
          this.cheezeBankPayForm = false
          this.cheezeUPIPayForm = false
        }

        if(tabName === 'expay') {
          this.expay = true  
         } else {
           this.expay = false
        }
      
      
        if(tabName === 'CryptoWallet') {
         this.coinPayForm = true
         this.triplePayForm = false
         this.helpPay = false
         this.validateForm.get('address')?.updateValueAndValidity();
         this.validateForm.get('toCoin')?.updateValueAndValidity();
         this.validateForm.controls['addressTrip'].clearValidators();
          this.validateForm.controls['toCoinTrip'].clearValidators();
          this.validateForm.get('addressTrip')?.updateValueAndValidity();
          this.validateForm.get('toCoinTrip')?.updateValueAndValidity();
          this.helpPayClear()
        }
      
        else if(tabName === 'tripeA' ) {
          this.triplePayForm = true
          this.coinPayForm = false
          this.helpPay = false
          this.validateForm.controls['addressTrip'].clearValidators();
          this.validateForm.controls['toCoinTrip'].clearValidators();
          this.validateForm.get('addressTrip')?.updateValueAndValidity();
          this.validateForm.get('toCoinTrip')?.updateValueAndValidity();
          this.validateForm.controls['address'].clearValidators();
          this.validateForm.controls['toCoin'].clearValidators();
          this.helpPayClear()
        }
        else if(tabName === 'Nganluong' || tabName === 'Help2Pay') {
          this.triplePayForm = false
          this.coinPayForm = false
          this.helpPay = true
          this.payClear()
        }
      
        else {
         this.coinPayForm = false
         this.triplePayForm = false
         this.helpPay = false
          this.validateForm.controls['address'].clearValidators();
          this.validateForm.controls['toCoin'].clearValidators();
          this.validateForm.get('address')?.updateValueAndValidity();
          this.validateForm.get('toCoin')?.updateValueAndValidity();
          this.validateForm.controls['addressTrip'].clearValidators();
          this.validateForm.controls['toCoinTrip'].clearValidators();
          this.validateForm.get('addressTrip')?.updateValueAndValidity();
          this.validateForm.get('toCoinTrip')?.updateValueAndValidity();
          this.helpPayClear()
        }
      
        if (tabName === 'hyperBc') {
          this.isHyperBCList = true;
          this.validateForm.controls['hyperBCCoin']?.setValidators([Validators.required]);
          this.validateForm.controls['hyperAddress']?.setValidators([Validators.required]);
        } else {
          this.isHyperBCList = false;
          this.validateForm.controls['hyperBCCoin']?.clearValidators();
          this.validateForm.controls['hyperBCCoin']?.updateValueAndValidity();
          this.validateForm.controls['hyperAddress']?.clearValidators();
          this.validateForm.controls['hyperAddress']?.updateValueAndValidity();
        }
      
        if (tabName === 'lean') {
          this.validateLean();
        } else {
          this.inValidateLean();
        }
      
        if (tabName === 'globe') {
          this.validateGlobePay();
        } else {
          this.inValidateGlobePay();
        }
      
        if (tabName === 'skrill') {
          this.validateSkrillPay();
        } else {
          this.inValidatekrillPay();
        }
      
        if (tabName === 'bridgerpay') {
          this.validateBridgePay();
        } else {
          this.invalidateBridgePay();
        }
      
        if (tabName === 'bliPay' || tabName === 'Blizzard Pay') {
          this.validateBillPay();
        } else {
          this.invalidateBillPay();
        }

        if (tabName === 'CCoop') {
          this.validatecopPay();
        } else {
          this.invalidatecopPay();
        }
      
      
        if (tabName === 'neteller') {
          this.validateNetellerPay();
        } else {
          this.invalidateNetellerPay();
        }
      
        if (tabName === 'sirPaga') {
          this.validatesirPagaPay();
        } else {
          this.invalidatesirPagaPay();
        }
      
      
        if (tabName === 'PaymentAsia') {
          this.validateVnPay();
        } else {
          this.inValidateVnPay();
        }
      
        if(tabName === 'bvnk' ) {
          this.bvnkPayForm = true
          this.triplePayForm = false
          this.coinPayForm = false
          this.helpPay = false
          this.validateForm.controls['addressTrip'].clearValidators();
          this.validateForm.controls['toCoinTrip'].clearValidators();
          this.validateForm.get('addressTrip')?.updateValueAndValidity();
          this.validateForm.get('toCoinTrip')?.updateValueAndValidity();
          this.validateForm.controls['address'].clearValidators();
          this.validateForm.controls['toCoin'].clearValidators();
          this.helpPayClear()
        } else {
          this.bvnkPayForm = false
        }
      }
}
