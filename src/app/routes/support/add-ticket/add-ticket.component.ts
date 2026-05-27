import { Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { I18NService } from '@core';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { IAddTicketParams, SupportDocument } from 'src/app/models/support';
import { ApiService } from 'src/app/services/api.service';
import { fileByBase64 } from 'src/app/shared/utils/base64';

@Component({
  selector: 'app-add-ticket',
  templateUrl: './add-ticket.component.html',
  styleUrls: ['./add-ticket.component.less']
})
export class AddTicketComponent implements OnInit {
  constructor(
    private injector: Injector,
    private fb: FormBuilder,
    private http: ApiService,
    private message: NzMessageService,
    private router: Router,
    private i18nSev: I18NService
  ) {}
  langs = this.i18nSev.i18nUrl();
  addTicketForm!: FormGroup;
  loadingSubmit:boolean = false;
  ticketType!: any;
  categories!: any;
  addTicketParams!: IAddTicketParams;
  fileList: NzUploadFile[] = [];
  loading: boolean = false;
  previewImage: string = '';
  ngOnInit(): void {
    this.addTicketForm = this.fb.group({
      ticket_TypeCode: [null, [Validators.required]],
      ticket_CategoryCode: [null, [Validators.required]],
      ticket_Message: [null, [Validators.required]]
    });
    this.getAllTicketType();
  }
  private get tokenSrv(): ITokenService {
    return this.injector.get(DA_SERVICE_TOKEN);
  }

  file!: NzUploadFile;
  beforeUpload = (file: NzUploadFile): boolean => {
    this.loading = true;
    this.file = file;
    this.http.fileUpload(file, file.name).subscribe(
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

  getAllTicketType() {
    this.http.getAllTicketType().subscribe((res: any) => {
      this.ticketType = res.data;
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
  submitForm(): void {
    this.loadingSubmit = true
    if (this.addTicketForm.valid) {
      this.addTicket();
    } else {
      Object.values(this.addTicketForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      this.loadingSubmit = false;
    }
  }

  addTicket() {
    const files = this.fileList.map(item => {
      return {
        documentType: 'Ticket',
        fileName: item.name,
        filePath: item.url
      };
    });

    this.http
      .addTicket({ ...this.addTicketForm.value, customer_ID: this.tokenSrv.get()?.customer_id, upload_Document: [...files] })
      .subscribe((res: any) => {
        this.message.success(res.message);
        this.loadingSubmit = false
        this.addTicketForm.reset({
          ticket_TypeCode: '',
          ticket_CategoryCode: '',
          ticket_Message: ''
        });
        this.fileList = []
      });
  }

  getTicketCategoriesByTicketType(e: string) {
    this.http.getTicketCategoriesByTicketType(e).subscribe((res: any): void => {
      this.categories = res.data;
    });
  }

  ticketTypeOnChange(e: any) {
    if (e) {
      this.getTicketCategoriesByTicketType(e);
    }
  }

  onLink() {
    this.router.navigate([`${this.langs}/support`]);
  }
}
