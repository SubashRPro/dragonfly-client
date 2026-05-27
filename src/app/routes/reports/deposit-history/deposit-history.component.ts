import { Component, Injector, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-deposit-history',
  templateUrl: './deposit-history.component.html',
  styles: []
})
export class DepositHistoryComponent implements OnInit {
  constructor(
    private excelService: ExcelService,
    private injector: Injector,
    private fb: FormBuilder,
    private common: ApiService,
    private message: NzMessageService,
    private i18NService: I18NService
  ) {}
  formFilter!: FormGroup;
  collapsed: boolean = false;
  isCollapse = false;
  loading = true;
  disableInput: boolean = true;
  users: any[] = [];
  currencies: any = [];
  public totalnumber: any = '';
  dateFormat = 'dd-MM-yyyy';
  public page = 1;
  public pageSize = 10;
  sortBy?:''
  sortOrder?:''
  customer_id = this.tokenSrv.get()?.customer_id;
  totalAmount?:number
  totaData?:number
  currencyData? = ''
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
      accountNumber: [''],
      transactionAmount: [''],
      timeline: [''],
      status: [],
      currency: [''],
      billNo: [''],
    });
   // this.getReport(1, this.pageSize, this.sortBy, this.sortOrder);
    this.GetPaymentStatus();
    this.common.getAllCurrencies().subscribe((res: any) => {
      this.currencies = res.data;
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
    this.common.getDepositHistory(this.filter).subscribe(
      (res: any) => {
        this.users = res.body?.data?.pageData || [];
        this.totalnumber = res.body.data.dataCount;
        this.pageSize = res.body.data.pageSize;
        this.page = res.body.data.page;
        this.totaData = res.body.data.dataCount
        this.totalAmount = res.body.data.totalAmount
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
        //  console.log(res.body.data);
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

  onPageIndexChange($event: number) {
    //do something here to go to next page
    this.page = $event;
  //  this.getReport(this.page, this.pageSize, this.sortBy, this.sortOrder);
  }
  onCurrentPageDataChange($event: number) {
    this.pageSize = $event;
    this.page = 1;
    this.getReport(this.page, this.pageSize, this.sortBy, this.sortOrder);
  }

  exportAsXLSX(): void {
    // this.excelService.exportAsExcelFile(this.users, 'Deposit-history');
    let csvStr = `${this.i18NService.i18n('Bill No.')},${this.i18NService.i18n('Deposited Time')},${this.i18NService.i18n('Type')},${this.i18NService.i18n(
      'From Account'
    )} ,${this.i18NService.i18n('To Account')},${this.i18NService.i18n('Amount')},${this.i18NService.i18n('Currency')},${this.i18NService.i18n('Status')} \n`;
    for (let data of this.users) {
      var recordStr = `${data.transaction_ID},${data.deposiT_TIME},${data.deposiT_TYPE},${data.paymenT_SOURCE},${data.paymenT_DESTINATION},${data.deposiT_AMOUNT},${data.currency},${data.status}`;
      csvStr = `${csvStr + recordStr}\n`;
    }

    var csvBlob = new Blob([csvStr], {
      type: 'text/plain'
    });
    saveAs(csvBlob, 'Deposit history.csv');
  }
}
