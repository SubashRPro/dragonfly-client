import { Component, OnInit } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { I18NService } from "@core";
import { NzMessageService } from "ng-zorro-antd/message";
import { NzModalRef, NzModalService } from "ng-zorro-antd/modal";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: "app-myfatoorah",
  templateUrl: "./fatoorah-error.component.html",
  styleUrls: ["./fatoorah-error.component.less"],
})
export class FatoorahError implements OnInit {
  ifromUrl: any;
  loading: boolean = false;
  param: any = {};
  trxId: any;
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
    // setTimeout(()=> {
    //   this.router.navigate(['en/funds/deposit'])
    // },5000)
    this.route.params.subscribe((params: any) => {
      console.log(params.id);
      this.trxId = params.id;
      console.log(params,'params.id');
      
      // setTimeout(() => {
      this.http
        .fatooraError({
          eventType: 1,
          event: "string",
          dateTime: "string",
          countryIsoCode: "string",
          data: {
            invoiceId: 0,
            invoiceReference: "string",
            createdDate: "string",
            customerReference: this.trxId,
            customerName: "string",
            customerMobile: "string",
            customerEmail: "string",
            transactionStatus: "string",
            paymentMethod: "string",
            referenceId: "string",
            trackId: "string",
            paymentId: "string",
            authorizationId: "string",
            invoiceValueInBaseCurrency: 0,
            baseCurrency: "string",
            invoiceValueInDisplayCurreny: 0,
            displayCurrency: "string",
            invoiceValueInPayCurrency: 0,
            payCurrency: "string",
          },
        })
        .subscribe((res: any) => {
          console.log(res);
        });
      // }, 1000);
    });

    this.loading = true;
    this.route.queryParams.subscribe((param) => {
      this.param = { ...param };
      this.http.getAvailablePaymentMethods(this.param).subscribe((res: any) => {
        console.log(res);
      });
      // if (this.param.postType === 'D') {
      //   this.http.getDepositByCardPraxisPaymentAsync({ ...this.param, postType: undefined }).subscribe(
      //     (res: any) => {
      //       const result = res?.data;
      //       this.loading = false;
      //       if (result.status !== 400) {
      //         this.ifromUrl = this.sanitizer.bypassSecurityTrustResourceUrl(result.redirect_url);
      //       } else {
      //         this.message.error(result?.description);
      //       }
      //     },
      //     error => {
      //       this.loading = false;
      //       this.message.error(error?.body?.message);
      //     }
      //   );
      // } else {
      //   this.http.getWithdrawByCardPraxisPaymentAsync({ ...this.param, postType: undefined }).subscribe(
      //     (res: any) => {
      //       const result = res?.data;
      //       this.loading = false;
      //       if (result.status !== 400) {
      //         this.ifromUrl = this.sanitizer.bypassSecurityTrustResourceUrl(result.redirect_url);
      //       } else {
      //         this.message.error(result?.description);
      //       }
      //     },
      //     error => {
      //       this.loading = false;
      //       this.message.error(error?.body?.message);
      //       this.router.navigateByUrl(`${this.langs}/funds/withdraw`);
      //     }
      //   );
      // }
    });
    // setTimeout(()=> {
    //   this.http.fatooraError({
    //     eventType: 1,
    //     event: "string",
    //     dateTime: "string",
    //     countryIsoCode: "string",
    //     data: {
    //       invoiceId: 0,
    //       invoiceReference: "string",
    //       createdDate: "string",
    //       customerReference:  this.trxId,
    //       customerName: "string",
    //       customerMobile: "string",
    //       customerEmail: "string",
    //       transactionStatus: "string",
    //       paymentMethod: "string",
    //       referenceId: "string",
    //       trackId: "string",
    //       paymentId: "string",
    //       authorizationId: "string",
    //       invoiceValueInBaseCurrency: 0,
    //       baseCurrency: "string",
    //       invoiceValueInDisplayCurreny: 0,
    //       displayCurrency: "string",
    //       invoiceValueInPayCurrency: 0,
    //       payCurrency: "string"
    //   }
    // }).subscribe((res:any)=> {
    //   console.log(res)
    // })
    // },1000)
  }

  goWallet() {
    this.router.navigate(["en/funds/wallet"]);
  }
}
