import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Injector,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { I18NService } from "@core";
import { DA_SERVICE_TOKEN, ITokenService } from "@delon/auth";
import { NzMessageService } from "ng-zorro-antd/message";
import { ClipboardService } from "ngx-clipboard";
import { ApiService } from "src/app/services/api.service";
import * as echarts from "echarts";
import { SettingsService } from "@delon/theme";
import { environment } from "@env/environment";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.less"],
})
export class DashboardComponent implements OnChanges, OnInit {
  greeting: any;
  registerForm!: FormGroup;
  isVisibleEmail: boolean = false;
  isVisibleSuit = false;
  webLink = environment.webUrl;
  array = [1, 2, 3, 4];
  accountLoader: boolean = true;
  effect = "scrollx";
  validateForm!: FormGroup;
  options: any;
  userType: any;
  users: any;
  symbol: any;
  margins: any;
  currency: any = ["USD", "EUR", "GBP"];
  leverage: any = ["1:100", "1:200", "1:400", "1:500"];
  MT4lot: number = 0;
  symbolOption: string = "";
  customer_id = this.tokenSrv.get()?.customer_id;
  userInfo: any;
  daily: string = "daily";
  calculator: any = {
    longSwap: 0.0,
    marginValue: 0.0,
    pipValue: 0.0,
    shortSwap: 0.0,
    profitValue: 0.0,
  };
  totals: any;
  isMargin: boolean = false;
  balanceLoader: boolean = true;
  colorPalette = ["#16678D", "#00b6f2"];
  isVisible = false;
  current = 0;
  user: any;
  langs = this.i18nSev.i18nUrl();
  statistics: any;
  morning: any;
  afternoon: any;
  evening: any;
  constructor(
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private message: NzMessageService,
    private injector: Injector,
    private fb: FormBuilder,
    private common: ApiService,
    private clipboardService: ClipboardService,
    private router: Router,
    private i18nSev: I18NService,
    private settings: SettingsService,
    private datepipe: DatePipe
  ) {
    var today = new Date();
    var curHr = today.getHours();
    if (curHr < 12) {
      this.greeting = "Good Morning";
      this.morning = true;
      this.afternoon = false;
      this.evening = false;
    } else if (curHr < 18) {
      this.greeting = "Good Afternoon";
      this.afternoon = true;
      this.morning = false;
      this.evening = false;
    } else {
      this.greeting = "Good Evening";
      this.evening = true;
      this.morning = false;
      this.afternoon = false;
    }
  }

  public page = 1;
  public pageSize = 100;
  notifications: any[] = [];
  public filter = {
    pageNumber: "",
    numberOfItemPerPage: "",
  };

  ngOnInit(): void {
    this.onAllAccountsDetail();
    this.tradingSummary();
    this.getNotificationList(1, this.pageSize);
    this.registerForm = this.fb.group({
      agree: [false, [Validators.required]],
      applicants: [false, [Validators.required]],
    });

    this.getBalanceChart();
    setTimeout(() => {
      this.user = this.tokenSrv.get()?.customer_FirstName;
      if (
        this.tokenService.get()?.afterLogin_Popup === 101 &&
        this.tokenService.get()?.user_Type !== "Demo"
      ) {
        this.isVisible = false;
      }

      // if(this.tokenService.get()?.customer_Status === 'Registered') {
      //   this.isVisibleEmail = true
      // }

      if (
        (this.tokenService.get()?.customer_Status === "Verified" &&
          this.tokenService.get()?.suitabilityTest_Result !== 112) ||
        (this.tokenService.get()?.customer_Status === "Active" &&
          this.tokenService.get()?.suitabilityTest_Result !== 112) ||
        (this.tokenService.get()?.customer_Status === "Funded" &&
          this.tokenService.get()?.suitabilityTest_Result !== 112)
      ) {
        // this.isVisibleSuit = true
      }

      // if( this.tokenService.get()?.customer_Status === "Verified" || this.tokenService.get()?.customer_Status === "Active" || this.tokenService.get()?.customer_Status === "Funded") {
      //   this.router.navigate([`${this.langs}/dashboard`])
      // } else {
      //   this.router.navigate([`${this.langs}/profile`])
      // }
    }, 500);

    this.getCustomerById();

    // this.onNews();
  }

  getNotificationList(pageNumber: any, itemsPerPage: any) {
    this.filter = {
      pageNumber: pageNumber,
      numberOfItemPerPage: itemsPerPage,
    };
    this.common.getAllNotifications(this.filter).subscribe(
      (res: any) => {
        this.notifications = res.data.pageData;
      },
      (err) => {
        this.message.error(err.body.message);
      }
    );
  }

  userName: any;
  verifiedBtn: boolean = false;
  customerStatus:any
  getCustomerById() {
    this.common.getCustomerProfile().subscribe((res: any) => {
      const data = res.data[0];
      this.userName = data.customer_FirstName;
      this.customerStatus = data.customer_Status;
      if (
        data.customer_Status === "Funded" ||
        data.customer_Status === "Verified" ||
        data.customer_Status === "Active"
      ) {
        this.verifiedBtn = false;
      } else {
        this.verifiedBtn = true;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {}

  private get tokenSrv(): ITokenService {
    return this.injector.get(DA_SERVICE_TOKEN);
  }

  ngModelChange(e: any) {
   // this.onStatisticDetail(e, this.totals.code);
    this.getBalanceChart();
  }

  onAllAccountsDetail() {
    this.common.getAllAccountsDetail({}).subscribe((res: any) => {
      this.accountLoader = false;
      this.users = res.data;
      this.userType = res.data[0]?.code;
      //   this.totals = res.data[0];
    //  this.onStatisticDetail("daily", res.data[0]?.code);
    });
  }

  tradingSummary() {
    this.common.getTradingSummary().subscribe((res: any) => {
      this.accountLoader = false;
      this.totals = res.data;
    });
  }

  userChange(e: any) {
    this.userType = e;
    const us = this.users.filter((item: any) => item.code === e);
    this.totals = us[0];
  }

  onStatisticDetail(type: string, user: string) {
    this.common.getStatisticDetail(type, user).subscribe((res: any) => {
      this.statistics = res?.data;
    });
  }
  setLang: any = {
    "en-US": "en",
    "zh-TW": "zh",
    "zh-CN": "cn",
    "vi-VN": "vt",
  };

  news: any = [];
  onNews() {
    this.common
      .getNews({
        pageNumber: 0,
        numberOfItemPerPage: 400,
        news_Type: "",
        title: "",
        description: "",
        author: "",
        lang: this.setLang[this.settings.layout.lang],
      })
      .subscribe((res: any) => {
        console.log(res);
        this.news = res.data.pageData || [];
      });
  }

  colors = ["#E24437", "#655BF7", "#37ADE2", "#37ADE2", "#37ADE2", "#655BF7"];
  //get balance chart
  getBalanceChart() {
    const xAxisValue = this.statistics?.map((item: any) => item.timeStamp);
    const date = new Date(xAxisValue);
    const dateData =
      date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
    //this.datepipe.transform(xAxisValue, 'dd/MM/yyyy')
    const datas = this.statistics?.map((item: any, index: any) => ({
      value: item.profit,
      itemStyle: {
        color: this.colors[index],
      },
    }));

    this.options = {
      title: {
        text: "",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          label: {
            backgroundColor: "#e8c71e",
          },
        },
      },
      legend: {
        borderRadius: 5,
        // data: ["Email", "Union Ads", "Video Ads", "Direct", "Search Engine"],
      },
      xAxis: [
        {
          type: "category",
          boundaryGap: false,
          data: [dateData],
          axisLine: {
            show: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
          axisLine: {
            show: true,
          },
        },
      ],
      series: [
        {
          name: "",
          type: "line",
          stack: "Total",
          smooth: true,
          label: {
            show: false,
            position: "top",
          },
          itemStyle: { normal: { color: "#e8c71e" } },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 0.8, [
                { offset: 0, color: "#0AE5D5" },
                { offset: 0.8, color: "#0AE5D500" },
              ]),
            },
          }, //填充区域样式
          emphasis: {
            focus: "series",
          },
          data: datas,
        },
      ],
    };
  }

  goVerify() {
    this.current = 1;
  }

  goProfile() {
    this.common.CloseModal().subscribe();
    this.router.navigate([`${this.langs}/profile`]);
  }

  goSuit(): void {
    for (const i in this.registerForm.controls) {
      if (this.registerForm.controls.hasOwnProperty(i)) {
        this.registerForm.controls[i].markAsDirty();
        this.registerForm.controls[i].updateValueAndValidity();
      }
    }
    if (!this.registerForm.value.applicants) {
      this.message.error("Please agree Terms & Conditions");
      return;
    } else {
      if (!this.registerForm.value.agree) {
        this.message.error("Please agree Privacy Policy");
        return;
      }
      this.router.navigate([`${this.langs}/profile-suit`]);
    }
  }

  withdraw() {
    this.isVisibleSuit = false;
  }

  handleEmailCancel(): void {
    this.isVisibleEmail = false;
  }

  goDeposit() {
    this.router.navigate([`${this.langs}/funds/deposit`]);
  }

  goKyc() {
    this.router.navigate([`${this.langs}/profile`]);
  }

  Withdraw() {
    this.router.navigate([`${this.langs}/funds/withdraw`]);
  }

  openAccount() {
    this.router.navigate([`${this.langs}/account/trading/0`]);
  }

  downloads() {
    this.router.navigate([`${this.langs}/platform`]);
  }
}
