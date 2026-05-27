import { Component, Injector, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-market-buzz',
  templateUrl: './market-buzz.component.html',
  styles: []
})
export class MarketBuzzComponent implements OnInit {
  url: any;
  dataLoad: boolean = true;
  accessDenied?:boolean;
  constructor(private injector: Injector, private common: ApiService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.getPage();
  }

  private get tokenSrv(): ITokenService {
    return this.injector.get(DA_SERVICE_TOKEN);
  }

  getPage() {
    this.common.getTradingCentral(this.tokenSrv.get()?.customer_id, 0).subscribe((res: any) => {
      if(res.data === '') {
        this.accessDenied = true
      } else {
        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(res.data);
      }
      this.dataLoad = false
    });
  }
}
