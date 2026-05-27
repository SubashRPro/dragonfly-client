/******
Note all data in parameter should be modal we will change later after stable api and compelteion
******/
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { CustomerParams, IDocumentParams, QuestionParams, CustomerJointParams, IDocumentParamsTwo, QuestionParamsTwo, SuitabilityTest } from 'src/app/models/profile';

import { Accounts } from '../models/accounts';
import { AddCalendarEventsParams, CalendarEventsParams } from '../models/calendar';
import { InitiateDepositParams, InitiateTransferParams, InitiateWithdrawParams, ITransactionParams, } from '../models/funds';
import { IAddTicketParams, ITicketActivitiesParams } from '../models/support';
import { GetCodeParams } from '../models/users';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'multipart/form-data'
  });

  constructor(private http: HttpClient) { }

  /******Login API******/
  login(user: any) {
    return this.http.post(`/api/User/AuthenticateUser?_allow_anonymous=true`, user);
  }
  /******  GetCode API******/
  // getCode(params: GetCodeParams) {
  //   return this.http.post('/api/Email/GetCode?_allow_anonymous=true', params);
  // }

  getCode(params: GetCodeParams) {
    return this.http.post('/api/Miscellaneous/GetEmailOTP?_allow_anonymous=true', params);
  }


  /******Register API******/
  register(user: any) {
    return this.http.post(`/api/User/RegisterUser?_allow_anonymous=true`, user);
  }
  /******Account Opening API******/
  accountOpen(user: any) {
    return this.http.post(`/api/User/RegisterUser`, user);
  }
  forgetPassword(data: any) {
    return this.http.post(`/api/User/ForgetPassword?_allow_anonymous=true`, data);
  }
  setNewPassword(data: any) {
    return this.http.post(`/api/User/SetNewPassword?_allow_anonymous=true`, data);
  }

  /****** UploadDocuments API******/
  uploadDocumentsById(customer_id: string, data: IDocumentParams) {
    return this.http.put(`/api/Customers/UploadDocuments`, data);
  }

  uploadDocumentsByIdTradeTwo(customer_id: string, data: IDocumentParamsTwo) {
    return this.http.put(`/api/Customers/UploadDocuments`, data);
  }


  /****** UploadQuestionnaireById API******/
  UploadQuestionnaireById(data: QuestionParams) {
    return this.http.post(`/api/Customers/UploadQuestionnaire`, data);
  }

  /****** UploadQuestionnaireById API******/
  UploadSuitable(data: SuitabilityTest) {
    return this.http.put(`/api/Customers/EvaluateSuitability`, data);
  }

  UploadQuestionnaireByIdTradeTwo(data: QuestionParamsTwo) {
    return this.http.post(`/api/Customers/UploadQuestionnaire`, data);
  }

  /******saveCustomer API******/
  saveCustomer(customerId: string, data: CustomerParams) {
    return this.http.put(`/api/Customers/SaveCustomer`, data);
  }


  saveCustomerTwo(customerId: string, data: CustomerJointParams) {
    return this.http.put(`/api/Customers/SaveCustomer`, data);
  }


  getCustomerProfile() {
    return this.http.get(`/api/Customers/GetCustomerProfile`);
  }

  GetProfileDetail() {
    return this.http.get(`/api/customers/GetProfileDetail`);
  }

  saveDemoCustomer(customerId: string, data: CustomerParams) {
    return this.http.put(`/api/Customers/SaveDemoCustomer`, data);
  }

  /****** GetAllCountries API******/
  getAllCountries() {
    return this.http.get(`/api/Miscellaneous/GetAllCountries?_allow_anonymous=true`);
  }

  getAllNationality(language: string) {
    return this.http.get(`/api/Miscellaneous/GetAllNationality?_allow_anonymous=true`);
  }

  getAllNationalities() {
    return this.http.get(`/api/Miscellaneous/getAllNationalities?_allow_anonymous=true`);
  }


  switchAccounts(customerId: string) {
    return this.http.get(`/api/User/SwitchAccount`);
  }
  /****** GetCustomerById API******/
  getCustomerById(customerId: string) {
    return this.http.get(`/api/Customers/GetCustomer`);
  }

  /****** GetCustomerByEmail API******/
  getCustomerByEmail(email: string) {
    return this.http.post(`/api/Customers/GetCustomerByEmail`, { email });
  }

  /****** GetKYCSettingByClientId API******/
  getKYCSettingByClientId(customerId: string) {
    return this.http.get(`/api/KYCSetting/GetKYCSetting`);
  }
  /****** GetIsPOARequired API******/
  getIsPOARequired(documentCode: string) {
    return this.http.get(`/api/Miscellaneous/IsPOARequired/${documentCode}`);
  }
  /******get all tickets API******/
  getTicketList(data: any) {
    return this.http.post(`/api/Tickets/GetAllTickets`, data);
  }

  /******get all tickets type******/
  getTicketType() {
    return this.http.get(`/api/Tickets/GetAllTicketType`, {
      observe: 'response'
    });
  }

  /******get all open report******/
  GetAllOpenPositions(data: any) {
    return this.http.post(`/api/Reports/GetAllOpenPositions`, data, {
      observe: 'response'
    });
  }

  /****** GetKYCQuestionsAnswerByClientId ******/
  getKYCQuestionsAnswerByClientId(customerId: string) {
    return this.http.get(`/api/KYCQuestionnaire/GetKYCQuestionsAnswer`);
  }

  /****** GetKYCQuestionsAnswerByClientId ******/
  getSuitabilityTest() {
    return this.http.get(`/api/Customers/GetSuitabilityTest`);
  }

  /****** GetAllAccounts ******/
  getAllAccounts(data: any) {
    return this.http.post(`/api/Accounts/GetAllAccounts`, data);
  }

  /****** AddNewAccount ******/
  addNewAccount(data: any) {
    return this.http.post(`/api/Accounts/AddNewAccount`, data);
  }

  /****** ChangeAccountPassword ******/
  changeAccountPassword(accountId: string, body: any) {
    return this.http.put(`/api/Accounts/ChangeAccountPassword/${accountId}`, body);
  }

  /****** ChangeAccountLeverage ******/
  changeAccountLeverage(accountId: string, body: any) {
    return this.http.put(`/api/Accounts/ChangeAccountLeverage/${accountId}`, body);
  }
  changeAccountDemoLeverage(accountId: string, body: any) {
    return this.http.put(`/api/Accounts/ChangeDemoAccountLeverage/${accountId}`, body);
  }

  // Funds
  /****** GetAllTransactions ******/
  getAllTransactions(body: ITransactionParams) {
    return this.http.post(`/api/Funds/GetAllTransactions`, body);
  }

  /****** InitiateDeposit ******/
  initiateDeposit(body: InitiateDepositParams) {
    return this.http.post(`/api/Funds/InitiateDeposit`, body);
  }

  /****** InitiateWithdraw ******/
  initiateWithdraw(body: InitiateWithdrawParams) {
    return this.http.post(`/api/Funds/InitiateWithdraw`, body);
  }

  /****** InitiateTransfer ******/
  initiateTransfer(body: InitiateTransferParams) {
    return this.http.post(`/api/Funds/InitiateTransfer`, body);
  }
  /******get all close report******/
  getClosePositions(data: any) {
    return this.http.post(`/api/Reports/GetAllClosedPositions`, data, {
      observe: 'response'
    });
  }

   /******get all deposit report******/
   getDepositHistory(data: any) {
     return this.http.post(`/api/Reports/GetAllDeposits`, data, {
       observe: 'response'
     });
   }


  /******get all deposit report******/
  getDeposiFundstHistory(data: any) {
    return this.http.post(`/api/Reports/GetAllMyDeposits`, data, {
      observe: 'response'
    });
  }

  /******get all status******/
  getAllPaymentStatus(transactionType?: any) {
    return this.http.get(`/api/Miscellaneous/GetAllPaymentStatus`, { params: transactionType });
  }

  getAllFundStatus() {
    return this.http.get(`/api/Miscellaneous/GetAllFundStatus`);
  }

  /******get all type******/
  getAllTransactionType() {
    return this.http.get(`/api/Miscellaneous/GetAllTransactionTypes`, {
      observe: 'response'
    });
  }

  /******get all WithdrawHistory report******/
  getWithdrawHistory(data: any) {
    return this.http.post(`/api/Reports/GetAllWithdraws`, data, {
      observe: 'response'
    });
  }

  /******get all WithdrawHistory report******/
  getWalletHistory(data: any) {
    return this.http.post(`/api/Funds/GetAllTransactions`, data, {
      observe: 'response'
    });
  }

  /******get all Transfer report******/
  getAllTransfersReport(data: any) {
    return this.http.post(`/api/Reports/GetAllTransfers`, data, {
      observe: 'response'
    });
  }

  /******add Account******/
  listAccount(data: Accounts) {
    return this.http.post(`/api/Accounts/GetAllAccounts?_allow_anonymous=true`, data, {
      observe: 'response'
    });
  }

  listDemoAccount(data: Accounts) {
    return this.http.post(`/api/Accounts/GetAllDemoAccounts?_allow_anonymous=true`, data, {
      observe: 'response'
    });
  }


  /******add Account******/
  addAccount(data: any) {
    return this.http.post(`/api/Accounts/AddNewAccount?_allow_anonymous=true`, data, {
      observe: 'response'
    });
  }

  addDemoAccount(data: any) {
    return this.http.post(`/api/Accounts/AddDemoAccount`, data, {
      observe: 'response'
    });
  }
  /******get Account leverage******/
  getSingleAccount(accoundId: String, data: any) {
    return this.http.post(`/api/Accounts/ChangeAccountLeverage/${accoundId}`, data);
  }

  // support
  addTicket(data: IAddTicketParams) {
    console.log(data);
    return this.http.post(`/api/Tickets/AddTicket`, data);
  }

  getAllTicketType() {
    return this.http.get(`/api/Tickets/GetAllTicketType`);
  }

  getAllTicketCategories() {
    return this.http.get(`/api/Tickets/GetAllTicketCategories`);
  }

  getAllTicketActivities(params: any) {
    return this.http.post(`/api/Tickets/GetAllTicketActivities`, params);
  }

  getAllTicketAttachments(params: ITicketActivitiesParams) {
    return this.http.post(`/api/Tickets/GetAllTicketAttachments`, params);
  }

  updateTicket(ticketId: string, params: ITicketActivitiesParams) {
    return this.http.post(`/api/Tickets/UpdateTicket/${ticketId}`, params);
  }

  getTicketCategoriesByTicketType(ticketType: string) {
    return this.http.get(`/api/Tickets/GetTicketCategoriesByTicketType/${ticketType}`);
  }

  //setting api
  changeEmail(data: any) {
    return this.http.post(`/api/Setting/ChangeEmailAddress`, data);
  }

  verifyEmail(data: any) {
    return this.http.post(`/api/Setting/VerifyEmailAddress`, data);
  }

  changePassword(data: any) {
    return this.http.post(`/api/Setting/ChangePassword`, data);
  }

  // 获取交易对数据
  getSymbolList = (params: any) => {
    let data = new FormData();
    data.append('security_model', params);
    return this.http.post('/Panel/getSymbolList?_allow_anonymous=true', data, { ...this.headers });
  };

  getSymbol() {
    return this.http.get(`/api/Miscellaneous/GetSymbol?_allow_anonymous=true`);
  }

  // 获取交易对数据
  getMarginList = ({ symbol, lots, currency, leverage }: any) => {
    let data = new FormData();
    data.append('symbol', symbol);
    data.append('lots', lots);
    data.append('currency', currency);
    data.append('leverage', leverage);
    return this.http.post('/api/Miscellaneous/GetMargin?_allow_anonymous=true', {
      symbol,
      leverage,
      currency,
      lots
    });
  };

  // getMarginList({ symbol, lots, currency, leverage }: any) {
  //   const data = { symbol, lots, currency, leverage };
  //   return this.http.post('/api/Miscellaneous/GetMargin?_allow_anonymous=true', data);
  // }


  // 获取交易对数据
  getProfitList = ({ symbol, lots, currency, leverage, open_Price, close_Price, type }: any) => {
    return this.http.post('/api/Miscellaneous/GetProfit?_allow_anonymous=true', {
      symbol,
      "direction_Type": type,
      leverage,
      currency,
      "lots": lots,
      "close_Price": open_Price,
      "open_Price": close_Price
    });
  };
  // get wallet balance
  getWalletBalance(customer_id: string) {
    return this.http.get(`/api/VirtualWallet/GetVirtualWallet`);
  }

  // login GetCode
  loginGetCode(data: any) {
    return this.http.post(`/api/Miscellaneous/GetEmailOTP?_allow_anonymous=true`, data);
  }

  VerifyEmailCode(data: any) {
    return this.http.post(`/api/User/VerifyEmailOTP?_allow_anonymous=true`, data);
  }

  ValidateUserEmail(data: any) {
    return this.http.post(`/api/User/ValidateUserEmail?_allow_anonymous=true`, data);
  }

  // login VerifyTwoWayAuthOPT
  verifyTwoWayAuthOPT(data: any) {
    return this.http.post(`/api/User/VerifyTwoWayAuthOPT?_allow_anonymous=true`, data);
  }

  verifyGoogleAuth(params: any) {
    return this.http.post(`/api/User/VerifyGoogleAuth?_allow_anonymous=true`, params);
  }

  // login GetAllDepositTo
  getAllDepositTo() {
    return this.http.get(`/api/Miscellaneous/GetAllDepositTo`);
  }

  // GetVirtualWalletBYCustomerId
  getVirtualWalletBYCustomerId(customerId: string) {
    return this.http.get(`/api/VirtualWallet/GetVirtualWallet`);
  }

  getAllAccountsByCustomerID(customerId: string) {
    return this.http.get(`/api/Miscellaneous/GetAllAccounts`);
  }

  getBalanceByAccountLogin({ code, type }: any) {
    return this.http.get(`/api/Miscellaneous/GetBalanceByAccountLogin?Code=${code}&AcccountType=${type}`);
  }
  // two factor status
  getFactorStatus(customer_id: string) {
    return this.http.get(`/api/Setting/GetTwoFactorAuth`);
  }

  updateFactorStatus(customer_id: string, data: any) {
    return this.http.put(`/api/Setting/SetTwoFactorAuth`, data);
  }

  // get contact us
  getContactUs(customer_id: string) {
    return this.http.get(`/api/Setting/GetContactUs`);
  }

  getAllCurrencies() {
    return this.http.get(`/api/Miscellaneous/GetAllCurrencies?_allow_anonymous=true`);
  }

  getDepositByCardPraxisPaymentAsync(data: any) {
    return this.http.post(`/api/Funds/DepositByCardPraxisPaymentAsync?_allow_anonymous=true`, data);
  }

  getWithdrawByCardPraxisPaymentAsync(data: any) {
    return this.http.post(`/api/Funds/WithdrawByCardPraxisPaymentAsync?_allow_anonymous=true`, data);
  }

  getPraxisStatusByOrderId(orderId: any) {
    return this.http.get(`/api/Funds/GetPraxisStatusByOrderId?TransactionID=${orderId}`);
  }

  getExchangeRate({ FromCurrency, ToCurrency, TransactionType, PaymentMethod }: any) {
    return this.http.get(
      `/api/Miscellaneous/GetExchangeRate?FromCurrency=${FromCurrency}&ToCurrency=${ToCurrency}&TransactionType=${TransactionType}&PaymentMethod=${PaymentMethod}&?_allow_anonymous=true`
    );
  }
  getAllAccountsTotalBalance(custmerId: any) {
    return this.http.get(`/api/Miscellaneous/GetAllAccountsTotalBalance`);
  }

  getMT4AccountDetail(account_logins: any) {
    return this.http.get(`/api/Miscellaneous/GetMT4AccountDetail?account_logins=${account_logins}`);
  }

  getAllTransferSourceByCustomerId(custmerId: string) {
    return this.http.get(`/api/Miscellaneous/GetAllTransferSource`);
  }

  getAllCalendarEvents(data: CalendarEventsParams) {
    return this.http.post(`/api/Calendars/GetAllCalendarEvents`, data);
  }

  addCalendarEvent(data: AddCalendarEventsParams) {
    return this.http.post(`/api/Calendars/AddCalendarEvent`, data);
  }
  // get chart data
  getChartData(custmerId: string) {
    return this.http.get(`/api/Miscellaneous/GetAllAccountSources`);
  }

  getBalanceData() {
    return this.http.get(`/api/Miscellaneous/GetAllAccountsDetail`);
  }
  // del chart data
  deleteCalendarEvent(CalendarEventId: string) {
    return this.http.put(`/api/Calendars/DeleteCalendarEvent?CalendarEventId=${CalendarEventId}`, {});
  }
  updateCalendarEvent(data: AddCalendarEventsParams) {
    return this.http.put(`/api/Calendars/UpdateCalendarEvent`, data);
  }

  getAllDepositStatus() {
    return this.http.get(`/api/Miscellaneous/GetAllDepositStatus`);
  }

  getCPTPaymentInformation() {
    return this.http.get(`/api/Miscellaneous/GetCPTPaymentInformation`);
  }

  fileUpload(file: any, name: string) {
    const formData = new FormData();
    formData.append('fileName', name);
    formData.append('fileToUpload', file);
    return this.http.post(`/api/Miscellaneous/FileUpload`, formData);
  }

  getTicketById(ticketId: string) {
    return this.http.get(`/api/Tickets/GetTicketById/${ticketId}`);
  }

  getUserInfo(loginId: string) {
    return this.http.get(`/api/User/GetUserDetail?_allow_anonymous=true`);
  }

  getGoogleAuthenticationCodes(customerId: string) {
    return this.http.get(`/api/Setting/GetGoogleAuthenticationCodes`);
  }
  checkGoogleAuth(customerId: string) {
    return this.http.get(`/api/Setting/CheckGoogleAuth`);
  }

  setGoogleAuthentication(data: any) {
    return this.http.put(`/api/Setting/SetGoogleAuthentication`, data);
  }

  getDownloadLinks() {
    return this.http.get(`/api/Setting/GetDownloadLinks`);
  }

  getAllNotifications(data: any) {
    return this.http.post(`/api/Notifications/GetAllNotifications?_allow_anonymous=true`, data);
  }

  getMenus(Customer_ID: string) {
    return this.http.get(`/api/User/GetUserRoles`);
  }

  getUnReadNotices(Customer_ID: string) {
    return this.http.get(`/api/Notifications/GetAllTotalUnReadNotifications`);
  }

  getSMSCode(data: any) {
    return this.http.post(`/api/Miscellaneous/GetSMSCode?_allow_anonymous=true`, data);
  }

  changePhoneNumber(data: any) {
    return this.http.post(`/api/Setting/ChangePhoneNumber`, data);
  }
  verifyPhoneNumber(data: any) {
    return this.http.post(`/api/Setting/VerifyPhoneNumber`, data);
  }

  getImgBg() {
    return this.http.get(`/api/Miscellaneous/GetLoginBackgroundImage?_allow_anonymous=true&lang=ENG`);
  }

  getTradingCentral(customer_ID: string, type: number) {
    return this.http.post(`/api/TradingCentral/GetTradingCentralUrl/${type}`, {});
  }

  getTnCLinks() {
    return this.http.get(`/api/Miscellaneous/GetTnCLinks?_allow_anonymous=true`);
  }

  getEmailCode(data: any) {
    return this.http.post(`/api/Miscellaneous/GetEmailCode`, data);
  }

  getChangeCode(data: any) {
    return this.http.post(`/api/Miscellaneous/GetEmailOTP`, data);
  }


  getSMSTokenCode(data: any) {
    return this.http.post(`/api/Miscellaneous/GetPhoneSMSCode`, data);
  }

  // view account api

  GetAccountDetailByAccountLogin(data: any) {
    return this.http.get(`/api/Accounts/GetAccountDetailByAccountLogin?accountLogin=${data}`);
  }


  tradeAccount(data: any) {
    return this.http.post(`/api/Trades/GetTradeHistoryByAccount?_allow_anonymous=true`, data, {
      observe: 'response'
    });
  }


  getBusinessType() {
    return this.http.get(`/api/Miscellaneous/GetAllBusinessType`);
  }

  getAccountType() {
    return this.http.get(`/api/Miscellaneous/GetCustomerType?_allow_anonymous=true`);
  }

  refreshToken(data: any) {
    return this.http.get(`/api/User/RefreshToken?_allow_anonymous=true`, data);
  }

  // coin payment deposit

  coinDeposit(data: any) {
    return this.http.post(`/api/Funds/DepositByCoinPaymentAsync?_allow_anonymous=true`, data);
  }

  coinWithdraw(data: any) {
    return this.http.post(`/api/Funds/cp/InitiateWithdraw?_allow_anonymous=true`, data);
  }

  // bank details

  getBankDetails() {
    return this.http.get(`/api/Customers/GetCustomerBankDetails?_allow_anonymous=true`);
  }

  getBankDetailbyId(id: any) {
    return this.http.get(`/api/Customers/GetCustomerBankDetailbyID?bankDetailID=${id}`);
  }

  addbank(data: any) {
    return this.http.post(`/api/Customers/SaveBankDetail?_allow_anonymous=true`, data);
  }

  updateBank(data: any) {
    return this.http.post(`/api/Customers/UpdateBankDetail?_allow_anonymous=true`, data);
  }

  deleteBank(id: any) {
    return this.http.get(`/api/Customers/DeleteBankDetail?bankDetailID=${id}`);
  }

  // triple a payment intergration

  getDepositByCardtripeAPaymentAsync(data: any) {
    return this.http.post(`/api/Funds/tpa/InitiateDeposit?_allow_anonymous=true`, data);
  }

  tripeAWithdraw(data: any) {
    return this.http.post(`/api/Funds/tpa/InitiateWithdraw?_allow_anonymous=true`, data);
  }

  hyperBCAWithdraw(data: any) {
    return this.http.post(`/api/Funds/hbc/InitiateWithdraw?_allow_anonymous=true`, data);
  }

  leanWithdraw(data: any) {
    return this.http.post(`/api/Funds/lean/InitiateWithdraw?_allow_anonymous=true`, data);
  }

  // notification
  getNotification() {
    return this.http.get(`/api/Miscellaneous/GetUserNotification?_allow_anonymous=true`);
  }


  updateNotify(id: any, body: any) {
    return this.http.post(`/api/Miscellaneous/NotificationRead/${id}`, body);
  }

  // get PSP details
  getAllPSP(psp: any) {
    return this.http.get(`/api/Funds/GetAllPSPs/${psp}?_allow_anonymous=true`);
  }

  // gpay api
  depositGpay(data: any) {
    return this.http.post(`/api/Funds/gpay/InitiateDeposit?_allow_anonymous=true`, data);
  }

  withdrawGpay(data: any) {
    return this.http.post(`/api/Funds/gpay/InitiateWithdraw?_allow_anonymous=true`, data);
  }

  gpayCallBack(data: any) {
    return this.http.post(`/api/Funds/gpay/depositcallback?_allow_anonymous=true`, data);
  }

  // epay
  depositEpay(data: any) {
    return this.http.post(`/api/Funds/epay/InitiateDeposit?_allow_anonymous=true`, data);
  }

  GetDepositById(depositID: any) {
    return this.http.get(`/api/Funds/GetDepositById?depositId=${depositID}&_allow_anonymous=true`);
  }

  withdrawEpay(data: any) {
    return this.http.post(`/api/Funds/epay/InitiateWithdraw?_allow_anonymous=true`, data);
  }

  epayCallBack(data: any, callSign: any) {
    return this.http.post(`/api/Funds/epay/depositcallback/${callSign}?_allow_anonymous=true`, data);
  }

  // upi
  depositUPI(data: any) {
    return this.http.post(`/api/Funds/upi/InitiateDeposit?_allow_anonymous=true`, data);
  }

  depositHelppay(data: any) {
    return this.http.post(`/api/Funds/help2Pay/InitiateDeposit?_allow_anonymous=true`, data);
  }

  depositHyperBC(data: any) {
    return this.http.post(`/api/Funds/hbc/InitiateDeposit?_allow_anonymous=true`, data);
  }

  depositLean(data: any) {
    return this.http.post(`/api/Funds/lean/InitiateDeposit?_allow_anonymous=true`, data);
  }

  gpDeposit(data: any) {
    return this.http.post(`/api/Funds/gp/InitiateDeposit?_allow_anonymous=true`, data);
  }

  getgpCancelStatus(orderId: any) {
    return this.http.get(`/api/Funds/gp/DepositCancelled/${orderId}`);
  }

  withDrawHelpPay(data: any) {
    return this.http.post(`/api/Funds/help2Pay/InitiateWithdraw?_allow_anonymous=true`, data);
  }


  withdrawUPI(data: any) {
    return this.http.post(`/api/Funds/upi/InitiateWithdraw?_allow_anonymous=true`, data);
  }

  paDeposit(data: any) {
    return this.http.post(`/api/Funds/pa/InitiateDeposit?_allow_anonymous=true`, data);
  }

  orbitalDeposit(data: any) {
    return this.http.post(`/api/Funds/orbital/InitiateDeposit?_allow_anonymous=true`, data);
  }


  monetixDeposit(data: any) {
    return this.http.post(`/api/Funds/mtxDoc/InitiateDeposit?_allow_anonymous=true`, data);
  }

  monetixDepositURL(data: any) {
    return this.http.get(`/api/Funds/mtxDoc/fetchUpiUrl/${data}?_allow_anonymous=true`,);
  }

  chipPayDeposit(data: any) {
    return this.http.post(`/api/Funds/chippay/InitiateDeposit?_allow_anonymous=true`, data);
  }


  paWithdraw(data: any) {
    return this.http.post(`/api/Funds/pa/InitiateWithdraw?_allow_anonymous=true`, data);
  }

  // my Fatoorah
  getAvailablePaymentMethods(data: any) {
    return this.http.post(`/api/Funds/mf/GetAvailablePaymentMethods?_allow_anonymous=true`, data);
  }

  depositFatoora(data: any) {
    return this.http.post(`/api/Funds/mf/InitiateDeposit?_allow_anonymous=true`, data);
  }

  WithDrawFatoora(data: any) {
    return this.http.post(`/api/Funds/mf/InitiateWithdraw?_allow_anonymous=true`, data);
  }

  getAllAccountsDetail(data: any) {
    return this.http.get(`/api/Miscellaneous/GetAllAccountsDetail`);
  }

  getStatisticDetail(date: string, account_login: string) {
    return this.http.get(`/api/Miscellaneous/GetStatisticDetail?account_login=${account_login}&graphType=` + date)
  }

  getNews(data: any) {
    return this.http.post(`/api/News/GetAllNews`, data)
  }

  getFundsBalance() {
    return this.http.get(`/api/Miscellaneous/GetCumulativeBalance?_allow_anonymous=true`);
  }

  CloseModal() {
    return this.http.get(`/api/User/AFPOPUP?_allow_anonymous=true`);
  }

  fatooraError(data: any) {
    return this.http.post(
      `/api/funds/mf/depositcallback/BVTPrECqZuPb35RQCCEv86GeXRRpA3J8QejNuwFwZzCj8yKn5d`,
      data
    );
  }

  /****** UploadDocuments API******/
  UploadPOADocumentsById(data: any) {
    return this.http.post(`/api/Customers/UploadPOADocumentsById`, data);
  }

  /****** UploadQuestionnaireById API******/
  UploadSuitableExist(data: SuitabilityTest) {
    return this.http.post(`/api/Customers/UpdateSuitabilityTestForExistingCustomer`, data);
  }
  gpWithdraw(data: any) {
    return this.http.post(`/api/Funds/gp/InitiateWithdraw?_allow_anonymous=true`, data);
  }

  skrillDeposit(data: any) {
    return this.http.post(`/api/Funds/WLTNTL/InitiateDeposit?_allow_anonymous=true`, data);
  }

  netterlerDeposit(data: any) {
    return this.http.post(`/api/Funds/neteller/InitiateDeposit?_allow_anonymous=true`, data);
  }

  skrillWithdraw(data: any) {
    return this.http.post(`/api/Funds/WLTNTL/InitiateWithdraw?_allow_anonymous=true`, data);
  }

  netellerWithdraw(data: any) {
    return this.http.post(`/api/Funds/neteller/InitiateWithdraw?_allow_anonymous=true`, data);
  }


  sirPagaWithdraw(data: any) {
    return this.http.post(`/api/Funds/Sirpaga/InitiateWithdraw?_allow_anonymous=true`, data);
  }


  blizardPayWithdraw(data: any) {
    return this.http.post(`/api/Funds/blizzardpay/InitiateWithdraw?_allow_anonymous=true`, data);
  }

  // corporate account 

  registerCorporate(user: any) {
    return this.http.post(`/api/User/RegisterCorporate?_allow_anonymous=true`, user);
  }

  getCompany() {
    return this.http.get(`/api/CustomerCompany/GetCustomerCompany?_allow_anonymous=true`);
  }

  saveCompany(data: any) {
    return this.http.post(`/api/CustomerCompany/SaveCustomerCompany?_allow_anonymous=true`, data);
  }

  GetRepresentativeDetail() {
    return this.http.get(`/api/CustomerCompany/GetRepresentativeDetail?_allow_anonymous=true`);
  }

  saveRepresentative(data: any) {
    return this.http.post(`/api/CustomerCompany/UpdateCompanyRepresentative?_allow_anonymous=true`, data);
  }

  getKYCQuestionsAnswerByKYCType() {
    return this.http.get(`/api/CustomerCompany/GetKYCQuestionsAnswerByKYCType?_allow_anonymous=true`);
  }

  UploadQuestionnaireCompany(data: QuestionParams) {
    return this.http.post(`/api/CustomerCompany/UploadQuestionnaire`, data);
  }

  UpdateCompanyDirectors(data: any) {
    return this.http.post(`/api/CustomerCompany/UpdateCompanyDirectors`, data);
  }


  UpdateCompanyShareholders(data: any) {
    return this.http.post(`/api/CustomerCompany/UpdateCompanyShareholders`, data);
  }

  GetShareholdersDetail() {
    return this.http.get(`/api/CustomerCompany/GetShareholdersDetail?_allow_anonymous=true`);
  }


  switchViewTab(customerId: string) {
    return this.http.get(`/api/User/SwitchBasicView`);
  }

  validateToken(data: any) {
    return this.http.post(`/api/User/rdlink/ValidateToken?_allow_anonymous=true`, data);
  }

  setPassword(data: any) {
    return this.http.post(`/api/User/rdlink/SetNewPassword?_allow_anonymous=true`, data);
  }

  bvnkDeposit(data: any) {
    return this.http.post(`/api/Funds/bvnk/InitiateDeposit?_allow_anonymous=true`, data);
  }

  bvnkWithdraw(data: any) {
    return this.http.post(`/api/Funds/bvnk/InitiateWithdraw?_allow_anonymous=true`, data);
  }

  bridgerpayDeposit(data: any) {
    return this.http.post(`/api/Funds/bridgerpay/InitiateDeposit?_allow_anonymous=true`, data);
  }

  bridgerpayProviders(currency: any) {
    return this.http.get(`/api/Funds/bridgerpay/GetProviders/${currency}?_allow_anonymous=true`);
  }


  bridgerpayToken(token: boolean) {
    return this.http.get(`/api/Funds/bridgerpay/InitiateCardTokenization/${token}?_allow_anonymous=true`);
  }

  bridgerpayWithdraw(data: any) {
    return this.http.post(`/api/Funds/bridgerpay/InitiateWithdraw?_allow_anonymous=true`, data);
  }


  // quick UPI pay

  quickPayDeposit(body: InitiateDepositParams) {
    return this.http.post(`/api/Funds/InitiateDeposit`, body);
  }

  quickPayWithdraw(body: InitiateWithdrawParams) {
    return this.http.post(`/api/Funds/InitiateWithdraw`, body);
  }

  // email verify

  emailVerify(body: any) {
    return this.http.post(`/api/User/VerifyEmailByLink?_allow_anonymous=true`, body);
  }

  resendEmailVerify(body: any) {
    return this.http.post(`/api/User/ResendEmailVerificationLink?_allow_anonymous=true`, body);
  }

  resendEmailVerifyProfile() {
    return this.http.get(`/api/User/ResendEmailVerificationLink?_allow_anonymous=true`);
  }

  acceptDeclaration(body: any) {
    return this.http.put(`/api/User/UpdateTCDeclaration/${body.isAggreed}`, body);
  }

  // create swap account
   // create swap account
  createSwapAccount(data: any) {
    return this.http.post(
      `/api/Accounts/RequestSwapFree?_allow_anonymous=true`,
      data
    );
  }

  // cancel withdraw

  cancelWithdraw(body: any) {
    return this.http.put(`/api/Funds/CancelWithdraw?_allow_anonymous=true`, body);
  }


  // blizzard pay
  blizzardpayDeposit(data: any) {
    return this.http.post(`/api/Funds/blizzardpay/InitiateDeposit?_allow_anonymous=true`, data);
  }

  //reset password link
  resetPasswordLink(email: any) {
    return this.http.get(`/api/Miscellaneous/SendPasswordResetEmail?email=${email}&_allow_anonymous=true`);
  }

  resetPassword(data: any) {
    return this.http.post(`/api/User/ResetPassword?_allow_anonymous=true`, data);
  }


  // eg pay
  egPayDeposit(data: any) {
    return this.http.post(`/api/Funds/egplocalpay/InitiateDeposit?_allow_anonymous=true`, data);
  }

  egPayWithdraw(data: any) {
    return this.http.post(`/api/Funds/egplocalpay/InitiateWithdraw?_allow_anonymous=true`, data);
  }

  getAllCampaigns() {
    return this.http.get(`/api/Campaigns/GetAllCampaigns`);
  }

  registerCampaigns(data: any) {
    return this.http.post(`/api/Campaigns/Register`, data);
  }

  validateNumber(number:any, countryCode:any) {
    return this.http.get(`/api/Miscellaneous/ValidateMobileNumber/${number}/${countryCode}?_allow_anonymous=true`);
  }

  getUserIp() {
    return this.http.get(`/api/Miscellaneous/GetGEODetail?_allow_anonymous=true`)
  }


  exlinkDeposit(data: any) {
    return this.http.post(`/api/Funds/exlinkpay/InitiateDeposit?_allow_anonymous=true`, data);
  }

  OnlinePayDeposit(data: any) {
    return this.http.post(
      `/api/Funds/OnlinePay/InitiateDeposit?_allow_anonymous=true`,
      data
    );
  }

  VerifyRegisteredCustomerOTP(data: any) {
    return this.http.post(`/api/User/VerifyRegisteredCustomerOTP?_allow_anonymous=true`, data);
  }


  ResendEmailVerificationOTP(loginID: any) {
    return this.http.get(`/api/User/ResendEmailVerificationOTP/${loginID}?_allow_anonymous=true`);
  }

   // cheezePay
   cheezePay(data: any) {
    return this.http.post(`/api/Funds/cheezeepay/InitiateDeposit?_allow_anonymous=true`, data);
  }

  cheezePayWithdraw(data: any) {
    return this.http.post(`/api/Funds/cheezeepay/InitiateWithdraw?_allow_anonymous=true`, data);
  }

  maxAccountReach(data: any) {
    return this.http.get(`/api/Accounts/IsMaxAccountCountReached/${data}?_allow_anonymous=true`);
  }

  exLinkWithdraw(data: any) {
    return this.http.post(`/api/Funds/exlinkpay/InitiateWithdraw?_allow_anonymous=true`, data);
  }

  // ccoop pay

  ccoopDeposit(data: any) {
    return this.http.post(`/api/Funds/ccoop/InitiateDeposit?_allow_anonymous=true`, data);
  }


  mtpayDeposit(data: any) {
    return this.http.post(`/api/Funds/mtpay/InitiateDeposit?_allow_anonymous=true`, data);
  }

  ccoopWithdraw(data: any) {
    return this.http.post(`/api/Funds/ccoop/InitiateWithdraw?_allow_anonymous=true`, data);
  }

    // save signature and send email

    saveSignSendEmail(data: any) {
      return this.http.post(`/api/Customers/SaveSignatureAndSendMail?_allow_anonymous=true`, data);
    }



  CryptoAndOtherPay(data: any) {
    return this.http.post(`/api/Funds/UNIPay/InitiateWithdraw?_allow_anonymous=true`, data);
  }

  oneTwopay(data: any) {
    return this.http.post(`/api/Funds/12pay/InitiateDeposit?_allow_anonymous=true`, data);
  }

  uniAuth(user: any) {
    return this.http.post(`/api/User/UNIAuth?_allow_anonymous=true`, user);
  }


  MerChantheaders = new HttpHeaders({
    'Accept': 'application/json',
    'zumo-api-version': '2.0.0'
  });

  merchantUserAuth(user: any) {
    return this.http.post(`/api/Merchant/Merchant_UserAuth?_allow_anonymous=true`, user);
  }

  redirectMerchant(data: any) {
    return this.http.post(`/api/Merchant/GetMerchantRedirectURL?_allow_anonymous=true`, data);
  }

  //GetSumSubAccessToken
  getSumSubAccessToken(CustomerId:any) {
    return this.http.get(`/api/Customers/GetSumSubAccessToken?CustomerId=${CustomerId}`);
  }


  getTradingSummary() {
    return this.http.get(`/api/Miscellaneous/GetTradingSummary`);
  }

  IsRSLRequired(isoCode:any) {
    return this.http.get(`/api/Miscellaneous/IsRSLRequired/${isoCode}?_allow_anonymous=true`);
  }

  unipaydeposit(data: any) {
    return this.http.post(`/api/Funds/UniPayment/InitiateDeposit?_allow_anonymous=true`, data);
  }

   addWallet(data: any) {
    return this.http.post(`/api/CryptoWallet/CryptoWallet?_allow_anonymous=true`, data);
  }

  getAllCryptoWallets() {
    return this.http.get(`/api/CryptoWallet/CryptoWallets?_allow_anonymous=true`);  
  }

   OmPay(data: any) {
    return this.http.post(`/api/Funds/OmPay/InitiateDeposit`, data);
  }

  getAllPaymentHubMethods() {
    return this.http.get(`/api/Funds/paymenthub/getmethods?_allow_anonymous=true`);  
  }

  depositHubPay(data: any) {
    return this.http.post(`/api/Funds/paymenthub/InitiateDeposit`, data);
  }

}
