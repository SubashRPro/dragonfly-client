export interface ITransactionParams {
  pageNumber: number;
  numberOfItemPerPage: number;
  searchText: string;
  timelineFrom: string;
  timelineTo: string;
  transactionAmount: number;
  transationType: string;
  status: number;
}

export interface InitiateDepositParams {
  customer_ID: string;
  deposiT_To: number;
  paymenT_SOURCE?: string;
  PAYMENT_DESTINATION?: string;
  deposiT_AMOUNT: number;
  deposiT_TYPE: string;
  wL_NO: string;
  currency: string;
  WT_PaymentReference_ID:string
}

export interface InitiateTransferParams {
  paymenT_SOURCE: string;
  paymenT_DESTINATION: string;
  transfeR_AMOUNT: number;
  wL_NO: string;
  currency: string;
}

export interface InitiateWithdrawParams {
  customer_ID: string;
  withdraW_From: number;
  paymenT_SOURCE: string;
  paymenT_DESTINATION: string;
  withdraW_AMOUNT: number;
  withdraW_TYPE: string;
  wL_NO: string;
  currency: string;
}
