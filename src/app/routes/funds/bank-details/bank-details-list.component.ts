import { Component, OnInit, Injectable, ViewChild, Injector, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { I18NService } from '@core';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { number } from 'echarts';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiService } from 'src/app/services/api.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { EditdetailsModalComponent } from '../edit-bank-details/edit-details-modal.component';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { fileByBase64 } from 'src/app/shared/utils/base64';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { SupportDocument } from 'src/app/models/support';

@Injectable({ providedIn: 'root' })
@Component({
  selector: 'app-bank-list',
  templateUrl: './bank-details-list.component.html',
   styleUrls: ['./bank-details-list.component.less']
})
export class BankDetailsListComponent  implements OnInit {
  @ViewChild('EditdetailsModalComponent')
  EditdetailsModalComponent!: EditdetailsModalComponent;
  constructor(
    private cdr: ChangeDetectorRef,
    private injector: Injector,
    private fb: FormBuilder,
    private common: ApiService,
    private message: NzMessageService,
    private router: Router,
    private i18nSev: I18NService,
    private http: ApiService,
    private modal: NzModalService,
    private route: ActivatedRoute,
  ) {
    this.userInfo = JSON.parse(localStorage.getItem('loginInfo')!);
  }
  langs = this.i18nSev.i18nUrl();
  fileList: NzUploadFile[] = [];
  formFilter!: FormGroup;
  collapsed: boolean = false;
  isCollapse = true;
  loading = true;
  loadingdata?:boolean
  account: any[] = [];
  public totalnumber: any = '';
  dateFormat = 'dd-MM-yyyy';
  public page = 1;
  public pageSize = 10;
  sortBy?:''
  sortOrder?:''
  loginId = this.tokenSrv.get()?.customer_id;
  integerPattern = '[0-9]{1,9}';
  totaData?:number
  isVisible = false;
  validateForm!: FormGroup;
  countriesOptios: any = [];
  confirmModal?: NzModalRef;
  user_Nationality = this.tokenSrv.get()?.user_Nationality
  ibanDisabled?:boolean
  bankFill:any
  public filter = {
    pageNumber: '',
    numberOfItemPerPage: '',
    account_RegDateFrom: null,
    account_RegDateTo: null,
    status: '',
    account_Login: '',
    sortBy:'',
    sortOrder:'',
    customer_ID: this.loginId
  };

  userInfo: any;

  // eslint-disable-next-line @angular-eslint/contextual-lifecycle
  ngOnInit(): void {
    this.route.queryParams.subscribe(queryParams => {
      if(queryParams?.addBank || queryParams.addnewBank) {
        this.addBank();
      }
    });
    this.validateForm = this.fb.group({
      banK_NATION: [null, [Validators.required]],
      banK_NAME: [null, [Validators.required]],
      banK_USER_NAME: [null, [Validators.required]],
      banK_NO: [null, [Validators.required]],
      banK_ADDRESS: [null, [Validators.required]],
      banK_IBAN: [null, [Validators.required, Validators.pattern('^[0-9a-zA-Z_]{1,34}$')]],
      swifT_CODE: [null, [Validators.required]],
      is_Default: [false]
    });
   this.getAllCountries()
   this.getBankList()
  }

  private get tokenSrv(): ITokenService {
    return this.injector.get(DA_SERVICE_TOKEN);
  }


  public getBankList() {
    this.loading = true;
    this.common.getBankDetails().subscribe(
      (res: any) => {
        this.account = res.data;
        this.loading = false;
          },
      error => {
        this.loading = false;
        this.message.error('error');
      }
    );
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    return false;
  };

  async onFileToBase64() {
    return await Promise.all(
      this.fileList.map(async item => {
        return {
          documentType: 'BankReceipt',
          fileName: item.name,
          fileType: item.type,
          b64String: await fileByBase64(item)
        } as SupportDocument;
      })
    );
  }



  showModal(): void {
    this.isVisible = true;
    if(this.user_Nationality === 'IN') {
      this.validateForm.controls.banK_IBAN.disable();
    } else {
      this.validateForm.controls.banK_IBAN.enable();
    }
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.fileList = [];
    this.isVisible = false;
    this.validateForm.reset();
  }


  async submitForm(): Promise<void> {
    this.loadingdata = true;
    const files =  await this.onFileToBase64();
    if (this.validateForm.valid) {
      const { banK_NATION, banK_NAME, banK_USER_NAME, banK_NO, banK_ADDRESS, banK_IBAN, swifT_CODE, is_Default  } = this.validateForm.value;
      let body = {
        accountHolderName: banK_USER_NAME,
        bankName: banK_NAME,
        accountNumber: banK_NO,
        bankCountry: banK_NATION,
        bankAddress: banK_ADDRESS,
        iban: banK_IBAN ? banK_IBAN : this.bankFill,
        swiftCode: swifT_CODE,
        is_Default:is_Default
      }
      this.http.addbank({...body, upload_BankStatement_Document: { ...files[0] } }).subscribe(
        (res:any) => {
          this.message.success(res.message);
          this.isVisible = false;
          this.loadingdata = false;
          this.validateForm.reset();
          this.getBankList()
          this.fileList = [];
        },
        error => {
          this.loadingdata = false;
          this.message.error(error?.body?.message);
        }
    );
    }

    else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      this.loadingdata = false;
    }

  }


  addBank() {
    this.showModal()
  }

  getAllCountries() {
    this.http.getAllCountries().subscribe((res: any) => {
      this.countriesOptios = res.data;
    });
  }

  deleteBankAccount(id:any) {
    this.confirmModal = this.modal.confirm({
      nzTitle: this.i18nSev.i18n('Are you sure to Delete Bank Account?'),
      nzOkText: this.i18nSev.i18n('Yes'),
      nzCancelText: this.i18nSev.i18n('No'),
      nzOnOk: () => {
        this.http.deleteBank(id).subscribe((res:any) => {
          this.message.success(res.message)
          this.getBankList()
        },
        error => {
          this.message.error(error?.body?.message);
        }
        );
      }
    });
  }

}
