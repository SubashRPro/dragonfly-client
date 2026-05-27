import {Validators} from "@angular/forms";

export interface CustomerParams {
  customer_FirstName?: string;
  customer_LastName?: string;
  customer_MiddleName?: string;
  customer_Mobile?: string;
  customer_Email?: string;
  customer_Gender?: string;
  customer_DoB?: any;
  customer_Address?: string;
  customer_Country?: string;
  customer_Nationality?: string;
  customer_City?: string;
  customer_Company?: string;
  customer_ZipCode?: string;
  customer_State?: string;
  tax_PayerIdentification?: string;
  customer_TIN?:string;
  customer_Passport?:string;
  customer_ApartmentNumber?:string;
  is_USCitizen?:boolean;
  row_Version?: string;
  is_Primary?: boolean;
  is_PEP?:boolean
  trading_Platform?:boolean
}

export interface CustomerJointParams {
  customer_ID?:number;
  customer_FirstName?: string;
  customer_LastName?: string;
  customer_MiddleName?: string;
  customer_Mobile?: string;
  customer_Email?: string;
  customer_Gender?: string;
  customer_DoB?: string;
  customer_Address?: string;
  customer_Country?: string;
  customer_Nationality?: string;
  customer_City?: string;
  customer_Company?: string;
  customer_ZipCode?: string;
  customer_State?: string;
  tax_PayerIdentification?: string;
  customer_TIN?:string;
  customer_Passport?:string;
  customer_ApartmentNumber?:string;
  is_USCitizen?:boolean;
  row_Version?: string;
  is_Primary?: boolean;
  tpi?: string;
  is_PEP?:boolean;
  trading_Platform?:boolean
}


export interface IDocumentParams {
  is_Active: number;
  row_Version: string;
  kyC_SettingsID: string;
  kyC_TypeID: string;
  is_Primary: boolean;
  upload_Document: DocumentItemParams[];
}

export interface DocumentItemParams {
  documentType: string;
  frontSide_FileName: string;
  frontSide_FilePath: string;
  backSide_FileName: string;
  backSide_FilePath: string;
}

// docuement two

export interface IDocumentParamsTwo {
  is_Active: number;
  row_Version: string;
  kyC_SettingsID: string;
  kyC_TypeID: string;
  is_Primary: boolean;
  upload_Document: DocumentItemParamsTwo[];
}

export interface DocumentItemParamsTwo {
  documentType: string;
  frontSide_FileName: string;
  frontSide_FilePath: string;
  backSide_FileName: string;
  backSide_FilePath: string;
}

// docuement end

export interface QuestionParams {
  is_Primary: boolean;
  customerId: string;
  selectedQuestion: [
    {
      questionCode: string;
      answer: string;
      answerID: string[];
    }
  ];
}

export interface QuestionParamsTwo {
  is_Primary: boolean;
  customerId: string;
  selectedQuestion: [
    {
      questionCode: string;
      answer: string;
      answerID: string[];
    }
  ];
}


export interface SuitabilityTest {
  id:number,
  level:number,
  result:number,
  toTest:boolean,
  message:string,
  minPoints:number,
  maxPoints:number,
  sT_Questions: [
    {
      id: string;
      question: string;
      sT_Answers: string[];
    }
  ];
}

export interface IDocumentParamspov {
  upload_Document: DocumentItemParams[];
}

