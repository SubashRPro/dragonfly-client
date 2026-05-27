import { Component, EventEmitter, Injector, OnInit, Output, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { I18NService } from '@core';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { environment } from '@env/environment';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { Subject } from 'rxjs';
import { throttleTime, distinctUntilChanged } from 'rxjs/operators';
import { InitiateTransferParams } from 'src/app/models/funds';
import { GetCodeParams } from 'src/app/models/users';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-transfer-modal',
  templateUrl: './transfer-modal.component.html',
  styleUrls: ['./transfer-modal.component.less']
})
export class TransferModalComponent implements OnInit {
  dataLoad: boolean = true;
  pspAllowed:boolean | undefined
  transferLoader: boolean | undefined
  @Output() readonly toParent = new EventEmitter();
  eventChange: Subject<string> = new Subject<string>();
  isVisible = false;
  validateForm!: FormGroup;
  validateOtpForm!: FormGroup;
  transferOptions: any = [];
  transferFrom: any = {
    currency: 'USD',
    balance: 0
  };
  transferTo: any = {
    currency: 'USD',
    balance: 0
  };
  loading: boolean = false;
  exchangeRate: number = 0;
  langs = this.i18nSev.i18nUrl();
  selectTransfer = '';
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private http: ApiService,
    private injector: Injector,
    private message: NzMessageService,
    private modal: NzModalService,
    private i18nSev: I18NService
  ) {}

  ngOnInit(): void {
    this.validateOtpForm = this.fb.group({
      otp: [null, [Validators.required]]
    });
    this.validateForm = this.fb.group({
      amount: [null, [Validators.required]],
      transferTo: [null, [Validators.required]],
      transferFrom: [null, [Validators.required]]
    });
    this.getAllTransferSourceByCustomerId();
    this.getAllAccountsTotalBalance();

    this.eventChange
      .pipe(throttleTime(2500)) //rxjs的方法
      .subscribe(eventId => {
        // 监听数据变化，例如2000毫秒触发50次，这里只会触发一次
        if (eventId === 'code') {
          this.onInitiateTransfer();
        }
      });

      this.http.getCustomerProfile().subscribe((res: any) => {
        this.dataLoad = false
        this.pspAllowed = res.data[0]?.is_TransferAllowed
      })
  }
  onToParent() {
    this.toParent.emit();
    this.isVisible = false;
  }
  submitForm(modelRef: NzModalRef): void {
    if (this.validateForm.valid) {
      const { amount, transferFrom, transferTo } = this.validateForm.value;
      if (this.transferFrom.balance <= 0) {
        this.message.error(this.i18nSev.i18n('Your balance is insufficient'));
        return;
      }
      this.loading = true;
      this.http
        .initiateTransfer({
          paymenT_SOURCE: transferFrom.split('|')[0],
          paymenT_DESTINATION: transferTo.split('|')[0],
          transfeR_AMOUNT: amount,
          transfeR_TYPE: '',
          wL_NO: 'CPT',
          currency: transferFrom.split('|')[1]
        } as InitiateTransferParams)
        .subscribe(
          res => {
            this.loading = false;
            this.message.success(this.i18nSev.i18n('Success'));
            modelRef.destroy();
            this.onToParent();
          },
          error => {
            this.loading = false;
          }
        );
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  modalTep: any;
  createTplModal(tplContent: TemplateRef<{}>): void {
    if (this.transferFrom.balance <= 0) {
      this.message.error(this.i18nSev.i18n('Your balance is insufficient'));
      return;
    }
    const { amount } = this.validateForm.value;
    if (amount < 1) {
      this.message.error(this.i18nSev.i18n('Minimum Amount Should be 1 USD'));
      return;
    }
    this.validateOtpForm.reset();
    this.onGetCode();
    if (this.validateForm.valid) {
      this.modalTep = this.modal.create({
        nzTitle: this.i18nSev.i18n('Transfer'),
        nzCancelText: this.i18nSev.i18n('No'),
        nzOkText: this.i18nSev.i18n('Yes'),
        nzContent: tplContent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '400px',
        nzOkLoading: this.loading,
        nzOnOk: () => {
          this.onInitiateTransfer()
           if (this.validateOtpForm.valid) {
             this.eventChange.next('code');
           } else {
             Object.values(this.validateOtpForm.controls).forEach(control => {
               if (control.invalid) {
                 control.markAsDirty();
                 control.updateValueAndValidity({ onlySelf: true });
               }
             });
           }
           return false;
        }
      });
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  onInitiateTransfer() {
    if (this.transferFrom.balance <= 0) {
      this.message.error(this.i18nSev.i18n('Your balance is insufficient'));
      return;
    }
    const { amount } = this.validateForm.value;
    if (amount < 1) {
      this.message.error(this.i18nSev.i18n('Minimum Amount Should be 1 USD'));
      return;
    }
    if (this.validateForm.valid) { 
      const { amount, transferFrom, transferTo } = this.validateForm.value;
      this.transferLoader = true;
      this.http
        .initiateTransfer({
          paymenT_SOURCE: transferFrom.split('|')[0],
          paymenT_DESTINATION: transferTo.split('|')[0],
          transfeR_AMOUNT: amount,
          wL_NO: 'CPT',
          currency: transferFrom.split('|')[1],
        } as InitiateTransferParams)
        .subscribe(
          res => {
            this.transferLoader = false;
            this.message.success(this.i18nSev.i18n('Success'));
            this.router.navigateByUrl(`${this.langs}/funds/wallet`);
            this.modalTep.destroy();
          },
          error => {
            this.transferLoader = false;
            this.message.error(error?.body?.message);
          }
        );
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
  onGetCode() {
    this.http
      .loginGetCode({
        email: this.tokenSrv.get()?.user_Email,
        userName: this.tokenSrv.get()?.user_Email,
        wL_Number: environment.wL_Number,
        Email_Type: 'Transfer',
        customer_ID: this.tokenSrv.get()?.customer_id
      } as GetCodeParams)
      .subscribe(
        res => {},
        error => {
          this.message.error('error');
        }
      );
  }
  showModal(): void {
    this.validateForm.reset();
    this.isVisible = true;
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.router.navigateByUrl(`${this.langs}/funds/wallet`);
  }

  private get tokenSrv(): ITokenService {
    return this.injector.get(DA_SERVICE_TOKEN);
  }

  getAllTransferSourceByCustomerId() {
    this.http.getAllTransferSourceByCustomerId(this.tokenSrv.get()?.customer_id).subscribe((res: any) => {
      this.transferOptions = res.data;
    });
  }

  tradingChange(e: any, type: string) {
    const result = e.split('|');
    this.selectTransfer = result[2];
    this.http.getBalanceByAccountLogin({ code: result[0], type: result[2] }).subscribe((res: any) => {
      if (type === 'From') {
        this.transferFrom = {
          currency: result[1],
          balance: res.data
        };
      } else {
        this.transferTo = {
          currency: result[1],
          balance: res.data
        };
      }
    });
    if (type === 'From') {
      this.getExchangeRate(result[1], this.validateForm.value?.transferTo?.split('|')[1]);
    } else {
      this.getExchangeRate(this.validateForm.value?.transferFrom?.split('|')[1], result[1]);
    }
  }

  getExchangeRate(FromCurrency: string, ToCurrency: string) {
    this.http.getExchangeRate({ FromCurrency, ToCurrency, TransactionType: 'transfer',  PaymentMethod: 0 }).subscribe((res: any) => {
      this.exchangeRate = res.data === 0 ? 1 : res.data;
    });
  }

  total: any = {};
  getAllAccountsTotalBalance() {
    this.http.getAllAccountsTotalBalance(this.tokenSrv.get()?.customer_id).subscribe((res: any) => {
      this.total = res.data;
    });
  }
}
