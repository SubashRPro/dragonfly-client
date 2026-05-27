import { HttpClient } from "@angular/common/http";
import { Injectable, Injector, Inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ACLService, ACLType } from "@delon/acl";
import { DA_SERVICE_TOKEN, ITokenService } from "@delon/auth";
import {
  ALAIN_I18N_TOKEN,
  MenuService,
  SettingsService,
  TitleService,
} from "@delon/theme";
import type { NzSafeAny } from "ng-zorro-antd/core/types";
import { NzIconService } from "ng-zorro-antd/icon";
import { Observable, zip, of } from "rxjs";
import { catchError, map } from "rxjs/operators";

import { ICONS } from "../../../style-icons";
import { ICONS_AUTO } from "../../../style-icons-auto";
import { I18NService } from "../i18n/i18n.service";

/**
 * Used for application startup
 * Generally used to get the basic data of the application, like: Menu Data, User Data, etc.
 */
@Injectable()
export class StartupService {
  constructor(
    iconSrv: NzIconService,
    private menuService: MenuService,
    @Inject(ALAIN_I18N_TOKEN) private i18n: I18NService,
    private settingService: SettingsService,
    private aclService: ACLService,
    private titleService: TitleService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private httpClient: HttpClient,
    private injector: Injector,
    private activeRoute: ActivatedRoute
  ) {
    iconSrv.addIcon(...ICONS_AUTO, ...ICONS);
  }

  private viaHttp(): Observable<void> {
    let defaultLang = "en-US";
    const url:any = location.hash;
    if(url.includes("/en")){
      defaultLang = 'en-US'
    }else if(url.includes("/cn")){
      defaultLang = 'zh-CN'
    }else if(url.includes("/vt")){
      defaultLang = 'vi-VN'
    }else if(url.includes("/zh")){
      defaultLang = 'zh-TW'
    }else if(url.includes("/fr")){
      defaultLang = 'fr-FR'
    }
    else if(url.includes("/ru")){
      defaultLang = 'ru-RU'
      document.documentElement.setAttribute('lang', 'ru');
    }
    else if(url.includes("/ar")){
      defaultLang = 'ar-EG';
      document.documentElement.setAttribute('lang', 'ar');
    }
    else if(url.includes("/id")){
      defaultLang = 'id-ID';
      document.documentElement.setAttribute('lang', 'id');
    }
    else if(url.includes("/th")){
      defaultLang = 'th-TH';
      document.documentElement.setAttribute('lang', 'th');
    }
    this.settingService.setLayout('lang', defaultLang);
    // let defaultLang = this.settingService.layout.lang || this.i18n.defaultLang;
    // defaultLang = defaultLang == "en" ? "en-US" : defaultLang;
    return zip(
      this.i18n.loadLangData(defaultLang),
      this.httpClient.get("assets/tmp/app-data.json")
    ).pipe(
      catchError((res: NzSafeAny) => {
        console.warn(`StartupService.load: Network request failed`, res);
        return [];
      }),
      map(([langData, appData]: [Record<string, string>, NzSafeAny]) => {
        // setting language data
        this.i18n.use(defaultLang, langData);
        // Application data
        // Application information: including site name, description, year
        this.settingService.setApp(appData.app);
        // User information: including name, avatar, email address
        this.settingService.setUser(appData.user);
        // ACL: Set the permissions to full, https://ng-alain.com/acl/getting-started
        this.aclService.setFull(true);

        // this.aclService.setRole(['home', 'ticket']);

        // Menu data, https://ng-alain.com/theme/menu
        this.menuService.add(appData.menu);
        // Can be set page suffix title, https://ng-alain.com/theme/title
        this.titleService.suffix = appData.app.name;
      })
    );
  }

  load(): Observable<void> {
    // http
    return this.viaHttp();
  }
}
