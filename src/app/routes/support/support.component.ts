import { Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { I18NService } from '@core';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiService } from 'src/app/services/api.service';

declare var $:any

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.less']
})
export class SupportComponent implements OnInit {
  validateForm!: FormGroup;
  isCollapse = false;
  loading = false;
  users: any[] = [];
  public totalnumber = [];
  public page = 1;
  public pageSize = 100;
  dateFormat = 'dd-MM-yyyy';
  totaData?:number
  dataCount: number = 0;
  public filter = {
    pageNumber: '',
    customer_ID: this.tokenSrv.get()?.customer_id,
    numberOfItemPerPage: '',
    status: ''
  };
  langs = this.i18nSev.i18nUrl();
  allType: Array<{ code: any; description: any }> = [];
  ticketType: Array<{ code: any; description: any }> = [];
  allStatus: Array<{ code: any; description: any }> = [
    {
      code: 'Open',
      description: 'Open'
    },
    {
      code: 'In-Progress',
      description: 'In-Progress'
    },
    {
      code: 'Resolved',
      description: 'Resolved'
    }
  ];

  dataLoader: boolean = true;
  noData!:boolean;

  constructor(
    private injector: Injector,
    private router: Router,
    private fb: FormBuilder,
    private common: ApiService,
    private message: NzMessageService,
    private i18nSev: I18NService
  ) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      ticketType: '',
      categoryType: '',
      status: '',
      timeline: [''],
      customer_ID: ''
    });
   // this.getTicketList(1, this.pageSize);
  //  this.getTicketType();
  }
  private get tokenSrv(): ITokenService {
    return this.injector.get(DA_SERVICE_TOKEN);
  }
  //get all ticket method
  public getTicketList(pageNumber: any, itemsPerPage: any, status: any = '') {
    this.loading = true;
    this.dataLoader = true;
    this.filter = {
      pageNumber: pageNumber,
      numberOfItemPerPage: itemsPerPage,
      customer_ID: this.tokenSrv.get()?.customer_id,
      status: status
    };
    this.common.getTicketList(this.filter).subscribe((res: any) => {
      this.loading = false;
      this.dataLoader = false;
      if(res.data.pageData.length == 0) {
        this.noData = true;
      } else {
        this.noData = false;
      }
      this.users = res.data.pageData;
      this.dataCount = res.data.dataCount;
      this.pageSize = res.data.pageSize;
      this.page = res.data.page;
      this.totaData = res.data.dataCount


    });
  }

  onSearch(type: any) {
    this.dataLoader = true;
    this.getTicketList(1, this.pageSize, type);
  }

  getTicketType() {
    this.common.getTicketType().subscribe((res: any): void => {
      this.allType = res.body.data;
    });
  }

  getTicketCategoriesByTicketType(e: string) {
    this.common.getTicketCategoriesByTicketType(e).subscribe((res: any): void => {
      this.ticketType = res.data;
    });
  }
  resetForm(): void {
    this.validateForm.reset();
    this.filter = {
      ...this.filter,
      status: ''
    };
    this.getTicketList(1, this.pageSize);
  }

  collapseChange(e: boolean) {
    this.isCollapse = e;
  }

  // go to view page
  gotoView(data: any) {
    this.router.navigate([`${this.langs}/support/view-ticket`], { queryParams: { ticket_ID: data } });
  }

  // go to history page
  gotoHistory(data: any) {
    this.router.navigate([`${this.langs}/support/support-history`], { queryParams: { ticket_ID: data } });
  }

  //on filter
  onfilter() {
    console.log(this.validateForm.value);
  }

  onPageIndexChange($event: number) {
    //do something here to go to next page
    this.page = $event;
    this.getTicketList(this.page, this.pageSize);
  }
  onCurrentPageDataChange($event: number) {
    this.pageSize = $event;
    this.page = 1;
    this.getTicketList(this.page, this.pageSize);
  }
  ticketTypeOnChange(e: any) {
    if (e) {
      this.getTicketCategoriesByTicketType(e);
    }
  }

  helpdesk:boolean = true
  faqData:boolean = false
  isValue: number = 1;
  raisedTicket() {
     this.helpdesk = true
     this.faqData = false
     this.isValue = 1;
   }

   email() {
    this.isValue = 2;
   }

   openChat() {
    $('#scNrLF').trigger('click');
    $('#psmtc_NrLF ps_messenger__toggle-content ps_rvm__hidden').trigger('click');
    this.isValue = 3;
  }

  faq() {
    this.faqData = true
    this.helpdesk = false
    this.isValue = 4;
   }
}
