import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ACLGuard } from "@delon/acl";
import { SimpleGuard } from "@delon/auth";
import { environment } from "@env/environment";

// layout
import { AuthGuard } from "../core/auth-guard";
import { LayoutBasicComponent } from "../layout/basic/basic.component";
import { LayoutBlankComponent } from "../layout/blank/blank.component";
import { LayoutPassportComponent } from "../layout/passport/passport.component";
// dashboard pages
import { AccountListComponent } from "./accounts/account-list/account-list.component";
import { DemoAccountListComponent } from "./accounts/demo-account/demo-account.component";
import { ViewAccountComponent } from "./accounts/view-account/view-account.component";
import { AccountOpenComponent } from "./accounts/account-open/account-open.component";
import { AlternativeComponent } from "./alternative/alternative.component";
import { AlternativeMerchantComponent } from "./alternative-merchant/alternative-merchant.component";
import { DepositModalComponent } from "./components/deposit-modal/deposit-modal.component";
import { TransferModalComponent } from "./components/transfer-modal/transfer-modal.component";
import { BankDetailsListComponent } from "./funds/bank-details/bank-details-list.component";
import { WithdrawModalComponent } from "./components/withdraw-modal/withdraw-modal.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { FundsSuccessComponent } from "./funds/funds-success/funds-success.component";
import { FundsRejectedComponent } from './funds/funds-rejected/funds-rejected.component';
import { FundsComponent } from "./funds/funds.component";
import { TripeAComponent } from "./funds/triplea/triplea.component";
import { CoinPayComponent } from "./funds/coinpay/coinpay.component";
import { FatooraPayComponent } from "./funds/fatoora-pay/fatoora-pay.component";
import { NetellerPayComponent } from "./funds/neteller-pay/neteller-pay.component";
// single pages
import { CallbackComponent } from "./passport/callback.component";
import { EmailValidationComponent } from "./passport/email-validation/email-validation.component";
import { ForgotPasswordComponent } from "./passport/forgot-password/forgot-password.component";
import { SetPasswordComponent } from "./passport/set-password/set-password.component";
import { VerifyEmailComponent } from "./passport/verify-email/verify-email.component";
import { UserLockComponent } from "./passport/lock/lock.component";
// passport pages
import { UserLoginComponent } from "./passport/login/login.component";
import { UniPathComponent } from "./passport/uniauth/uniauth.component";
import { DepositPaymentComponent } from "./passport/deposit-payment/deposit-payment.component";
import { WithdrawPaymentComponent } from "./passport/withdraw-payment/withdraw-payment.component";
import { UserRegisterResultComponent } from "./passport/register-result/register-result.component";
import { UserRegisterComponent } from "./passport/register/register.component";
import { RegisterDataComponent } from "./passport/register-data/register-data.component";
import { RegisterIinstitutionalComponent } from "./passport/register-institutional/register-institutional.component";
import { RegisterList } from "./passport/register-list/register-list.component";
import { ResetComponent } from "./passport/reset/reset.component";
import { ProfileDemoComponent } from "./profile/profile-demo/profile-demo.component";
import { ProfileComponent } from "./profile/profile.component";
import { profileInstituteComponent } from "./profile/profile-institute/profile-institute.component";
import { VerificationInformationComponent } from "./profile/verification-information/verification-information.component";
import { VerificationComponent } from "./profile/verification/verification.component";
import { ClosedPositionsComponent } from "./reports/closed-positions/closed-positions.component";
import { DepositHistoryComponent } from "./reports/deposit-history/deposit-history.component";
import { OpenPositionsComponent } from "./reports/open-positions/open-positions.component";
import { TransferHistoryComponent } from "./reports/transfer-history/transfer-history.component";
import { WithdrawHistoryComponent } from "./reports/withdraw-history/withdraw-history.component";
import { SettingAccountComponent } from "./setting-account/setting-account.component";
import { AddTicketComponent } from "./support/add-ticket/add-ticket.component";
import { SupportHistoryComponent } from "./support/support-history/support-history.component";
import { SupportComponent } from "./support/support.component";
import { ViewTicketComponent } from "./support/view-ticket/view-ticket.component";
import { AnalystViewsComponent } from "./trading-central/analyst-views/analyst-views.component";
import { EconomicCalendarComponent } from "./trading-central/economic-calendar/economic-calendar.component";
import { EducationComponent } from "./trading-central/education/education.component";
import { MarketBuzzComponent } from "./trading-central/market-buzz/market-buzz.component";
import { CoinSuccessComponent } from "./funds/coin-success/coin-success.component";
import { UpiSuccessComponent } from "./funds/upi-success/upi-success.component";
import { FatoorahError } from "../routes/fatoorah-error/fatoorah-error.component";
import { FatoorahSuccess } from "../routes/fatoorah-success/fatoorah-success.component";
import { ProfileJointComponent } from "./profile/profile-joint.component";
import { HelpPay } from "../routes/help-pay/help-pay.component";
import { AccountTradComponent } from "./accounts/account-trad/account-trad.component";
import { AccountDemoComponent } from "./accounts/account-demo/account-demo.component";
import { UserRegisterDemoComponent } from "./passport/register-demo/register-demo.component";
import { PlatformComponent } from "./platform/platform.component";
import { NotificationsComponent } from "./notifications/notification-list/notifications.component";
import { SettingsComponent } from "./settings/settings.component";
import { VerificationSuitComponent } from "./profile/verification-suit/verification-suit.component";
import { ProfileSuitComponent } from "./profile/profile-suit/profile-suit.component";
import { FundsGpCancelComponent } from "./funds/funds-gp-cancel/funds-gp-cancel.component";
import { FundsGpSuccessComponent } from "./funds/funds-gp-success/funds-gp-success.component";
import { FundsMbSuccessComponent } from "./passport/funds-mb-success/funds-mb-success.component";
import { FundsMbCancelComponent } from "./passport/funds-mb-cancel/funds-mb-cancel.component";
import { TradingCentralComponent } from "./platform/trading-central/trading-central.component";
import { CampaignsComponent } from "./campaigns/campaigns.component";
import { DepositMethodComponent } from './components/deposit-method/deposit-method.component';
import { WithdrawMethodComponent } from './components/withdraw-method/withdraw-method.component';
import { SuccessComponent } from "./support/success/success.component";
const routes: Routes = [
  { path: "", redirectTo: "en/dashboard", pathMatch: "full" },
  {
    path: ":lang",
    component: LayoutBasicComponent,
    canActivate: [SimpleGuard, AuthGuard],
    children: [
      // { path: 'en', redirectTo: 'dashboard', pathMatch: 'full' },
      // { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: "dashboard",
        component: DashboardComponent,
        data: { title: "Dashboard" },
      },
      {
        path: "support",
        component: SupportComponent,
        data: { title: "support" },
      },
      {
        path: "support/add-ticket",
        component: AddTicketComponent,
        data: { title: "support" },
      },
      {
        path: "support/success",
        component: SuccessComponent,
        data: { title: "support" },
      },
      {
        path: "support/view-ticket",
        component: ViewTicketComponent,
        data: { title: "support" },
      },
      {
        path: "support/support-history",
        component: SupportHistoryComponent,
        data: { title: "Support" },
      },
      {
        path: "account-list",
        component: AccountListComponent,
        data: { title: "Accounts" },
      },
      {
        path: "demo-accounts",
        component: DemoAccountListComponent,
        data: { title: "Demo Accounts" },
      },
      {
        path: "account-list/account-open",
        component: AccountOpenComponent,
        data: { title: "Accounts" },
      },
      {
        path: "funds/wallet",
        component: FundsComponent,
        data: { title: "Transaction" },
      },
      {
        path: "funds/deposit",
        component: DepositModalComponent,
        data: { title: "Deposit" },
      },
      {
        path: "funds/withdraw",
        component: WithdrawModalComponent,
        data: { title: "Withdraw" },
      },
      {
        path: "funds/transfer",
        component: TransferModalComponent,
        data: { title: "Transfer" },
      },
      {
        path: "funds/bankdetail",
        component: BankDetailsListComponent,
        data: { title: "Bank Details" },
      },
      {
        path: "funds/alternative",
        component: AlternativeComponent,
        data: { title: "alternative" },
      },

      {
        path: "funds/mf/error/:id",
        component: FatoorahError,
        data: { title: "Fatoorah Cancel" },
      },
      {
        path: "funds/mf/result/:id",
        component: FatoorahSuccess,
        data: { title: "Fatoorah Success" },
      },
      {
        path: "funds/exlinkpay/result",
        component: FatoorahSuccess,
        data: { title: "Ex Link Success" },
      },
      {
        path: "funds/ccoop/result",
        component: FatoorahSuccess,
        data: { title: "Ccoop Success" },
      },

      {
        path: "funds/helpay/result",
        component: HelpPay,
        data: { title: "Help Pay Result" },
      },
       {
        path: "funds/pa/result",
        component: HelpPay,
        data: { title: "Payment Asia Result" },
      },
      {
        path: "funds/paymenthub/result",
        component: HelpPay,
        data: { title: "Paymenthub Hub Result" },
      },
      {
        path: "funds/hbc/result",
        component: HelpPay,
        data: { title: "HBC Result" },
      },
       {
        path: "funds/orbital/result",
        component: HelpPay,
        data: { title: "Orbital Result" },
      },
       {
        path: "funds/payment/result",
        component: HelpPay,
        data: { title: "OmPay Result" },
      },
      {
        path: "funds/mtxDoc/success",
        component: HelpPay,
        data: { title: "Mtx Doc Result" },
      },
       {
        path: "funds/mtxDoc/result",
        component: HelpPay,
        data: { title: "Mtx Doc Result" },
      },
        {
        path: "funds/chippay/result",
        component: HelpPay,
        data: { title: "Chip Pay Result" },
      },
      {
        path: "funds/mb/blizzardpay/result",
        component: HelpPay,
        data: { title: "Help Pay Result" },
      },
      {
        path: "funds/triplea",
        component: TripeAComponent,
        data: { title: "Tripe A" },
      },
      {
        path: "funds/coinpay",
        component: CoinPayComponent,
        data: { title: "Coin Pay" },
      },
      {
        path: "funds/fatoorapay",
        component: FatooraPayComponent,
        data: { title: "Fatoora Pay" },
      },
      {
        path: "funds/netellerPay",
        component: NetellerPayComponent,
        data: { title: "Neteller Pay" },
      },

      {
        path: "funds/success/:id",
        component: FundsSuccessComponent,
        data: { title: "success" },
      },
      {
        path: "funds/coin-success/:id",
        component: CoinSuccessComponent,
        data: { title: "Success" },
      },
      {
        path: "funds/upi/result",
        component: UpiSuccessComponent,
        data: { title: "Success" },
      },
      {
        path: "funds/rejected/:id",
        component: FundsRejectedComponent,
        data: { title: "rejected" },
      },
      {
        path: "funds/pending/:id",
        component: FundsSuccessComponent,
        data: { title: "pending" },
      },
      {
        path: "funds/requested/:id",
        component: FundsSuccessComponent,
        data: { title: "requested" },
      },
      {
        path: "funds/paymentInfo/:id",
        component: FundsSuccessComponent,
        data: { title: "paymentInfo" },
      },
      {
        path: "funds/approved/:id",
        component: FundsSuccessComponent,
        data: { title: "approved" },
      },
      {
        path: "funds/initialized/:id",
        component: FundsSuccessComponent,
        data: { title: "initialized" },
      },
      {
        path: "funds/authorized/:id",
        component: FundsSuccessComponent,
        data: { title: "authorized" },
      },
      {
        path: "funds/error/:id",
        component: FundsSuccessComponent,
        data: { title: "error" },
      },
      {
        path: "funds/cancelled/:id",
        component: FundsSuccessComponent,
        data: { title: "cancelled" },
      },
      {
        path: "funds/partial_refund/:id",
        component: FundsSuccessComponent,
        data: { title: "partial_refund" },
      },
      {
        path: "funds/chargeback/:id",
        component: FundsSuccessComponent,
        data: { title: "chargeback" },
      },
      {
        path: "funds/duplicated/:id",
        component: FundsSuccessComponent,
        data: { title: "duplicated" },
      },
      {
        path: "reports/open-positions",
        component: OpenPositionsComponent,
        data: { title: "Open Positions" },
      },
      {
        path: "reports/closed-positions",
        component: ClosedPositionsComponent,
        data: { title: "Closed Positions" },
      },
      {
        path: "reports/withdraw-history",
        component: WithdrawHistoryComponent,
        data: { title: "Withdraw History" },
      },
      {
        path: "reports/deposit-history",
        component: DepositHistoryComponent,
        data: { title: "Deposit History" },
      },
      {
        path: "reports/transfer-history",
        component: TransferHistoryComponent,
        data: { title: "Transfer History" },
      },
      {
        path: "profile",
        component: ProfileComponent,
        data: { title: "Profile" },
      },
      {
        path: "profile-corporate",
        component: profileInstituteComponent,
        data: { title: "Profile Corporate" },
      },
      {
        path: "profile-suit",
        component: ProfileSuitComponent,
        data: { title: "Profile Suit" },
      },
      {
        path: "profile/verification-suit",
        component: VerificationSuitComponent,
        data: { title: "verification suit" },
      },

      {
        path: "profile-joint",
        component: ProfileJointComponent,
        data: { title: "Profile Joint" },
      },
      {
        path: "profile-demo",
        component: ProfileDemoComponent,
        data: { title: "Profile-demo" },
      },
      {
        path: "profile/verification",
        component: VerificationComponent,
        data: { title: "verification" },
      },
      {
        path: "profile/verification-information",
        component: VerificationInformationComponent,
        data: { title: "Information" },
      },
      {
        path: "exception",
        loadChildren: () =>
          import("./exception/exception.module").then((m) => m.ExceptionModule),
      },
      {
        path: "account/trading/:id",
        component: AccountTradComponent,
        data: { title: "Account Trading" },
      },
      {
        path: "open-demo-accounts",
        component: AccountDemoComponent,
        data: { title: "Open Demo Accounts" },
      },

      {
        path: "trading/analyst-views",
        component: AnalystViewsComponent,
        data: { title: "Analyst" },
      },
      {
        path: "trading/economic-calendar",
        component: EconomicCalendarComponent,
        data: { title: "Economic" },
      },
      {
        path: "trading/market-buzz",
        component: MarketBuzzComponent,
        data: { title: "Market" },
      },
      {
        path: "trading/education",
        component: EducationComponent,
        data: { title: "Education" },
      },
      {
        path: "view-account/:id",
        component: ViewAccountComponent,
        data: { title: "View Account" },
      },
      {
        path: "trading/analyst-views",
        component: AnalystViewsComponent,
        data: { title: "Analyst" },
      },
      {
        path: "trading/economic-calendar",
        component: EconomicCalendarComponent,
        data: { title: "Economic" },
      },
      {
        path: "trading/market-buzz",
        component: MarketBuzzComponent,
        data: { title: "Market" },
      },
      {
        path: "trading/education",
        component: EducationComponent,
        data: { title: "Education" },
      },
      {
        path: "view-account/:id",
        component: ViewAccountComponent,
        data: { title: "View Account" },
      },
      {
        path: "platform",
        component: PlatformComponent,
        data: { title: "Platform" },
      },
      {
        path: "trading-platfrom",
        component: TradingCentralComponent,
        data: { title: "Trading" },
      },
      {
        path: "notifications",
        component: NotificationsComponent,
        data: { title: "Notifications" },
      },
      {
        path: "settings",
        component: SettingsComponent,
        data: { title: "Settings" },
      },
      {
        path: "social-trading",
        component: CampaignsComponent,
        data: { title: "Social Trading" },
      },
      {
        path: "funds/gp/cancel/:id",
        component: FundsGpCancelComponent,
        data: { title: "cancel" },
      },
      {
        path: "funds/gp/success",
        component: FundsGpSuccessComponent,
        data: { title: "Success" },
      },

      {
        path: "funds/wltntl/cancel",
        component: FundsGpCancelComponent,
        data: { title: "cancel" },
      },

      {
        path: "funds/brdgp/mb/cancelled",
        component: FundsGpCancelComponent,
        data: { title: "cancel" },
      },

      {
        path: "funds/brdgp/mb/failed",
        component: FundsGpCancelComponent,
        data: { title: "failed" },
      },

      {
        path: "funds/wltntl/success",
        component: FundsGpSuccessComponent,
        data: { title: "Success" },
      },

      // 业务子模块
      // { path: 'widgets', loadChildren: () => import('./widgets/widgets.module').then(m => m.WidgetsModule) },
    ],
  },

  // 空白布局
  {
    path: "blank",
    component: LayoutBlankComponent,
    children: [],
  },

  // passport
  {
    path: ":lang/user",
    component: LayoutPassportComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "login",
        component: UserLoginComponent,
        data: { title: "Login" },
      },
      {
        path: "uniauth",
        component: UniPathComponent,
        data: { title: "UNI Auth" },
      },
      {
        path: "email",
        component: EmailValidationComponent,
        data: { title: "Email" },
      },
      {
        path: "register",
        component: UserRegisterComponent,
        data: { title: "Register" },
      },
      {
        path: "register-list",
        component: RegisterList,
        data: { title: "Register List" },
      },
      {
        path: "reset-password",
        component: ResetComponent,
        data: { title: "Forgot" },
      },
      {
        path: "forgot-password",
        component: ForgotPasswordComponent,
        data: { title: "Forgot" },
      },

      {
        path: "verify-email",
        component: VerifyEmailComponent,
        data: { title: "verify" },
      },

      {
        path: "set-password",
        component: SetPasswordComponent,
        data: { title: "Set Password" },
      },

      // {
      //   path: "set-password",
      //   component: ForgotPasswordComponent,
      //   data: { title: "Forgot" },
      // },
      {
        path: "register-result",
        component: UserRegisterResultComponent,
        data: { title: "Register" },
      },

      {
        path: "register",
        component: UserRegisterComponent,
        data: { title: "Register" },
      },

      {
        path: "register/corporate",
        component: RegisterIinstitutionalComponent,
        data: { title: "Register" },
      },

      {
        path: "register/demo",
        component: UserRegisterDemoComponent,
        data: { title: "Register" },
      },

      { path: "lock", component: UserLockComponent, data: { title: "Lock" } },
    ],
  },

  {
    path: ":lang/payment",
    canActivate: [AuthGuard],
    children: [
      {
        path: "deposit",
        component: DepositPaymentComponent,
        data: { title: "Payment" },
      },
      {
        path: "withdraw",
        component: WithdrawPaymentComponent,
        data: { title: "Payment" },
      },
      {
        path: "deposit-method",
        component: DepositMethodComponent,
        data: { title: "Deposit Method" },
      },
      {
        path: "withdraw-method",
        component: WithdrawMethodComponent,
        data: { title: "Withdraw Method" },
      },
      {
        path: "alternative",
        component: AlternativeMerchantComponent,
        data: { title: "Alternative Method" },
      },
    ],
  },
  {
    path: ":lang",
    component: LayoutPassportComponent,
    children: [
      {
        path: "funds/mb/cancel",
        component: FundsMbCancelComponent,
        data: { title: "funds cancel" },
      },
      {
        path: "funds/mb/error",
        component: FundsMbCancelComponent,
        data: { title: "funds error" },
      },
      {
        path: "funds/mb/result",
        component: FundsMbSuccessComponent,
        data: { title: "funds result" },
      },
      {
        path: "funds/mb/success",
        component: FundsMbSuccessComponent,
        data: { title: "funds success" },
      },

      {
        path: "funds/mb/cancel/:id",
        component: FundsMbCancelComponent,
        data: { title: "funds cancel" },
      },
      {
        path: "funds/mb/error/:id",
        component: FundsMbCancelComponent,
        data: { title: "funds error" },
      },
      {
        path: "funds/mb/result/:id",
        component: FundsMbSuccessComponent,
        data: { title: "funds result" },
      },
      {
        path: "funds/mb/success/:id",
        component: FundsMbSuccessComponent,
        data: { title: "funds success" },
      },
    ],
  },

  { path: "login", redirectTo: "en/user/login" },
  { path: "user/login", redirectTo: "en/user/login" },
  { path: "register", redirectTo: "en/user/register" },
  { path: "user/register", redirectTo: "en/user/register" },
  { path: "set-password", redirectTo: "user/set-password" },
  { path: "alternative", redirectTo: "user/alternative" },

  // 单页不包裹Layout
  { path: "passport/callback/:type", component: CallbackComponent },
  // { path: '**', redirectTo: 'exception/404' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: environment.useHash,
      // NOTICE: If you use `reuse-tab` component and turn on keepingScroll you can set to `disabled`
      // Pls refer to https://ng-alain.com/components/reuse-tab
      scrollPositionRestoration: "top",
    }),
  ],
  exports: [RouterModule],
})
export class RouteRoutingModule {}
