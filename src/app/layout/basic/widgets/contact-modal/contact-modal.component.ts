/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, Injector, OnInit } from '@angular/core';
import { I18NService } from '@core';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ClipboardService } from 'ngx-clipboard';
import { GetCodeParams } from 'src/app/models/users';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-contact-modal',
  templateUrl: './contact-modal.component.html'
})
export class ContactModalComponent implements OnInit {
  public customer_ID: any = this.tokenSrv.get()?.customer_id;
  constructor(
    private injector: Injector,
    private common: ApiService,
    private message: NzMessageService,
    private clipboardService: ClipboardService,
    private i18nSev: I18NService
  ) {}
  isVisible = false;
  phone!: string;
  email!: string;
  web!: string;
  ngOnInit(): void {
 //  this.getContactUsDetail();
  }

  private get tokenSrv(): ITokenService {
    return this.injector.get(DA_SERVICE_TOKEN);
  }

  showModal() {
    this.isVisible = true;
  }
  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  copyContent() {
    this.clipboardService.copyFromContent(this.email);
    //this.message.success('Copied');
    this.message.success(this.i18nSev.i18n('Copied'));
  }

  // get status
  getContactUsDetail() {
    this.common.getContactUs(this.customer_ID).subscribe(
      (res: any): void => {
        this.email = res.data.email;
        this.phone = res.data.phone_Number;
        this.web = res.data.website
      },
      error => {
        this.message.error(error.body.message);
      }
    );
  }
}
