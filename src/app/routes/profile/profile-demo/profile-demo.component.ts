import { Component, Inject, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { I18NService } from '@core';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { SettingsService } from '@delon/theme';
import { environment } from '@env/environment';
import { differenceInCalendarDays, differenceInYears } from 'date-fns';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzUploadFile, NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { Observable, Observer } from 'rxjs';
import { DocumentItemParams, IDocumentParams, QuestionParams } from 'src/app/models/profile';
import { ApiService } from 'src/app/services/api.service';

import { prefixDefault } from '../phone';

interface nationalityOption {
  code: string;
  description: string;
}

const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

@Component({
  selector: 'app-profile',
  templateUrl: './profile-demo.component.html',
  styleUrls: ['./profile-demo.component.less']
})
export class ProfileDemoComponent implements OnInit {
  registeredEmail!:boolean 
  loader:boolean | undefined
  personalForm!: FormGroup;
  controlArray: Array<{ index: number; show: boolean }> = [];
  isCollapse = true;
  current = 0;
  customerId!: string;
  nationality: nationalityOption[] = [] as nationalityOption[];
  loading: boolean = false;
  prfoleloading: boolean = false;
  passportLoading: boolean = false;
  nationalityLoading: boolean = false;
  drivingLoading: boolean = false;
  adderssLoading: boolean = false;
  loaddingSumbit = false;
  passportFile!: NzUploadFile;
  nationalFile!: NzUploadFile;
  passportFileList: NzUploadFile[] = [];
  addessFileList: NzUploadFile[] = [];
  nationalFileList: NzUploadFile[] = [];
  drivingLicenseFileList: NzUploadFile[] = [];
  drivingLicenseFile!: NzUploadFile;
  customerParams: IDocumentParams = {} as IDocumentParams;
  customerVersion: any;
  settingByClientParms!: any;
  phones: any = prefixDefault;
  avatarUrl?: string;
  // eslint-disable-next-line prettier/prettier
  mobilePattern = '^(?:[0-9] ?){6,14}[0-9]$';
  questionsAnswer: any = [];
  langs = this.i18nSev.i18nUrl();
  toggleCollapse(): void {
    this.isCollapse = !this.isCollapse;
    this.controlArray.forEach((c, index) => {
      c.show = this.isCollapse ? index < 6 : true;
    });
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
  ) {
    // const userInfo = JSON.parse(localStorage.getItem('loginInfo')!);
    // if (userInfo.user_Type === 'Demo') {
    //   this.router.navigateByUrl(`${this.langs}/profile-demo`);
    // } else {
    //   this.router.navigateByUrl(`${this.langs}/profile`);
    // }
  }

  get curLangCode(): string {
    return this.settings.layout.lang;
  }

  private get tokenSrv(): ITokenService {
    return this.injector.get(DA_SERVICE_TOKEN);
  }

  ngOnInit(): void {
    this.personalForm = this.fb.group({
      customer_FirstName: [null, [Validators.required, Validators.pattern('^[A-Za-z ]+$')]],
      customer_MiddleName: [null, [Validators.pattern('^[A-Za-z ]+$')]],
      customer_LastName: [null, [Validators.required, Validators.pattern('^[A-Za-z ]+$')]],
      email: [null, [Validators.email, Validators.required]],
      date: [null, [Validators.required, this.dateValidator]],
      nationality: [null, [Validators.required]],
      gender: [null, [Validators.required]],
      phoneNumber: [null, [Validators.required, this.phoneNumberValidator]],
      phoneNumberPrefix: ['+971']
    });

    this.api.getAllCountries().subscribe((res: any) => {
      this.nationality = res.data;
    });

    this.getCustomerById();
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
        state
      } = this.personalForm.value;

      this.api
        .saveDemoCustomer(this.customerId, {
          customer_FirstName: customer_FirstName,
          customer_MiddleName: customer_MiddleName,
          customer_LastName: customer_LastName,
          customer_Mobile: `${phoneNumberPrefix} ${phoneNumber}`,
          customer_Gender: gender,
          customer_DoB: date,
          customer_Nationality: nationality,
          row_Version: this.customerVersion?.row_Version
        })
        .subscribe(
          res => {
            this.current = 1;
            this.getCustomerById();
            this.message.success('success');
          },
          error => {
            console.log(error?.body?.message || 'error');
          }
        );
    } else {
      Object.values(this.personalForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  nzOnCancel(modelRef: NzModalRef) {
    this.current = this.current - 1;
    this.getCustomerById();
    modelRef.destroy();
  }

  createTplModal(tplTitle: TemplateRef<{}>, tplContent: TemplateRef<{}>, tplFooter: TemplateRef<{}>): void {
    this.modal.create({
      nzTitle: tplTitle,
      nzContent: tplContent,
      nzFooter: tplFooter,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '400px'
    });
  }

  beforeUpload = (file: NzUploadFile, _fileList: NzUploadFile[]): Observable<boolean> =>
    new Observable((observer: Observer<boolean>) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        this.message.error('You can only upload JPG file!');
        observer.complete();
        return;
      }
      const isLt2M = file.size! / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.message.error('Image must smaller than 2MB!');
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
    } else if (control.value.toString().length > 11 || control.value.toString().length < 7) {
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
      if (res.data[0]?.customer_Status == 'Verified') {
        this.personalForm.get('customer_FirstName')?.disable();
        this.personalForm.get('customer_MiddleName')?.disable();
        this.personalForm.get('customer_LastName')?.disable();
        this.personalForm.get('date')?.disable();
        this.personalForm.get('nationality')?.disable();
        this.personalForm.get('gender')?.disable();
        this.personalForm.get('phoneNumberPrefix')?.disable();
        this.personalForm.get('phoneNumber')?.disable();
        this.personalForm.get('email')?.disable();
      }
       if (res.data[0]?.customer_Status == "Registered_EmailVerificationPending") {
        this.registeredEmail = true
       }
      const data = res.data[0];
      const phone = res.data[0].customer_Mobile;
      const phoneNumberPrefix = phone ? phone?.split(' ')[0] : '';

      phoneNumberPrefix && this.personalForm.get('phoneNumberPrefix')?.setValue(phoneNumberPrefix);

      const phoneNumber = phone && phone?.split(' ')[1];

      this.customerVersion = {
        ...data,
        phoneNumberPrefix,
        phoneNumber
      };
    });
  }
  disabledDate = (current: Date): boolean =>
    // Can not select days before today and today
    differenceInCalendarDays(current, new Date()) > 0;

  handleChange({ file, fileList }: NzUploadChangeParam): void {
    const status = file.status;
    if (status !== 'uploading') {
      console.log(file, fileList);
    }
    if (status === 'done') {
    } else if (status === 'error') {
    }
  }

  statusCode: boolean = false;

  nzOnChange(e: any, arr: string) {
    console.log(e, arr);
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    }
    return {};
  };

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

}
