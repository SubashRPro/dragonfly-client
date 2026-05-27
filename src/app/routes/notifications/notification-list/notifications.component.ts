import {Component, Injector, OnInit} from '@angular/core';
import {ApiService} from "../../../services/api.service";
import {NzMessageService} from 'ng-zorro-antd/message';
import {DatePipe} from '@angular/common';
import {DA_SERVICE_TOKEN, ITokenService} from '@delon/auth';
import {Router} from "@angular/router";
import {I18NService} from "@core";

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.less']
})
export class NotificationsComponent implements OnInit {

  constructor(
    private injector: Injector,
    private api: ApiService,
    public message: NzMessageService,
    private datePipe: DatePipe,
    private router: Router,
    private i18nSev: I18NService
  ) { }

  langs = this.i18nSev.i18nUrl();

  public page = 1;
  public pageSize = 100;
  public filter = {
    pageNumber: '',
    numberOfItemPerPage: ''
  };

  notificationList: any = null;
  loader: boolean = true;
  noData!:boolean;

  ngOnInit(): void {
    this.getNotificationList(1, this.pageSize);
  }

  private get tokenSrv(): ITokenService {
    return this.injector.get(DA_SERVICE_TOKEN);
  }

  getNotificationList(pageNumber: any, itemsPerPage: any) {
    this.filter = {
      pageNumber: pageNumber,
      numberOfItemPerPage: itemsPerPage
    };
    this.api.getAllNotifications(this.filter).subscribe((res: any) => {
      let data = res.data.pageData;
      if(data == null) {
        this.noData = true;
      } else {
        // let reArrangeList = data.map((obj: any) => ({
        //   id: obj.id,
        //   created_Date: this.formatDate(obj.created_Date),
        //   title: obj.title,
        //   description: obj.description,
        //   readStatus: obj.readStatus,
        //   notification_Type: obj.notification_Type,
        //   notification_Type_Desc: obj.notification_Type_Desc,
        // }));

        this.notificationList = data.sort((a: any, b: any) => a.id > b.id ? 1 : -1).reverse();
      }
        this.loader = false;
    },
    err => {
      this.loader = false;
      this.message.error(err.body.message);
    });
  }

  formatDate(date: any) {
    return new Date(date).toLocaleDateString();
  }

  redirectNotice(type: any) {
    let redirectTo = 'dashboard';
    if(type == 1 || type == 2 || type == 3) {
      redirectTo = 'funds/wallet'
    }

    this.router.navigateByUrl(`${this.langs}/${redirectTo}`);
  }

}
