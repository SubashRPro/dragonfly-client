import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { I18NService } from '@core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-tripea',
  templateUrl: './coinpay.component.html',
  styles: []
})
export class CoinPayComponent implements OnInit {
  ifromUrl: any;
  loading: boolean = false;
  kycMessage!:boolean
  exceed:boolean = false
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
      console.log(param)
      this.param = { ...param };
      this.http.bvnkDeposit({ ...this.param, postType: undefined }).subscribe((res:any)=> {
        console.log(res?.data)
        if (res.statusCode == 101) {
          const result = res?.data
          this.ifromUrl = this.sanitizer.bypassSecurityTrustResourceUrl(result);
          this.loading = false;
        } else {
          this.message.error(res.message);
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
          this.router.navigateByUrl(`${this.langs}/funds/deposit`);
        }
      }
      )
    })
  }
  confirmModal?: NzModalRef;
  goBack() {
    // history.back();
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Are you sure to exit the current payment?',
      nzContent: 'The current return cannot be undone',
      nzOnOk: () => {
        this.router.navigateByUrl(`${this.langs}/funds/deposit`);
      }
    });
  }

  goVerify() {
    this.router.navigate([`${this.langs}/profile`])
  }

}
