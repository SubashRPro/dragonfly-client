import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { I18NService } from '@core';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { SettingsService, _HttpClient } from '@delon/theme';
import { environment } from '@env/environment';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CountdownConfig, CountdownEvent } from 'ngx-countdown';
import { GetCodeParams } from 'src/app/models/users';
import { ApiService } from 'src/app/services/api.service';
import { NzButtonSize } from 'ng-zorro-antd/button';

import { prefixDefault } from '../../profile/phone';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'passport-register',
  templateUrl: './register-list.component.html',
  styleUrls: ['./register-list.component.less']
})
export class RegisterList implements OnInit {
  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private modal: NzModalService,
    public message: NzMessageService,
    private route: ActivatedRoute,
    private i18nSev: I18NService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService
  ) {

  }
  partnerQuery:boolean = true
  langs = this.i18nSev.i18nUrl();
  radioValue: string = '';
  size: NzButtonSize = 'large';
  next:boolean = true
  individual: boolean = true;
  partner!: boolean;
  corporate!: boolean;
  selectionType:string | undefined
  queryData:any
  ngOnInit(): void {
    this.onItemChange('individual')
    const url = window.location.href;
    // const numArray = url.split("?");
    if (url.includes('?')) {
      this.partnerQuery = false
      this.route.queryParamMap.subscribe((res:any)=> {
        this.queryData = res.params
      })
    
    }
  }

  onItemChange(e: any) {
   // console.log(e)
    if (this.radioValue = e) {
      this.next = false
    }
    if(e === 'individual') {
        this.individual = true
        this.partner = false
        this.corporate = false
        this.selectionType = 'individual'
    } else if (e === 'partner') {
      this.individual = false
      this.partner = true
      this.corporate = false
    } else if (e === 'corporate') {
      this.individual = false
      this.partner = false
      this.corporate = true
      this.selectionType = 'corporate'
    }
  }

  goRegister() {
    if(this.partner) {
      window.location.href = '#';
    } else {
      this.router.navigate([`${this.langs}/user/register/${this.selectionType}`], {
        queryParams: {
          ...this.queryData
        }
      })
    }
  }
  goDemo() {
    this.router.navigate([`${this.langs}/user/register/demo`]);
  }
}
