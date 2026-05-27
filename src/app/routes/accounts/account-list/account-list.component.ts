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
import { Router } from "@angular/router";
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
  selector: "app-account-list",
  templateUrl: "./account-list.component.html",
  styleUrls: ["./account-list.component.less"],
})
export class AccountListComponent implements OnInit {
  @ViewChild("changePasswordModalComponent")
  changePasswordModalComponent!: ChangePasswordModalComponent;
  @ViewChild("changeLeverageModalComponent")
  changeLeverageModalComponent!: ChangeLeverageModalComponent;
  @ViewChild("settingModalComponent")
  settingModalComponent!: SettingModalComponent;

    @ViewChild('signaturePad', { static: false }) signaturePad;

  width: number = 450;
  height: number = 100;
  options = {
    minWidth: 1,
    maxWidth: 2,
    penColor: "rgb(0, 0, 0)",
    backgroundColor: "rgb(255, 255, 255)"
  };


  constructor(
    private cdr: ChangeDetectorRef,
    private injector: Injector,
    private fb: FormBuilder,
    private common: ApiService,
    private message: NzMessageService,
    private router: Router,
    private i18nSev: I18NService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService
  ) {
    this.userInfo = JSON.parse(localStorage.getItem("loginInfo")!);
  }
  private isFirstLoad = true;
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
    this.validateForm = this.fb.group({
      customerId: [''],
      applicantName: [''],
      phoneNumber: [""],
      phoneNumberPrefix: ["+971"],
      email: [''],
      agree: [false, [Validators.required]],
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
  //  this.getListAccount(1, this.pageSize, this.sortBy, this.sortOrder);
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

    if (this.userInfo?.user_Type === "Customer") {
      this.loading = true;
      this.isDemo = false;
      this.common.listAccount(this.filter).subscribe(
        (res: any) => {
          this.account = res.body.data.pageData;
          this.totalnumber = res.body.data.dataCount;
          this.pageSize = res.body.data.pageSize;
          this.page = res.body.data.page;
          this.totaData = res.body.data.dataCount;
          this.loading = false;
        },
        (error) => {
          this.loading = false;
          this.message.error(error.body.message);
        }
      );
    } else {
      this.isDemo = true;
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

  submitForm(): void {
    if(this.signaturePad.isEmpty()) {
      this.message.error(this.i18nSev.i18n("Please add Signature to submit"))
    } else {
      const data = this.signaturePad.toDataURL();
      let body = {
        signatureBase64: data
      }
      this.loader = true
      this.common.createSwapAccount(body).subscribe(res => {
        this.message.success(this.i18nSev.i18n('Your Swap free Account request has been requested successfully'));
        this.isVisible = false;
        this.loader = false;
        this.checked = false
        this.signPad = false
      },
      error => {
        this.loader = false;
        this.message.error(error?.body?.message);
      }
      );
    }

  }
  swapData:any = {}
  showModal(): void {
    this.isVisible = true;
    const tokenData = this.tokenService.get();
    this.swapData = tokenData
    const phoneNumberPrefix = tokenData?.user_Mobile ? tokenData?.user_Mobile?.split(" ")[0] : "";
    const phoneNumber = tokenData?.user_Mobile;
    this.validateForm.patchValue({
      applicantName: tokenData?.customer_FirstName + ' ' +  tokenData?.customer_LastName,
      customerId: tokenData?.customer_SID,
      email: tokenData?.user_Email,
      phoneNumber: phoneNumber,
    })
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.agreeTc = false;
    this.checked = false
    this.signPad = false
  }

  cancel() {
    this.isVisible = false;
    this.agreeTc = false
  }


  reject() {
    
  }


  signPad:boolean = false
  checked = false
  accountBtn:boolean = true
  clear() {
    this.signaturePad.clear();
  }

  showPad(e:any) {
    console.log(e)
    if(e) {
      this.signPad = true
      this.accountBtn = false
    } else {
      this.signPad = false
      this.accountBtn = true
    }
  }


  deposit() {
    this.router.navigateByUrl(`${this.langs}/funds/deposit`);
  }

}
