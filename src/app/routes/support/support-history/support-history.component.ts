import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { STColumn, STColumnBadge, STColumnTag } from '@delon/abc/st';
import { environment } from '@env/environment';
import { I18NService } from 'src/app/core/i18n/i18n.service';
import { ITicketActivitiesParams } from 'src/app/models/support';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-support-history',
  templateUrl: './support-history.component.html',
  styleUrls: ['./support-history.component.less']
})
export class SupportHistoryComponent implements OnInit {
  constructor(private http: ApiService, private route: ActivatedRoute, private i81n: I18NService, private router: Router) {}
  users: any[] = [];
  date: any = [];
  ticket_id!: string;
  activitiesParams!: ITicketActivitiesParams;

  activities = [];
  attachments = [];
  params = {
    pageNumber: 1,
    pageSize: 10,
    total: 0
  };
  columns: STColumn[] = [
    {
      title: {
        text: 'Date',
        i18n: 'Date'
      },
      index: 'created_Date',
      width: 100
    },
    {
      title: {
        text: 'User',
        i18n: 'User'
      },
      width: 10,
      index: 'created_By'
    },
    {
      title: {
        text: 'Remarks',
        i18n: 'Remarks'
      },
      index: 'ticket_Message'
    }
  ];

  attachColumns: STColumn[] = [
    {
      title: {
        text: 'Date',
        i18n: 'Date'
      },
      index: 'created_Date'
    },
    {
      title: {
        text: 'User',
        i18n: 'User'
      },
      index: 'created_By'
    },
    {
      title: {
        text: 'File Name',
        i18n: 'File Name'
      },
      index: 'ticket_AttachmentName'
    },
    {
      title: {
        text: 'Action',
        i18n: 'Action'
      },
      buttons: [
        {
          text: this.i81n.i18n('Download file'),
          type: 'link',
          click: e => this.downloadFile(`${environment.api.fileUrl}/${e.ticket_AttachmentPath}`, e.ticket_AttachmentName)
        }
      ]
    }
  ];
  info: any = {};
  ngOnInit(): void {
    this.route.queryParams.subscribe(param => {
      this.ticket_id = param.ticket_ID;
      this.onActivities();
      this.onAttachments();
      this.onGetTicketById();
    });
  }

  langs = this.i81n.i18nUrl();

  onChange(result: Date[]): void {
    this.onActivities();
  }

  onActivities() {
    const params = this.date.length
      ? { ...this.activitiesParams, timelineFrom: this.date[0], timelineTo: this.date[1], ticket_ID: this.ticket_id }
      : { ...this.activitiesParams, ticket_ID: this.ticket_id };
    this.http.getAllTicketActivities({ ...params }).subscribe((res: any) => {
      this.activities = res.data?.pageData?.map((r: any) => ({
        ...r,
        created_By: r.created_By.split('|').join(' ')
      }));
    });
  }

  onAttachments() {
    const params = this.date.length
      ? { ...this.activitiesParams, timelineFrom: this.date[0], timelineTo: this.date[1], ticket_ID: this.ticket_id }
      : { ...this.activitiesParams, ticket_ID: this.ticket_id };
    this.http.getAllTicketAttachments({ ...params }).subscribe((res: any) => {
      this.attachments = res.data?.pageData?.map((r: any) => ({
        ...r,
        created_By: r.created_By.split('|').join(' ')
      }));
    });
  }

  downloadFile(content: string, filename: string) {
    // var x = new XMLHttpRequest();
    // x.open('GET', content, true);
    // x.responseType = 'blob';
    // x.onload = function (e) {
    //   var url = window.URL.createObjectURL(x.response);
    //   var a = document.createElement('a');
    //   a.href = url;
    //   a.download = filename;
    //   a.click();
    // };
    // x.send();
    window.open(content, "_blank");
  }

  onGetTicketById() {
    this.http.getTicketById(this.ticket_id).subscribe((res: any) => {
      this.info = res.data;
    });
  }

  backClick() {
    this.router.navigate([`${this.langs}/support`]);
  }
}
