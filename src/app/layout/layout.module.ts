/* eslint-disable import/order */
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GlobalFooterModule } from "@delon/abc/global-footer";
import { NoticeIconModule } from "@delon/abc/notice-icon";
import { AlainThemeModule } from "@delon/theme";
import { LayoutDefaultModule } from "@delon/theme/layout-default";
import { SettingDrawerModule } from "@delon/theme/setting-drawer";
import { ThemeBtnModule } from "@delon/theme/theme-btn";
import { NzAutocompleteModule } from "ng-zorro-antd/auto-complete";
import { NzAvatarModule } from "ng-zorro-antd/avatar";
import { NzBadgeModule } from "ng-zorro-antd/badge";
import { NzDropDownModule } from "ng-zorro-antd/dropdown";
import { NzFormModule } from "ng-zorro-antd/form";
import { NzGridModule } from "ng-zorro-antd/grid";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzSpinModule } from "ng-zorro-antd/spin";
import { NzLayoutModule } from "ng-zorro-antd/layout";
import { NzBreadCrumbModule } from "ng-zorro-antd/breadcrumb";
import { NzPageHeaderModule } from "ng-zorro-antd/page-header";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzSpaceModule } from "ng-zorro-antd/space";
import { NzDrawerModule } from "ng-zorro-antd/drawer";
import { NzModalModule } from "ng-zorro-antd/modal";
import { NzTabsModule } from "ng-zorro-antd/tabs";
import { NzSelectModule } from "ng-zorro-antd/select";
import { NzCardModule } from "ng-zorro-antd/card";
import { NzSwitchModule } from "ng-zorro-antd/switch";
import { NzCheckboxModule } from "ng-zorro-antd/checkbox";
import { NzDividerModule } from "ng-zorro-antd/divider";
import { NzCalendarModule } from "ng-zorro-antd/calendar";
import { NzDescriptionsModule } from "ng-zorro-antd/descriptions";
import { NzDatePickerModule } from "ng-zorro-antd/date-picker";
import { NzTimePickerModule } from "ng-zorro-antd/time-picker";
import { NzCollapseModule } from "ng-zorro-antd/collapse";

import { LayoutBasicComponent } from "./basic/basic.component";
import { HeaderClearStorageComponent } from "./basic/widgets/clear-storage.component";
import { HeaderFullScreenComponent } from "./basic/widgets/fullscreen.component";
import { HeaderI18nComponent } from "./basic/widgets/i18n.component";
import { HeaderSearchComponent } from "./basic/widgets/search.component";
import { HeaderUserComponent } from "./basic/widgets/user.component";
import { LayoutBlankComponent } from "./blank/blank.component";
//import { FullCalendarModule } from "@fullcalendar/angular";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import timeGridPlugin from "@fullcalendar/timegrid";
// import listPlugin from "@fullcalendar/list";
// import interactionPlugin from "@fullcalendar/interaction";
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';

// FullCalendarModule.registerPlugins([
//   dayGridPlugin,
//   timeGridPlugin,
//   listPlugin,
//   interactionPlugin,
// ]);
const COMPONENTS = [LayoutBasicComponent, LayoutBlankComponent];

const HEADERCOMPONENTS = [
  HeaderSearchComponent,
  HeaderFullScreenComponent,
  HeaderI18nComponent,
  HeaderClearStorageComponent,
  HeaderUserComponent,
  SettingModalComponent,
];

// passport
import { LayoutPassportComponent } from "./passport/passport.component";
import { SettingModalComponent } from "./basic/widgets/setting-modal/setting-modal.component";
//import { CalendarModalComponent } from "./basic/widgets/calendar-modal/calendar-modal.component";
import { ContactModalComponent } from "./basic/widgets/contact-modal/contact-modal.component";

const PASSPORT = [LayoutPassportComponent];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    AlainThemeModule.forChild(),
    ThemeBtnModule,
    SettingDrawerModule,
    LayoutDefaultModule,
    NoticeIconModule,
    GlobalFooterModule,
    NzDropDownModule,
    NzInputModule,
    NzAutocompleteModule,
    NzGridModule,
    NzFormModule,
    NzSpinModule,
    NzBadgeModule,
    NzAvatarModule,
    NzIconModule,
    NzLayoutModule,
    NzBreadCrumbModule,
    NzPageHeaderModule,
    NzButtonModule,
    NzSpaceModule,
    NzDrawerModule,
    NzModalModule,
    NzTabsModule,
    NzSelectModule,
    NzCardModule,
    NzSwitchModule,
    ReactiveFormsModule,
    NzCheckboxModule,
    NzDividerModule,
    NzCalendarModule,
    NzDescriptionsModule,
    NzDatePickerModule,
    NzTimePickerModule,
    NzCollapseModule,
     NgxIntlTelInputModule,
     NzCarouselModule
  ],
  declarations: [
    ...COMPONENTS,
    ...HEADERCOMPONENTS,
    ...PASSPORT,
    ContactModalComponent,
  ],
  exports: [...COMPONENTS, ...PASSPORT],
})
export class LayoutModule {}
