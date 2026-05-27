import { NgModule, Type, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
// import { FullCalendarModule } from "@fullcalendar/angular";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import interactionPlugin from "@fullcalendar/interaction";
// import listPlugin from "@fullcalendar/list";
// import timeGridPlugin from "@fullcalendar/timegrid";
import { SharedModule } from "@shared";
import * as echarts from "echarts";
import { ClipboardModule } from "ngx-clipboard";
import { NgxEchartsModule } from "ngx-echarts";
import { WebcamModule } from "ngx-webcam"; 
// dashboard pages
import { DynamicColumnWidthDirective } from '../directives/dynamic-column-width.directive';
import { AccountListComponent } from './accounts/account-list/account-list.component';
import { DemoAccountListComponent } from "./accounts/demo-account/demo-account.component";
import { ViewAccountComponent } from './accounts/view-account/view-account.component';
import { AccountOpenComponent } from './accounts/account-open/account-open.component';
import { EditdetailsModalComponent } from './funds/edit-bank-details/edit-details-modal.component';
import { ChangeLeverageModalComponent } from './accounts/change-leverage-modal/change-leverage-modal.component';
import { ChangePasswordModalComponent } from './accounts/change-password-modal/change-password-modal.component';
import { AlternativeComponent } from './alternative/alternative.component';
import { AlternativeMerchantComponent } from "./alternative-merchant/alternative-merchant.component";
import { BankDetailsComponent } from './components/bank-details/bank-details.component';
import { QuickPayComponent } from './components/quick-pay/quick-pay.component';
import { TripeAComponent } from './funds/triplea/triplea.component';
import { CoinPayComponent } from './funds/coinpay/coinpay.component';
import { NetellerPayComponent } from './funds/neteller-pay/neteller-pay.component'
import { FatooraPayComponent } from './funds/fatoora-pay/fatoora-pay.component';
import { CryptoWalletComponent } from './components/crypto-wallet/crypto-wallet.component';
import { DepositModalComponent } from './components/deposit-modal/deposit-modal.component';
import { DepositMethodComponent } from './components/deposit-method/deposit-method.component';
import { WithdrawMethodComponent } from './components/withdraw-method/withdraw-method.component';
import { SettingModalComponent } from './components/setting-modal/setting-modal.component';
import { SuccessModalComponent } from './components/success-modal/success-modal.component';
import { TransferModalComponent } from './components/transfer-modal/transfer-modal.component';
import { WireTransferModalComponent } from './components/wire-transfer-modal/wire-transfer-modal.component';
import { WithdrawModalComponent } from './components/withdraw-modal/withdraw-modal.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegisterList } from './passport/register-list/register-list.component';
import { FundsSuccessComponent } from './funds/funds-success/funds-success.component';
import { FundsRejectedComponent } from './funds/funds-rejected/funds-rejected.component';
import { CoinSuccessComponent } from './funds/coin-success/coin-success.component';
import { UpiSuccessComponent } from './funds/upi-success/upi-success.component';
import { FundsComponent } from './funds/funds.component';
import {PlatformComponent} from "./platform/platform.component";
import {NotificationsComponent} from "./notifications/notification-list/notifications.component";
import {SettingsComponent} from "./settings/settings.component";
import { profileInstituteComponent } from "./profile/profile-institute/profile-institute.component";
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
import { UserRegisterDemoComponent } from "./passport/register-demo/register-demo.component";
import { ResetComponent } from "./passport/reset/reset.component";
import { ImageRequirementModalComponent } from "./profile/image-requirement-modal/image-requirement-modal.component";
import { ProfileDemoComponent } from "./profile/profile-demo/profile-demo.component";
import { ProfileComponent } from "./profile/profile.component";
import { VerificationInformationComponent } from "./profile/verification-information/verification-information.component";
import { SumSubComponent } from "./profile/sumsub/sumsub.component";
import { VerificationComponent } from "./profile/verification/verification.component";
import { ClosedPositionsComponent } from "./reports/closed-positions/closed-positions.component";
import { DepositHistoryComponent } from "./reports/deposit-history/deposit-history.component";
import { OpenPositionsComponent } from "./reports/open-positions/open-positions.component";
import { TransferHistoryComponent } from "./reports/transfer-history/transfer-history.component";
import { WithdrawHistoryComponent } from "./reports/withdraw-history/withdraw-history.component";
import { DepositFundsComponent } from "./reports/deposit-funds/deposit-funds.component";
import { RouteRoutingModule } from "./routes-routing.module";
import { AddTicketComponent } from "./support/add-ticket/add-ticket.component";
import { SupportHistoryComponent } from "./support/support-history/support-history.component";
import { SupportComponent } from "./support/support.component";
import { ViewTicketComponent } from "./support/view-ticket/view-ticket.component";
import { AnalystViewsComponent } from "./trading-central/analyst-views/analyst-views.component";
import { EconomicCalendarComponent } from "./trading-central/economic-calendar/economic-calendar.component";
import { EducationComponent } from "./trading-central/education/education.component";
import { MarketBuzzComponent } from "./trading-central/market-buzz/market-buzz.component";
import { BankDetailsListComponent } from "./funds/bank-details/bank-details-list.component";
import { FatoorahError } from "../routes/fatoorah-error/fatoorah-error.component";
import { FatoorahSuccess } from "../routes/fatoorah-success/fatoorah-success.component";
import { HelpPay } from "../routes/help-pay/help-pay.component";
import { GooglePayButtonModule } from "@google-pay/button-angular";
import { ProfileJointComponent } from "./profile/profile-joint.component";
import { NgOtpInputModule } from "ng-otp-input";
import { AccountTradComponent } from "./accounts/account-trad/account-trad.component";
import { AccountDemoComponent } from "./accounts/account-demo/account-demo.component";
import { ProfileSuitComponent } from './profile/profile-suit/profile-suit.component';
import { VerificationSuitComponent } from './profile/verification-suit/verification-suit.component';
import { FundsGpCancelComponent } from './funds/funds-gp-cancel/funds-gp-cancel.component';
import { FundsGpSuccessComponent } from './funds/funds-gp-success/funds-gp-success.component';
import { FundsMbSuccessComponent } from './passport/funds-mb-success/funds-mb-success.component';
import { FundsMbCancelComponent } from './passport/funds-mb-cancel/funds-mb-cancel.component';
import { TradingCentralComponent } from './platform/trading-central/trading-central.component';
import {NgxMaskModule, IConfig} from 'ngx-mask'
import { TwoDigitDecimaNumberDirective } from '../directives/two-digit-decima-number.directive'
import { CampaignsComponent } from "./campaigns/campaigns.component";
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxSignaturepadModule } from 'ngx-signaturepad2';
import { CountdownModule } from 'ngx-countdown';
import { NumberMaskPipe } from '../shared/pipe/mask.pipe';
import { SuccessComponent } from "./support/success/success.component";
import { FaqComponent } from "./support/faq/faq.component";

export const options: Partial<IConfig> = {
  thousandSeparator: "'"
};

// FullCalendarModule.registerPlugins([
//   dayGridPlugin,
//   timeGridPlugin,
//   listPlugin,
//   interactionPlugin,
// ]);
const COMPONENTS: Array<Type<void>> = [
  TwoDigitDecimaNumberDirective,
  DynamicColumnWidthDirective,
  DashboardComponent,
  RegisterList,
  // passport pages
  CampaignsComponent,
  UserLoginComponent,
  UniPathComponent,
  DepositPaymentComponent,
  WithdrawPaymentComponent,
  UserRegisterComponent,
  RegisterDataComponent,
  RegisterIinstitutionalComponent,
  UserRegisterDemoComponent,
  UserRegisterResultComponent,
  ResetComponent,
  BankDetailsListComponent,
  // single pages
  CallbackComponent,
  UserLockComponent,
  SupportComponent,
  ProfileComponent,
  profileInstituteComponent,
  ProfileJointComponent,
  AccountListComponent,
  DemoAccountListComponent,
  ViewAccountComponent,
  AccountOpenComponent,
  OpenPositionsComponent,
  ClosedPositionsComponent,
  DepositHistoryComponent,
  TransferHistoryComponent,
  WithdrawHistoryComponent,
  DepositFundsComponent,
  FundsComponent,
  AddTicketComponent,
  FaqComponent,
  ViewTicketComponent,
  SupportHistoryComponent,
  ImageRequirementModalComponent,
  WithdrawModalComponent,
  BankDetailsComponent,
  QuickPayComponent,
  TripeAComponent,
  CoinPayComponent,
  NetellerPayComponent,
  FatooraPayComponent,
  TransferModalComponent,
  DepositModalComponent,
  DepositMethodComponent,
  WithdrawMethodComponent,
  ChangePasswordModalComponent,
  ChangeLeverageModalComponent,
  EditdetailsModalComponent,
  EmailValidationComponent,
  SuccessModalComponent,
  CryptoWalletComponent,
  ForgotPasswordComponent,
  SetPasswordComponent,
  VerifyEmailComponent,
  WireTransferModalComponent,
  VerificationComponent,
  VerificationInformationComponent,
  SumSubComponent,
  SettingModalComponent,
  AlternativeComponent,
  AlternativeMerchantComponent,
  FundsSuccessComponent,
  FundsRejectedComponent,
  CoinSuccessComponent,
  UpiSuccessComponent,
  ProfileDemoComponent,
  AnalystViewsComponent,
  EconomicCalendarComponent,
  MarketBuzzComponent,
  EducationComponent,
  FatoorahError,
  FatoorahSuccess,
  HelpPay,
  AccountTradComponent,
  AccountDemoComponent,
  PlatformComponent,
  NotificationsComponent,
  SettingsComponent,
  ProfileSuitComponent,
  VerificationSuitComponent,
  FundsGpCancelComponent,
  FundsGpSuccessComponent,
  FundsMbSuccessComponent,
  FundsMbCancelComponent,
  TradingCentralComponent,
  NumberMaskPipe,
  SuccessComponent
];

@NgModule({
  imports: [
    NgxIntlTelInputModule,
    SharedModule,
    RouteRoutingModule,
    ClipboardModule,
    GooglePayButtonModule,
    WebcamModule,
    NgOtpInputModule,
    PdfViewerModule,
    NgxSignaturepadModule,
    CountdownModule,
    NgxMaskModule.forRoot(options),
    NgxEchartsModule.forRoot({
      echarts,
    }),
  ],
  declarations: COMPONENTS,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RoutesModule {}
