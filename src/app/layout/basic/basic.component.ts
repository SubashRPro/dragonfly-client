import {
  Component,
  Inject,
  Injector,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { NavigationEnd, Router } from "@angular/router";
import { I18NService } from "@core";
import { DA_SERVICE_TOKEN, ITokenService } from "@delon/auth";
import { SettingsService, User } from "@delon/theme";
import { LayoutDefaultOptions } from "@delon/theme/layout-default";
import { environment } from "@env/environment";
import { NzMessageService } from "ng-zorro-antd/message";
import { NzModalService, NzModalRef } from "ng-zorro-antd/modal";
import { ClipboardService } from "ngx-clipboard";
import { Observable } from "rxjs";
import { filter } from "rxjs/operators";
import { ApiService } from "src/app/services/api.service";

// import { CalendarModalComponent } from "./widgets/calendar-modal/calendar-modal.component";
import { ContactModalComponent } from "./widgets/contact-modal/contact-modal.component";
import { SettingModalComponent } from "./widgets/setting-modal/setting-modal.component";
declare var $: any;
@Component({
  selector: "layout-basic",
  templateUrl: "./basic.component.html",
  styleUrls: ["basic.component.less"],
})
export class LayoutBasicComponent implements OnInit {
  status: boolean = false;
  width: string = "100px";
  @ViewChild("settingModalComponent")
  settingModalComponent!: SettingModalComponent;
  // @ViewChild("calendarModalComponent")
  // calendarModalComponent!: CalendarModalComponent;
  @ViewChild("ContactModalComponent")
  ContactModalComponent!: ContactModalComponent;
  isCollapsed = false;
  options: LayoutDefaultOptions = {
    logoExpanded: `./assets/logo.svg`,
    logoCollapsed: `./assets/logo.svg`,
  };
  chatLang: any = {
    "en-US": "en",
    "zh-TW": "zh",
    "zh-CN": "cn",
    "vi-VN": "vt",
  };

  langs = this.i18nSev.i18nUrl();
  panels = [
    {
      active: true,
      name: "This is panel header 1",
      childPanel: [
        {
          active: false,
          name: "This is panel header 1-1",
        },
      ],
    },
    {
      active: false,
      name: "This is panel header 2",
    },
    {
      active: false,
      name: "This is panel header 3",
    },
  ];
  loader: boolean = false;
  menus: any = [];
  customDrawerTitle!: TemplateRef<any>;
  showMenuSettings!: boolean;
  menuStaticdisable!: boolean;
  showMenuLogout!: boolean;
  unReadNotificationCount: any = 0;
  lang: string = localStorage.getItem("lang") || "en";
  iframeUrl: any = "";
  showEc: boolean = true;
  isDrak: boolean = false;
  searchToggleStatus = false;
  showSettingDrawer = !environment.production;
  routerUrl: any = [];
  userName: string = "";
  theme: any = window.localStorage.getItem("theme");
  outLoading: boolean = false;
  customer_id = this.tokenSrv.get()?.customer_id;
  routerOption: any = {
    funds: "Funds",
    deposit: "Deposit",
    dashboard: "Home",
    withdraw: "Withdraw",
    transfer: "Trasnfer",
    bankdetail: "Bank Detail",
    reports: "Reports",
    "open-positions": "Open Positions",
    "closed-positions": "Closed Positions",
    "deposit-history": "Deposit History",
    "withdraw-history": "Withdraw History",
    "transfer-history": "Transfer History",
    "support-history": "Support History",
    "account-list": "Account List",
    profile: "Profile",
    support: "Support",
    "add-ticket": "New Ticket",
    "account-open": "Account Open",
    verification: "Verification",
    "verification-information": "Information",
    "view-ticket": "View Ticket",
    rejected: "rejected",
    success: "success",
    pending: "pending",
    wallet: "Transaction History",
    trading: "Trading",
    error: "Cancel",
    result: "Success",
    mf: "MyFatoorah",
    "analyst-views": "Analyst Views",
    "economic-calendar": "Economic Calendar",
    "market-buzz": "Market Buzz",
    education: "Education",
    "view-account": "View Account",
  };
  get user(): User {
    return this.settings.user;
  }
  visible = false;
  visibleMenu = false;
  logo = "";
  bg = "";
  name: any;
  email: any;
  SID: any;
  next: boolean = true;
  basic: boolean = true;
  public notification: any = [];
  get tokenSrv(): ITokenService {
    return this.injector.get(DA_SERVICE_TOKEN);
  }
  ecToggle() {
    this.showEc = !this.showEc;
  }

  closeMenuList(): void {
    this.visibleMenu = false;
  }

  openMenu(): void {
    this.visibleMenu = true;
  }

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }

  onCollapsed() {
    this.isCollapsed = !this.isCollapsed;
  }
  openMap: { [name: string]: boolean } = {
    sub1: false,
    sub2: false,
  };

  openHandler(value: any): void {
    this.menus.forEach((item: any, index: any) => {
      if (item.menu_ID !== value.menu_ID) {
        this.menus[index].open = false;
      }
      if (value.menu_URL == "/notifications") {
        setTimeout(() => {
          this.unReadNotificationCount = 0;
        }, 2000);
      }
    });
  }

  onSetting() {
    this.settingModalComponent.showModal();
    this.openHandler("sub0");
  }
  logout(modelRef: NzModalRef) {
    modelRef.destroy();
    localStorage.removeItem("_token");
    localStorage.removeItem("loginInfo");
    localStorage.removeItem("sumSubToken");
    this.router.navigateByUrl(`${this.langs}/user/login`);
  }
  createTplModal(
    tplTitle: TemplateRef<{}>,
    tplContent: TemplateRef<{}>,
    tplFooter: TemplateRef<{}>
  ): void {
    this.modal.create({
      nzTitle: tplTitle,
      nzContent: tplContent,
      nzFooter: tplFooter,
      nzClosable: false,
      nzWidth: "400px",
      nzOnOk: () => {
        localStorage.removeItem("_token");
        window.location.reload();
      },
    });
  }
  createDemoTplModal(
    tplTitle: TemplateRef<{}>,
    tplContent: TemplateRef<{}>,
    tplFooter: TemplateRef<{}>
  ): void {
    this.modal.create({
      nzTitle: tplTitle,
      nzContent: tplContent,
      nzFooter: tplFooter,
      nzWidth: "450px",
    });
  }
  toDemo(modelRef: NzModalRef) {
    this.api.switchAccounts(this.customerId).subscribe(
      (res: any) => {
        this.tokenService.clear();
        this.tokenService.set({
          token: res.data.token,
          refresToken: res.data.refresh_Token,
          login_id: res.data.login_ID,
          customer_id: res.data.customer_ID,
        });
        localStorage.setItem("tokenGet", res.data.token);
        localStorage.setItem("refresrtokenGet", res.data.refresh_Token);

        this.api.getUserInfo(res?.data.customer_ID).subscribe((info: any) => {
          this.tokenService.set({
            ...this.tokenSrv.get(),
            token: this.tokenSrv.get()?.token,
            email: res.data.email,
            customer_id: res?.data.customer_ID,
            ...info.data,
          });
          const params = {
            token: res.data.token,
            login_id: res.data.login_ID,
            customer_id: res.data.customer_ID,
            customer_ID: res?.data.customer_ID,
            ...res.data,
          };
          localStorage.setItem(
            "loginInfo",
            JSON.stringify({ ...params, ...info.data })
          );

          modelRef.destroy();
          this.router.navigateByUrl(`${this.langs}/profile`);
          setTimeout(function () {
            window.location.reload();
          }, 500);
        });
      },
      (error) => {
        this.message.error(error.body.message);
      }
    );
  }
  onTheme(model: "default" | "dark") {
    this.changeTheme(model);
  }

  changeTheme(theme: "default" | "dark"): void {
    if (theme === "dark") {
      this.isDrak = true;
      var body = document.getElementsByTagName("body")[0];
      var att = document.createAttribute("data-theme");
      att.value = "dark";
      body.setAttributeNode(att);

      var url = "assets/style.dark.css";
      var link = document.createElement("link");
      link.setAttribute("rel", "stylesheet");
      link.setAttribute("type", "text/css");
      link.setAttribute("href", url);
      link.setAttribute("id", "dark-theme");
      document.getElementsByTagName("head")[0].appendChild(link);
      window.localStorage.setItem("theme", theme);
      this.theme = theme;
    } else {
      this.isDrak = false;
      var body = document.getElementsByTagName("body")[0];
      var att = document.createAttribute("data-theme");
      att.value = "default";
      body.setAttributeNode(att);
      const dom = document.getElementById("dark-theme");
      window.localStorage.setItem("theme", theme);
      this.theme = theme;
      if (dom) {
        dom.remove();
      }
    }
  }

  userInfo: any;
  constructor(
    private injector: Injector,
    private settings: SettingsService,
    private modal: NzModalService,
    private router: Router,
    private clipboardService: ClipboardService,
    private message: NzMessageService,
    private sanitizer: DomSanitizer,
    private api: ApiService,
    private i18nSev: I18NService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService
  ) {
    this.userInfo = JSON.parse(localStorage.getItem("loginInfo")!);
    if (this.tokenService.get()?.user_Type === "Customer") {
      // this.getUnReadNotifications();
    }

    this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `${environment.api.ecUrl}/#/SessionForm?lang=${this.chatLang[this.lang]}`
    );

    (
      this.router.events.pipe(
        filter((event) => event instanceof NavigationEnd)
      ) as Observable<NavigationEnd>
    ).subscribe((router) => {
      const arr = router.url.split("/").filter((item) => item !== "");
      const arrs = arr.map((item) => {
        if (item.split("?").length) {
          return item.split("?")[0];
        } else {
          return item;
        }
      });
      if (arr) this.routerUrl = arrs.length ? arrs.splice(1) : ["dashboard"];

      const info: any = JSON.parse(localStorage.getItem("loginInfo")!) || {};
      this.api.getUserInfo(info?.customer_id).subscribe((res: any) => {
        this.tokenService.set({
          ...this.tokenSrv.get(),
          token: this.tokenSrv.get()?.token,
          email: res.data.email,
          customer_id: info?.customer_id,
          ...res.data,
        });
      });
    });
    this.onTheme(this.theme ?? "default");

    this.userName = this.userInfo.email;
    this.getCustomerById();
  }

  onCype() {
    this.clipboardService.copyFromContent(
      `${window.location.host}/#/user/register?referrence_Code=${this.customerData?.referredBy_Code}`
    );
    this.message.success("copied");
  }

  userDataStatus: any;
  isDemoAccountExist: true;
  getCustomerById() {
    this.customerId = this.tokenSrv.get()?.customer_id;
    this.api.getCustomerProfile().subscribe((res: any) => {
      this.customerData = res.data[0];
      this.userDataStatus = res.data[0]?.customer_Status;
      this.name = res.data[0]?.customer_FirstName;
      this.email = res.data[0]?.customer_Email;
      this.SID = res.data[0]?.customer_SID;
      this.isDemoAccountExist = res.data[0]?.is_DemoAccountExist;
      this.getMenus();
    });
  }
  isloadingMenu = true;
  getMenus() {
    this.isloadingMenu = true;
    this.api.getMenus(this.customer_id).subscribe(
      (res: any) => {
        this.isloadingMenu = false;
        // show basic and advance static menu tab
        if (
          this.userInfo?.customer_RoleTypeID ===
          "b7a1b60d-ab86-49da-854d-7db3e57882be"
        ) {
          this.showMenuSettings = false;
          this.showMenuLogout = true;
          this.basicHide = false;
        } else {
          this.showMenuSettings = true;
          this.showMenuLogout = true;
          this.basicHide = true;
        }
        this.menus =
          res.data.map((item: any) => {
            if (
              this.userDataStatus === "Registered" ||
              this.userDataStatus === "ProfileCompleted" ||
              this.userDataStatus === "FinInfoCompleted" ||
              this.userDataStatus === "SuitabilityTestPass" ||
              this.userDataStatus === "SuitabilityTestFailed" ||
              this.userDataStatus === "ReTestRequired" ||
              this.userDataStatus === "DocumentDetailCompleted" ||
              this.userDataStatus === "Pending" ||
              this.userDataStatus === "Registered_EmailVerificationPending"
            ) {
              if (
                // item.menu_Name === "My Accounts" ||
                item.menu_Name === "Finances" ||
                item.menu_Name === "Reports" ||
                item.menu_Name === "Market Analysis" ||
                item.menu_Name === "Campaigns" ||
                item.menu_Name === "Demo Accounts" ||
                item.menu_Name === "Platforms"
              ) {
                return {
                  ...item,
                  menu_disable: false,
                };
              } else if (item.menu_Name === "My Accounts") {
                if (item.childMenus.length > 0) {
                  const childMenus = item.childMenus.map((d: any) => {
                    if (d.menu_Name === "Live Accounts") {
                      return {
                        ...d,
                        menu_disable: false,
                      };
                    } else {
                      return {
                        ...d,
                        menuDisable: true,
                      };
                    }
                  });
                  return {
                    ...item,
                    childMenus,
                  };
                }
              }
            }
            if (
              this.userInfo?.user_Type === "Demo" &&
              item.menu_URL === "/profile"
            ) {
              return {
                ...item,
                menu_URL: "/profile-demo",
                open: item.childMenus.length > 0 ? false : undefined,
              };
            } else {
              return {
                ...item,
                open: item.childMenus.length > 0 ? false : undefined,
              };
            }
          }) || [];
        this.onRouteChange();
      },
      (err) => {
        this.isloadingMenu = false;
        this.message.error(err?.body?.message);
      }
    );
  }

  onRouteChange() {
    const currentRoute = this.router.url;

    // Iterate through menus to find the parent menu
    this.menus.forEach((menu) => {
      if (menu.childMenus && menu.childMenus.length > 0) {
        const isSubmenuRoute = menu.childMenus.some((childMenu) =>
          currentRoute.includes(childMenu.menu_URL)
        );

        // Open the parent menu if the current route matches a submenu route
        if (isSubmenuRoute) {
          menu.open = true;
        }
      }
    });
  }
  getUnReadNotifications() {
    this.api.getUnReadNotices(this.customer_id).subscribe(
      (res: any) => {
        this.unReadNotificationCount = res.data;
      },
      (err) => {
        this.message.error(err?.body?.message);
      }
    );
  }
  customerData: any = {};
  menuDisable: boolean | undefined;
  customerId: string = "";

  basicHide: boolean | undefined;
  disabledDeposit!: boolean;
  serverTime: any;
  ngOnInit(): void {
    // Subscribe to route change events
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.menus.length > 0) {
          this.onRouteChange();
        }
      });
    this.tradingSummary();
    // this.serverTime = this.getCurrentTimeFormatted();
    // menu and header hide basic and advance tab
    // this.getReport();
    // this.notify()
    setTimeout(() => {
      const userStatus = this.tokenService.get()?.customer_Status;
      const IsDemoUser = this.tokenService.get()?.user_Type;

      if (IsDemoUser === "Demo") {
        this.next = true;
      }
      if (
        userStatus === "Funded" ||
        userStatus === "Verified" ||
        userStatus === "Active"
      ) {
        this.next = false;
        this.basic = false;
        this.menuStaticdisable = true;
      }
    }, 800);
  }

  getCurrentTimeFormatted(): string {
    const now = new Date();

    // Get the hours and minutes
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");

    // Get the timezone offset in hours and minutes
    const timezoneOffset = now.getTimezoneOffset(); // offset in minutes
    const sign = timezoneOffset > 0 ? "-" : "+";
    const offsetHours = Math.abs(Math.floor(timezoneOffset / 60));
    const offsetMinutes = Math.abs(timezoneOffset % 60);

    // Format the time
    const formattedOffset = `${sign}${offsetHours
      .toString()
      .padStart(2, "0")}:${offsetMinutes.toString().padStart(2, "0")}`;

    // Combine everything into the final string
    return `${hours}:${minutes} GMT${formattedOffset}`;
  }
  totals: any;
  accountLoader = false;
  tradingSummary() {
    this.accountLoader = true;
    this.api.getTradingSummary().subscribe((res: any) => {
      this.accountLoader = false;
      this.totals = res.data;
    });
  }

  public notify() {
    this.api.getNotification().subscribe((res: any) => {
      this.notification = res.data;
    });
  }
  public getReport() {
    this.api.getImgBg().subscribe((res: any) => {
      let content = res.data;
      this.logo = environment.api.crmUrl + content.loginBackground_LogoPath;
      this.bg = content.loginBackground_ImagePath;
    });
  }

  // read email notify
  readNotify(id: any) {
    this.api.updateNotify(id, null).subscribe(
      (res: any) => {
        this.message.success(res.message);
        this.notify();
      },
      (error) => {
        this.message.error(error?.body?.message);
      }
    );
  }

  goDeposit() {
    this.router.navigate([`${this.langs}/funds/deposit`]);
  }

  openChat() {
    $("#convrs-chat-channel-control").trigger("click");
    $("#convrs-chat-channel-image-mainicon").trigger("click");
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

  swithcBasic(modelRef: NzModalRef) {
    this.loader = true;
    this.api.switchViewTab(this.customerId).subscribe(
      (res: any) => {
        this.tokenService.clear();
        this.tokenService.set({
          token: res.data.token,
          refresToken: res.data.refresh_Token,
          login_id: res.data.login_ID,
          customer_id: res.data.customer_ID,
        });
        localStorage.setItem("tokenGet", res.data.token);
        localStorage.setItem("refresrtokenGet", res.data.refresh_Token);

        this.api.getUserInfo(res?.data.customer_ID).subscribe((info: any) => {
          this.tokenService.set({
            ...this.tokenSrv.get(),
            token: this.tokenSrv.get()?.token,
            email: res.data.email,
            customer_id: res?.data.customer_ID,
            ...info.data,
          });
          const params = {
            token: res.data.token,
            login_id: res.data.login_ID,
            customer_id: res.data.customer_ID,
            customer_ID: res?.data.customer_ID,
            ...res.data,
          };
          localStorage.setItem(
            "loginInfo",
            JSON.stringify({ ...params, ...info.data })
          );
          this.loader = false;
          modelRef.destroy();
          setTimeout(function () {
            window.location.reload();
          }, 500);
        });
      },
      (error) => {
        this.loader = false;
        this.message.error(error.body.message);
      }
    );
  }

  ibLink(modelRef: NzModalRef) {
    modelRef.destroy();
    window.open(`${environment.api.ibUrl}/#/en/user/register`, "_blank");
  }

  // ib  title
  createIbModal(
    tplContentIb: TemplateRef<{}>,
    tplFooterIb: TemplateRef<{}>
  ): void {
    this.modal.create({
      nzContent: tplContentIb,
      nzFooter: tplFooterIb,
      nzClosable: false,
      nzWidth: "400px",
    });
  }

  loaderDemo: boolean = false;
  public loginID: any = this.tokenSrv.get()?.customer_id;
  openDemo() {
    this.router.navigateByUrl(`${this.langs}/open-demo-accounts`);
    // this.loaderDemo = true;
    // let body = {
    //   customer_ID: this.loginID,
    //   Trading_Platform: "MT5",
    //   account_Type: "demo",
    //   currency: "USD",
    //   account_Leverage: "100",
    //   init_Balance: "5000",
    // };
    // this.api.addDemoAccount(body).subscribe(
    //   (res: any) => {
    //     this.message.success(res.body.message);
    //     this.loaderDemo = false;
    //     this.router.navigate([`${this.langs}/demo-accounts`]);
    //     this.getCustomerById();
    //   },
    //   (error) => {
    //     this.loaderDemo = false;
    //     this.message.error(error.body.message);
    //   }
    // );
  }


  copyTrading() {
    window.open("https://socialtrading-global.dragonfly.com/portal/login?redirectUrl=%2F", "_blank");
  }

}
