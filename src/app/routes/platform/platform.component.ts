import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {ApiService} from "../../services/api.service";
import { I18NService } from '@core';
@Component({
  selector: 'app-platform',
  templateUrl: './platform.component.html',
  styleUrls: ['./platform.component.less']
})
export class PlatformComponent implements OnInit {
  langs = this.i18nSev.i18nUrl();
  constructor(
    private api: ApiService,
    private router: Router,
    private i18nSev: I18NService,
  ) { }

  mt4Android: string = '';
  mt4Ios: string = '';
  mt4Web: string = '';
  mt4Windows: string = '';
  mt5Android: string = '';
  mt5Ios: string = '';
  mt5Web: string = '';
  mt5Windows: string = '';
  ctraderAndriod:string = ''
  ctraderWindows:string = ''
  ctraderIos: string = '';
  ctraderWeb:string = ''
  ngOnInit(): void {
  //  this.getDownloadLinks();
  }

  getDownloadLinks() {
    this.api.getDownloadLinks().subscribe((res: any) => {
      res.data?.map((res: any) => {
        if (res.platform === 'mt4Android') {
          this.mt4Android = res.downloadLink;
        }
        if (res.platform === 'mt4IoS') {
          this.mt4Ios = res.downloadLink;
        }
        if (res.platform === 'mt4Windows') {
          this.mt4Windows = res.downloadLink;
        }
        if (res.platform === 'mt4Web') {
          this.mt4Web = res.downloadLink;
        }
        if (res.platform === 'mt5Android') {
          this.mt5Android = res.downloadLink;
        }
        if (res.platform === 'mt5IoS') {
          this.mt5Ios = res.downloadLink;
        }
        if (res.platform === 'mt5Windows') {
          this.mt5Windows = res.downloadLink;
        }
        if (res.platform === 'mt5Web') {
          this.mt5Web = res.downloadLink;
        }
        if (res.platform === 'ctraderAndroid') {
          this.ctraderAndriod = res.downloadLink;
        }
        if (res.platform === 'ctraderWindows') {
          this.ctraderWindows = res.downloadLink;
        }

        if (res.platform === 'ctraderMac') {
          this.ctraderIos = res.downloadLink;
        }

        if (res.platform === 'ctraderWeb') {
          this.ctraderWeb = res.downloadLink;
        }
        
      });
    });
  }

  goTrading(platform:any) {
    if(platform === 'https://ct.cptmarkets.tw/') {
      this.router.navigate([`${this.langs}/trading-platfrom`], {
        queryParams: {
          cTrader: 'C'
        }
      })
    } else {
      this.router.navigate([`${this.langs}/trading-platfrom`])
    }
  }

}
