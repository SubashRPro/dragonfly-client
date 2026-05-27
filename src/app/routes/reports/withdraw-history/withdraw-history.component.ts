import { Component, Inject, Injector, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { I18NService } from '@core';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import * as saveAs from 'file-saver';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { ExcelService } from 'src/app/services/excel.service';
import { NzModalService, NzModalRef } from "ng-zorro-antd/modal";
@Component({
  selector: 'app-withdraw-history',
  templateUrl: './withdraw-history.component.html',
  styles: []
})
export class WithdrawHistoryComponent implements OnInit {
  constructor(
    private excelService: ExcelService,
    private injector: Injector,
    private fb: FormBuilder,
    private common: ApiService,
    private message: NzMessageService,
    private i18NService: I18NService,
    private modal: NzModalService,
  ) {}
  withdrawCancel!: FormGroup;
  menu_disable!:boolean
  userInfo: any;
  basicHide:boolean | undefined
  cancelWithdrawLoader: boolean | undefined
  formFilter!: FormGroup;
  collapsed: boolean = true;
  disableInput: boolean = true;
  isCollapse = false;
  currencies: any = [];
  loading = true;
  users: any[] = [];
  public totalnumber: any = '';
  dateFormat = 'dd-MM-yyyy';
  public page = 1;
  public pageSize = 10;
  sortBy?:''
  sortOrder?:''
  customer_id = this.tokenSrv.get()?.customer_id;
  totaData?:number
  currencyData? = ''
  totalAmount?:number
  public filter = {
    pageNumber: '',
    numberOfItemPerPage: '',
    Transaction_ID:'',
    timelineFrom: null,
    timelineTo: null,
    transactionAmount: '',
    status: '',
    accountNumber: '',
    currency: '',
    sortBy:'',
    sortOrder:'',
    customer_id: this.customer_id
  };
  allType: Array<{ id: any; description: any }> = [];
  ngOnInit(): void {
    this.formFilter = this.fb.group({
      transactionAmount: [''],
      timeline: [''],
      accountNumber: [''],
      status: [],
      currency: [''],
      billNo: [''],
    });
   // this.getReport(1, this.pageSize, this.sortBy, this.sortOrder);
    this.GetPaymentStatus();
    this.common.getAllCurrencies().subscribe((res: any) => {
      this.currencies = res.data;
  });
  this.withdrawCancel = this.fb.group({
    comments: ['', [Validators.required]],
  });
  }

  private get tokenSrv(): ITokenService {
    return this.injector.get(DA_SERVICE_TOKEN);
  }

  //get all report method
  public getReport(pageNumber: any, itemsPerPage: any, sortBy:any, sortOrder:any) {
    this.filter = {
      pageNumber: pageNumber,
      numberOfItemPerPage: itemsPerPage,
      customer_id: this.customer_id,
      timelineFrom: this.formFilter.value.timeline[0],
      timelineTo: this.formFilter.value.timeline[1],
      transactionAmount: this.formFilter.value.transactionAmount,
      status: this.formFilter.value.status,
      accountNumber: this.formFilter.value.accountNumber,
      currency:this.formFilter.value.currency,
      Transaction_ID:this.formFilter.value.billNo,
      sortBy:sortBy,
      sortOrder:sortOrder,
    };
    this.loading = true;
    this.common.getWithdrawHistory(this.filter).subscribe(
      (res: any) => {
        this.users = res.body?.data?.pageData || [];
        this.totalnumber = res.body.data.dataCount;
        this.pageSize = res.body.data.pageSize;
        this.page = res.body.data.page;
        this.totaData = res.body.data.dataCount;
        this.totalAmount = res.body.data.totalAmount;
        this.loading = false;
        this.disableInput = this.users.length <= 0;
      },
      error => {
        this.loading = false;
        this.message.error('error');
      }
    );
  }

  GetPaymentStatus() {
    this.common.getAllFundStatus().subscribe(
      (res: any): void => {
        this.allType = res.data;
      },
      error => {
        this.loading = false;
        this.message.error('error');
      }
    );
  }

  collapseChange(e: boolean) {
    this.isCollapse = e;
  }

  reset() {
    this.formFilter.patchValue({
      billNo:'',
      currency:'',
      accountNumber: '',
      timeline: '',
      transactionAmount: '',
      status: ''
    });
    this.getReport(1, this.pageSize, this.sortBy, this.sortOrder);
  }

  onfilter() {
    this.currencyData = this.formFilter.value.currency
    this.getReport(1, this.pageSize, this.sortBy, this.sortOrder);
    console.log(this.formFilter.value);
  }

  onPageIndexChange($event: number) {
    //do something here to go to next page
    this.page = $event;
   // this.getReport(1, this.pageSize, this.sortBy, this.sortOrder);
  }
  onCurrentPageDataChange($event: number) {
    this.pageSize = $event;
    this.page = 1;
    this.getReport(1, this.pageSize, this.sortBy, this.sortOrder);
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    console.log(params);
    const { sort } = params;
    const currentSort = sort.find(item => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;
    let sortOrderChange = sortOrder == "ascend"? "ASC":"DESC";
    this.getReport(this.page, this.pageSize, sortField, sortOrderChange);
  }
  
  exportAsXLSX(): void {
    // this.excelService.exportAsExcelFile(this.users, 'withdraw-history');
    let csvStr = `${this.i18NService.i18n('Bill No')},${this.i18NService.i18n('Created Time')},${this.i18NService.i18n('Type')},${this.i18NService.i18n(
      'From Account'
    )} ,${this.i18NService.i18n('To Account')},${this.i18NService.i18n('Amount')},${this.i18NService.i18n('Currency')},${this.i18NService.i18n('Status')} \n`;
    for (let data of this.users) {
      var recordStr = `${data.transaction_ID},${data.withdraW_TIME},${data.withdraW_TYPE},${data.paymenT_SOURCE},${data.paymenT_DESTINATION},${data.withdraW_AMOUNT},${data.currency},${data.withdraW_STATUS}`;
      csvStr = `${csvStr + recordStr}\n`;
    }

    var csvBlob = new Blob([csvStr], {
      type: 'text/plain'
    });
    saveAs(csvBlob, 'Withdraw history.csv');
  }


  createBasicModal(
    basicTitle: TemplateRef<{}>,
    basicContent: TemplateRef<{}>,
    basicFooter: TemplateRef<{}>
  ): void {
    this.modal.create({
      nzTitle: basicTitle,
      nzContent: basicContent,
      nzFooter: basicFooter,
      nzClosable: false,
      nzWidth: "400px",
      // nzOnOk: () => {
      //   localStorage.removeItem("_token");
      //   window.location.reload();
      // },
    });
  }


    // cancel withdraw 
    swithcBasic(id:any, modelRef: NzModalRef) {
      if (this.withdrawCancel.valid) {
        let body = {
          withdrawId: id,
          comment: this.withdrawCancel.value.comments
        }
        this.cancelWithdrawLoader = true
        this.common.cancelWithdraw(body).subscribe(
          (res: any) => {
            this.cancelWithdrawLoader = false
            this.getReport(1, this.pageSize, this.sortBy, this.sortOrder);
            modelRef.destroy();
            this.withdrawCancel.reset()
            this.message.success('Your Withdraw request has been cancelled successfully.')
          },
          (error) => {
            this.cancelWithdrawLoader = false
            this.message.error(error.body.message);
          }
        );
      }
      else {
        Object.values(this.withdrawCancel.controls).forEach(control => {
          if (control.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }
        });
        this.cancelWithdrawLoader = false;
      }
    }
  
    closeWithdraw(modelRef: NzModalRef) {
      modelRef.destroy();
      this.withdrawCancel.markAsPristine();
      this.withdrawCancel.markAsUntouched();
      this.withdrawCancel.updateValueAndValidity();
    }
}
