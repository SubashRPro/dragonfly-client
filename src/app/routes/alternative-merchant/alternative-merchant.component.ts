import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { I18NService } from '@core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-alternative',
  templateUrl: './alternative-merchant.component.html',
  styles: []
})
export class AlternativeMerchantComponent implements OnInit {
  kycMessage!:boolean
  exceed:boolean = false
  ifromUrl: any;
  loading: boolean = false;
  param: any = {};
  constructor(
    private http: ApiService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private message: NzMessageService,
    private modal: NzModalService,
    private router: Router,
    private i18nSev: I18NService
  ) {}
  langs = this.i18nSev.i18nUrl();
  ngOnInit(): void {
    this.loading = true;
    this.route.queryParams.subscribe(param => {
      this.param = { ...param };
      if (this.param.postType === 'D') {
        this.http.getDepositByCardPraxisPaymentAsync({ ...this.param, postType: undefined }).subscribe(
          (res: any) => {
            console.log(res)
            const result = res?.data;
            this.loading = false;
            if (result.status !== 400) {
              this.ifromUrl = this.sanitizer.bypassSecurityTrustResourceUrl(result.redirect_url);
            } else {
              this.message.error(result?.description);
            }
          },
          error => {
            this.loading = false;
            if(error?.body?.message === 'Deposit_is_not_allowed_Exceed_Limit') {
              this.exceed = true
              this.kycMessage = true
            } 
            else if(error?.body?.message === 'Deposit_is_not_allowed_Exceed_Amount') {
                this.exceed = true
              }

            else {
              this.message.error(error?.body?.message);
            }
          }
        );
      } else {
        this.http.getWithdrawByCardPraxisPaymentAsync({ ...this.param, postType: undefined }).subscribe(
          (res: any) => {
            const result = res?.data;
            this.loading = false;
            if (result.status !== 400) {
              this.ifromUrl = this.sanitizer.bypassSecurityTrustResourceUrl(result.redirect_url);
            } else {
              this.message.error(result?.description);
            }
          },
          error => {
            this.loading = false;
            this.message.error(error?.body?.message);
          }
        );
      }
    });
  }
  confirmModal?: NzModalRef;
  goBack() {
    // history.back();
    this.confirmModal = this.modal.confirm({
      nzTitle: this.i18nSev.i18n('Are you sure to exit the current payment?'),
      nzContent: this.i18nSev.i18n('The current return cannot be undone'),
      nzOnOk: () => {
        if (this.param.postType === 'D') {
          this.router.navigateByUrl(`${this.langs}/payment/deposit-method`);
        } else {
          this.router.navigateByUrl(`${this.langs}/payment/withdraw-method`);
        }
      }
    });
  }

  goVerify() {
    this.router.navigate([`${this.langs}/profile`])
  }
}
