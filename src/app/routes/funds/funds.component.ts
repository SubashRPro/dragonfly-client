import { Component, Inject, Injector, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { I18NService } from '@core';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiService } from 'src/app/services/api.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzModalService, NzModalRef } from "ng-zorro-antd/modal";
@Component({
  selector: 'app-funds',
  templateUrl: './funds.component.html',
  styleUrls: ['./funds.component.less']
})
export class FundsComponent implements OnDestroy, OnInit {
  withdrawCancel!: FormGroup;
  menu_disable!:boolean
  userInfo: any;
  basicHide:boolean | undefined
  cancelWithdrawLoader: boolean | undefined
  constructor(
    private injector: Injector,
    private fb: FormBuilder,
    private common: ApiService,
    private message: NzMessageService,
    private router: Router,
    private routeInfo: ActivatedRoute,
    private i18nSev: I18NService,
    private modal: NzModalService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService
  ) {
    this.withdrawCancel = this.fb.group({
      comments: ['', [Validators.required]],
    });
    this.userInfo = JSON.parse(localStorage.getItem("loginInfo")!);
  }

  langs = this.i18nSev.i18nUrl();

  toLink(url: string) {
    this.router.navigateByUrl(`${this.langs}/funds/${url}`);
  }

  formFilter!: FormGroup;
  collapsed: boolean = false;
  balanceLoader: boolean = true;
  isCollapse = false;
  loading = true;
  public balance = '';
  public currency = '';
  walletCode = '';
  users: any[] = [];
  public totalnumber: any = '';
  dateFormat = 'dd-MM-yyyy';
  public page = 1;
  public pageSize = 10;
  sortBy?:''
  sortOrder?:''
  totaData?:number
  customer_id = this.tokenSrv.get()?.customer_id;
  public filter = {
    pageNumber: '',
    numberOfItemPerPage: '',
    searchText: '',
    Transaction_ID:'',
    timelineFrom: null,
    timelineTo: null,
    accountNumber: null,
    transationType: null,
    status: '',
    currency: '',
    sortBy:'',
    sortOrder:'',
    customer_id: this.customer_id
  };
  allType: Array<{ id: any; description: any }> = [];
  allTransactionType: Array<{ code: any; description: any }> = [];
  timer: any = null;
  currencies: any = [];
  fundList: { [key: string]: any } = {
  };
  cancelLoader:boolean = false

  ngOnInit(): void {
    setTimeout(() => {
      const userStatus =  this.tokenService.get()?.customer_Status
      if (
        userStatus === "Funded" ||
        userStatus === "Verified" ||
        userStatus === "Active"
      ) {
        this.menu_disable = true
      } else {
        this.menu_disable = false
      }
    }, 500);

    if(this.userInfo?.customer_RoleTypeID === 'b7a1b60d-ab86-49da-854d-7db3e57882be') {
      this.basicHide = false
    } else {
      this.basicHide = true
    }

    this.formFilter = this.fb.group({
      searchText: [''],
      transactionAmount: [null],
      timeline: [''],
      status: [],
      transationType: [null],
      currency: [''],
      billNo: [''],
    });
  //  this.getReport(1, this.pageSize, this.sortBy, this.sortOrder);
    this.GetTypeStatus();
    // this.GetWalletBalance();

    // this.timer = setInterval(() => {
    //   this.getReport(1, this.pageSize, this.sortBy, this.sortOrder);
    // }, 1000 * 30);
    this.getPaymentStatus();

    this.common.getAllCurrencies().subscribe((res: any) => {
        this.currencies = res.data;
    });

    this.common.getFundsBalance().subscribe((res:any)=> {
      let fund = res.data
      this.fundList = fund
      this.balanceLoader = false;
    })

  }

  ngOnDestroy() {
    clearInterval(this.timer);
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
      searchText: this.formFilter.value.searchText,
      timelineFrom: this.formFilter.value.timeline[0],
      timelineTo: this.formFilter.value.timeline[1],
      accountNumber: this.formFilter.value.transactionAmount,
      transationType: this.formFilter.value.transationType,
      status: this.formFilter.value.status,
      currency:this.formFilter.value.currency,
      Transaction_ID:this.formFilter.value.billNo,
      sortBy:sortBy,
      sortOrder:sortOrder,
    };
    this.loading = true;
    this.common.getWalletHistory(this.filter).subscribe(
      (res: any) => {
        this.users = res.body.data.pageData;
        this.totalnumber = res.body.data.dataCount;
        this.pageSize = res.body.data.pageSize;
        this.page = res.body.data.page;
        this.totaData = res.body.data.dataCount
        this.loading = false;
      },
      error => {
        this.loading = false;
        this.message.error('error');
      }
    );
  }

  getPaymentStatus() {
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

  transationTypeChange(e: any) {}

  toParent() {
    this.getReport(1, this.pageSize, this.sortBy, this.sortOrder);
  }

  GetTypeStatus() {
    this.common.getAllTransactionType().subscribe(
      (res: any): void => {
        this.allTransactionType = res.body.data;
      },
      error => {
        this.loading = false;
        this.message.error('error');
      }
    );
  }

  // get wallet balance
  GetWalletBalance() {
    this.common.getBalanceByAccountLogin({ code:this.customer_id, type:  'C' }).subscribe((res: any) => {
      this.balance = res.data.balance;
        this.currency = res.data.currency;
        this.walletCode = res.data.virtualWallet_Code;
        this.balanceLoader = false;
    });
  }

  collapseChange(e: boolean) {
    this.isCollapse = e;
  }

  reset() {
    this.formFilter.patchValue({
      billNo:'',
      currency:'',
      timeline: '',
      transactionAmount: '',
      status: '',
      transationType: ''
    });
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
  
  onfilter() {
    this.getReport(1, this.pageSize, this.sortBy, this.sortOrder);
  }



  onPageIndexChange($event: number) {
    //do something here to go to next page
    this.page = $event;
   // this.getReport(this.page, this.pageSize, this.sortBy, this.sortOrder);
  }
  onCurrentPageDataChange($event: number) {
    this.pageSize = $event;
    this.page = 1;
    this.getReport(this.page, this.pageSize, this.sortBy, this.sortOrder);
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
