import {
  Component,
  Inject,
  Injector,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import {
  FormArray,
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
} from "src/app/models/profile";
import { ApiService } from "src/app/services/api.service";
import { WebcamImage } from "ngx-webcam";

import { ImageRequirementModalComponent } from "../image-requirement-modal/image-requirement-modal.component";
import { prefixDefault } from "../phone";

import { NzFormTooltipIcon } from "ng-zorro-antd/form";
import { dataTool } from "echarts";

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
  selector: "app-profile-institute",
  templateUrl: "./profile-institute.component.html",
  styleUrls: ["./profile-institute.component.less"],
})
export class profileInstituteComponent implements OnInit {
  loaderCompany!:boolean
  registeredEmail!:boolean 
  loader:boolean | undefined
  directorForm ={} as FormGroup
  shareForm ={} as FormGroup
  isValidDirectorFormSubmitted: boolean | null = null;
  isValidShareFormSubmitted: boolean | null = null;
  @ViewChild("imageRequirementModalComponent")
  settingModalComponent!: ImageRequirementModalComponent;
  loaddingSumbit = false;
  langs = this.i18nSev.i18nUrl();
  phones: any = prefixDefault;
  individual: boolean = true;
  personalForm!: FormGroup;
  repFrom!: FormGroup;
  controlArray: Array<{ index: number; show: boolean }> = [];
  isCollapse = true;
  current = 0;
  customerId!: string;
  nationality: nationalityOption[] = [] as nationalityOption[];
  nationality1: nationalityOption1[] = [] as nationalityOption1[];

  loading: boolean = false;
  prfoleloading: boolean = false;

  customerParams: IDocumentParams = {} as IDocumentParams;
  customerVersion: any;
  companyVersion: any;
  reprentiveVersion: any;
  companyDetails:any;
  questionsAnswer: any = [];
  suitableAnswer: any = [];
  passportCam: boolean = false;
  business: boolean = true;
  authorized:boolean = true;
  usNatioanl:boolean = true
  stock: boolean = true;
  euComp: boolean = true;
  classificationTest_Result: any = [];
  initialFunding: any = [];
  authPerson: any = [];
  thirdParty: any = [];
  ftca: any = [];
  hideQA: any = [];
  hideOtherAns: any = [];
  multiSelect: any = [];
  multiSelectCatReq: any = [];
  multiError: any = false;
  checkboxError: any = false;
  registerForm!: FormGroup;
  companyList: any = [];
  validateForm!: FormGroup;
  documentForm!: FormGroup;
  toggleCollapse(): void {
    this.isCollapse = !this.isCollapse;
    this.controlArray.forEach((c, index) => {
      c.show = this.isCollapse ? index < 6 : true;
    });
  }


  submitForm(): void {}

  captchaTooltipIcon: NzFormTooltipIcon = {
    type: "info-circle",
    theme: "twotone",
  };
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
    this.directorForm = this.fb.group({
			directors: this.fb.array(
				[this.createDirectorFormGroup()],
				[Validators.required, Validators.maxLength(5)])
		});

    this.shareForm = this.fb.group({
			shares: this.fb.array(
				[this.createShareFormGroup()],
				[Validators.required, Validators.maxLength(5)])
		});

    this.documentForm = this.fb.group({
      documentType: ["Passport", [Validators.required]],
    });
    this.validateForm = this.fb.group({});
    this.personalForm = this.fb.group({
      place_Of_Business: [null, [Validators.required]],
      principal_Business_Activity: [null, [Validators.required]],
      tax_Domicile: [null, [Validators.required]],
      tax_Identification_Number: [null],
      legal_Entity_Identifier: [null, [Validators.required]],
      client_Representative_Name: [null, [Validators.required]],
      representative_Position: [null, [Validators.required]],
      shareholding_Type: [null, [Validators.required]],
      nature_Of_Business: [null, [Validators.required]],
      registered_Address: [null, [Validators.required]],
      street_Name: [null, [Validators.required]],
      building_Name: [null, [Validators.required]],
      unit_No: [null, [Validators.required]],
      zip_Code: [null, [Validators.required]],
      is_Business_Address_Same: [false],
      b_Street_Name: [null],
      b_Building_Name: [null],
      b_Unit_No: [null],
      b_Zip_Code: [null],
      is_Authorized: [true],
      regulatory_Body:[null],
      ref_Number:[null],
      is_US_Citizen: [true],
    });

    this.repFrom = this.fb.group({
      first_Name: [null, [Validators.required]],
      last_Name: [null, [Validators.required]],
      dob: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      phoneNumberPrefix: ['+971'],
      phoneNumber: ["", [Validators.required, this.phoneNumberValidator]],
      passportNumber: [null, [Validators.required]],
      resudential_Address:[null, [Validators.required]],
      is_Politically_Exposed_Person: [true],
      is_US_National: [true],
      fatca: [null],
      crs: [null],
    })

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
    // this.getClassificationTestAnswer();
    this.getCustomerById();
    // this.getPersonalBankDetails()
    //  this.getCustomerByEmail();
    this.getCustomerProfie();
   // this.getCompany();
    this.getRepresenative();
    this.getQuestionsAnswer();
   this.GetShareholdersDetail();
  }

  // get company data
getCompany() {
  this.api.getCompany().subscribe((res:any)=> {
    this.companyVersion = res.data
  })
 }

// get company data
getRepresenative() {
  this.api.GetRepresentativeDetail().subscribe((res:any)=> {
    const data = res.data;
    this.reprentiveVersion = data
    const phone = data.phoneNumber;
    const phoneNumberPrefix = phone ? phone?.split(" ")[0] : "";
    phoneNumberPrefix &&
    this.repFrom.get("phoneNumberPrefix")?.setValue(phoneNumberPrefix);
    const phoneNumber = phone && phone?.split(" ")[1];
    this.reprentiveVersion = {
      ...data,
      phoneNumberPrefix,
      phoneNumber,
    }
  })
 }

 GetShareholdersDetail() {
  this.api.GetShareholdersDetail().subscribe((res:any)=> {
    const data = res.data;
  })
 }

 // get question
 getQuestionsAnswer() {
  this.api
    .getKYCQuestionsAnswerByKYCType()
    .subscribe((res: any) => {
      let datas = res.data;
      datas = datas.map((r: any) => {
        if (r.type == "SingleChoice") {
          let answersOthers: any = r.answers;
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


  // customer profile
  getCustomerProfie() {
    this.prfoleloading = true;
    this.api.getCustomerProfile().subscribe((res: any) => {
      this.prfoleloading = false;
      let data = res?.data[0];
      if (
        data?.verification_Status == "InProgress" &&
        data?.customer_Status == "" &&
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
      }


      else if (data?.customer_Status == "CompanyDetailCompleted") {
        this.current = 1
        this.getCompany();
        return;
      }

        else if (data?.customer_Status == "DirectorDetailCompleted") {
        this.current = 2
        this.getRepresenative();
        return;
      }

      else if (data?.customer_Status == "RepresentativeDetailCompleted") {
        this.current = 3
        this.GetShareholdersDetail();
        return;
      }

      else if (data?.customer_Status == "ShareholderDetailCompleted") {
        this.current = 4
        return;
      }
      
      else if (data?.customer_Status == "FinInfoCompleted") {
        this.current = 5
        return;
      }

      else if (data?.customer_Status == "Pending") {
        this.router.navigateByUrl(`${this.langs}/profile/verification`);
      }
      

       /* else if (data?.customer_Status == "Registered") {
          this.profileFirst = true
        }*/


        else if (data?.customer_Status == "ProfileCompleted") {
          this.current = 1;
           return;
         }

      else {
      //  this.router.navigateByUrl(`${this.langs}/profile`);
      }
    });
  }

  personalSubmit() {
    if (this.personalForm.valid) {
      const {
      place_Of_Business,
      principal_Business_Activity,
      tax_Domicile,
      tax_Identification_Number,
      legal_Entity_Identifier,
      client_Representative_Name,
      representative_Position,
      shareholding_Type,
      nature_Of_Business,
      registered_Address,
      street_Name,
      building_Name,
      unit_No,
      zip_Code,
      is_Business_Address_Same,
      b_Street_Name,
      b_Building_Name,
      b_Unit_No,
      b_Zip_Code,
      is_Authorized,
      regulatory_Body,
      ref_Number,
      is_US_Citizen,
      } = this.personalForm.value;

      this.api
        .saveCompany({
          place_Of_Business: place_Of_Business,
          principal_Business_Activity: principal_Business_Activity,
          tax_Domicile: tax_Domicile,
          tax_Identification_Number: tax_Identification_Number,
          legal_Entity_Identifier: legal_Entity_Identifier,
          client_Representative_Name: client_Representative_Name,
          representative_Position: representative_Position,
          shareholding_Type: shareholding_Type,
          nature_Of_Business: nature_Of_Business,
          registered_Address: registered_Address,
          street_Name: street_Name,
          building_Name: building_Name,
          unit_No: unit_No,
          zip_Code: zip_Code,
          is_Business_Address_Same: is_Business_Address_Same,
          b_Street_Name: b_Street_Name,
          b_Building_Name: b_Building_Name,
          b_Unit_No: b_Unit_No,
          b_Zip_Code: b_Zip_Code,
          is_Authorized: is_Authorized,
          regulatory_Body: regulatory_Body,
          ref_Number: ref_Number,
          is_US_Citizen: is_US_Citizen
        })
        .subscribe(
          (res: any) => {
            this.current = 1;
            //第3步之前 获取
        //    this.geClassificationTest()
          },
          (err: any) => {
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
          this.message.error(this.i18nSev.i18n('Please fill the required fields'));
          this.scroll();
        }
      });
    }
  }

  // error form scroll to top
  scroll() {
    let  abc:any = document.getElementById("scroll-error");
    abc.scrollIntoView({
      behavior: 'smooth'
    });
  }


  directorSubmit() {
    this.current = 2
  }

  reprensativeSubmit() {
    if (this.repFrom.valid) {
      const {
        first_Name,
        last_Name,
        dob,
        email,
        phoneNumberPrefix,
        phoneNumber,
        passportNumber,
        resudential_Address,
        is_Politically_Exposed_Person,
        is_US_National,
        fatca,
        crs,
      } = this.repFrom.value;

      this.api
        .saveRepresentative({
          id: this.reprentiveVersion?.id,
          first_Name: first_Name,
          last_Name: last_Name,
          dob: dob,
          email: email,
          resudential_Address: resudential_Address,
          phoneNumber:  `${phoneNumberPrefix} ${phoneNumber}`,
          passportNumber: passportNumber,
          is_Politically_Exposed_Person: is_Politically_Exposed_Person,
          is_US_National: is_US_National,
          fatca: fatca,
          crs: crs
        })
        .subscribe(
          (res: any) => {
            this.current = 3;
            //第3步之前 获取
        //    this.geClassificationTest()
          },
          (err: any) => {
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
      Object.values(this.repFrom.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
          this.message.error(this.i18nSev.i18n('Please fill the required fields'));
          this.scroll();
        }
      });
    }
  }

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
        .UploadQuestionnaireCompany({
          selectedQuestion: result,
        } as QuestionParams)
        .subscribe((res) => {
          this.current = 5;
        //  this.getSuitabilityAnswer();
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


  async documnetSubmit() {
    let upload_Document = [];
    const type = this.documentForm.value?.documentType;
    if (this.incorpFileList.length <= 0) {
      this.message.error("Please Upload required Documents");
      this.scroll();
      return;
    }
    if (this.incorpFileList.length > 0) {
      upload_Document.push({
        documentType: "Certificate of incorporation or equivalent",
        frontSide_FileName: this.incorpFileList[0]?.name,
        frontSide_FilePath: this.incorpFileList[0]?.url,
        backSide_FileName: '',
        backSide_FilePath: '',
      });
    }

    if (this.memoFileList.length <= 0) {
      this.message.error("Please Upload required Documents");
      this.scroll();
      return;
    }
    if (this.memoFileList.length > 0) {
      upload_Document.push({
        documentType: "Memorandum and Articles of Association",
        frontSide_FileName: this.memoFileList[0]?.name,
        frontSide_FilePath: this.memoFileList[0]?.url,
        backSide_FileName: '',
        backSide_FilePath: '',
      });
    }

    if (this.proofFileList.length <= 0) {
      this.message.error("Please Upload required Documents");
      this.scroll();
      return;
    }
    if (this.proofFileList.length > 0) {
      upload_Document.push({
        documentType: "Proof of Residence",
        frontSide_FileName: this.proofFileList[0]?.name,
        frontSide_FilePath: this.proofFileList[0]?.url,
        backSide_FileName: '',
        backSide_FilePath: '',
      });
    }

    if (this.lcFileList.length <= 0) {
      this.message.error("Please Upload required Documents");
      this.scroll();
      return;
    }
    if (this.lcFileList.length > 0) {
      upload_Document.push({
        documentType: "License",
        frontSide_FileName: this.lcFileList[0]?.name,
        frontSide_FilePath: this.lcFileList[0]?.url,
        backSide_FileName: '',
        backSide_FilePath: '',
      });
    }

    if (this.ownerFileList.length <= 0) {
      this.message.error("Please Upload required Documents");
      this.scroll();
      return;
    }
    if (this.ownerFileList.length > 0) {
      upload_Document.push({
        documentType: "Ownership Chart",
        frontSide_FileName: this.ownerFileList[0]?.name,
        frontSide_FilePath: this.ownerFileList[0]?.url,
        backSide_FileName: '',
        backSide_FilePath: '',
      });
    }

    if (this.boardFileList.length <= 0) {
      this.message.error("Please Upload required Documents");
      this.scroll();
      return;
    }
    if (this.boardFileList.length > 0) {
      upload_Document.push({
        documentType: "Board Resolution",
        frontSide_FileName: this.boardFileList[0]?.name,
        frontSide_FilePath: this.boardFileList[0]?.url,
        backSide_FileName: '',
        backSide_FilePath: '',
      });
    }

    if (this.directorsFileList.length <= 0) {
      this.message.error("Please Upload required Documents");
      this.scroll();
      return;
    }
    if (this.directorsFileList.length > 0) {
      upload_Document.push({
        documentType: "Register of Directors",
        frontSide_FileName: this.directorsFileList[0]?.name,
        frontSide_FilePath: this.directorsFileList[0]?.url,
        backSide_FileName: '',
        backSide_FilePath: '',
      });
    }

    if (this.membersFileList.length <= 0) {
      this.message.error("Please Upload required Documents");
      this.scroll();
      return;
    }
    if (this.membersFileList.length > 0) {
      upload_Document.push({
        documentType: "Register of Members/Shareholders",
        frontSide_FileName: this.membersFileList[0]?.name,
        frontSide_FilePath: this.membersFileList[0]?.url,
        backSide_FileName: '',
        backSide_FilePath: '',
      });
    }

    if (this.statementFileList.length <= 0) {
      this.message.error("Please Upload required Documents");
      this.scroll();
      return;
    }
    if (this.statementFileList.length > 0) {
      upload_Document.push({
        documentType: "Latest Financial Statement",
        frontSide_FileName: this.statementFileList[0]?.name,
        frontSide_FilePath: this.statementFileList[0]?.url,
        backSide_FileName: '',
        backSide_FilePath: '',
      });
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
            this.router.navigateByUrl(`${this.langs}/profile/verification`);
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


  nzOnCancel(modelRef: NzModalRef) {
    // this.documentForm.reset();
    this.current = this.current - 1;
    this.getCustomerById();
    this.getCompany();
    this.getRepresenative();
    this.getQuestionsAnswer();
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
      } 
      else if (res.data[0]?.customer_Status == "Registered_EmailVerificationPending") {
        this.registeredEmail = true
       }
       
      else if (
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
    });
  }



  disabledDate = (current: Date): boolean =>
    // Can not select days before today and today
    differenceInCalendarDays(current, new Date()) > 0;

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


  goContact() {
    this.router.navigateByUrl(`${this.langs}/support`);
  }

  toggleBusinessAddress(e: any) {
    console.log(e)
    if (e === false) {
      this.business = true;
      this.personalForm.value.is_Business_Address_Same = false;
    } else {
      this.business = false;
      this.personalForm.value.is_Business_Address_Same = true;
    }
  }

  toggleAuthorized(e: any) {
    if (e === false) {
      this.authorized = false;
      this.personalForm.value.is_Authorized = false;
    } else {
      this.authorized = true;
      this.personalForm.value.is_Authorized = true;
    }
  }


  toggleUS(e: any) {
    if (e === false) {
      this.personalForm.value.is_US_Citizen = false;
    } else {
      this.personalForm.value.is_US_Citizen = true;
    }
  }

  togglePolitically(e: any) {
    if (e === false) {
      this.repFrom.value.is_Politically_Exposed_Person = false;
    } else {
      this.repFrom.value.is_Politically_Exposed_Person = true;
    }
  }
  
  toggleUsNational(e: any) {
    if (e === false) {
      this.usNatioanl = false;
      this.repFrom.value.is_US_National = false;
    } else {
      this.usNatioanl = true;
      this.repFrom.value.is_US_National = true;
    }
  }

// all upload image data here 
incorpFileList: NzUploadFile[] = [];
incorpPreviewVisible = false;
incorpFile!: NzUploadFile;
incorpPreviewImage: string | undefined = "";
incorpLoading: boolean = false;
incorpUpload = (file: NzUploadFile): boolean => {
  console.log(file);
  this.incorpLoading = true;
  this.incorpFile = file;
  this.api.fileUpload(file, file.name).subscribe(
    (res: any) => {
      this.incorpLoading = false;
      this.incorpPreviewImage = res.data.filePath;
      this.incorpFileList = [
        {
          uid: "-1",
          name: file.name,
          status: "done",
          url: res.data.filePath,
        },
      ];
    },
    (error) => {
      this.incorpLoading = false;
    }
  );
  return false;
};

handlePreview = async (file: NzUploadFile): Promise<void> => {
  if (!file.url && !file.preview) {
    file.preview = await getBase64(file.originFileObj!);
  }
  this.incorpPreviewVisible = file.url || file.preview;
  this.incorpPreviewVisible = true;
};


handleIncorpRemove(file: any) {
  this.incorpFileList = [];
  return true;
}
// file uplaod list
memoFileList: NzUploadFile[] = [];
memoPreviewVisible = false;
memoFile!: NzUploadFile;
memoPreviewImage: string | undefined = "";
memoLoading: boolean = false;
memoUpload = (file: NzUploadFile): boolean => {
  this.memoLoading = true;
  this.memoFile = file;
  this.api.fileUpload(file, file.name).subscribe(
    (res: any) => {
      this.memoLoading = false;
      this.memoPreviewImage = res.data.filePath;
      this.memoFileList = [
        {
          uid: "-1",
          name: file.name,
          status: "done",
          url: res.data.filePath,
        },
      ];
    },
    (error) => {
      this.memoLoading = false;
    }
  );
  return false;
};

memoPreview = async (file: NzUploadFile): Promise<void> => {
  if (!file.url && !file.preview) {
    file.preview = await getBase64(file.originFileObj!);
  }
  this.memoPreviewVisible = file.url || file.preview;
  this.memoPreviewVisible = true;
};


memoRemove(file: any) {
  this.memoFileList = [];
  return true;
}

// file uplaod list
proofFileList: NzUploadFile[] = [];
proofPreviewVisible = false;
proofFile!: NzUploadFile;
proofPreviewImage: string | undefined = "";
proofLoading: boolean = false;
proofUpload = (file: NzUploadFile): boolean => {
  this.proofLoading = true;
  this.proofFile = file;
  this.api.fileUpload(file, file.name).subscribe(
    (res: any) => {
      this.proofLoading = false;
      this.proofPreviewImage = res.data.filePath;
      this.proofFileList = [
        {
          uid: "-1",
          name: file.name,
          status: "done",
          url: res.data.filePath,
        },
      ];
    },
    (error) => {
      this.proofLoading = false;
    }
  );
  return false;
};

proofPreview = async (file: NzUploadFile): Promise<void> => {
  if (!file.url && !file.preview) {
    file.preview = await getBase64(file.originFileObj!);
  }
  this.proofPreviewVisible = file.url || file.preview;
  this.proofPreviewVisible = true;
};


proofRemove(file: any) {
  this.proofFileList = [];
  return true;
}

// file uplaod list
lcFileList: NzUploadFile[] = [];
lcPreviewVisible = false;
lcFile!: NzUploadFile;
lcPreviewImage: string | undefined = "";
lcLoading: boolean = false;
lcUpload = (file: NzUploadFile): boolean => {
  this.lcLoading = true;
  this.lcFile = file;
  this.api.fileUpload(file, file.name).subscribe(
    (res: any) => {
      this.lcLoading = false;
      this.lcPreviewImage = res.data.filePath;
      this.lcFileList = [
        {
          uid: "-1",
          name: file.name,
          status: "done",
          url: res.data.filePath,
        },
      ];
    },
    (error) => {
      this.lcLoading = false;
    }
  );
  return false;
};

lcPreview = async (file: NzUploadFile): Promise<void> => {
  if (!file.url && !file.preview) {
    file.preview = await getBase64(file.originFileObj!);
  }
  this.lcPreviewVisible = file.url || file.preview;
  this.lcPreviewVisible = true;
};


lcRemove(file: any) {
  this.lcFileList = [];
  return true;
}


// file uplaod list
ownerFileList: NzUploadFile[] = [];
ownerPreviewVisible = false;
ownerFile!: NzUploadFile;
ownerPreviewImage: string | undefined = "";
ownerLoading: boolean = false;
ownerUpload = (file: NzUploadFile): boolean => {
  this.ownerLoading = true;
  this.ownerFile = file;
  this.api.fileUpload(file, file.name).subscribe(
    (res: any) => {
      this.ownerLoading = false;
      this.ownerPreviewImage = res.data.filePath;
      this.ownerFileList = [
        {
          uid: "-1",
          name: file.name,
          status: "done",
          url: res.data.filePath,
        },
      ];
    },
    (error) => {
      this.ownerLoading = false;
    }
  );
  return false;
};

ownerPreview = async (file: NzUploadFile): Promise<void> => {
  if (!file.url && !file.preview) {
    file.preview = await getBase64(file.originFileObj!);
  }
  this.ownerPreviewVisible = file.url || file.preview;
  this.ownerPreviewVisible = true;
};


ownerRemove(file: any) {
  this.ownerFileList = [];
  return true;
}


// file uplaod list
boardFileList: NzUploadFile[] = [];
boardPreviewVisible = false;
boardFile!: NzUploadFile;
boardPreviewImage: string | undefined = "";
boardLoading: boolean = false;
boardUpload = (file: NzUploadFile): boolean => {
  this.boardLoading = true;
  this.boardFile = file;
  this.api.fileUpload(file, file.name).subscribe(
    (res: any) => {
      this.boardLoading = false;
      this.boardPreviewImage = res.data.filePath;
      this.boardFileList = [
        {
          uid: "-1",
          name: file.name,
          status: "done",
          url: res.data.filePath,
        },
      ];
    },
    (error) => {
      this.boardLoading = false;
    }
  );
  return false;
};

boardPreview = async (file: NzUploadFile): Promise<void> => {
  if (!file.url && !file.preview) {
    file.preview = await getBase64(file.originFileObj!);
  }
  this.boardPreviewVisible = file.url || file.preview;
  this.boardPreviewVisible = true;
};


boardRemove(file: any) {
  this.boardFileList = [];
  return true;
}


// file uplaod list
directorsFileList: NzUploadFile[] = [];
directorsPreviewVisible = false;
directorsFile!: NzUploadFile;
directorsPreviewImage: string | undefined = "";
directorsLoading: boolean = false;
directorsUpload = (file: NzUploadFile): boolean => {
  this.directorsLoading = true;
  this.directorsFile = file;
  this.api.fileUpload(file, file.name).subscribe(
    (res: any) => {
      this.directorsLoading = false;
      this.directorsPreviewImage = res.data.filePath;
      this.directorsFileList = [
        {
          uid: "-1",
          name: file.name,
          status: "done",
          url: res.data.filePath,
        },
      ];
    },
    (error) => {
      this.directorsLoading = false;
    }
  );
  return false;
};

directorsPreview = async (file: NzUploadFile): Promise<void> => {
  if (!file.url && !file.preview) {
    file.preview = await getBase64(file.originFileObj!);
  }
  this.directorsPreviewVisible = file.url || file.preview;
  this.directorsPreviewVisible = true;
};


directorsRemove(file: any) {
  this.directorsFileList = [];
  return true;
}


// file uplaod list
membersFileList: NzUploadFile[] = [];
membersPreviewVisible = false;
membersFile!: NzUploadFile;
membersPreviewImage: string | undefined = "";
membersLoading: boolean = false;
membersUpload = (file: NzUploadFile): boolean => {
  this.membersLoading = true;
  this.membersFile = file;
  this.api.fileUpload(file, file.name).subscribe(
    (res: any) => {
      this.membersLoading = false;
      this.membersPreviewImage = res.data.filePath;
      this.membersFileList = [
        {
          uid: "-1",
          name: file.name,
          status: "done",
          url: res.data.filePath,
        },
      ];
    },
    (error) => {
      this.membersLoading = false;
    }
  );
  return false;
};

membersPreview = async (file: NzUploadFile): Promise<void> => {
  if (!file.url && !file.preview) {
    file.preview = await getBase64(file.originFileObj!);
  }
  this.membersPreviewVisible = file.url || file.preview;
  this.membersPreviewVisible = true;
};


membersRemove(file: any) {
  this.membersFileList = [];
  return true;
}


// file uplaod list
statementFileList: NzUploadFile[] = [];
statementPreviewVisible = false;
statementFile!: NzUploadFile;
statementPreviewImage: string | undefined = "";
statementLoading: boolean = false;
statementUpload = (file: NzUploadFile): boolean => {
  this.statementLoading = true;
  this.statementFile = file;
  this.api.fileUpload(file, file.name).subscribe(
    (res: any) => {
      this.statementLoading = false;
      this.statementPreviewImage = res.data.filePath;
      this.statementFileList = [
        {
          uid: "-1",
          name: file.name,
          status: "done",
          url: res.data.filePath,
        },
      ];
    },
    (error) => {
      this.statementLoading = false;
    }
  );
  return false;
};

statementPreview = async (file: NzUploadFile): Promise<void> => {
  if (!file.url && !file.preview) {
    file.preview = await getBase64(file.originFileObj!);
  }
  this.statementPreviewVisible = file.url || file.preview;
  this.statementPreviewVisible = true;
};


statementRemove(file: any) {
  this.statementFileList = [];
  return true;
}
// directors form 
   createDirectorFormGroup() {
		return this.fb.group({
      first_Name: [null, [Validators.required]],
      last_Name: [null, [Validators.required]],
      dob: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      phoneNumberPrefix: ['+971'],
      phoneNumber: ["", [Validators.required, this.phoneNumberValidator]],
      passportNumber: [null, [Validators.required]],
      resudential_Address:[null, [Validators.required]],
      is_Politically_Exposed_Person: [true],
      is_US_National: [true],
      fatca: [null],
      crs: [null],
      is_Representative: [true],
      is_ShareHolder: [true],
      upload_Document: [null],
		})
	}

	get directors(): FormArray {
		return this.directorForm.get('directors') as FormArray;
	}

  addDirectors() {
		let fg = this.createDirectorFormGroup();
		this.directors.push(fg);
    this.drFileList = [];
    this.prdrFileList = [];
    this.prFileList = [];
    this.shareAdFileList = [];
	}

  deleteDirectors(idx: number) {
		this.directors.removeAt(idx);
	}

	onDirectorSubmit() {
    this.loaderCompany = true
    let upload_Documents: { documentType: string; frontSide_FileName: string; frontSide_FilePath: string | undefined; backSide_FileName: string; backSide_FilePath: string; document_For: string; }[] = [];
		this.isValidDirectorFormSubmitted = false;
		if (this.directorForm.invalid) {
      this.message.error(this.i18nSev.i18n('Please fill the required fields'));
      this.loaderCompany = false
       this.scroll();
			return;
		} else {
      if (this.drFileList.length > 0) {
        upload_Documents.push({
          documentType: "Proof of Identity",
          frontSide_FileName: this.drFileList[0]?.name,
          frontSide_FilePath: this.drFileList[0]?.url,
          backSide_FileName: '',
          backSide_FilePath: '',
          document_For: 'director'
        });
      }
      if (this.prdrFileList.length > 0) {
        upload_Documents.push({
          documentType: "Proof of Identity",
          frontSide_FileName: this.prdrFileList[0]?.name,
          frontSide_FilePath: this.prdrFileList[0]?.url,
          backSide_FileName: '',
          backSide_FilePath: '',
          document_For: 'director'
        });
      }

      if (this.prFileList.length > 0) {
        upload_Documents.push({
          documentType: "Address Proof",
          frontSide_FileName: this.prFileList[0]?.name,
          frontSide_FilePath: this.prFileList[0]?.url,
          backSide_FileName: '',
          backSide_FilePath: '',
          document_For: 'shareholder'
        });
      }

      if (this.prFileList.length > 0) {
        upload_Documents.push({
          documentType: "Address Proof",
          frontSide_FileName: this.shareAdFileList[0]?.name,
          frontSide_FilePath: this.shareAdFileList[0]?.url,
          backSide_FileName: '',
          backSide_FilePath: '',
          document_For: 'shareholder'
        });
      }

      // this.directorForm.value.directors?.upload_Documents?.push(upload_Documents)
      //  // this.directorForm.value.directors.upload_Documents.patC = upload_Documents
      // //  this.directorForm.value.directors[1].upload_Documents = upload_Documents
      //   console.log(this.directorForm.value.directors);
         for(let i = 0; i <= this.directorForm.value?.directors?.upload_Document?.length; i++) {
          this.directorForm.value.directors[i].upload_Document = upload_Documents as DocumentItemParams[]
         }

      this.api.UpdateCompanyDirectors(this.directorForm.value.directors).subscribe((res:any)=> {
        this.loaderCompany = false
        this.current = 2
      })

    }
	}

  directortogglePolitically(e: any) {
    if (e === false) {
      this.directorForm.value.is_Politically_Exposed_Person = false;
    } else {
      this.directorForm.value.is_Politically_Exposed_Person = true;
    }
  }

  directortoggleUsNational(e: any) {
    if (e === false) {
      this.usNatioanl = false
      this.directorForm.value.is_US_National = false;
    } else {
      this.usNatioanl = true
      this.directorForm.value.is_US_National = true;
    }
  }


  directortogglerepresantive(e: any) {
    if (e === false) {
      this.directorForm.value.is_Representative = false;
    } else {
      this.directorForm.value.is_Representative = true;
    }
  }

  directortoggleShareHolder(e: any) {
    if (e === false) {
      this.directorForm.value.is_ShareHolder = false;
    } else {
      this.directorForm.value.is_ShareHolder = true;
    }
  }

// file uplaod director
drFileList: NzUploadFile[] = [];
drPreviewVisible = false;
drFile!: NzUploadFile;
drPreviewImage: string | undefined = "";
drLoading: boolean = false;
drUpload = (file: NzUploadFile): boolean => {
  this.drLoading = true;
  this.drFile = file;
  this.api.fileUpload(file, file.name).subscribe(
    (res: any) => {
      this.drLoading = false;
      this.drPreviewImage = res.data.filePath;
      this.drFileList = [
        {
          uid: "-1",
          name: file.name,
          status: "done",
          url: res.data.filePath,
        },
      ];
    },
    (error) => {
      this.drLoading = false;
    }
  );
  return false;
};

drPreview = async (file: NzUploadFile): Promise<void> => {
  if (!file.url && !file.preview) {
    file.preview = await getBase64(file.originFileObj!);
  }
  this.drPreviewVisible = file.url || file.preview;
  this.drPreviewVisible = true;
};


drRemove(file: any) {
  this.drFileList = [];
  return true;
}
  

// file uplaod shareholder proof
prFileList: NzUploadFile[] = [];
prPreviewVisible = false;
prFile!: NzUploadFile;
prPreviewImage: string | undefined = "";
prLoading: boolean = false;
prUpload = (file: NzUploadFile): boolean => {
  this.prLoading = true;
  this.prFile = file;
  this.api.fileUpload(file, file.name).subscribe(
    (res: any) => {
      this.prLoading = false;
      this.prPreviewImage = res.data.filePath;
      this.prFileList = [
        {
          uid: "-1",
          name: file.name,
          status: "done",
          url: res.data.filePath,
        },
      ];
    },
    (error) => {
      this.prLoading = false;
    }
  );
  return false;
};

prPreview = async (file: NzUploadFile): Promise<void> => {
  if (!file.url && !file.preview) {
    file.preview = await getBase64(file.originFileObj!);
  }
  this.prPreviewVisible = file.url || file.preview;
  this.prPreviewVisible = true;
};


prRemove(file: any) {
  this.prFileList = [];
  return true;
}


// file uplaod shareholder proof address
shareAdFileList: NzUploadFile[] = [];
shareAdPreviewVisible = false;
shareAdFile!: NzUploadFile;
shareAdPreviewImage: string | undefined = "";
shareAdLoading: boolean = false;
shareAdUpload = (file: NzUploadFile): boolean => {
  this.shareAdLoading = true;
  this.shareAdFile = file;
  this.api.fileUpload(file, file.name).subscribe(
    (res: any) => {
      this.shareAdLoading = false;
      this.shareAdPreviewImage = res.data.filePath;
      this.shareAdFileList = [
        {
          uid: "-1",
          name: file.name,
          status: "done",
          url: res.data.filePath,
        },
      ];
    },
    (error) => {
      this.shareAdLoading = false;
    }
  );
  return false;
};

shareAdPreview = async (file: NzUploadFile): Promise<void> => {
  if (!file.url && !file.preview) {
    file.preview = await getBase64(file.originFileObj!);
  }
  this.shareAdPreviewVisible = file.url || file.preview;
  this.shareAdPreviewVisible = true;
};


shareAdRemove(file: any) {
  this.shareAdFileList = [];
  return true;
}

// file uplaod director 1
prdrFileList: NzUploadFile[] = [];
prdrPreviewVisible = false;
prdrFile!: NzUploadFile;
prdrPreviewImage: string | undefined = "";
prdrLoading: boolean = false;
prdrUpload = (file: NzUploadFile): boolean => {
  this.prdrLoading = true;
  this.prdrFile = file;
  this.api.fileUpload(file, file.name).subscribe(
    (res: any) => {
      this.prdrLoading = false;
      this.prdrPreviewImage = res.data.filePath;
      this.prdrFileList = [
        {
          uid: "-1",
          name: file.name,
          status: "done",
          url: res.data.filePath,
        },
      ];
    },
    (error) => {
      this.prdrLoading = false;
    }
  );
  return false;
};

prdrPreview = async (file: NzUploadFile): Promise<void> => {
  if (!file.url && !file.preview) {
    file.preview = await getBase64(file.originFileObj!);
  }
  this.prdrPreviewVisible = file.url || file.preview;
  this.prdrPreviewVisible = true;
};


prdrRemove(file: any) {
  this.prdrFileList = [];
  return true;
}
  

// share form 
createShareFormGroup() {  
  return this.fb.group({
    first_Name: [null, [Validators.required]],
    last_Name: [null, [Validators.required]],
    dob: [null, [Validators.required]],
    email: [null, [Validators.required, Validators.email]],
    phoneNumberPrefix: ['+971'],
    phoneNumber: ["", [Validators.required, this.phoneNumberValidator]],
    passportNumber: [null, [Validators.required]],
    resudential_Address:[null, [Validators.required]],
    is_Politically_Exposed_Person: [true],
    is_US_National: [true],
    fatca: [null],
    crs: [null],
  })
}

get shares(): FormArray {
  return this.shareForm.get('shares') as FormArray;
}

addShares() {
  let fg = this.createDirectorFormGroup();
  this.shares.push(fg);
}

deleteShares(idx: number) {
  this.shares.removeAt(idx);
}


onShareSubmit() {
  this.isValidShareFormSubmitted = false;
  if (this.shareForm.invalid) {
    this.message.error(this.i18nSev.i18n('Please fill the required fields'));
    this.scroll();
    return;
  } else {

      //  this.shareForm.value.shares.forEach((res:any)=> {
      //    this.shareForm.value.shares.phoneNumber = res.phoneNumber
      //    console.log(res)
      //   })

    // this.directorForm.value.directors[0].upload_Documents = upload_Documents
    //  for(let i = 0; i <= this.shareForm.value.shares.length; i++) {
    //    this.shareForm.value.shares[i].phoneNumber  = 'fffff'
    //   }


    this.api.UpdateCompanyShareholders(this.shareForm.value.shares).subscribe((res:any)=> {
      this.current = 4
    })
  }
}


SharetoggleUsNational(e: any) {
  if (e === false) {
    this.usNatioanl = false
    this.shareForm.value.is_US_National = false;
  } else {
    this.usNatioanl = true
    this.shareForm.value.is_US_National = true;
  }
}

generateLink() {
  this.loader = true
  this.api.resendEmailVerifyProfile().subscribe((res:any)=> {
    this.loader = false
    this.message.success(this.i18nSev.i18n('A verification link has been sent to your email account'))
  },
  error => {
    this.loader = false
    this.message.error(error?.body?.message);
  }
  )
}


handleChange(e:any) {
  console.log(e)
}


}
