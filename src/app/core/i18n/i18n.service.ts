
// 请参考：https://ng-alain.com/docs/i18n
import { Platform } from '@angular/cdk/platform';
import { registerLocaleData } from '@angular/common';
import ngEn from '@angular/common/locales/en';
import ngZh from '@angular/common/locales/zh';
import ngVi from '@angular/common/locales/vi';
import ngFr from '@angular/common/locales/fr';
import ngAr from '@angular/common/locales/ar';
import ngRu from '@angular/common/locales/ru';
import ngId from '@angular/common/locales/id';
import ngTh from '@angular/common/locales/th';
import ngZhTw from '@angular/common/locales/zh-Hant';
import { Injectable, Injector } from '@angular/core';
import {
  DelonLocaleService,
  en_US as delonEnUS,
  SettingsService,
  zh_CN as delonZhCn,
  zh_TW as delonZhTw,
  _HttpClient,
  AlainI18nBaseService,
  ALAIN_I18N_TOKEN
} from '@delon/theme';
import { AlainConfigService } from '@delon/util/config';
import { enUS as dfEn, zhCN as dfZhCn, zhTW as dfZhTw,vi as dfVi, fr as dfFr, ar as dfAr, ru as dfRu, id as dfId, th as dfTh } from 'date-fns/locale';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { en_US as zorroEnUS, NzI18nService, zh_CN as zorroZhCN, zh_TW as zorroZhTW,vi_VN as zorroVi_VN,fr_FR as zorroFr_FR, ar_EG as zorroar_EG, ru_RU as zorroru_RU, id_ID as zorroid_ID , th_TH as zorroth_TH } from 'ng-zorro-antd/i18n';

interface LangConfigData {
  abbr: string;
  text: string;
  ng: NzSafeAny;
  zorro: NzSafeAny;
  date: NzSafeAny;
  delon: NzSafeAny;
}

const DEFAULT = 'en-US';
const LANGS: { [key: string]: LangConfigData } = {
  'en-US': {
    text: 'English',
    ng: ngEn,
    zorro: zorroEnUS,
    date: dfEn,
    delon: delonEnUS,
    abbr: 'assets/images/langs/flag_en.png'
  },
  'zh-CN': {
    text: '简体中文',
    ng: ngZh,
    zorro: zorroZhCN,
    date: dfZhCn,
    delon: delonZhCn,
    abbr: 'assets/images/langs/flag_cn.png'
  }
  // 'zh-TW': {
  //   text: '繁体中文',
  //   ng: ngZhTw,
  //   zorro: zorroZhTW,
  //   date: dfZhTw,
  //   delon: delonZhTw,
  //   abbr: 'assets/images/langs/flag_zh.svg'
  // },
  // 'vi-VN': {
  //   text: 'Tiếng Việt',
  //   ng: ngVi,
  //   zorro: zorroVi_VN,
  //   date: dfVi,
  //   delon: delonEnUS,
  //   abbr: 'assets/images/langs/vt.svg'
  // },

  //  'id-ID': {
  //    text: 'Bahasa Indonesia',
  //    ng: ngId,
  //    zorro: zorroid_ID,
  //    date: dfId,
  //    delon: delonEnUS,
  //    abbr: 'assets/images/langs/vt.svg'
  //  },
  //  'th-TH': {
  //   text: 'Thai',
  //   ng: ngTh,
  //   zorro: zorroth_TH,
  //   date: dfTh,
  //   delon: delonEnUS,
  //   abbr: 'assets/images/langs/vt.svg'
  // },
  //  'fr-FR': {
  //    text: 'Français',
  //    ng: ngFr,
  //    zorro: zorroar_EG,
  //    date: dfFr,
  //    delon: zorroZhTW,
  //    abbr: 'assets/images/langs/flag_fr.png'
  //  },
  //  'ar-EG': {
  //   text: 'العربية',
  //   ng: ngAr,
  //   zorro: zorroar_EG,
  //   date: dfAr,
  //   delon: zorroZhTW,
  //   abbr: 'assets/images/langs/flag_fr.png'
  // },
  // 'ru-RU': {
  //   text: 'Русский',
  //   ng: ngRu,
  //   zorro: zorroru_RU,
  //   date: dfRu,
  //   delon: zorroZhTW,
  //   abbr: 'assets/images/langs/flag_fr.png'
  // },
};

@Injectable({ providedIn: 'root' })
export class I18NService extends AlainI18nBaseService {
  protected _defaultLang = DEFAULT;

  private _langs = Object.keys(LANGS).map(code => {
    const item = LANGS[code];
    return { code, text: item.text, abbr: item.abbr };
  });

  constructor(
    private http: _HttpClient,
    private settings: SettingsService,
    private nzI18nService: NzI18nService,
    private delonLocaleService: DelonLocaleService,
    private platform: Platform,
    cogSrv: AlainConfigService,
    private injector: Injector,
  ) {
    super(cogSrv);

    const defaultLang = this.getDefaultLang();
    if (this._langs.findIndex(w => w.code === defaultLang)) {
      this._defaultLang = defaultLang;
    }
  }

  private getDefaultLang(): string {
    if (!this.platform.isBrowser) {
      return DEFAULT;
    }
    if (this.settings.layout.lang) {
      return this.settings.layout.lang;
    }
    let res = (navigator.languages ? navigator.languages[0] : null) || navigator.language;
    const arr = res.split('-');
    return arr.length <= 1 ? res : `${arr[0]}-${arr[1].toUpperCase()}`;
  }

  async loadLangData(lang: string): Promise<any> {
   // console.log(lang)

    // return this.http.get(`assets/tmp/i18n/${lang}.json`);
    return await fetch(`assets/tmp/i18n/${lang}.json`).then(response => response.json());
  }

  use(lang: string, data: Record<string, string>): void {
    if (this._currentLang === lang) return;

    this._data = data;
    const item = LANGS[lang];
    registerLocaleData(item.ng);
    this.nzI18nService.setLocale(item.zorro);
    this.nzI18nService.setDateLocale(item.date);
    this.delonLocaleService.setLocale(item.delon);
    this._currentLang = lang;

    this._change$.next(lang);
  }

  getLangs(): Array<{ code: string; text: string; abbr: string }> {
    return this._langs;
  }
  i18n(text: string): string {
    return this.injector.get(ALAIN_I18N_TOKEN).fanyi(text);
  }

  language: any = {
    'en-US': 'en',
    'zh-TW': 'zh',
    'zh-CN': 'cn',
    'vi-VN': 'vt',
    'fr-FR': 'fr',
    'ar-EG': 'ar',
    'ru-RU': 'ru',
    'id-ID': "id",
    'th-TH': "th"
  };

  i18nUrl(): string {
    return `/${this.language[this.settings.layout.lang || 'en-US']}`;
  }
}
