import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { STColumn } from '@delon/abc/st';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { ITicketActivitiesParams, SupportDocument } from 'src/app/models/support';
import { ApiService } from 'src/app/services/api.service';
import { fileByBase64 } from 'src/app/shared/utils/base64';
import {I18NService} from "@core";

@Component({
  selector: 'app-view-ticket',
  templateUrl: './view-ticket.component.html',
  styleUrls: ['./view-ticket.component.less']
})
export class ViewTicketComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private common: ApiService,
    private message: NzMessageService,
    private i18nSev: I18NService
  ) {}
  langs = this.i18nSev.i18nUrl();
  activities: any = [];
  public page = 1;
  public pageSize = 10;
  totalnumber = 0;
  params = {
    pageNumber: 1,
    pageSize: 10,
    total: 0
  };
  addTicketForm!: FormGroup;
  info: any;
  ticketId: any = '';
  date: any = [];
  fileList: NzUploadFile[] = [];
  activitiesParams!: ITicketActivitiesParams;
  columns: STColumn[] = [
    {
      title: {
        text: 'Date',
        i18n: 'Date'
      },
      index: 'created_Date',
      type: 'date',
      width: 260
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
        text: 'Remarks',
        i18n: 'Remarks'
      },
      index: 'ticket_Message'
    }
  ];
  loadingSubmit:boolean = false;
  ngOnInit(): void {
    this.addTicketForm = this.fb.group({
      ticket_Message: [null, [Validators.required]]
    });

    this.route.queryParams.subscribe(param => {
      this.ticketId = param.ticket_ID;
      this.onActivities(1, this.pageSize);
      this.onGetTicketById();
    });
  }
  async onFileToBase64() {
    return await Promise.all(
      this.fileList.map(async item => {
        return {
          documentType: 'Ticket',
          fileName: item.name,
          fileType: item.type,
          b64String: await fileByBase64(item)
        } as SupportDocument;
      })
    );
  }

  loading: boolean = false;
  file!: NzUploadFile;
  beforeUpload = (file: NzUploadFile): boolean => {
    this.loading = true;
    this.file = file;
    this.common.fileUpload(file, file.name).subscribe(
      (res: any) => {
        this.loading = false;
        this.fileList = [{ uid: '-1', name: file.name, status: 'done', url: res.data.filePath }];
      },
      error => {
        this.loading = false;
      }
    );
    return false;
  };

  onUpdateTicket() {
    const files = this.fileList.map(item => {
      return {
        documentType: 'Ticket',
        fileName: item.name,
        filePath: item.url
      };
    });
    this.common
      .updateTicket(this.info.ticket_ID, {
        ...this.addTicketForm.value,
        row_Version: this.info.row_Version,
        upload_Document: [...files]
      })
      .subscribe((res: any) => {
        this.message.success('Service Ticket has been updated successfully.');
        this.onLink();
      });
    this.loadingSubmit = false
  }

  submitForm(): void {
    this.loadingSubmit = true
    if (this.addTicketForm.valid) {
      this.onUpdateTicket();
    } else {
      Object.values(this.addTicketForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      this.loadingSubmit = false
    }
  }
  onLink() {
    this.router.navigate([`${this.langs}/support`]);
  }

  backClick() {
    this.router.navigate([`${this.langs}/support`]);
  }

  onGetTicketById() {
    this.common.getTicketById(this.ticketId).subscribe((res: any) => {
      this.info = res.data;
    });
  }
  onActivities(pageNumber: any, itemsPerPage: any) {
    this.loading = true;
    this.common
      .getAllTicketActivities({
        pageNumber: pageNumber,
        numberOfItemPerPage: itemsPerPage,
        ticket_ID: this.ticketId
      })
      .subscribe((res: any) => {
        this.activities = res.data?.pageData?.map((r: any) => ({
          ...r,
          created_By: r.created_By.split('|').join(' ')
        }));

        this.totalnumber = res.data.dataCount;
        this.pageSize = res.data.pageSize;
        this.page = res.data.page;
        this.loading = false;
      });
  }

  onPageIndexChange($event: number) {
    //do something here to go to next page
    this.page = $event;
    this.onActivities(this.page, this.pageSize);
  }
  onCurrentPageDataChange($event: number) {
    this.pageSize = $event;
    this.page = 1;
    this.onActivities(this.page, this.pageSize);
  }

  downloadFile(content: string, filename: string) {
    var x = new XMLHttpRequest();
    x.open('GET', content, true);
    x.responseType = 'blob';
    x.onload = function (e) {
      var url = window.URL.createObjectURL(x.response);
      var a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
    };
    x.send();
  }
}
