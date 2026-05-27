import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild, ElementRef, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { ApiService } from 'src/app/services/api.service';
import { I18NService } from '@core';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
@Component({
  selector: 'app-wire-transfer-modal',
  templateUrl: './wire-transfer-modal.component.html',
  styleUrls: ['./wire-transfer-modal.component.less']
})
export class WireTransferModalComponent implements OnInit {
  @Output() readonly toParent = new EventEmitter();
  user_Nationality = this.tokenSrv.get()?.user_Nationality
  isVisible = false;
   validateForm!: FormGroup;
  transferOptions: any = [];
  loading: boolean = false;
  loadingdata?:boolean
  radioValue: string = 'existing';
  allbankDetails:boolean = true
  accountDetails:any = {}
  langs = this.i18nSev.i18nUrl();
  account: any[] = [];
  checked?:boolean
  info:any
  transferFrom: any = {
    currency: '--',
    balance: 0
  };
  transferTo: any = {
    currency: '--',
    balance: 0
  };
  params: any = {};
  exchangeRate: number = 0;
  countriesOptios: any = [];
  constructor(
    private modal: NzModalService,
    private fb: FormBuilder,
    private http: ApiService,
    private message: NzMessageService,
    private router: Router,
    private i18nSev: I18NService,
    private injector: Injector,

  ) {}

  private get tokenSrv(): ITokenService {
    return this.injector.get(DA_SERVICE_TOKEN);
  }

  ngOnInit(): void {
     this.validateForm = this.fb.group({
       banK_NATION: [null, [Validators.required]],
       banK_NAME: [null, [Validators.required]],
       banK_USER_NAME: [null, [Validators.required]],
       banK_NO: [null, [Validators.required]],
       banK_ADDRESS: [null, [Validators.required]],
       banK_IBAN: [null, [Validators.required, Validators.pattern('^[0-9a-zA-Z_]{1,34}$')]],
       swifT_CODE: [null, [Validators.required]]
     });
    this.getAllCountries();
    this.getBankList()
     this.http.getBankDetails().subscribe((res:any)=> {
      let content = res.data
      let curr = content.filter((item: any) => item.is_Default);
      let obj =  Object.assign({}, curr);
      this.accountDetails = obj[0]
      console.log(this.accountDetails)
     })

  }
  

  submitForm(): void {
    this.loadingdata = true;
    console.log(this.accountDetails)
    if(this.accountDetails === undefined) {
      this.message.error('Please Select any bank to proceed')
      this.loadingdata = false;
    } else {
      this.http.initiateWithdraw({ ...this.params,
        paymenT_DESTINATION: this.accountDetails.iban,
        banK_NATION: this.accountDetails.bankCountry,
        banK_NAME: this.accountDetails.bankName,
        banK_USER_NAME: this.accountDetails.accountHolderName,
        banK_NO: this.accountDetails.accountNumber,
        banK_ADDRESS: this.accountDetails.bankAddress,
        banK_IBAN: this.accountDetails.iban,
        swifT_CODE: this.accountDetails.swiftCode,
      })
    .subscribe(
      res => {
        this.message.success('Withdraw Success');
        this.isVisible = false;
        this.loadingdata = false;
        this.router.navigateByUrl('/en/funds/wallet');
      },
      error => {
        this.isVisible = false;
        this.loadingdata = false;
        this.message.error(error?.body?.message);
      }
    );
    }
  
  }

  

    // submit form for bank details manual input

    // submitForm(modelRef: NzModalRef): void {
    //   this.loading = true;
    //   this.http
    //     .initiateWithdraw({ ...this.params, paymenT_DESTINATION: this.validateForm.value.banK_NO, ...this.validateForm.value })
    //     .subscribe(
    //       res => {
    //         this.message.success('Withdraw success');
    //         this.isVisible = false;
    //         this.loading = false;
    //         this.validateForm.reset();
    //         modelRef.destroy();
    //         this.router.navigateByUrl('/en/funds/wallet');
    //       },
    //       error => {
    //         this.loading = false;
    //         this.message.error(error?.body?.message);
    //       }
    //     );
    // }

    
  public getBankList() {
    this.loading = true;
    this.http.getBankDetails().subscribe(
      (res: any) => {
        this.account = res.data;
        this.loading = false;
          },
      error => {
        this.loading = false;
        this.message.error(error);
      }
    );
  }

  onItemChange(e: any){
    if(e === 'existing') {
      this.allbankDetails = true
    }else {
      this.allbankDetails = false
      this.router.navigateByUrl(`${this.langs}/funds/bankdetail?addnewBank=true`);

    }
  }
  showModal(params: any): void {
    this.isVisible = true;
    this.params = params;
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  createTplModal(tplTitle: TemplateRef<{}>, tplContent: TemplateRef<{}>, tplFooter: TemplateRef<{}>): void {
    this.modal.create({
      nzTitle: tplTitle,
      nzContent: tplContent,
      nzFooter: tplFooter,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '400px'
    });
  }
  getAllCountries() {
    this.http.getAllCountries().subscribe((res: any) => {
      this.countriesOptios = res.data;
    });
  }

  selectBankAccount(data:any) {
    console.log(data)
   // this.getBankList()
   this.accountDetails = data
   const res = this.account.map((i)=>{
        if(i.bankDetailsID == data.bankDetailsID ){
          return {
            ...i,
            is_Default:true
          }
        }else{
          return {
            ...i,
            is_Default:false
          }
        }
    })

     this.account = [...res];
    }
}

