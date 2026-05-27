export interface IRegisterUserParams {
  login_UserName: string;
  login_Password: string;
  email: string;
  verification_Code: string;
  referrer_ID: string;
  login_IP: string;
}

export interface IChangeEmailAddressParams {
  customer_ID: string;
  new_Email: string;
  email_OTP: string;
}

export interface IChangePasswordParams {
  customer_ID: string;
  old_Password: string;
  new_Password: string;
}
