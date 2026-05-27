import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { I18NService } from '@core';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { SettingsService } from '@delon/theme';
import { ApiService } from 'src/app/services/api.service';

import { SettingModalComponent } from '../../components/setting-modal/setting-modal.component';
import { prefixDefault } from '../phone';
declare var snsWebSdk:any
@Component({
  selector: 'app-sumsub',
  templateUrl: './sumsub.component.html',
  styles: []
})
export class SumSubComponent implements OnInit {
  loader:any = true
  constructor(
    private api: ApiService,
    private settings: SettingsService,
    private fb: FormBuilder,
    private injector: Injector,
    private router: Router,
    private i18nSev: I18NService
  ) {
  }

  get tokenSrv(): ITokenService {
    return this.injector.get(DA_SERVICE_TOKEN);
  }
  
  ngOnInit(): void {
    this.getSumSubToken();
  }

  launchWebSdk(accessToken: any) {
    let snsWebSdkInstance = snsWebSdk
      .init(
        accessToken,
        // token update callback, must return Promise
        () => this.getNewAccessToken()
      )
      .withConf({
        lang: 'en',
      })
      .on('onError', (error) => {
        console.log('onError', payload)
      })
      .onMessage((type: any, payload: any) => {
        console.log('onMessage', type, payload)
      })
      .build()

    // you are ready to go:
    // just launch the WebSDK by providing the container element for it
    snsWebSdkInstance.launch('#sumsub-websdk-container')
  }

   getNewAccessToken() {
    return Promise.resolve()
  }

  getSumSubToken() {
    this.api.getSumSubAccessToken(this.tokenSrv.get()?.customer_id).subscribe((res:any)=> {
      localStorage.setItem('sumSubToken', res?.accessToken)
      this.loader = false
      setTimeout(()=> {
        this.launchWebSdk(localStorage.getItem('sumSubToken'))
      },2000)
    })
  }
}

function payload(arg0: string, payload: any) {
  throw new Error("Function not implemented.");
}

