import { DOCUMENT } from '@angular/common';
import { Route } from '@angular/compiler/src/core';
import { Inject, Injectable, Injector } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  CanLoad,
  CanDeactivate,
  UrlTree
} from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { ALAIN_I18N_TOKEN, SettingsService } from '@delon/theme';
import { Observable } from 'rxjs';

import { I18NService } from './i18n/i18n.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad, CanDeactivate<any> {
  chatLang: any = {
    en: 'en-US',
    zh: 'zh-TW',
    cn: 'zh-CN',
    vt: 'vi-VN',
    fr: 'fr-FR',
    ar:'ar-EG',
    ru:'ru-RU',
    id:'id-ID',
    th:'th-TH',
  };

  constructor(
    private router: Router,
    private settings: SettingsService,
    private injector: Injector,
    @Inject(ALAIN_I18N_TOKEN) private i18n: I18NService,
    @Inject(DOCUMENT) private doc: any
  ) {}
  canDeactivate(
    component: any,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    throw new Error('Method not implemented.');
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // 权限控制逻辑如 是否验证kyc/拥有访问权限

//    console.log('canActivate', route, state.url, this.chatLang[route.params.lang]);

    const lang = this.chatLang[route.params.lang] || 'en-US';

    if (state.url == '/en') {
      this.router.navigateByUrl(`/${route.params.lang}/dashboard`);
    }

    localStorage.setItem('lang', lang);

    this.i18n.loadLangData(lang).then(res => {
      this.i18n.use(lang, res);
      this.settings.setLayout('lang', lang);
     
    });
    return true;
  }

  private get tokenSrv(): ITokenService {
    return this.injector.get(DA_SERVICE_TOKEN);
  }

  // canDeactivate(currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState: RouterStateSnapshot) {
  //   console.log('canDeactivate');
  //   return true;
  // }

  canActivateChild() {
    // 返回false则导航将失败/取消
    // 也可以写入具体的业务逻辑
    console.log('canActivateChild');
    return true;
  }
  canLoad(route: Route) {
    // 是否可以加载路由
    console.log('canload');
    return true;
  }
}
