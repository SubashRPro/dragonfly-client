import {
  Component,
  ElementRef,
  Inject,
  Injector,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { ViewportScroller } from "@angular/common";
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { I18NService } from "@core";
import { DA_SERVICE_TOKEN, ITokenService } from "@delon/auth";
import { SettingsService } from "@delon/theme";
import { environment } from "@env/environment";
import { differenceInCalendarDays, differenceInYears } from "date-fns";
import { NzMessageService } from "ng-zorro-antd/message";
import { NzModalRef, NzModalService } from "ng-zorro-antd/modal";
import { NzUploadFile, NzUploadChangeParam } from "ng-zorro-antd/upload";
import { Observable, Observer, Subject } from "rxjs";
import { SearchCountryField, CountryISO } from "ngx-intl-tel-input";
import {
  DocumentItemParams,
  IDocumentParams,
  QuestionParams,
  SuitabilityTest,
} from "src/app/models/profile";
import { ApiService } from "src/app/services/api.service";
import { WebcamImage } from "ngx-webcam";

import { ImageRequirementModalComponent } from "./image-requirement-modal/image-requirement-modal.component";
import { prefixDefault } from "./phone";
import * as moment from "moment";
interface nationalityOption {
  img: string;
  code: string;
  description: string;
}

interface nationalityOption1 {
  img: string;
  code: string;
  description: string;
}

const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.less"],
})
export class ProfileComponent implements OnInit {
  @ViewChild('signaturePad', { static: false }) signaturePad;

  width: number = 600;
  height: number = 150;
  options = {
    minWidth: 1,
    maxWidth: 2,
    penColor: "rgb(0, 0, 0)",
    backgroundColor: "rgb(255, 255, 255)"
  };


  isVisiblePdf:boolean = false
  hideOtp: boolean = false;
  emailOtp: any = null;
  showOtpError: boolean = false;
  public submitted: boolean = false;
  preferredCountries: CountryISO[] = [
    CountryISO.UnitedArabEmirates,
    CountryISO.SouthAfrica,
    CountryISO.India,
    CountryISO.Vietnam,
  ];
  CountryISO = CountryISO;
  SearchCountryField = SearchCountryField;
  selectedCountryISO: any;
  loader: boolean | undefined;
  consentAcceptanceLoader: boolean = false;
  isSuitpage: boolean | undefined;
  @ViewChild("imageRequirementModalComponent")
  settingModalComponent!: ImageRequirementModalComponent;
  validateForm!: FormGroup;
  SuitableForm!: FormGroup;
  personalForm!: FormGroup;
  documentForm!: FormGroup;
  controlArray: Array<{ index: number; show: boolean }> = [];
  isCollapse = true;
  current = 0;
  customerId!: string;
  nationality: nationalityOption[] = [] as nationalityOption[];
  nationality1: nationalityOption1[] = [] as nationalityOption1[];
  nationalityTemp: any;
  nationality1Temp: any;
  isConcentChecked: boolean = false;
  isConsentGiven: boolean = false;
  isVisibleConsent: boolean = false;
  loading: boolean = false;
  prfoleloading: boolean = false;
  passportLoading: boolean = false;
  passportBackLoading: boolean = false;
  nationalityLoading: boolean = false;
  nationalityBackLoading: boolean = false;
  drivingLoading: boolean = false;
  drivingBackLoading: boolean = false;
  adderssLoading: boolean = false;
  adderssBackLoading: boolean = false;
  loaddingSumbit = false;
  passportFile!: NzUploadFile;
  nationalFile!: NzUploadFile;
  nationalBackFile!: NzUploadFile;
  addessFile!: NzUploadFile;
  addessBackFile!: NzUploadFile;
  passportFileList: NzUploadFile[] = [];
  passportBackFileList: NzUploadFile[] = [];
  addessFileList: NzUploadFile[] = [];
  addessBackFileList: NzUploadFile[] = [];
  nationalFileList: NzUploadFile[] = [];
  nationalBackFileList: NzUploadFile[] = [];
  drivingLicenseFileList: NzUploadFile[] = [];
  drivingLicenseBackFileList: NzUploadFile[] = [];
  drivingLicenseFile!: NzUploadFile;
  drivingLicenseBackFile!: NzUploadFile;
  customerParams: IDocumentParams = {} as IDocumentParams;
  customerVersion: any;
  settingByClientParms!: any;
  phones: any = prefixDefault;
  avatarUrl?: string;
  langs = this.i18nSev.i18nUrl();
  user_Nationality = this.tokenSrv.get()?.user_Nationality;
  user_Resident = this.tokenSrv.get()?.user_Country;
  suitableId: any;
  suitableLevel: any;
  userNational: any;
  userCountry: any;
  supportModal: boolean = false;
  // eslint-disable-next-line prettier/prettier
  mobilePattern = "^(?:[0-9] ?){6,14}[0-9]$";
  questionsAnswer: any = [];
  suitableAnswer: any = [];
  suitableSecondAnswer: any = [];
  passportCam: boolean = false;
  isSecondAnswer: boolean = false;
  otherAns: any = [];
  show1: boolean = false;
  show2: boolean = false;
  personalLoader: boolean = false;
  questionLoader: boolean = false;
  signLoader:boolean = false;
  registeredEmail!: boolean;
  toggleCollapse(): void {
    this.isCollapse = !this.isCollapse;
    this.controlArray.forEach((c, index) => {
      c.show = this.isCollapse ? index < 6 : true;
    });
  }

  resetForm(): void {
    this.validateForm.reset();
  }

  onlyCountries: CountryISO[] = Object.keys(this.CountryISO)
    .filter(
      (x) =>
        ![this.CountryISO.Afghanistan, this.CountryISO.Albania, this.CountryISO.AmericanSamoa , this.CountryISO.Belarus, this.CountryISO.Belgium,  this.CountryISO.Burundi, this.CountryISO.CentralAfricanRepublic, 
        this.CountryISO.Cyprus, this.CountryISO.CongoRepublicCongoBrazzaville, this.CountryISO.Eritrea, this.CountryISO.Guam, this.CountryISO.Haiti, this.CountryISO.Liberia, this.CountryISO.Libya, this.CountryISO.Mali,
        this.CountryISO.NewZealand, this.CountryISO.Nicaragua, this.CountryISO.NorthernMarianaIslands, this.CountryISO.PuertoRico, this.CountryISO.GuineaBissau, this.CountryISO.Russia, this.CountryISO.SierraLeone,
        this.CountryISO.Somalia, this.CountryISO.SouthSudan, this.CountryISO.SriLanka, this.CountryISO.Sudan, this.CountryISO.Syria, this.CountryISO.Ukraine, this.CountryISO.Venezuela, this.CountryISO.Yemen,
        this.CountryISO.UnitedStates, this.CountryISO.UnitedKingdom, this.CountryISO.Canada, this.CountryISO.Israel, this.CountryISO.Iran, this.CountryISO.NorthKorea, this.CountryISO.Cuba, this.CountryISO.CongoDRCJamhuriYaKidemokrasiaYaKongo, this.CountryISO.CongoRepublicCongoBrazzaville, 
        this.CountryISO.NorthernMarianaIslands, this.CountryISO.Guinea, 
        ].some(
          (y) => y == this.CountryISO[x]
        )
    )
    .map((x) => this.CountryISO[x]);
    
  constructor(
    private settings: SettingsService,
    private fb: FormBuilder,
    private api: ApiService,
    private injector: Injector,
    private modal: NzModalService,
    private message: NzMessageService,
    private router: Router,
    private i18nSev: I18NService,
    private myElement: ElementRef,
    private scroller: ViewportScroller,
    private http: HttpClient
  ) {}

  get curLangCode(): string {
    return this.settings.layout.lang;
  }

  private get tokenSrv(): ITokenService {
    return this.injector.get(DA_SERVICE_TOKEN);
  }

  lang: any = {
    "en-US": "EN",
    "zh-TW": "TW",
    "as-CN": "CN",
  };
  ageValidator: ValidatorFn = (control: AbstractControl) => {
    const maxAge = 100;
    if (!control.value) {
      return {}; // If the control value is empty, consider it as valid
    }
    const dateOfBirth = moment(control.value, "DD/MM/YYYY").format(
      "YYYY-MM-DD"
    ); // Format: MM-DD-YYYY
    const currentDate = moment().format("YYYY-MM-DD"); // Current date
    const ageDifference = this.calculateAgeDifference(dateOfBirth, currentDate);
    if (ageDifference.years >= maxAge) {
      return { maxAge: true, error: true };
    }
    return {};
  };

  dateValidator: ValidatorFn = (control: AbstractControl) => {
    if (!control.value) {
      return {}; // If the control value is empty, consider it as valid
    }
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!regex?.test(control.value)) {
      return { invalidDateFormat: true, error: true };
    }
    return {};
  };  
  ngOnInit(): void {
    this.validateForm = this.fb.group({});
    this.SuitableForm = this.fb.group({});
    this.personalForm = this.fb.group({
      customer_FirstName: [
        null,
        [Validators.required],
      ],
      customer_MiddleName: [null],
      customer_LastName: [
        null,
        [Validators.required],
      ],
      email: [null, [Validators.email, Validators.required]],
      customer_TIN: [null],
      customer_Passport: [null],
      date: [
        null,
        [Validators.required, this.dateValidator, this.ageValidator],
      ],
      nationality: [null, [Validators.required]],
      gender: ["null", [Validators.required]],
      phoneNumber: [null, [Validators.required]],
      customer_Address: [null],
      street: [null],
      country: [null, [Validators.required]],
      state: [null],
      city: [null],
      zipCode: [null],
      customer_ApartmentNumber: [null],
      tpi: [null],
      is_USCitizen: [false],
      is_PEP: [false],
      trading_Platform: [null],
    });;

    this.documentForm = this.fb.group({
      documentType: ["Passport", [Validators.required]],
    });
    // here is the api call to get the country list but currently we are using the static json file because of the api response time if we use the api call then we have to remove the static json file and also remove the assets data import in the module.ts file
    this.http
  .get<any>('assets/data/countries.json')
  .subscribe((res) => {
    this.nationality = res.data.map((item: any) => ({
      ...item,
      img: `${environment.api.baseUrl}/app_contents/country_flag/${item.code}.svg`
    }));
    this.nationalityTemp = this.nationality;
  });
    // this.api.getAllCountries().subscribe((res: any) => {
    //   this.nationality = res.data.map((item: any) => ({
    //     ...item,
    //     img: `${environment.api.baseUrl}/app_contents/country_flag/${item.code}.svg`,
    //   }));
    //   this.nationalityTemp = this.nationality;
    // });

    // setTimeout(() => {
    //   if (this.tokenSrv.get()?.customer_Type === "CTCRP_0003_0422") {
    //     this.router.navigateByUrl(`${this.langs}/profile-corporate`);
    //   }
    // }, 300);

    this.api.getAllNationalities().subscribe((res: any) => {
      this.nationality1 = res.data.map((item: any) => ({
        ...item,
        img: `${environment.api.baseUrl}/app_contents/country_flag/${item.code}.svg`,
      }));
      this.nationality1Temp = this.nationality1;
    });
    this.getCustomerById();
    this.getKYCSettingByClientId(this.customerVersion?.customer_ID, true);
    //  this.getCustomerByEmail();
    this.api.getCustomerProfile().subscribe((res: any) => {
      let data = res?.data[0];
      this.userNational = data?.customer_Nationality;
      this.userCountry = data?.customer_Country;
    //  this.personalForm.controls.phoneNumber.setValue(data.customer_Mobile);
      if (data?.customer_Type === "CTJNT_0002_0422") {
        if (
          data?.verification_Status == "InProgress" &&
          data?.customer_Status == "Pending" &&
          data?.kyC_QuestionnaireStatus == "Completed"
        ) {
          this.router.navigateByUrl(`${this.langs}/profile/verification`);
        } else {
          this.router.navigateByUrl(`${this.langs}/profile-joint`);
        }
      } 
      
      else if (data?.customer_Type === "CTINDV_0001_0422") {
        if (
          data?.verification_Status == "InProgress" &&
          data?.customer_Status == "Pending" &&
          data?.kyC_QuestionnaireStatus == "Completed"
        ) {
          this.router.navigateByUrl(`${this.langs}/profile/verification`);
        } else if (
          (data?.verification_Status == "Completed" &&
            data?.customer_Status == "Verified") ||
          data?.customer_Status == "Active" ||
          (data?.customer_Status == "Funded" &&
            data?.kyC_QuestionnaireStatus == "Completed")
        ) {
          this.router.navigateByUrl(
            `${this.langs}/profile/verification-information`
          );
          return;
        } else if (data?.customer_Status == "SuitabilityTestFailed") {
          this.supportModal = true;
          return;
        } else if (data?.customer_Status == "SuitabilityTestFailed") {
          this.supportModal = true;
          return;
        } else if (data?.customer_Status == "DocumentDetailCompleted") {
          this.current = 3;
          return;
        } 
        else if (data?.customer_Status == "FinInfoCompleted") {
          this.current = 2;
          return;
        }
        else if (data?.customer_Status == "ProfileCompleted") {
          this.current = 1;
          this.getQuestionsAnswer();
          return;
        } else {
          this.router.navigateByUrl(`${this.langs}/profile`);
        }
      }
      else if(data?.customer_Type === "CTCRP_0003_0422") {
        this.router.navigateByUrl(`${this.langs}/profile-corporate`);
      }
    });
  }
  countryChangeSearch(event: any) {
    this.nationality = this.nationalityTemp.filter((data: any) => {
      return data.description.toLowerCase().startsWith(event.toLowerCase());
    });
  }
  nationalityChangeSearch(event: any) {
    this.nationality1 = this.nationality1Temp.filter((data: any) => {
      return data.description.toLowerCase().startsWith(event.toLowerCase());
    });
  }
  personalSubmit() {
    this.submitted = true;
    if (this.personalForm.valid) {
      this.personalLoader = true;
      const newDate = this.personalForm.value.date;
      const dataList = newDate?.split("/").reverse().join("-");
      // const dataList = new Date(this.personalForm.value.date)
      // const data = moment(dataList).format('YYYY-MM-DD')
      //  console.log(data)
      const {
        customer_FirstName,
        customer_MiddleName,
        customer_LastName,
        email,
        date,
        nationality,
        gender,
        phoneNumber,
        phoneNumberPrefix,
        customer_Address,
        street,
        city,
        zipCode,
        country,
        state,
        tpi,
        customer_TIN,
        customer_Passport,
        customer_ApartmentNumber,
        is_USCitizen,
        is_PEP,
        trading_Platform,
      } = this.personalForm.value;
      let mobNumber = "";
      console.log(this.personalForm.value.phoneNumber);
      const formValue = this.personalForm.value.phoneNumber;

      const phoneSpace = formValue.nationalNumber?.split(/[- )(]/g).join("");

      const splitNum = phoneNumber.number?.split(" ");
      // if (splitNum.length > 1) {
      //   mobNumber = `${splitNum[0]} ${splitNum[1]?.split('-').join('')}`;
      // } else {
      //   mobNumber = `${phoneNumber.dialCode} ${splitNum?.split('-').join('')}`;
      // }
      this.api
        .saveCustomer(this.customerId, {
          customer_FirstName: customer_FirstName,
          customer_MiddleName: customer_MiddleName,
          customer_LastName: customer_LastName,
          customer_Mobile: `${formValue.dialCode} ${phoneSpace}`,
          customer_Email: email,
          customer_Gender: gender,
          customer_DoB: dataList,
          customer_Address: customer_Address,
          customer_Country: country,
          customer_Nationality: nationality,
          customer_City: city,
          customer_Company: street,
          customer_ZipCode: zipCode,
          customer_State: state,
          tax_PayerIdentification: tpi,
          customer_TIN: customer_TIN,
          customer_Passport: customer_Passport,
          customer_ApartmentNumber: customer_ApartmentNumber,
          is_USCitizen: is_USCitizen,
          is_PEP: is_PEP,
          trading_Platform: trading_Platform,
          row_Version: this.customerVersion?.row_Version,
        })
        .subscribe(
          (res: any) => {
            this.current = 1;
            this.getQuestionsAnswer();
            this.personalLoader = false;
          },
          // (err) => {
          //   let errList = "";
          //   for (var key of Object.keys(err.error?.errors)) {
          //     for (let i = 0; i < err.error.errors[key].length; i++) {
          //       errList += err.error.errors[key][i];
          //     }
          //   }
          //   this.message.error(errList)
          //   this.message.error(err?.body?.message);
          //   this.personalLoader = false
          // }
          (error) => {
            this.personalLoader = false;
            this.message.error(error?.body?.message);
            this.scroll();
          }
        );
    } else {
      Object.values(this.personalForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
          this.message.error(
            this.i18nSev.i18n("Please fill the required fields")
          );
          this.scroll();
          this.personalLoader = false;
        }
      });
    }
  }

  // error form scroll to top
  scroll() {
    let abc: any = document.getElementById("scroll-error");
    abc.scrollIntoView({
      behavior: "smooth",
    });
  }

  nzOnCancel(modelRef: NzModalRef) {
    // this.documentForm.reset();
    this.current = this.current - 1;
    this.getCustomerById();
    this.getQuestionsAnswer();
    this.getSuitabilityAnswer();
    modelRef.destroy();
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
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: "400px",
    });
  }

  beforeUpload = (
    file: NzUploadFile,
    _fileList: NzUploadFile[]
  ): Observable<boolean> =>
    new Observable((observer: Observer<boolean>) => {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        this.message.error("You can only upload JPG file!");
        observer.complete();
        return;
      }
      const isLt2M = file.size! / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.message.error("Image must smaller than 5MB!");
        observer.complete();
        return;
      }
      observer.next(isJpgOrPng && isLt2M);
      observer.complete();
    });

  async documnetSubmit() {
    let upload_Document = [];
    const type = this.documentForm.value?.documentType;
    switch (type) {
      case "Passport":
        //ticket changes for CPTI-99 Passport Back is not obligatory
        if (this.passportFileList.length <= 0) {
          //if (this.passportFileList.length <= 0 || this.passportBackFileList.length <= 0) {
          this.message.error("Please upload files");
          this.scroll();
          return;
        }
        if (this.passportFileList.length > 0) {
          //ticket changes for CPTI-99 Passport Back is not obligatory
          //if (this.passportFileList.length > 0 && this.passportBackFileList.length > 0) {
          upload_Document.push({
            documentType: "Passport",
            frontSide_FileName: this.passportFileList[0]?.name,
            frontSide_FilePath: this.passportFileList[0]?.url,
            backSide_FileName: this.passportBackFileList[0]?.name,
            backSide_FilePath: this.passportBackFileList[0]?.url,
          });
        }

        break;
      case "Driving License":
        if (
          this.drivingLicenseFileList.length <= 0 ||
          this.drivingLicenseBackFileList.length <= 0
        ) {
          this.message.error("Please upload files");
          this.scroll();
          return;
        }
        if (
          this.drivingLicenseFileList.length > 0 &&
          this.drivingLicenseBackFileList.length > 0
        ) {
          upload_Document.push({
            documentType: "Driving License",
            frontSide_FileName: this.drivingLicenseFileList[0]?.name,
            frontSide_FilePath: this.drivingLicenseFileList[0]?.url,
            backSide_FileName: this.drivingLicenseBackFileList[0]?.name,
            backSide_FilePath: this.drivingLicenseBackFileList[0]?.url,
          });
        }
        break;

      case "Voter ID":
        if (
          this.voterFileList.length <= 0 ||
          this.votereBackFileList.length <= 0
        ) {
          this.message.error("Please upload files");
          this.scroll();
          return;
        }
        if (
          this.voterFileList.length > 0 &&
          this.votereBackFileList.length > 0
        ) {
          upload_Document.push({
            documentType: "Voter's Card",
            frontSide_FileName: this.voterFileList[0]?.name,
            frontSide_FilePath: this.voterFileList[0]?.url,
            backSide_FileName: this.votereBackFileList[0]?.name,
            backSide_FilePath: this.votereBackFileList[0]?.url,
          });
        }
        break;

      case "National ID":
        if (
          this.nationalFileList.length <= 0 ||
          this.nationalBackFileList.length <= 0
        ) {
          this.message.error("Please upload files");
          this.scroll();
          return;
        }
        if (
          this.nationalFileList.length > 0 &&
          this.nationalBackFileList.length > 0
        ) {
          upload_Document.push({
            documentType: "National ID",
            frontSide_FileName: this.nationalFileList[0]?.name,
            frontSide_FilePath: this.nationalFileList[0]?.url,
            backSide_FileName: this.nationalBackFileList[0]?.name,
            backSide_FilePath: this.nationalBackFileList[0]?.url,
          });
        }
        break;
    }
    //Address Proff obligatory removed khurshed https://logtec.atlassian.net/browse/CUET-34
    if (this.showAddressProof) {
      //  if (
      //    this.settingByClientParms?.kyC_IsAddressProof &&
      //    this.addessFileList.length <= 0
      //  ) {
      //    this.message.error("Please upload files");
      //    this.scroll();
      //    return;
      //  }
      if (
        this.settingByClientParms?.kyC_IsAddressProof &&
        this.addessFileList.length > 0
      ) {
        upload_Document.push({
          documentType: "Address Proof",
          frontSide_FileName: this.addessFileList[0]?.name,
          frontSide_FilePath: this.addessFileList[0]?.url,
          // backSide_FileName: this.addessBackFileList[0]?.name,
          // backSide_FilePath: this.addessBackFileList[0]?.url
        });
      }
    }

    if (this.documentForm.valid) {
      this.loaddingSumbit = true;
      this.customerParams = {
        ...this.customerParams,
        row_Version: this.customerVersion.row_Version,
        upload_Document: upload_Document as DocumentItemParams[],
      };
      this.api
        .uploadDocumentsById(this.tokenSrv.get()?.customer_id, {
          ...this.customerParams,
        })
        .subscribe(
          (res) => {
            // this.router.navigateByUrl(`${this.langs}/profile/verification`);
            this.current = 3;
            this.loaddingSumbit = false;
          },
          (error) => {
            this.loaddingSumbit = false;
          }
        );
    } else {
      Object.values(this.documentForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  phoneNumberValidator = (control: FormControl): { [s: string]: boolean } => {
    var re =
      /^((?:\+|00)[17](?: |\-)?|(?:\+|00)[1-9]\d{0,2}(?: |\-)?|(?:\+|00)1\-\d{3}(?: |\-)?)?(0\d|\([0-9]{3}\)|[1-9]{0,3})(?:((?: |\-)[0-9]{2}){4}|((?:[0-9]{2}){4})|((?: |\-)[0-9]{3}(?: |\-)[0-9]{4})|([0-9]{7}))$/;
    if (!control.value) {
      return { required: true };
    } else if (
      control.value.toString().length > 11 ||
      control.value.toString().length < 7
    ) {
      return { pattern: true, error: true };
    }
    return {};
  };

  // dateValidator = (control: FormControl): { [s: string]: boolean } => {
  //   const re = differenceInYears(new Date(control.value), new Date()) <= -18;
  //   if (!control.value) {
  //     return { required: true };
  //   } else if (!re) {
  //     return { pattern: true, error: true };
  //   }
  //   return {};
  // };

  getCustomerById() {
    this.prfoleloading = true;
    this.customerId = this.tokenSrv.get()?.customer_id;
    this.api.getCustomerProfile().subscribe((res: any) => {
      this.prfoleloading = false;
      setTimeout(()=> {
        this.personalForm.controls.phoneNumber.setValue(
          res?.data[0]?.customer_Mobile
        );
      },500)
      if (
        res.data[0]?.verification_Status == "InProgress" &&
        res.data[0]?.customer_Status == "Pending" &&
        res.data[0]?.kyC_QuestionnaireStatus == "Completed"
      ) {
        this.router.navigateByUrl(`${this.langs}/profile/verification`);
        return;
      } else if (
        res.data[0]?.customer_Status == "Registered_EmailVerificationPending"
      ) {
        this.registeredEmail = true;
      } else if (
        (res.data[0]?.verification_Status == "Completed" &&
          res.data[0]?.customer_Status == "Verified") ||
        res.data[0]?.customer_Status == "Active" ||
        (res.data[0]?.customer_Status == "Funded" &&
          res.data[0]?.kyC_QuestionnaireStatus == "Completed")
      ) {
        this.router.navigateByUrl(
          `${this.langs}/profile/verification-information`
        );
        return;
      }
      const data = res?.data[0];
      const dob = res.data[0].customer_DoB;
      //  const phoneNumberPrefix = phone ? phone?.split(" ")[0] : "";
      const tpi = res.data[0].tax_PayerIdentification;
      if (
        res.data[0]?.isAggreedOn_TCDeclaration == 111 &&
        res.data[0]?.customer_DoB === null
      ) {
        this.isConsentGiven = false;
      }
      // this.isConsentGiven = res.data[0]?.isAggreedOn_TCDeclaration == 111 ? true : false
      // phoneNumberPrefix && this.personalForm.get("phoneNumberPrefix")?.setValue(phoneNumberPrefix);
      // const phoneNumber = phone && phone?.split(" ")[1];
      // const getDate =  moment(dob).format('DD-MM-YYYY')
      const phone = res?.data[0]?.customer_Mobile || null;
      // this.personalForm?.get("phoneNumber")?.setValue(phone);
      const getDate = dob?.split("-").reverse().join("-");
      this.customerVersion = {
        ...data,
        getDate,
        tpi,
      };

      const type = ["Passport", "Driving License", "National ID", "Voter ID"];

      data?.documents?.map((item: any) => {
        if (type.indexOf(item?.document_Type) !== -1) {
          this.documentForm.get("documentType")?.setValue(item?.document_Type);
        }
        const fron = `${environment.api.fileUrl}/${item.document_FrontSidePath}`;
        const back = `${environment.api.fileUrl}/${item.document_BackSidePath}`;
        switch (item.document_Type) {
          case "Passport":
            this.passportFileList = fron
              ? [
                  {
                    uid: "-1",
                    name: item.document_BackSideName,
                    status: "done",
                    url: fron,
                  },
                ]
              : [];
            this.passportPreviewImage = fron;
            this.passportBackFileList = back
              ? [
                  {
                    uid: "-1",
                    name: item.document_BackSideName,
                    status: "done",
                    url: back,
                  },
                ]
              : [];
            this.passportBackPreviewImage = back;
            break;
          case "Driving License":
            this.drivingLicenseFileList = fron
              ? [
                  {
                    uid: "-1",
                    name: item.document_BackSideName,
                    status: "done",
                    url: fron,
                  },
                ]
              : [];
            this.drivingLicensePreviewImage = fron;
            this.drivingLicenseBackFileList = back
              ? [
                  {
                    uid: "-1",
                    name: item.document_BackSideName,
                    status: "done",
                    url: back,
                  },
                ]
              : [];
            this.drivingLicenseBackPreviewImage = back;
            break;
          case "Address Proof":
            this.addessFileList = fron
              ? [
                  {
                    uid: "-1",
                    name: item.document_BackSideName,
                    status: "done",
                    url: fron,
                  },
                ]
              : [];
            this.addressPreviewImage = fron;
            // this.addessBackFileList = back
            //   ? [
            //       {
            //         uid: '-1',
            //         name: item.document_BackSideName,
            //         status: 'done',
            //         url: back
            //       }
            //     ]
            //   : [];
            // this.addressBackPreviewImage = back;
            break;

          case "Voter ID":
            this.voterFileList = fron
              ? [
                  {
                    uid: "-1",
                    name: item.document_BackSideName,
                    status: "done",
                    url: fron,
                  },
                ]
              : [];
            this.voterPreviewImage = fron;
            this.votereBackFileList = back
              ? [
                  {
                    uid: "-1",
                    name: item.document_BackSideName,
                    status: "done",
                    url: back,
                  },
                ]
              : [];
            this.voterbackPreviewImage = back;
            break;
        }
      });

      // this.nationalPreviewImage = `${environment.api.fileUrl}/${res.data.customer_NICPath}`;
      // this.drivingLicensePreviewImage = `${environment.api.fileUrl}/${res.data.customer_DrivingLicensePath}`;
      // this.addressPreviewImage = `${environment.api.fileUrl}/${res.data.customer_AddressProofPath}`;
      // this.nationalFileList = res.data.customer_NICPath
      //   ? [{ uid: '-1', name: res.data.customer_NIC, status: 'done', url: `${environment.api.fileUrl}/${res.data.customer_NICPath}` }]
      //   : [];
      // this.drivingLicenseFileList = res.data.customer_DrivingLicensePath
      //   ? [
      //       {
      //         uid: '-1',
      //         name: res.data.customer_DrivingLicense,
      //         status: 'done',
      //         url: `${environment.api.fileUrl}/${res.data.customer_DrivingLicensePath}`
      //       }
      //     ]
      //   : [];
      // this.addessFileList = res.data.customer_AddressProofPath
      //   ? [
      //       {
      //         uid: '-1',
      //         name: res.data.customer_AddressProof,
      //         status: 'done',
      //         url: `${environment.api.fileUrl}/${res.data.customer_AddressProofPath}`
      //       }
      //     ]
      //   : [];

      // this.getQuestionsAnswer();
    });
  }
  disabledDate = (current: Date): boolean =>
    // Can not select days before today and today
    differenceInCalendarDays(current, new Date()) > 0;

  handleChange({ file, fileList }: NzUploadChangeParam): void {
    const status = file.status;
    if (status !== "uploading") {
      console.log(file, fileList);
    }
    if (status === "done") {
    } else if (status === "error") {
    }
  }

  changeDocumentType(docType: any) {
    console.log(docType);
    this.showAddressProof = false;
    const selectedDocTypeData = this.settingByClientParms?.documentTypes?.find(
      (item: any) => item.id === docType
    );
    this.api.getIsPOARequired(selectedDocTypeData?.code).subscribe(
      (res: any) => {
        if (res.statusCode === 100) this.showAddressProof = res.data;
      },
      (err) => {
        console.log(err, "error");
      }
    );
  }

  statusCode: boolean = false;
  showAddressProof = false;
  selectedDocType = "Passport";
  getKYCSettingByClientId(customerId: string, isFirst: boolean = false) {
    this.api.getKYCSettingByClientId(customerId).subscribe(
      (res: any) => {
        this.statusCode = false;
        const { kyC_SettingsID, kyC_TypeID } = res.data;
        this.customerParams = {
          kyC_SettingsID,
          kyC_TypeID,
        } as IDocumentParams;

        this.settingByClientParms = res.data;
        if (isFirst) {
          this.changeDocumentType(this.selectedDocType);
        }
      },
      (error) => {
        if (error.body.statusCode === 104) {
          this.statusCode = true;
        }
        this.message.error("Please contact to admin.");
      }
    );
  }

  passportPreviewImage: string | undefined = "";
  passportBackPreviewImage: string | undefined = "";
  passportPreviewVisible = false;
  passportBackPreviewVisible = false;
  nationalPreviewImage: string | undefined = "";
  nationalBackPreviewImage: string | undefined = "";
  nationalPreviewVisible = false;
  nationalBackPreviewVisible = false;
  drivingLicensePreviewImage: string | undefined = "";
  drivingLicenseBackPreviewImage: string | undefined = "";
  drivingLicensePreviewVisible = false;
  drivingLicenseBackPreviewVisible = false;
  addressPreviewImage: string | undefined = "";
  addressBackPreviewImage: string | undefined = "";
  addressPreviewVisible = false;
  addressBackPreviewVisible = false;

  handleDrivingPreview = async (file: NzUploadFile): Promise<void> => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj!);
    }
    this.drivingLicensePreviewImage = file.url || file.preview;
    this.drivingLicensePreviewVisible = true;
  };

  handleDrivingBackPreview = async (file: NzUploadFile): Promise<void> => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj!);
    }
    this.drivingLicenseBackPreviewImage = file.url || file.preview;
    this.drivingLicenseBackPreviewVisible = true;
  };

  handleNationalPreview = async (file: NzUploadFile): Promise<void> => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj!);
    }
    this.nationalPreviewImage = file.url || file.preview;
    this.nationalPreviewVisible = true;
  };

  handleNationalBackPreview = async (file: NzUploadFile): Promise<void> => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj!);
    }
    this.nationalBackPreviewImage = file.url || file.preview;
    this.nationalBackPreviewVisible = true;
  };

  handlePreview = async (file: NzUploadFile): Promise<void> => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj!);
    }
    this.passportPreviewImage = file.url || file.preview;
    this.passportPreviewVisible = true;
  };
  handleBackPreview = async (file: NzUploadFile): Promise<void> => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj!);
    }
    this.passportBackPreviewImage = file.url || file.preview;
    this.passportBackPreviewVisible = true;
  };

  handlePassportRemove(file: any) {
    this.passportFileList = [];
    return true;
  }

  handlePassportBackRemove(file: any) {
    this.passportBackFileList = [];
    return true;
  }

  handleNationalRemove(file: any) {
    this.nationalFileList = [];
    return true;
  }
  handleNationalBackRemove(file: any) {
    this.nationalBackFileList = [];
    return true;
  }

  handleDrivingRemove(file: any) {
    this.drivingLicenseFileList = [];
    return true;
  }

  handleDrivingBackRemove(file: any) {
    this.drivingLicenseBackFileList = [];
    return true;
  }

  handleAdressRemove(file: any) {
    this.addessFileList = [];
    return true;
  }
  handleAdressBackRemove(file: any) {
    this.addessBackFileList = [];
    return true;
  }

  passportBeforeUpload = (file: NzUploadFile): boolean => {
    console.log(file);
    this.passportLoading = true;
    this.passportFile = file;
    this.api.fileUpload(file, file.name).subscribe(
      (res: any) => {
        this.passportLoading = false;
        this.passportPreviewImage = res.data.filePath;
        this.passportFileList = [
          {
            uid: "-1",
            name: file.name,
            status: "done",
            url: res.data.filePath,
          },
        ];
      },
      (error) => {
        this.passportLoading = false;
      }
    );
    return false;
  };

  // 护照背面
  passportBackBeforeUpload = (file: NzUploadFile): boolean => {
    this.passportBackLoading = true;
    this.passportFile = file;
    this.api.fileUpload(file, file.name).subscribe(
      (res: any) => {
        this.passportBackLoading = false;
        this.passportBackPreviewImage = res.data.filePath;
        this.passportBackFileList = [
          {
            uid: "-1",
            name: file.name,
            status: "done",
            url: res.data.filePath,
          },
        ];
      },
      (error) => {
        this.passportBackLoading = false;
      }
    );
    return false;
  };

  nationalBeforeUpload = (file: NzUploadFile): boolean => {
    this.nationalFile = file;
    this.nationalityLoading = false;
    this.api.fileUpload(file, file.name).subscribe(
      (res: any) => {
        this.nationalityLoading = false;
        this.nationalPreviewImage = res.data.filePath;
        this.nationalFileList = [
          {
            uid: "-1",
            name: file.name,
            status: "done",
            url: res.data.filePath,
          },
        ];
      },
      (error) => {
        this.nationalityLoading = false;
      }
    );
    return false;
  };

  nationalBackBeforeUpload = (file: NzUploadFile): boolean => {
    this.nationalBackFile = file;
    this.nationalityBackLoading = false;
    this.api.fileUpload(file, file.name).subscribe(
      (res: any) => {
        this.nationalityBackLoading = false;
        this.nationalBackPreviewImage = res.data.filePath;
        this.nationalBackFileList = [
          {
            uid: "-1",
            name: file.name,
            status: "done",
            url: res.data.filePath,
          },
        ];
      },
      (error) => {
        this.nationalityBackLoading = false;
      }
    );
    return false;
  };

  drivingLicenseBeforeUpload = (file: NzUploadFile): boolean => {
    this.drivingLoading = true;
    this.drivingLicenseFile = file;
    this.api.fileUpload(file, file.name).subscribe(
      (res: any) => {
        this.drivingLoading = false;
        this.drivingLicensePreviewImage = res.data.filePath;
        this.drivingLicenseFileList = [
          {
            uid: "-1",
            name: file.name,
            status: "done",
            url: res.data.filePath,
          },
        ];
      },
      (error) => {
        this.drivingLoading = false;
      }
    );
    return false;
  };

  drivingLicenseBackBeforeUpload = (file: NzUploadFile): boolean => {
    this.drivingBackLoading = true;
    this.drivingLicenseBackFile = file;
    this.api.fileUpload(file, file.name).subscribe(
      (res: any) => {
        this.drivingBackLoading = false;
        this.drivingLicenseBackPreviewImage = res.data.filePath;
        this.drivingLicenseBackFileList = [
          {
            uid: "-1",
            name: file.name,
            status: "done",
            url: res.data.filePath,
          },
        ];
      },
      (error) => {
        this.drivingBackLoading = false;
      }
    );
    return false;
  };

  addessBeforeUpload = (file: NzUploadFile): boolean => {
    this.adderssLoading = true;
    this.addessFile = file;
    this.api.fileUpload(file, file.name).subscribe(
      (res: any) => {
        this.adderssLoading = false;
        this.addressPreviewImage = res.data.filePath;
        this.addessFileList = [
          {
            uid: "-1",
            name: file.name,
            status: "done",
            url: res.data.filePath,
          },
        ];
      },
      (error) => {
        this.adderssLoading = false;
      }
    );
    return false;
  };

  addessBackBeforeUpload = (file: NzUploadFile): boolean => {
    this.adderssBackLoading = true;
    this.addessBackFile = file;
    this.api.fileUpload(file, file.name).subscribe(
      (res: any) => {
        this.adderssBackLoading = false;
        this.addressBackPreviewImage = res.data.filePath;
        this.addessBackFileList = [
          {
            uid: "-1",
            name: file.name,
            status: "done",
            url: res.data.filePath,
          },
        ];
      },
      (error) => {
        this.adderssBackLoading = false;
      }
    );
    return false;
  };

  // get finacial question
  getQuestionsAnswer() {
    this.api
      .getKYCQuestionsAnswerByClientId(this.tokenSrv.get()?.customer_id)
      .subscribe((res: any) => {
        let datas = res.data;
        datas = datas.map((r: any) => {
          if (r.type == "SingleChoice") {
            let answersOthers: any = r.answers;
            answersOthers?.map((anwserOther: any) => {
              if (
                anwserOther.isChecked &&
                anwserOther.answerID == "7ff94f18-7b5a-48ee-aab2-947fcb754da6"
              ) {
                this.otherAns.push({ [r.questionCode]: true });
              }
              if (
                anwserOther.isChecked &&
                anwserOther.answerID == "49636c88-1c89-4aba-a43e-c61c47e2a4a3"
              ) {
                this.otherAns.push({ [r.questionCode]: true });
              }
            });
            return {
              ...r,
              answers: r.answers.sort((a: any, b: any) => a.sNo - b.sNo),
            };
          }
          return r;
        });
        datas.map((item: any) => {
          if (item.type === "Subjective") {
            this.validateForm.addControl(
              `Subjective|${item.questionCode}`,
              new FormControl(null, Validators.required)
            );
            this.validateForm.get(
              `Subjective|${item.questionCode}|${item.answers[0].answersID}`
            );
          } else if (item.type === "MultipleChoice") {
            const ansRest = item.answers.map((ans: any, index: number) => ({
              label: ans.title,
              value: ans.answerID,
              checked: ans.isChecked,
            }));
            this.validateForm.addControl(
              `MultipleChoice|${item.questionCode}`,
              new FormControl(ansRest, [
                Validators.required,
                this.confirmationValidator,
              ])
            );
            // this.validateForm.addControl(`MultipleChoice|${item.questionCode}|${ans.answerID}`, new FormControl(null));
          } 
          
          else if (item.type === "DropDown") {
            this.validateForm.addControl(
              `dropDownChoice|${item.questionCode}`,
              new FormControl(null, Validators.required)
            );
            this.validateForm.addControl(
              `Other|${item.questionCode}`,
              new FormControl(null)
            );
            return {
              ...item,
              other: false,
            };
          } else if (item.type === "SingleChoice") {
            this.validateForm.addControl(
              `SingleChoice|${item.questionCode}`,
              new FormControl(null, Validators.required)
            );
            this.validateForm.addControl(
              `Other|${item.questionCode}`,
              new FormControl(null)
            );
            return {
              ...item,
              other: false,
            };
          }
          return item;
        });
        this.questionsAnswer = datas;
      });
  }

  hideAnsList(id: any) {
    let hideOtherAns = false;
    this.otherAns.map((item: any, index: number) => {
      if (typeof item[id] !== "undefined") {
        hideOtherAns = item[id];
      }
    });
    return hideOtherAns;
  }

  // get Suitability Test question
  getSuitabilityAnswer() {
    this.api.getSuitabilityTest().subscribe((res: any) => {
      let datas = res.data.sT_Questions;
      this.suitableAnswer = datas;
      this.suitableId = res.data.id;
      this.suitableLevel = res.data.level;
      datas.map((item: any) => {
        this.SuitableForm.addControl(
          `answerType|${item.id}`,
          new FormControl(null, Validators.required)
        );
      });
    });
  }

  onOther(e: any) {
    console.log(this.otherAns);
    const sp = e.split("|");
    console.log(e);
    this.questionsAnswer = this.questionsAnswer.map((item: any) => {
      if (
        sp[2] == "KYC_Q0622_0012" &&
        sp[0] != "7ff94f18-7b5a-48ee-aab2-947fcb754da6"
      ) {
        this.otherAns.map((item2: any, index: number) => {
          console.log(item2[sp[2]]);
          if (typeof item2[sp[2]] !== "undefined") {
            item2[sp[2]] = false;
          }
        });
      }

      if (
        sp[2] == "KYC_Q0622_0010" &&
        sp[0] != "49636c88-1c89-4aba-a43e-c61c47e2a4a3"
      ) {
        this.otherAns.map((item2: any, index: number) => {
          console.log(item2[sp[2]]);
          if (typeof item2[sp[2]] !== "undefined") {
            item2[sp[2]] = false;
          }
        });
      }

      if (
        (sp[0] == "7ff94f18-7b5a-48ee-aab2-947fcb754da6" &&
          item.questionCode === sp[2]) ||
        (sp[0] == "1c387b76-2973-4e78-be28-a06649a9f669" &&
          item.questionCode === sp[2])
      ) {
        return {
          ...item,
          other: true,
        };
      } else if (
        (sp[0] == "49636c88-1c89-4aba-a43e-c61c47e2a4a3" &&
          item.questionCode === sp[2]) ||
        (sp[0] == "b4f91cda-5805-48cd-b6a0-07928a7d1056" &&
          item.questionCode === sp[2]) ||
        (sp[0] == "1c387b76-2973-4e78-be28-a06649a9f669" &&
          item.questionCode === sp[2]) ||
        (sp[0] == "4374e074-9379-44f0-a59d-e5c264e35b35" &&
          item.questionCode === sp[2])
      ) {
        return {
          ...item,
          otherText: true,
        };
      } else {
        return {
          ...item,
        };
      }

      // if(this.langs === '/en') {
      //   if (sp[1] == "Other" && item.questionCode === sp[2]) {
      //     return {
      //       ...item,
      //       other: true,
      //     };
      //   } else {
      //     return {
      //       ...item
      //     };
      //   }
      // }
      // else if(this.langs === '/vt') {
      //   if (sp[1] == " Khác" && item.questionCode === sp[2]) {
      //     return {
      //       ...item,
      //       other: true,
      //     };
      //   } else {
      //     return {
      //       ...item
      //     };
      //   }
      // }

      // else if(this.langs === '/cn') {
      //   if (sp[1] == "其他" && item.questionCode === sp[2]) {
      //     return {
      //       ...item,
      //       other: true,
      //     };
      //   } else {
      //     return {
      //       ...item
      //     };
      //   }
      // }
      // else if(this.langs === '/zh') {
      //   if (sp[1] == "其他" && item.questionCode === sp[2]) {
      //     return {
      //       ...item,
      //       other: true,
      //     };
      //   } else {
      //     return {
      //       ...item
      //     };
      //   }
      // }
      // else if(this.langs === '/fr') {
      //   if (sp[1] == "Autre" && item.questionCode === sp[2]) {
      //     return {
      //       ...item,
      //       other: true,
      //     };
      //   } else {
      //     return {
      //       ...item
      //     };
      //   }
      // }
      // else if(this.langs === '/ru') {
      //   if (sp[1] == "Прочее" && item.questionCode === sp[2]) {
      //     return {
      //       ...item,
      //       other: true,
      //     };
      //   } else {
      //     return {
      //       ...item
      //     };
      //   }
      // }
      // else if(this.langs === '/ar') {
      //   if (sp[1] == "غيرها" && item.questionCode === sp[2]) {
      //     return {
      //       ...item,
      //       other: true,
      //     };
      //   } else {
      //     return {
      //       ...item
      //     };
      //   }
      // }
    });
  }
  onOccupation(e: any) {
    const sp = e.split("|");
    console.log(e);
    this.questionsAnswer = this.questionsAnswer.map((item: any) => {
      if (
        (sp[0] == "f2de6d13-17dd-461e-9010-c52665656b22" &&
          item.questionCode === sp[2]) ||
        (sp[0] == "e4b7fe26-18b6-43e0-89e7-93dbe9c37baa" &&
          item.questionCode === sp[2]) ||
        (sp[0] == "55529ea1-7bd2-4391-83d8-2531e3a6355d" &&
          item.questionCode === sp[2])
      ) {
        return {
          ...item,
          otherIndustry: true,
        };
      } else {
        return {
          otherIndustry: false,
          ...item,
        };
      }
    });
  }

  onSuitability(e: any) {
    const sp = e.split("|");
    //sp[0] : 答案  sp[2] //问题

    this.suitableAnswer = this.suitableAnswer.map((item: any) => {
      let ans: any = item.sT_Answers.map((j: any) => {
        if (sp[0] == j.id && j.sT_QuestionID == sp[2]) {
          return {
            ...j,
            is_Selected: true,
          };
        } else if (sp[2] == item.id) {
          return {
            ...j,
            is_Selected: false,
          };
        } else {
          return { ...j };
        }
      });

      return {
        ...item,
        sT_Answers: ans,
      };
    });

    console.log(this.suitableAnswer);
  }

  onSecondSuitability(e: any) {
    const sp = e.split("|");
    //sp[0] : 答案  sp[2] //问题
    this.suitableSecondAnswer = this.suitableSecondAnswer.map((item: any) => {
      let ans: any = item.sT_Answers.map((j: any) => {
        if (sp[0] == j.id && j.sT_QuestionID == sp[2]) {
          return {
            ...j,
            is_Selected: true,
          };
        } else if (sp[2] == item.id) {
          return {
            ...j,
            is_Selected: false,
          };
        } else {
          return { ...j };
        }
      });

      return {
        ...item,
        sT_Answers: ans,
      };
    });

    console.log(this.suitableSecondAnswer);
  }

  // financial information submit
  onSubmit() {
    if (this.validateForm.valid) {
      this.questionLoader = true;
      let datas: any = [];
      let isError = false;
      Object.keys(this.validateForm.value).map((item) => {
        if (
          this.validateForm.value[item] != null &&
          this.validateForm.value[item] != false
        ) {
          const str = item.split("|");
          if (str[0] === "MultipleChoice") {
            const check = this.validateForm.value[item].filter(
              (i: any) => i.checked == true
            );
            this.validateForm.value[item] = this.validateForm.value[item];
            if (check.length <= 0) {
              this.message.error("The answer cannot be blank");
              isError = true;
              return;
            }
            check?.map((item: any) => {
              datas.push({
                type: str[0],
                questionCode: str[1],
                answerID: item.value,
              });
            });
          } else if (str[0] == "Subjective") {
            datas.push({
              type: str[0],
              questionCode: str[1],
              answer: this.validateForm.value[item],
              answerID: undefined,
            });
          } else if (str[0] == "SingleChoice") {
            const qId = `Other|${item.split("|")[1]}`;
            const ans = this.validateForm.value[item].split("|");
            if (this.langs === "/en") {
              datas.push({
                type: str[0],
                questionCode: str[1],
                answerID: ans[0],
                otherAnswer:
                  ans[1] === "Other" ? this.validateForm.value[qId] : undefined,
              });
            } else if (this.langs === "/vt") {
              datas.push({
                type: str[0],
                questionCode: str[1],
                answerID: ans[0],
                otherAnswer:
                  ans[1] === " Khác" ? this.validateForm.value[qId] : undefined,
              });
            } else if (this.langs === "/cn") {
              datas.push({
                type: str[0],
                questionCode: str[1],
                answerID: ans[0],
                otherAnswer:
                  ans[1] === "其他" ? this.validateForm.value[qId] : undefined,
              });
            } else if (this.langs === "/zh") {
              datas.push({
                type: str[0],
                questionCode: str[1],
                answerID: ans[0],
                otherAnswer:
                  ans[1] === "其他" ? this.validateForm.value[qId] : undefined,
              });
            } else if (this.langs === "/fr") {
              datas.push({
                type: str[0],
                questionCode: str[1],
                answerID: ans[0],
                otherAnswer:
                  ans[1] === "Autre" ? this.validateForm.value[qId] : undefined,
              });
            } else if (this.langs === "/ar") {
              datas.push({
                type: str[0],
                questionCode: str[1],
                answerID: ans[0],
                otherAnswer:
                  ans[1] === "غيرها" ? this.validateForm.value[qId] : undefined,
              });
            } else if (this.langs === "/ru") {
              datas.push({
                type: str[0],
                questionCode: str[1],
                answerID: ans[0],
                otherAnswer:
                  ans[1] === "Прочее"
                    ? this.validateForm.value[qId]
                    : undefined,
              });
            }
          }
          else if (str[0] == "dropDownChoice") {
            const qId = `Other|${item.split("|")[1]}`;
            const ans = this.validateForm.value[item].split("|");
            datas.push({
              type: str[0],
              questionCode: str[1],
              answerID: ans[0],
              otherAnswer:
                ans[1] === "Other" ? this.validateForm.value[qId] : undefined,
            });
          }
        }
      });
      if (isError) return;
      let result: any[] = [];
      datas &&
        datas.map((item: any) => {
          const qu = result.filter(
            (r: any) => item.questionCode === r.questionCode
          );
          if (qu.length > 0) {
            result = result.map((i: any) => {
              if (
                i.questionCode === item.questionCode &&
                item.type !== "Subjective"
              ) {
                return {
                  ...i,
                  answerID: [...i.answerID, item.answerID],
                  answer: item.answer,
                };
              }
              return i;
            });
          } else {
            result.push({
              questionCode: item.questionCode,
              answer: item.answer,
              answerID:
                item.type === "Subjective" ? undefined : [item.answerID],
              otherAnswer: item.otherAnswer ? item.otherAnswer : undefined,
            });
          }
        });
      this.api
        .UploadQuestionnaireById({
          customerId: this.customerId,
          selectedQuestion: result,
        } as QuestionParams)
        .subscribe(
          (res: any) => {
            console.log(res);
            if (res.statusCode === 100) {
             this.current = 2
            // this.router.navigateByUrl(`${this.langs}/profile/verification`);
              this.questionLoader = false;
            } else {
              this.questionLoader = false;
              this.message.error(res.message);
            }
          },
          (error) => {
            this.questionLoader = false;
            this.message.error(error?.body?.message);
          }
          // (err:any) => {
          //   let errList = '';
          //   for (var key of Object?.keys(err?.error?.errors)) {
          //     for (let i = 0; i < err?.error?.errors[key].length; i++) {
          //       errList += err.error.errors[key][i];
          //     }
          //   }
          //   this.message.error(errList);
          //   this.questionLoader = false
          // }
        );
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
          this.message.error(
            this.i18nSev.i18n("Please type the required fields")
          );
          this.scroll();
          this.questionLoader = false;
        }
      });
    }
  }

  // Suitability Test
  suitabilitySubmit() {
    if (this.SuitableForm.valid) {
      this.api
        .UploadSuitable({
          id: this.suitableId,
          level: this.suitableLevel,
          result: 1,
          toTest: true,
          sT_Questions: this.suitableAnswer || this.suitableSecondAnswer,
        } as SuitabilityTest)
        .subscribe((res: any) => {
          this.suitableId = res?.data?.newTest?.id;
          this.suitableLevel = res?.data?.newTest?.level;
          if (res.data.result === 111) {
            this.current = 3;
            this.getCustomerById();
            this.getKYCSettingByClientId(this.customerVersion?.customer_ID);
            this.message.success("You have passed the suitability test.");
          } else if (res?.data?.is_NewTest_Required) {
            this.isSecondAnswer = true;
            this.message.error(res?.data?.message);
            let datasSecond = res?.data?.newTest?.sT_Questions;
            this.suitableSecondAnswer = datasSecond;
            datasSecond.map((item: any) => {
              this.SuitableForm.addControl(
                `answerTypeSecond|${item.id}`,
                new FormControl(null, Validators.required)
              );
            });
          } else {
            this.supportModal = true;
          }
        });
    } else {
      Object.values(this.SuitableForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
          this.message.error(
            this.i18nSev.i18n("Please select the required valid answer")
          );
          this.scroll();
        }
      });
    }
  }

  suitabilitySecondSubmit() {
    if (this.SuitableForm.valid) {
      this.api
        .UploadSuitable({
          id: this.suitableId,
          level: this.suitableLevel,
          result: 1,
          toTest: true,
          sT_Questions: this.suitableSecondAnswer,
        } as SuitabilityTest)
        .subscribe((res: any) => {
          this.suitableId = res?.data?.newTest?.id;
          this.suitableLevel = res?.data?.newTest?.level;
          if (res.data.result === 111) {
            this.current = 3;
            this.getCustomerById();
            this.getKYCSettingByClientId(this.customerVersion?.customer_ID);
            this.message.success("You have passed the suitability test.");
          } else {
            this.supportModal = true;
          }
        });
    } else {
      Object.values(this.SuitableForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
          this.message.error(
            this.i18nSev.i18n("Please select the required valid answer")
          );
          this.scroll();
        }
      });
    }
  }
  nzOnChange(e: any, arr: string) {
    console.log(e, arr);
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    }
    return {};
  };

  pepChange(event: any) {
    console.log(event);
  }

  // take a live photo function start here

  passportcamOn() {
    this.passportCam = !this.passportCam;
  }
  private trigger: Subject<void> = new Subject<void>();

  triggerSnapshot(): void {
    this.trigger.next();
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  handleImage(webcamImage: WebcamImage): void {
    console.log(webcamImage);
    let imgData = webcamImage.imageAsDataUrl;
    this.passportFileList = [
      { uid: "-1", name: "file.name", status: "done", url: imgData },
    ];
    this.passportCam = false;
  }

  goContact() {
    this.router.navigateByUrl(`${this.langs}/support`);
  }

  goUpload() {
    this.current = 3;
  }

  generateLink() {
    this.loader = true;
    this.api
      .ResendEmailVerificationOTP(this.tokenSrv.get()?.login_id)
      .subscribe(
        (res: any) => {
          this.loader = false;
          this.message.success(
            this.i18nSev.i18n(
              "A verification link and code has been sent to your email account"
            )
          );
          this.hideOtp = true;
        },
        (error) => {
          this.hideOtp = true;
          this.loader = false;
          this.message.error(error?.body?.message);
        }
      );
  }

  validateConcentAge() {
    const dateOfBirth = moment(
      this.personalForm.value.date,
      "DD/MM/YYYY"
    ).format("YYYY-MM-DD"); // Format: MM-DD-YYYY
    const currentDate = moment().format("YYYY-MM-DD"); // Current date
    const ageDifference = this.calculateAgeDifference(dateOfBirth, currentDate);
    if (ageDifference.years >= 60 && ageDifference.years < 100) {
      this.isConcentChecked = false;
      this.isConsentGiven = false;
      // this.isVisibleConsent = true;
    } else if (ageDifference.years >= 100) {
      this.personalForm.controls["date"].errors;
    }
  }

  calculateAgeDifference(dateOfBirth: string, currentDate: string) {
    const dob = moment(dateOfBirth);
    const now = moment(currentDate);

    const years = now.diff(dob, "years");
    dob.add(years, "years"); // Move to the next birthday
    const months = now.diff(dob, "months");
    dob.add(months, "months"); // Move to the next month

    const days = now.diff(dob, "days");

    return {
      years,
      months,
      days,
    };
  }

  acceptDeclaration() {
    this.consentAcceptanceLoader = true;
    const body = {
      isAggreed: 111, // 100 - NONE , 111 - AGREE, 110 - DISAGREE
    };
    this.api.acceptDeclaration(body).subscribe(
      (res: any) => {
        this.consentAcceptanceLoader = false;
        this.isConsentGiven = true;
        this.isVisibleConsent = false;
        this.message.success(this.i18nSev.i18n("Your consent has been saved."));
      },
      (error) => {
        this.consentAcceptanceLoader = false;
        this.message.error(error?.body?.message);
      }
    );
  }

  onOtpChange(otp: any) {
    if (otp.length == 6) {
      this.emailOtp = otp;
      this.showOtpError = false;
    }
  }
  verifyLoader: boolean = false;
  selectedValue = "lucy";
  verify() {
    if (this.emailOtp == null) {
      this.showOtpError = true;
    } else {
      this.showOtpError = false;
    }
    if (!this.showOtpError) {
      this.verifyLoader = true;
      let formData = {
        login_ID: this.tokenSrv.get()?.login_id,
        customer_ID: this.tokenSrv.get()?.customer_id,
        otp: this.emailOtp,
      };
      this.api.VerifyRegisteredCustomerOTP(formData).subscribe(
        (res: any) => {
          if (res.data) {
            this.router.navigateByUrl(`${this.langs}/dashboard`);
            this.message.success(
              this.i18nSev.i18n("you have verified your email successfully")
            );
            this.getCustomerById();
            this.verifyLoader = false;
            this.hideOtp = false;
          }
        },
        (error) => {
          this.verifyLoader = false;
          this.message.error(error?.body?.message);
        }
      );
    }
  }

  voterFileList: NzUploadFile[] = [];
  votereBackFileList: NzUploadFile[] = [];
  voterLoading: boolean = false;
  voterLoadingBackLoading: boolean = false;
  voterFile!: NzUploadFile;
  voterBackFile!: NzUploadFile;
  voterPreviewVisible = false;

  voterBackPreviewVisible = false;
  voterPreviewImage: string | undefined = "";

  voterbackPreviewImage: string | undefined = "";

  voterIdeBeforeUpload = (file: NzUploadFile): boolean => {
    this.voterLoading = true;
    this.voterFile = file;
    this.api.fileUpload(file, file.name).subscribe(
      (res: any) => {
        this.voterLoading = false;
        this.voterPreviewImage = res.data.filePath;
        this.voterFileList = [
          {
            uid: "-1",
            name: file.name,
            status: "done",
            url: res.data.filePath,
          },
        ];
      },
      (error) => {
        this.voterLoading = false;
      }
    );
    return false;
  };

  voterIdeBeforeUploadBackBeforeUpload = (file: NzUploadFile): boolean => {
    this.voterLoadingBackLoading = true;
    this.voterBackFile = file;
    this.api.fileUpload(file, file.name).subscribe(
      (res: any) => {
        this.voterLoadingBackLoading = false;
        this.voterbackPreviewImage = res.data.filePath;
        this.votereBackFileList = [
          {
            uid: "-1",
            name: file.name,
            status: "done",
            url: res.data.filePath,
          },
        ];
      },
      (error) => {
        this.voterLoadingBackLoading = false;
      }
    );
    return false;
  };

  handleVoterPreview = async (file: NzUploadFile): Promise<void> => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj!);
    }
    this.voterPreviewImage = file.url || file.preview;
    this.drivingLicensePreviewVisible = true;
  };

  handleVoterBackPreview = async (file: NzUploadFile): Promise<void> => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj!);
    }
    this.voterbackPreviewImage = file.url || file.preview;
    this.drivingLicenseBackPreviewVisible = true;
  };

  handleVoterRemove(file: any) {
    this.voterFileList = [];
    return true;
  }

  handleVoterBackRemove(file: any) {
    this.votereBackFileList = [];
    return true;
  }

  // document signature 
  signPad:boolean = false
  checked = false
  pdfDocument:boolean = false
  pdfSrc: any;
  showPad(e:any) {
    if(e) {
      this.signPad = true
    } else {
      this.signPad = false
    }
  }

  loadPdf() {
    const url = 'https://globalportal-api.trive.com/app_contents/agreement_doc/additionaltermsandconditionsriskdisclosure.pdf';
    this.http.get(url, { responseType: 'blob' }).subscribe((res) => {
      const fileURL = URL.createObjectURL(res);
      this.pdfSrc = fileURL;
    });
  }

  openPdf() {
    this.pdfDocument = true
    this.loadPdf()
  }

  cancelDoc():void {
    this.pdfDocument = false
  }

  // signature pad
 
  isEmpty() {
    console.log('is empty', this.signaturePad.isEmpty());
  }

  savePng() {
    const data = this.signaturePad.toDataURL();
    console.log(data);
  }

  saveJpg() {
    const data = this.signaturePad.toDataURL("image/jpeg");
    console.log(data);
  }

  saveSvg() {
    const data = this.signaturePad.toDataURL("image/svg+xml");
    console.log(data);
  }

  saveArray() {
    const data = this.signaturePad.toData();
    console.log(data);
    console.log(JSON.stringify(data));
  }

  clear() {
    this.signaturePad.clear();
  }

  revert() {
    this.signaturePad.revert()
  }

  // changeOptions() {
  //   this.options = {
  //     minWidth: 1,
  //     maxWidth: 3,
  //     penColor: "rgb(0, 0, 0)"
  //   };
  // }

  setSigArray() {
    let jsonString = '[{"color":"rgb(66, 133, 244)","points":[{"time":1582940095394,"x":267,"y":116}]},{"color":"rgb(66, 133, 244)","points":[{"time":1582940096537,"x":297,"y":115}]},{"color":"rgb(66, 133, 244)","points":[{"time":1582940097774,"x":239,"y":135},{"time":1582940097853,"x":240,"y":141},{"time":1582940097885,"x":242,"y":148},{"time":1582940097918,"x":244,"y":153},{"time":1582940097983,"x":248,"y":158},{"time":1582940098033,"x":252,"y":162},{"time":1582940098064,"x":257,"y":165},{"time":1582940098112,"x":264,"y":167},{"time":1582940098144,"x":271,"y":167},{"time":1582940098177,"x":284,"y":168},{"time":1582940098210,"x":295,"y":168},{"time":1582940098244,"x":302,"y":165},{"time":1582940098277,"x":309,"y":161},{"time":1582940098311,"x":315,"y":156},{"time":1582940098343,"x":322,"y":148},{"time":1582940098376,"x":325,"y":142},{"time":1582940098392,"x":330,"y":136},{"time":1582940098442,"x":333,"y":131}]}]';
    this.signaturePad.fromData(JSON.parse(jsonString));
  }

  //
  setSigString() {
    this.signaturePad.fromDataURL("data:image/png;base64,iVBORw...");
    console.log(this.signaturePad.fromDataURL())
  }

  agreeSubmit() {
      if(this.signaturePad.isEmpty()) {
        this.message.error(this.i18nSev.i18n("Please add Signature to submit"))
      } else {
        this.signLoader = true
        const data = this.signaturePad.toDataURL();
        let body = {
          signatureBase64: data
        }
        this.api.saveSignSendEmail(body).subscribe((res:any)=> {
          if(res.statusCode === 100) {
            console.log(data);
            this.clear();
            this.signLoader = false;
            this.router.navigateByUrl(`${this.langs}/profile/verification`);
            this.message.success(this.i18nSev.i18n("Your signature details added successfully"))
          } else {
              this.signLoader = false;
              this.message.error(res.message);
              console.log(data);
          }
        },
        (error) => {
          this.signLoader = false;
          this.message.error(error?.body?.message);
        }
        )
      }
  }
  

  gotPersonalStep() {
    this.current = 1
  }
  
    nextAgree() {
    this.current = 3
  }


}