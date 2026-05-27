import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { I18NService } from '@core';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styles: []
})
export class VerificationComponent implements OnInit {
  customerId!: string;
  data: any;
  langs = this.i18nSev.i18nUrl();
  constructor(private injector: Injector, private api: ApiService, private router: Router, private i18nSev: I18NService) {}

  ngOnInit(): void {
    this.getCustomerById();
  }

  private get tokenSrv(): ITokenService {
    return this.injector.get(DA_SERVICE_TOKEN);
  }

  getCustomerById() {
    this.customerId = this.tokenSrv.get()?.customer_id;

    this.api.getCustomerProfile().subscribe((res: any) => {
      this.data = res.data[0];
      if (
        res.data[0]?.verification_Status == 'InProgress' &&
        res.data[0]?.customer_Status == 'Pending' &&
        res.data[0]?.kyC_QuestionnaireStatus == 'Completed'
      ) {
        this.router.navigateByUrl(`${this.langs}/profile/verification`);
        return;
      } else if (
        res.data[0]?.verification_Status == 'Completed' &&
        res.data[0]?.customer_Status == 'Verified' &&
        res.data[0]?.kyC_QuestionnaireStatus == 'Completed'
      ) {
        this.router.navigateByUrl(`${this.langs}/profile/verification-information`);
        return;
      }
    });
  }

  goDashboard() {
    this.router.navigateByUrl(`${this.langs}/dashboard`);
  }
}
