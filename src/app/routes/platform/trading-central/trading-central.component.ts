import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { I18NService } from '@core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-tripea',
  templateUrl: './trading-central.component.html',
  styles: []
})
export class TradingCentralComponent implements OnInit {
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
  mt5Web: string = '';
  mt4Web: string = '';
  ngOnInit(): void {
    this.loading = true;

    this.route.queryParams.subscribe(param => {
      this.param = { ...param };
      if (this.param.cTrader === 'C') {
        this.http.getDownloadLinks().subscribe((res: any) => {
          res.data?.map((res: any) => { 
            if (res.platform === 'ctraderWeb') {
              const mt4Web = res.downloadLink;
              this.ifromUrl = this.sanitizer.bypassSecurityTrustResourceUrl(mt4Web);
            }
          });
          this.loading = false;
        });
      } else {
        this.http.getDownloadLinks().subscribe((res: any) => {
          res.data?.map((res: any) => { 
            if (res.platform === 'mt4Web') {
              const mt4Web = res.downloadLink;
              this.ifromUrl = this.sanitizer.bypassSecurityTrustResourceUrl(mt4Web);
            }
            if (res.platform === 'mt5Web') {
              const mt5Web = res.downloadLink;
              this.ifromUrl = this.sanitizer.bypassSecurityTrustResourceUrl(mt5Web);
            }
          });
          this.loading = false;
        });
      }
    });
  }
  
  goBack() {
    this.router.navigateByUrl(`${this.langs}/platform`);
  }
}
