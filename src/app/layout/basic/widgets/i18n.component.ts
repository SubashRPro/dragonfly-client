import { DOCUMENT } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
} from "@angular/core";
import { I18NService } from "@core";
import { ALAIN_I18N_TOKEN, SettingsService } from "@delon/theme";
import { BooleanInput, InputBoolean } from "@delon/util/decorator";

@Component({
  selector: "header-i18n",
  template: `
    <a
      nz-dropdown
      nzTrigger="click"
      [nzDropdownMenu]="menu"
      *ngIf="!showLangText"
      class="lang-header"
      nzPlacement="bottomRight"
    >
      <img src="assets/images/icon-lang.svg" alt="flag" />{{
        curLangCode === 'en-US' ? 'EN' : curLangCode === 'zh-CN' ? '简体' : '繁体'
      }}
      <i nz-icon nzType="down" nzTheme="outline"></i>
    </a>
    <nz-dropdown-menu #menu="nzDropdownMenu">
      <ul nz-menu>
        <li
          nz-menu-item
          *ngFor="let item of langs"
          [nzSelected]="item.code === curLangCode"
          (click)="change(item.code)"
        >
          <!-- <span role="img" [attr.aria-label]="item.text" class="pr-xs">{{ item.abbr }}</span> -->
           <img [src]="item?.abbr" style="width:30px;" alt="langs" />
          {{ item.text }}
        </li>
      </ul>
    </nz-dropdown-menu>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderI18nComponent {
  static ngAcceptInputType_showLangText: BooleanInput;
  /** Whether to display language text */
  @Input() @InputBoolean() showLangText = true;

  get langs(): Array<{ code: string; text: string; abbr: string }> {
    console.log(this.i18n.getLangs());
    return this.i18n.getLangs();
  }

  get curLangCode(): string {
    return this.settings.layout.lang || "en-US";
  }

  get curLange(): any {
    const lang = this.settings.layout.lang || "en-US";
    return this.langs.filter((item) => item.code === lang)[0] ?? {};
  }
  lang: any = {
    "en-US": "en",
    "zh-TW": "zh",
    "zh-CN": "CN",
    "vi-VN": "vt",
    "fr-FR": "fr",
    "ar-EG": "ar",
    "ru-RU": "ru",
    "id-ID": "id",
  };

  setLang: any = {
    "en-US": "en",
    "zh-TW": "zh",
    "zh-CN": "cn",
    "vi-VN": "vt",
    "fr-FR": "fr",
    "ar-EG": "ar",
    "ru-RU": "ru",
    "id-ID": "id",
  };

  constructor(
    private settings: SettingsService,
    @Inject(ALAIN_I18N_TOKEN) private i18n: I18NService,
    @Inject(DOCUMENT) private doc: any
  ) {}

  change(lang: string): void {
    const l = window.location.hash.split("/");
    l[1] = this.setLang[lang] || "en";
    window.location.href = `${window.location.origin}/${l.join("/")}`;
    const spinEl = this.doc.createElement("div");
    spinEl.setAttribute(
      "class",
      `page-loading ant-spin ant-spin-lg ant-spin-spinning`
    );
    spinEl.innerHTML = `<span class="ant-spin-dot ant-spin-dot-spin"><i></i><i></i><i></i><i></i></span>`;
    this.doc.body.appendChild(spinEl);
    // temporary fixed will change this
    localStorage.setItem("lang", lang);

    this.i18n.loadLangData(lang).then((res) => {
      this.i18n.use(lang, res);
      this.settings.setLayout("lang", lang);
      setTimeout(() => this.doc.location.reload());
    });

    // subscribe(res => {
    //   this.i18n.use(lang, res);
    //   this.settings.setLayout('lang', lang);
    //   setTimeout(() => this.doc.location.reload());
    // });
  }
}
