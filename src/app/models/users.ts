export interface Users {
  Login_ID: string;
  Row_Version: string;
  Is_Active: string;
  Created_Date: string;
  Updated_Date: string;
  Created_By: string;
  Updated_By: string;
}

export interface UsersResult {
  token: string;
}

export interface GetCodeParams {
  email: string;
  userName: string;
  wL_Number: string;
}

export interface GetTokenParams {
  token: string;
}

export interface GetVerifyParams {
  email: string;
  userName: string;
  wL_Number: string;
}
