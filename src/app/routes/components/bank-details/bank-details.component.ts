import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild , Injector} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { I18NService } from '@core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { SupportDocument } from 'src/app/models/support';
import { ApiService } from 'src/app/services/api.service';
import { fileByBase64 } from 'src/app/shared/utils/base64';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
@Component({
  selector: 'app-bank-details',
  templateUrl: './bank-details.component.html',
  styleUrls: ['./bank-details.component.less']
})
export class BankDetailsComponent implements OnInit {
  kycMessage!:boolean
  langs = this.i18nSev.i18nUrl();
  exceed:boolean = false
  @Output() readonly toParent = new EventEmitter();
  uploadStatement: boolean = false
  allbankDetails: boolean = false
  isVisible = false;
  validateForm!: FormGroup;
  fileList: NzUploadFile[] = [];
  uploadList: NzUploadFile[] = [];
  info: any = {};
  infoAed: any = {};
  infoZar:any = {};
  params: any = {};
  bankDetails:any = []; 
  accountDetails:any = ''
  loading: boolean = false;
  account: any[] = [];
  zarRate:any
  user_Nationality = this.tokenSrv.get()?.user_Nationality
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
    this.http.getBankDetails().subscribe((res:any)=> {
      let content = res.data
      let curr = content.filter((item: any) => item.is_Default);
      let obj =  Object.assign({}, curr);
      this.accountDetails = obj[0]?.accountNumber
     })
     
   // this.getCPTPaymentInformation();
    this.getBankList()
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    return false;
  };


  beforeUpload1 = (file: NzUploadFile): boolean => {
    this.uploadList = this.uploadList.concat(file);
    return false;
  };


  showModal(params: any): void {
    this.isVisible = true;
    this.fileList = [];
    this.uploadList=[]
    this.params = params;
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
    // upload doc mandatory remove alon requirement 
    // if (this.fileList.length) {
    //   this.modal.create({
    //     nzTitle: tplTitle,
    //     nzContent: tplContent,
    //     nzFooter: tplFooter,
    //     nzMaskClosable: false,
    //     nzClosable: false,
    //     nzWidth: '400px'
    //   });
    // } else {
    //   this.message.error(this.i18nSev.i18n('Please Upload File'));
    // }
  }

  // getExchangeRate() {
  //   this.http.getExchangeRate({ FromCurrency: 'USD', ToCurrency:this.infoZar.currency, TransactionType: 'deposit',  PaymentMethod: 0  }).subscribe((res: any) => {
  //    this.zarRate = res.data
  //   });
  // }

  // getCPTPaymentInformation() {
  //   this.http.getCPTPaymentInformation().subscribe((res: any) => {
  //    // this.info = res.data;
  //    this.info = res.data[0]
  //    this.infoAed = res.data[1]
  //    this.infoZar = res.data[2]
  //    this.getExchangeRate()

  //   });
  // }
  async onFileToBase64() {
    return await Promise.all(
      this.fileList.map(async item => {
        return {
          documentType: 'DepositReceipt',
          fileName: item.name,
          fileType: item.type,
          b64String: await fileByBase64(item)
        } as SupportDocument;
      })
    );
  }

  async onFileToBase641() {
    return await Promise.all(
      this.uploadList.map(async item => {
        return {
          documentType: 'BankStatement',
          fileName: item.name,
          fileType: item.type,
          b64String: await fileByBase64(item)
        } as SupportDocument;
      })
    );
  }

  async submit() {
    this.loading = true;
    const files = await this.onFileToBase64();
    const filesUpload = await this.onFileToBase641();
    if (this.fileList.length <= 0) {
      this.message.error('Please Upload Transaction Receipt')
      this.loading = false
    } else {
      if(this.uploadList.length > 0) {
        this.http.initiateDeposit({ ...this.params, upload_BankStatement_Document: { ...filesUpload[0] }, upload_Support_Document: { ...files[0] } }).subscribe((res:any) => {
          this.message.success('Your Deposit has been Initiated Successfully');
          this.router.navigateByUrl(`${this.langs}/funds/wallet`);
            this.isVisible = false;
            this.loading = false;
            this.router.navigateByUrl(`${this.langs}/funds/wallet`);
          //  this.redirectMerchant();
          },
          error => {
            if(error?.body?.message === 'Deposit_is_not_allowed_Exceed_Limit') {
              this.exceed = true
              this.kycMessage = true
            } 
            else if(error?.body?.message === 'Deposit_is_not_allowed_Exceed_Amount') {
            //  this.message.error(this.i18nSev.i18n('Account verification is required for deposit above 300$'));
              this.exceed = true
            }
            else {
              this.message.error(error?.body?.message);
            }
            // this.isVisible = false;
            this.loading = false;
            // modelRef.destroy();
          }
        );
      } 
      else  {
        this.http.initiateDeposit({ ...this.params, accountNumber: this.accountDetails, upload_BankStatement_Document: { ...filesUpload[0] }, upload_Support_Document: { ...files[0] } }).subscribe((res:any) => { 
          this.message.success('Your Deposit has been Initiated Successfully');
            this.isVisible = false;
            this.loading = false;
            this.router.navigateByUrl(`${this.langs}/funds/wallet`);
          //  this.redirectMerchant();
          },
          error => {
            this.message.error(error?.body?.message);
            if(error?.body?.message === 'Deposit_is_not_allowed_Exceed_Limit') {
              this.exceed = true
            }
            // this.isVisible = false;
            this.loading = false;
            // modelRef.destroy();
          }
        );
      }
    }
   
  }

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
    if(e === 'no') {
      this.uploadStatement = true
      this.allbankDetails = false
    }else {
      this.uploadStatement = false
      this.allbankDetails = true
    }
  }

  selectBankAccount(data:any) {
   this.accountDetails = data?.accountNumber
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

    
    goVerify() {
      this.router.navigate([`${this.langs}/profile`])
    }

    redirectMerchant() {
      const body = {
        merchant_token: sessionStorage.getItem('merchant_token'),
        merchant_secret: sessionStorage.getItem('merchant_secret'),
        transaction_type: 'deposit'
      }
      this.http.redirectMerchant(body).subscribe(
        (res: any) => {
          let data = res?.data
          if(res?.data?.is_CPT_Customer) {
            this.router.navigateByUrl('/en/funds/wallet');
          } else {
            window.open(`${data.redirect_url}?email=${data?.email}&first_name=${data?.first_name}&last_name=${data?.last_name}&merchant_reference_id=${data?.merchant_reference_id}&transaction_id=${data?.transaction_id}&status=success&remarks=success`, "_self");
          }
        },
      );
    }
}
