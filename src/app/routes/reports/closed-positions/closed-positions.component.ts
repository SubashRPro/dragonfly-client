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
  selector: 'app-closed-positions',
  templateUrl: './closed-positions.component.html',
  styles: []
})
export class ClosedPositionsComponent implements OnInit {
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
  isCollapse = true;
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
  totaData?:number
  totalSwap?:number
  totalCommission?:number
  totalProfit?:number
  customer_id = this.tokenSrv.get()?.customer_id;
  public filter = {
    pageNumber: '',
    numberOfItemPerPage: '',
    timelineFrom: null,
    timelineTo: null,
    accountNumber: '',
    currency: '',
    Order_ID:'',
    sortBy:'',
    sortOrder:'',
    customer_id: this.customer_id,
    trading_Platform:'MT5',
  };
  ngOnInit(): void {
    this.formFilter = this.fb.group({
      currency:[''],
      accountNumber: [''],
      timeline: [''],
      orderId:[''],
      trading_Platform:'MT5',
    });
    this.common.getAllCurrencies().subscribe((res: any) => {
      this.currencies = res.data;
  });
   // this.getReport(1, this.pageSize, this.sortBy, this.sortOrder);
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
      accountNumber: this.formFilter.value.accountNumber,
      currency:this.formFilter.value.currency,
      Order_ID:this.formFilter.value.orderId,
      trading_Platform: this.formFilter.value.trading_Platform,
      sortBy:sortBy,
      sortOrder:sortOrder,
    };
     this.loading = true;
    this.common.getClosePositions(this.filter).subscribe(
      (res: any) => {
        this.users = res.body.data.pageData;
        this.totalnumber = res.body.data.dataCount;
        this.pageSize = res.body.data.pageSize;
        this.page = res.body.data.page;
        this.totaData = res.body.data.dataCount
        this.totalSwap = res.body.data.totalSwap
        this.totalCommission = res.body.data.totalCommission
       this. totalProfit = res.body.data.totalProfit
        this.loading = false;
        this.disableInput = this.users.length <= 0;
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
      orderId:'',
      currency:'',
      timeline: '',
      accountNumber: '',
      trading_Platform:'MT4'
    });
    this.getReport(1, this.pageSize, this.sortBy, this.sortOrder);
  }

  onfilter() {
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

     //this.getReport(1, this.pageSize, this.sortBy, this.sortOrder);
  }
  onCurrentPageDataChange($event: number) {
    this.pageSize = $event;
    this.page = 1;
    this.getReport(1, this.pageSize, this.sortBy, this.sortOrder);
  }

  exportAsXLSX(): void {
    // this.excelService.exportAsExcelFile(this.users, 'closed-position');
    let csvStr = `
    ${this.i18NService.i18n('Order Id')}, ${this.i18NService.i18n('Account1')} ,${this.i18NService.i18n(
      'Created Time'
    )} , ${this.i18NService.i18n('Symbol')},${this.i18NService.i18n('Volume')} , ${this.i18NService.i18n(
      'Open Price'
    )}, , ${this.i18NService.i18n(
      'Closed Price'
    )},${this.i18NService.i18n('Currency')}, ${this.i18NService.i18n('Swap')},${this.i18NService.i18n(
      'Profit'
    )+"(USD)"}, ${this.i18NService.i18n('Commission')} \n`;
    for (let data of this.users) {
      var recordStr = `${data.orderID},${data.accountNo},${data.trading_CloseTime},${data.transaction_Symbol},${data.trading_Volume},${data.trading_OpenPrice},${data.trading_ClosePrice},${data.currency},${data.currency_Swap},${data.profit},${data.commission_Amount}`;
      csvStr = `${csvStr + recordStr}\n`;
    }

    var csvBlob = new Blob([csvStr], {
      type: 'text/plain'
    });
    saveAs(csvBlob, 'Closed Position.csv');
  }
}
