import {
  Component,
  Inject,
  Injector,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
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
import {
  DocumentItemParams,
  IDocumentParams,
  QuestionParams,
  SuitabilityTest,
  IDocumentParamspov
} from "src/app/models/profile";
import { ApiService } from "src/app/services/api.service";
import { WebcamImage } from "ngx-webcam";

import { ImageRequirementModalComponent } from "../image-requirement-modal/image-requirement-modal.component";
import { prefixDefault } from "../phone";

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
  templateUrl: "./profile-suit.component.html",
  styleUrls: ["./profile-suit.component.less"],
})
export class ProfileSuitComponent implements OnInit {
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
  customerParams: IDocumentParamspov = {} as IDocumentParamspov;
  customerVersion: any;
  settingByClientParms!: any;
  phones: any = prefixDefault;
  avatarUrl?: string;
  langs = this.i18nSev.i18nUrl();
  suitableId: any;
  suitableLevel: any;
  supportModal: boolean = false;
  // eslint-disable-next-line prettier/prettier
  mobilePattern = "^(?:[0-9] ?){6,14}[0-9]$";
  questionsAnswer: any = [];
  suitableAnswer: any = [];
  passportCam: boolean = false;
  isSecondAnswer:boolean = false
  suitableSecondAnswer: any = [];
  toggleCollapse(): void {
    this.isCollapse = !this.isCollapse;
    this.controlArray.forEach((c, index) => {
      c.show = this.isCollapse ? index < 6 : true;
    });
  }

  resetForm(): void {
    this.validateForm.reset();
  }

  constructor(
    private settings: SettingsService,
    private fb: FormBuilder,
    private api: ApiService,
    private injector: Injector,
    private modal: NzModalService,
    private message: NzMessageService,
    private router: Router,
    private i18nSev: I18NService
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
  ngOnInit(): void {
    this.validateForm = this.fb.group({});
    this.SuitableForm = this.fb.group({});
    this.personalForm = this.fb.group({
      customer_FirstName: [
        null,
        [Validators.required, Validators.pattern("^[A-Za-z ]+$")],
      ],
      customer_MiddleName: [null, [Validators.pattern("^[A-Za-z ]+$")]],
      customer_LastName: [
        null,
        [Validators.required, Validators.pattern("^[A-Za-z ]+$")],
      ],
      email: [null, [Validators.email, Validators.required]],
      customer_TIN: [null],
      customer_Passport: [null],
      date: [null, [Validators.required, this.dateValidator]],
      nationality: [null, [Validators.required]],
      gender: ["null", [Validators.required]],
      phoneNumber: ["", [Validators.required, this.phoneNumberValidator]],
      phoneNumberPrefix: ["+971"],
      customer_Address: [null, [Validators.required]],
      street: [null, [Validators.required]],
      country: [null, [Validators.required]],
      state: [null, [Validators.required]],
      city: [null, [Validators.required]],
      zipCode: [null, [Validators.required]],
      customer_ApartmentNumber: [null],
      tpi: [null],
      is_USCitizen: [false],
      is_PEP: [false],
      trading_Platform: [null],
    });

    this.documentForm = this.fb.group({
      documentType: ["Passport", [Validators.required]],
    });
    this.api.getAllCountries().subscribe((res: any) => {
      this.nationality = res.data.map((item: any) => ({
        ...item,
        img: `${environment.api.baseUrl}/app_contents/country_flag/${item.code}.svg`,
      }));
    });

    this.api.getAllCountries().subscribe((res: any) => {
      this.nationality1 = res.data.map((item: any) => ({
        ...item,
        img: `${environment.api.baseUrl}/app_contents/country_flag/${item.code}.svg`,
      }));
    });
    this.getSuitabilityAnswer()
    this.api.getUserInfo(this.tokenSrv.get()?.customer_id).subscribe((res: any) => {
       if (res?.data?.suitabilityTest_Result == 111) {
        this.current = 1
        return;
      } 
    });

    // this.api.getCustomerProfile().subscribe((res:any)=> {
    //   let data = res?.data[0];
    // })
    // this.getCustomerById();
    // this.api.getCustomerProfile().subscribe((res: any) => {
    //   let data = res?.data[0];
    //   if (data?.customer_Type === "CTJNT_0002_0422") {
    //     if (
    //       data?.verification_Status == "InProgress" &&
    //       data?.customer_Status == "Pending" &&
    //       data?.kyC_QuestionnaireStatus == "Completed"
    //     ) {
    //       this.router.navigateByUrl(`${this.langs}/profile/verification`);
    //     } else {
    //       this.router.navigateByUrl(`${this.langs}/profile-joint`);
    //     }
    //   } else if (data?.customer_Type === "CTINDV_0001_0422") {
    //     if (
    //       data?.verification_Status == "InProgress" &&
    //       data?.customer_Status == "Pending" &&
    //       data?.kyC_QuestionnaireStatus == "Completed"
    //     ) {
    //       this.router.navigateByUrl(`${this.langs}/profile/verification`);
    //     } else if (
    //       (data?.verification_Status == "Completed" &&
    //         data?.customer_Status == "Verified") ||
    //       data?.customer_Status == "Active" ||
    //       (data?.customer_Status == "Funded" &&
    //         data?.kyC_QuestionnaireStatus == "Completed")
    //     ) {
    //       this.router.navigateByUrl(
    //         `${this.langs}/profile/verification-information`
    //       );
    //       return;
    //     } else if (data?.customer_Status == "SuitabilityTestFailed") {
    //       this.supportModal = true;
    //       return;
    //     } else {
    //       this.router.navigateByUrl(`${this.langs}/profile`);
    //     }
    //   }
    //   //  if(data?.customer_Type === 'CTJNT_0002_0422' && data?.verification_Status == 'InProgress' &&
    //   //  data?.customer_Status == 'Pending' &&
    //   //  data?.kyC_QuestionnaireStatus == 'Completed') {
    //   //   this.router.navigateByUrl(`${this.langs}/profile/verification`);
    //   //  } else if (data?.customer_Type === 'CTINDV_0001_0422' && data?.verification_Status !== 'InProgress' &&
    //   //  data?.customer_Status !== 'Pending' &&
    //   //  data?.kyC_QuestionnaireStatus !== 'Completed' || data?.customer_Status == 'Rejected') {
    //   //      this.router.navigateByUrl(`${this.langs}/profile`);
    //   //  }
    //   //  else if(data?.customer_Type === 'CTJNT_0002_0422') {
    //   //   this.router.navigateByUrl(`${this.langs}/profile-joint`);
    //   //  }
    //   //  else {
    //   //   this.router.navigateByUrl(`${this.langs}/profile-joint`);
    //   //  }
    // });
  }
  personalSubmit() {
    if (this.personalForm.valid) {
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
      this.api
        .saveCustomer(this.customerId, {
          customer_FirstName: customer_FirstName,
          customer_MiddleName: customer_MiddleName,
          customer_LastName: customer_LastName,
          customer_Mobile: `${phoneNumberPrefix} ${phoneNumber}`,
          customer_Email: email,
          customer_Gender: gender,
          customer_DoB: date,
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
          (res) => {
            this.current = 1;
            //第3步之前 获取
            this.getQuestionsAnswer();
          },
          (err) => {
            let errList = "";
            for (var key of Object.keys(err.error?.errors)) {
              for (let i = 0; i < err.error.errors[key].length; i++) {
                errList += err.error.errors[key][i];
              }
            }
            this.message.error(errList);
          }
        );
    } else {
      Object.values(this.personalForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  nzOnCancel(modelRef: NzModalRef) {
    // this.documentForm.reset();
    this.current = this.current - 1;
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
        this.message.error("Image must smaller than 2MB!");
        observer.complete();
        return;
      }
      observer.next(isJpgOrPng && isLt2M);
      observer.complete();
    });

  async documnetSubmit() {
    let upload_Document:any;
    const type = this.documentForm.value?.documentType;
    //ticket changes for CPTI-98 AddressProff obligatory
    if (this.passportFileList.length > 0) {
        upload_Document = {
          documentType: "Address Proof",
          frontSide_FileName: this.passportFileList[0]?.name,
          frontSide_FilePath: this.passportFileList[0]?.url,
          backSide_FileName: '',
          backSide_FilePath: ''
        }
    }

    if (this.documentForm.valid) {
      this.loaddingSumbit = true;
  
      this.api
        .UploadPOADocumentsById(upload_Document)
        .subscribe(
          (res) => {
            this.router.navigateByUrl(`${this.langs}/profile/verification-suit`);
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

  dateValidator = (control: FormControl): { [s: string]: boolean } => {
    const re = differenceInYears(new Date(control.value), new Date()) <= -18;
    if (!control.value) {
      return { required: true };
    } else if (!re) {
      return { pattern: true, error: true };
    }
    return {};
  };

  getCustomerById() {
    this.prfoleloading = true;
    this.customerId = this.tokenSrv.get()?.customer_id;
    this.api.getCustomerProfile().subscribe((res: any) => {
      this.prfoleloading = false;
      if (
        res.data[0]?.verification_Status == "InProgress" &&
        res.data[0]?.customer_Status == "Pending" &&
        res.data[0]?.kyC_QuestionnaireStatus == "Completed"
      ) {
        this.router.navigateByUrl(`${this.langs}/profile/verification`);
        return;
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
      const data = res.data[0];
      const phone = res.data[0].customer_Mobile;
      const phoneNumberPrefix = phone ? phone?.split(" ")[0] : "";
      const tpi = res.data[0].tax_PayerIdentification;

      phoneNumberPrefix &&
        this.personalForm.get("phoneNumberPrefix")?.setValue(phoneNumberPrefix);

      const phoneNumber = phone && phone?.split(" ")[1];

      this.customerVersion = {
        ...data,
        phoneNumberPrefix,
        phoneNumber,
        tpi,
      };

      const type = ["Passport", "Driving License", "National ID"];

      data?.documents?.map((item: any) => {
        if (type.indexOf(item.document_Type) !== -1) {
          this.documentForm.get("documentType")?.setValue(item.document_Type);
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

  statusCode: boolean = false;
  getKYCSettingByClientId(customerId: string) {
    this.api.getKYCSettingByClientId(customerId).subscribe(
      (res: any) => {
        this.statusCode = false;
        const { kyC_SettingsID, kyC_TypeID } = res.data;
        this.customerParams = {
          kyC_SettingsID,
          kyC_TypeID,
        } as IDocumentParams;

        console.log(res.data);
        this.settingByClientParms = res.data;
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
    const sp = e.split("|");
    this.questionsAnswer = this.questionsAnswer.map((item: any) => {
      if (sp[1] == "Other" && item.questionCode === sp[2]) {
        return {
          ...item,
          other: true,
        };
      } else {
        return {
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
          return {...j};
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
          return {...j};
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
        .subscribe((res) => {
          this.current = 2;
          this.getSuitabilityAnswer();
        });
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  // Suitability Test
  suitabilitySubmit() {
    if (this.SuitableForm.valid) {
      this.api
        .UploadSuitableExist({
          id: this.suitableId,
          level: this.suitableLevel,
          result: 1,
          toTest: true,
          sT_Questions: this.suitableAnswer,
        } as SuitabilityTest)
        .subscribe((res: any) => {
          this.suitableId = res?.data?.newTest?.id;
          this.suitableLevel = res?.data?.newTest?.level;
          if (res.data.result === 111) {
            this.current = 1;
            this.message.success('You have passed the suitability test.')
          } else if (res?.data?.is_NewTest_Required) {
            this.isSecondAnswer = true
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
        }
      });
    }
  }

  suitabilitySecondSubmit() {
    if (this.SuitableForm.valid) {
      this.api
        .UploadSuitableExist({
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
            this.current = 1;
            this.message.success('You have passed the suitability test.')
          } else {
            this.supportModal = true;
          }
        });
    } else {
      Object.values(this.SuitableForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
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
}
