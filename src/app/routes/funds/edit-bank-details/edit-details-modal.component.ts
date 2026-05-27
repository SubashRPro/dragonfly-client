import { Component, OnInit, Injectable, ViewChild, Injector, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { I18NService } from '@core';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { number } from 'echarts';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiService } from 'src/app/services/api.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
@Injectable({ providedIn: 'root' })
@Component({
  selector: 'app-edit-list',
  templateUrl: './edit-details-modal.component.html',
 // styleUrls: ['./bank-details.component.less']
})
export class EditdetailsModalComponent implements OnInit {

  constructor(
    private cdr: ChangeDetectorRef,
    private injector: Injector,
    private fb: FormBuilder,
    private common: ApiService,
    private message: NzMessageService,
    private router: Router,
    private i18nSev: I18NService,
    private http: ApiService
  ) {
    this.userInfo = JSON.parse(localStorage.getItem('loginInfo')!);
  }
  langs = this.i18nSev.i18nUrl();
  loadingdata?:boolean
  account: any[] = [];
  isVisible = false;
  validateForm!: FormGroup;
  countriesOptios: any = [];
  user_Nationality = this.tokenSrv.get()?.user_Nationality
  userInfo: any;
  bankId:any
  bankFill:any
  // eslint-disable-next-line @angular-eslint/contextual-lifecycle
  ngOnInit(): void {
    this.validateForm = this.fb.group({
      banK_NATION: [null, [Validators.required]],
      banK_NAME: [null, [Validators.required]],
      banK_USER_NAME: [null, [Validators.required]],
      banK_NO: [null, [Validators.required]],
      banK_ADDRESS: [null, [Validators.required]],
      banK_IBAN: [null, [Validators.required, Validators.pattern('^[0-9a-zA-Z_]{1,34}$')]],
      swifT_CODE: [null, [Validators.required]],
      is_Default: [false]
    });
   this.getAllCountries()
  }

  private get tokenSrv(): ITokenService {
    return this.injector.get(DA_SERVICE_TOKEN);
  }

  showModal(data: any): void {
    if(this.user_Nationality === 'IN') {
      this.validateForm.controls.banK_IBAN.disable();
    } else {
      this.validateForm.controls.banK_IBAN.enable();
    }
    this.bankId = data?.bankDetailsID
    this.http.getBankDetailbyId(data?.bankDetailsID).subscribe(
      (res:any) => {
        let content = res.data
        this.validateForm.patchValue({
          banK_NATION: content?.bankCountry,
          banK_NAME:content?.bankName,
          banK_USER_NAME:content?.accountHolderName,
          banK_NO: content?.accountNumber,
          banK_ADDRESS: content?.bankAddress,
          banK_IBAN: content?.iban,
          swifT_CODE:content?.swiftCode,
          is_Default: content?.is_Default
        })

        console.log(res)
      },
      error => {
        this.message.error(error?.body?.message);
      }
  );
    this.isVisible = true;
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.validateForm.reset();
  }


  submitForm(): void {
    this.loadingdata = true;
    if (this.validateForm.valid) { 
      const { banK_NATION, banK_NAME, banK_USER_NAME, banK_NO, banK_ADDRESS, banK_IBAN, swifT_CODE, is_Default  } = this.validateForm.value;
      let body = {
        bankDetailsID: this.bankId,
        accountHolderName: banK_USER_NAME,
        bankName: banK_NAME,
        accountNumber: banK_NO,
        bankCountry: banK_NATION,
        bankAddress: banK_ADDRESS,
        iban: banK_IBAN ? banK_IBAN : this.bankFill,
        swiftCode: swifT_CODE,
        is_Default: is_Default
      }
      this.http.updateBank(body).subscribe(
        (res:any) => {
          this.message.success(res.message);
          this.isVisible = false;
          this.loadingdata = false;
          this.validateForm.reset();
        },
        error => {
          this.loadingdata = false;
          this.message.error(error?.body?.message);
        }
    );
    }

    else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      this.loadingdata = false;
    }
   
  }


  getAllCountries() {
    this.http.getAllCountries().subscribe((res: any) => {
      this.countriesOptios = res.data;
    });
  }

}
