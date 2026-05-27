import { Location } from '@angular/common';
import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiService } from 'src/app/services/api.service';
import { I18NService } from '@core';
import { Accounts } from '../../../models/accounts';
import { AccountListComponent } from '../account-list/account-list.component';
@Component({
  selector: 'app-change-leverage-modal',
  templateUrl: './change-leverage-modal.component.html',
  styles: []
})
export class ChangeLeverageModalComponent implements OnInit {
  @Output() readonly toParent = new EventEmitter();
  isVisible = false;
  validateForm!: FormGroup;
  loader: boolean = false;
  userId: any;
  leverage: string = '';
  userInfo: any;
  constructor(
    private injector: Injector,
    private fb: FormBuilder,
    private common: ApiService,
    private message: NzMessageService,
    private router: Router,
    private location: Location,
    private i18nSev: I18NService,
  ) {
    this.userInfo = JSON.parse(localStorage.getItem('loginInfo')!);
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      proportion: null,
      account_Leverage: [null, [Validators.required]]
    });
  }
  submitForm(): void {
    if (this.validateForm.valid) {
      const params = {
        customer_ID: this.tokenSrv.get()?.customer_id,
        account_Leverage: this.validateForm.value.account_Leverage
      };

      if (this.userInfo?.user_Type === 'Customer') {
        this.loader = true;
        this.common.changeAccountLeverage(this.userId, params).subscribe(res => {
          this.message.success(this.i18nSev.i18n('Your leverage change request has been successfully initiated, it will take effect after approval.'));
          this.isVisible = false;
          this.validateForm.reset();
          this.toParent.emit();
          this.loader = false;
        },
        error => {
          this.loader = false;
          this.message.error(error?.body?.message);
        }
        
        );
      } else {
        this.loader = true;
        this.common.changeAccountDemoLeverage(this.userId, params).subscribe(res => {
          this.message.success(this.i18nSev.i18n('Your leverage change request has been successfully initiated, it will take effect after approval.'));
          this.isVisible = false;
          this.validateForm.reset();
          this.loader = false;
          this.toParent.emit();
        },
        error => {
          this.loader = false;
          this.message.error(error?.body?.message);
        }
        );
      }
    } 
    
    else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      this.loader = false;
    }
  }

  private get tokenSrv(): ITokenService {
    return this.injector.get(DA_SERVICE_TOKEN);
  }

  showModal(data: any): void {
    this.userId = data.account_ID;
    this.leverage = data.account_Leverage;
    this.isVisible = true;
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
    this.validateForm.reset();
  }

  cancel() {
    this.isVisible = false;
  }
}
