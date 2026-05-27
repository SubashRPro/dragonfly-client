import {
  Component,
  OnInit,
  Injectable,
  ViewChild,
  Injector,
  ChangeDetectorRef,
  EventEmitter,
  Output,
  Inject,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { I18NService } from "@core";
import { DA_SERVICE_TOKEN, ITokenService } from "@delon/auth";
import { number } from "echarts";
import { NzMessageService } from "ng-zorro-antd/message";
import { ApiService } from "src/app/services/api.service";
import { NzTableQueryParams } from "ng-zorro-antd/table";
import { SettingModalComponent } from "../../../layout/basic/widgets/setting-modal/setting-modal.component";
import { ChangeLeverageModalComponent } from "../change-leverage-modal/change-leverage-modal.component";
import { ChangePasswordModalComponent } from "../change-password-modal/change-password-modal.component";

import { prefixDefault } from '../../profile/phone';

@Injectable({ providedIn: "root" })
@Component({
  selector: "app-demo-list",
  templateUrl: "./demo-account.component.html",
  styleUrls: ["./demo-account.component.less"],
})
export class DemoAccountListComponent implements OnInit {
  @ViewChild("changePasswordModalComponent")
  changePasswordModalComponent!: ChangePasswordModalComponent;
  @ViewChild("changeLeverageModalComponent")
  changeLeverageModalComponent!: ChangeLeverageModalComponent;
  @ViewChild("settingModalComponent")
  settingModalComponent!: SettingModalComponent;

  constructor(
    private cdr: ChangeDetectorRef,
    private injector: Injector,
    private fb: FormBuilder,
    private common: ApiService,
    private message: NzMessageService,
    private router: Router,
    private i18nSev: I18NService,
    private route: ActivatedRoute,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService
  ) {
    this.userInfo = JSON.parse(localStorage.getItem("loginInfo")!);
  }
  private isFirstLoad = true;
  formOpenAccount!: FormGroup;
  langs = this.i18nSev.i18nUrl();
  formFilter!: FormGroup;
  collapsed: boolean = false;
  isCollapse = false;
  loading = true;
  account: any[] = [];
  public totalnumber: any = "";
  dateFormat = "dd-MM-yyyy";
  public page = 1;
  public pageSize = 10;
  sortBy?: "";
  sortOrder?: "";
  loginId = this.tokenSrv.get()?.customer_id;
  integerPattern = "[0-9]{1,9}";
  totaData?: number;
  menu_disable!:boolean
  agreeTc:boolean = false
  public filter = {
    pageNumber: "",
    numberOfItemPerPage: "",
    account_RegDateFrom: null,
    account_RegDateTo: null,
    status: "",
    account_Login: "",
    sortBy: "",
    sortOrder: "",
    customer_ID: this.loginId,
  };

  userInfo: any;
  isDemo: boolean = false;
  isVisible = false;
  loader: boolean = false;
  validateForm!: FormGroup;
  phones: any = prefixDefault;
  customerVersion: any;
  swapFree = this.tokenSrv.get()?.is_SwapFreeReq_Enabled
  // eslint-disable-next-line @angular-eslint/contextual-lifecycle
  ngOnInit(): void {
    this.route.queryParams.subscribe(queryParams => {
      if(queryParams?.addDemoAc) {
        this.isVisible = true
      }
    });
    this.validateForm = this.fb.group({
      customerId: [''],
      applicantName: [''],
      phoneNumber: [""],
      phoneNumberPrefix: ["+971"],
      email: [''],
      agree: [false, [Validators.required]],
    });

    this.formOpenAccount = this.fb.group({
      Trading_Platform: ['MT5', [Validators.required]],
      account_Type: ['demo', [Validators.required]],
      currency: ['USD', [Validators.required]],
      account_Leverage: ['100', [Validators.required]],
      init_Balance: ['5000']
    });

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


    this.formFilter = this.fb.group({
      account_Login: ["", [Validators.pattern(this.integerPattern)]],
      timeline: [""],
      status: "",
    });
   // this.getListAccount(1, this.pageSize, this.sortBy, this.sortOrder);
  }

  onNew() {
    const is_VerificationRequired =
      this.tokenSrv.get()?.is_VerificationRequired;
    const verification_Status = this.tokenSrv.get()?.verification_Status;

    if (is_VerificationRequired && verification_Status == "Completed") {
      this.router.navigateByUrl(`${this.langs}/account-list/account-open`);
    } else {
      this.router.navigateByUrl(`${this.langs}/profile`);
    }
  }

  private get tokenSrv(): ITokenService {
    return this.injector.get(DA_SERVICE_TOKEN);
  }

  //get all report method
  public getListAccount(
    pageNumber: any,
    itemsPerPage: any,
    sortBy: any,
    sortOrder: any
  ) {
    this.filter = {
      pageNumber: pageNumber,
      numberOfItemPerPage: itemsPerPage,
      customer_ID: this.loginId,
      account_RegDateFrom: this.formFilter.value.timeline[0],
      account_RegDateTo: this.formFilter.value.timeline[1],
      account_Login: this.formFilter.value.account_Login,
      status: this.formFilter.value.status,
      sortBy: sortBy,
      sortOrder: sortOrder,
    };

    this.common.listDemoAccount(this.filter).subscribe(
      (res: any) => {
        this.account = res.body.data.pageData;
        this.totalnumber = res.body.data.dataCount;
        this.pageSize = res.body.data.pageSize;
        this.page = res.body.data.page;
        this.loading = false;
      },
      (error) => {
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
      account_Login: "",
      timeline: "",
      status: "",
    });
    this.getListAccount(1, this.pageSize, this.sortBy, this.sortOrder);
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

  onQueryParamsChange(params: NzTableQueryParams): void {
    // 🚫 Skip first automatic trigger
      if (this.isFirstLoad) {
        this.isFirstLoad = false;
        return;
      }
    console.log(params);
    const { sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;
    let sortOrderChange = sortOrder == "ascend" ? "ASC" : "DESC";
    this.getListAccount(this.page, this.pageSize, sortField, sortOrderChange);
  }

  onPageIndexChange($event: number) {
    //do something here to go to next page
    this.page = $event;
    //   this.getListAccount(1, this.pageSize, this.sortBy, this.sortOrder);
  }
  onCurrentPageDataChange($event: number) {
    this.pageSize = $event;
    this.page = 1;
    this.getListAccount(1, this.pageSize, this.sortBy, this.sortOrder);
  }
  toDepoist(data: any) {
    this.router.navigate(["funds/deposit"], {
      queryParams: { pamars: `${data.account_Login}|${data.mT_Currency}` },
    });
  }

  goView(id: any) {
    this.router.navigateByUrl(`${this.langs}/view-account/${id}`);
  }
  go(type: number) {
    this.router.navigateByUrl(`${this.langs}/account/trading/${type}`);
  }

  // showModal(): void {
  //   this.isVisible = true;
  // }

  showModal(): void {
    this.router.navigateByUrl(
      `${this.langs}/open-demo-accounts`
    );
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.agreeTc = false
  }

  cancel() {
    this.isVisible = false;
    this.agreeTc = false
  }


  reject() {
    
  }

  public loginID: any = this.tokenSrv.get()?.customer_id;
  submitForm(): void {
    for (const i in this.formOpenAccount.controls) {
      if (this.formOpenAccount.controls.hasOwnProperty(i)) {
        this.formOpenAccount.controls[i].markAsDirty();
        this.formOpenAccount.controls[i].updateValueAndValidity();
      }
    }
    if (this.formOpenAccount.valid) {
      this.loader = true;
      let body = {
        customer_ID: this.loginID,
        Trading_Platform: this.formOpenAccount.value.Trading_Platform,
        account_Type: this.formOpenAccount.value.account_Type,
        currency: this.formOpenAccount.value.currency,
        account_Leverage: this.formOpenAccount.value.account_Leverage,
        init_Balance: this.formOpenAccount.value.init_Balance
      };

      this.common.addDemoAccount(body).subscribe(
        (res: any) => {
          this.message.success(res.body.message);
          this.loader = false;
          this.isVisible = false
          this.getListAccount(1, this.pageSize, this.sortBy, this.sortOrder);
        },
        error => {
          this.loader = false;
          this.message.error(error.body.message);
        }
      );
    }
  }


}
