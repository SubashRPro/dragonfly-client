import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { I18NService } from '@core';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { SettingsService } from '@delon/theme';
import { ApiService } from 'src/app/services/api.service';

import { SettingModalComponent } from '../../components/setting-modal/setting-modal.component';
import { prefixDefault } from '../phone';

@Component({
  selector: 'app-verification-information',
  templateUrl: './verification-information.component.html',
  styles: []
})
export class VerificationInformationComponent implements OnInit {
  @ViewChild('settingModalComponent')
  settingModalComponent!: SettingModalComponent;

  personalForm!: FormGroup;
  customerVersion: any;
  phones: any = prefixDefault;
  nationality: any = [];
  customerId: string = '';
  dataSet: any = [];
  langs = this.i18nSev.i18nUrl();
  lang: any =  {
    'en-US': 'en',
    'zh-TW': 'zh',
    'zh-CN': 'cn',
    'vi-VN': 'vt'
  };

  get curLangCode(): string {
    return this.settings.layout.lang;
  }
  constructor(
    private api: ApiService,
    private settings: SettingsService,
    private fb: FormBuilder,
    private injector: Injector,
    private router: Router,
    private i18nSev: I18NService
  ) {
    this.personalForm = this.fb.group({
      englishName: [{ value: null, disabled: true }, [Validators.required]],
      middleName: [{ value: null, disabled: true }],
      lastName: [{ value: null, disabled: true }, [Validators.required]],
      email: [{ value: null, disabled: true }, [Validators.email, Validators.required]],
      date: [{ value: null, disabled: true }, [Validators.required]],
      nationality: [{ value: null, disabled: true }, [Validators.required]],
      gender: [{ value: null, disabled: true }, [Validators.required]],
      customer_TIN: [{ value: null, disabled: true }],
      customer_Passport: [{ value: null, disabled: true }],
      phoneNumber: [{ value: null, disabled: true }, [Validators.required, this.phoneNumberValidator]],
      phoneNumberPrefix: [{ value: '+971', disabled: true }],
      address: [{ value: null, disabled: true }, [Validators.required]],
      street: [{ value: null, disabled: true }, [Validators.required]],
      country: [{ value: null, disabled: true }, [Validators.required]],
      state: [{ value: null, disabled: true }, [Validators.required]],
      city: [{ value: null, disabled: true }, [Validators.required]],
      zipCode: [{ value: null, disabled: true }, [Validators.required]],
      customer_ApartmentNumber: [{ value: null, disabled: true }],
      tax_PayerIdentification: [{ value: null, disabled: true }],
      is_USCitizen:[{ value: null, disabled: true }],
      tpi: [{ value: null, disabled: true }],
      is_PEP:[{ value: null, disabled: true }] 
    });

    const userInfo = JSON.parse(localStorage.getItem('loginInfo')!);
    if (userInfo.user_Type === 'Demo') {
      this.router.navigateByUrl(`${this.langs}/profile-demo`);
    } else {
      // this.router.navigateByUrl('/profile');
    }
  }

  ngOnInit(): void {
    // this.api.getAllCountries().subscribe((res: any) => {
    //   this.nationality = res.data;
    // });
    this.getCustomerById();
  }

  phoneNumberValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value.toString().length > 11) {
      return { pattern: true, error: true };
    }
    return {};
  };

  personalSubmit() {}

  private get tokenSrv(): ITokenService {
    return this.injector.get(DA_SERVICE_TOKEN);
  }

  getCustomerById() {
    this.customerId = this.tokenSrv.get()?.customer_id;
    this.api.GetProfileDetail().subscribe((res: any) => {
      this.customerVersion = res?.data
    });
  }
}
