export class VnBankModel
{
  public code?: string;
  public currency?: string;
  public name?: string;
}


export class bridgeModel {
  public type?: string;
  public token?: string;
  public card?: {
      maskedNumber?: string
      bin?: string,
      last4Digits?: string,
      expireMonth?: string,
      expireYear?: string,
      holderName?: string,
      brand?: string,
      type?: string,
      issuer?: string
      country?: string,
  }
    maskedEmail?: string;
    customerId?: string;
    status?: string;
    created?: string;
    encryptedCvv?: string
}
