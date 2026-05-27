import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { I18NService } from '@core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-fatoora',
  templateUrl: './fatoora-pay.component.html',
  styles: []
})
export class FatooraPayComponent implements OnInit {
  ifromUrl: any;
  loading: boolean = false;
  param: any = {};
  constructor(
    private http: ApiService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private message: NzMessageService,
    private modal: NzModalService,
    private router: Router,
    private i18nSev: I18NService
  ) {}
  langs = this.i18nSev.i18nUrl();
  ngOnInit(): void {
    this.loading = true;
    this.route.queryParams.subscribe(param => {
      this.param = { ...param };
      this.http.depositFatoora({...this.param }).subscribe((res:any)=> {
        const result = res.data;
        console.log(result)
        var url = result; 
        this.ifromUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        this.loading = false;
      },
      error => {
         this.message.error(error?.body?.message);
         this.loading = false;
       }
      )
    })
  }
  confirmModal?: NzModalRef;
  goBack() {
    // history.back();
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Are you sure to exit the current payment?',
      nzContent: 'The current return cannot be undone',
      nzOnOk: () => {
        this.router.navigateByUrl(`${this.langs}/funds/deposit`);
      }
    });
  }
}
