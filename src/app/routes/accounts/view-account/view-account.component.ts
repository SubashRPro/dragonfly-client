import { Component, OnInit, Injectable, ViewChild, Injector, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { I18NService } from '@core';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { number } from 'echarts';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiService } from 'src/app/services/api.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import * as XLSX from 'xlsx';
import * as saveAs from 'file-saver';
@Injectable({ providedIn: 'root' })
@Component({
  selector: 'app-account-list',
  templateUrl: './view-account.component.html',
//  styleUrls: ['./account-list.component.less']
})
export class ViewAccountComponent implements OnInit {
  constructor(
    private cdr: ChangeDetectorRef,
    private injector: Injector,
    private fb: FormBuilder,
    private common: ApiService,
    private message: NzMessageService,
    private router: Router,
    private i18nSev: I18NService,
    private route: ActivatedRoute,
    private i18NService: I18NService
  ) {
    this.userInfo = JSON.parse(localStorage.getItem('loginInfo')!);
  }
  langs = this.i18nSev.i18nUrl();
  formFilter!: FormGroup;
  collapsed: boolean = false;
  isCollapse = false;
  loading = true;
  account: any[] = [];
  public totalnumber: any = '';
  dateFormat = 'dd-MM-yyyy';
  public page = 1;
  public pageSize = 10;
  sortBy?:''
  sortOrder?:''
  disableInput: boolean = true;
  loginId = this.tokenSrv.get()?.customer_id;
  integerPattern = '[0-9]{1,9}';
  totaData?:number
  currencies: any = [];
  totalSwap?:number
  totalCommission?:number
  totalProfit?:number
  public filter = {
    pageNumber: '',
    numberOfItemPerPage: '',
    timelineFrom: null,
    timelineTo: null,
    searchText:null,
    currency: '',
    sortBy:'',
    sortOrder:'',
    Order_ID:'',
    accountNumber: this.route.snapshot.params.id
  };

  userInfo: any;

  // eslint-disable-next-line @angular-eslint/contextual-lifecycle
  ngOnInit(): void {
    this.formFilter = this.fb.group({
      timeline: [''],
      currency: [''],
      orderId:['']
    });
    this.getListAccount(1, this.pageSize, this.sortBy, this.sortOrder);
    this.getAccountDetail()
    this.common.getAllCurrencies().subscribe((res: any) => {
      this.currencies = res.data;
  });
  }

  private get tokenSrv(): ITokenService {   
    return this.injector.get(DA_SERVICE_TOKEN);
  }

  //get all report method
  public getListAccount(pageNumber: any, itemsPerPage: any, sortBy:any, sortOrder:any) {
    this.filter = {
      pageNumber: pageNumber,
      numberOfItemPerPage: itemsPerPage,
      accountNumber: this.route.snapshot.params.id,
      timelineFrom: this.formFilter.value.timeline[0],
      timelineTo: this.formFilter.value.timeline[1],
      searchText: null,
      currency:this.formFilter.value.currency,
      Order_ID:this.formFilter.value.orderId,
      sortBy:sortBy,
      sortOrder:sortOrder,
    };
    this.loading = true
      this.common.tradeAccount(this.filter).subscribe(
        (res: any) => {
          console.log(res)
          this.account = res.body.data.pageData;
          this.totalnumber = res.body.data.dataCount;
          this.pageSize = res.body.data.pageSize;
          this.page = res.body.data.page;
          this.totaData = res.body.data.dataCount
          this.totalSwap = res.body.data.totalSwap
          this.totalCommission = res.body.data.totalCommission
         this. totalProfit = res.body.data.totalProfit
          this.loading = false;
          this.disableInput = this.account.length <= 0;
        },
        error => {
          this.loading = false;
          this.message.error(error.body.message);
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
    });
    this.getListAccount(1, this.pageSize, this.sortBy, this.sortOrder);

  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    console.log(params);
    const { sort } = params;    
    const currentSort = sort.find(item => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;
    let sortOrderChange = sortOrder == "ascend"? "ASC":"DESC";
    this.getListAccount(this.page, this.pageSize, sortField, sortOrderChange);
  }

  onfilter() {
    for (const i in this.formFilter.controls) {
      if (this.formFilter.controls.hasOwnProperty(i)) {
        this.formFilter.controls[i].markAsDirty();
        this.formFilter.controls[i].updateValueAndValidity();
      }
    }
    if (this.formFilter.valid) {
      this.getListAccount(1, this.pageSize, this.sortBy, this.sortOrder);

    }
  }   



  onPageIndexChange($event: number) {
    //do something here to go to next page
    this.page = $event;
  //  this.getListAccount(1, this.pageSize, this.sortBy, this.sortOrder);

  }
  onCurrentPageDataChange($event: number) {
    this.pageSize = $event;
    this.page = 1;
    this.getListAccount(1, this.pageSize, this.sortBy, this.sortOrder);

  }
  toDepoist(data: any) {
    this.router.navigate(['funds/deposit'], { queryParams: { pamars: `${data.account_Login}|${data.mT_Currency}` } });
  }

  accountDetails:any = {}

  getAccountDetail() { 
    this.common.GetAccountDetailByAccountLogin(this.route.snapshot.params.id).subscribe(
      (res: any) => {
        this.accountDetails = res.data
        console.log(res.data)
      })
  }

  exportAsXLSX(): void {
    // this.excelService.exportAsExcelFile(this.users, 'open-position');
    let csvStr = 'Order ID, A/C No., Opened Time, Closed Time, Action, Symbol, Volume, Open Price, Close Price, Swap, Profit(EUR), Commission \n';
    for (let data of this.account) {
      var recordStr = `${data.orderID},${data.account_Login},${data.open_Time},${data.close_Time},${data.action},${data.symbol},${data.volume},${data.open_Price},${data.close_Price}, ${data.swaps}, ${data.profit},  ${data.trade_Commission}`;
      csvStr = `${csvStr + recordStr}\n`;
    }

    var csvBlob = new Blob([csvStr], {
      type: 'text/plain'
    });
    saveAs(csvBlob, 'Accounts.csv');
  }
}
