import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { I18NService } from '@core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-helpPay',
  templateUrl: './help-pay.component.html',
  styleUrls: ['./help-pay.component.less']
})
export class HelpPay implements OnInit {
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
    private i18nSev: I18NService,
  ) {}
  langs = this.i18nSev.i18nUrl();
  ngOnInit(): void {
    this.loading = true;
   // this.redirectMerchant();
  }

  goWallet(){
    this.router.navigate(['en/funds/wallet'])
   }


   redirectMerchant() {
    const body = {
      merchant_token: sessionStorage.getItem('merchant_token'),
      merchant_secret: sessionStorage.getItem('merchant_secret')
    }
    this.http.redirectMerchant(body).subscribe(
      (res: any) => {
        if(res?.data?.is_CPT_Customer) {
        // there will be no redirection
        } else {
          window.open(res.data.redirect_URL, "_self");
        }
      },
    );
  }
   
}
