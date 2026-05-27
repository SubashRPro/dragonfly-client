import { Component, OnInit } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { I18NService } from "@core";
import { NzMessageService } from "ng-zorro-antd/message";
import { NzModalRef, NzModalService } from "ng-zorro-antd/modal";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: "app-myfatoorah-success",
  templateUrl: "./fatoorah-success.component.html",
  styleUrls: ["./fatoorah-success.component.less"],
})
export class FatoorahSuccess implements OnInit {
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
    // this.redirectMerchant();
    this.loading = true;
    this.route.params.subscribe((params: any) => {
      console.log(params.id);
      this.trxId = params.id;
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
    });
    // setTimeout(()=> {
    // this.http
    //   .fatooraError({
    //     eventType: 1,
    //     event: "string",
    //     dateTime: "string",
    //     countryIsoCode: "string",
    //     data: {
    //       invoiceId: 0,
    //       invoiceReference: "string",
    //       createdDate: "string",
    //       customerReference: this.trxId,
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
    //       payCurrency: "string",
    //     },
    //   })
    //   .subscribe((res: any) => {
    //     console.log(res);
    //   });
    // },1000)
  }

  goWallet() {
    this.router.navigate(["en/funds/wallet"]);
  }

  redirectMerchant() {
    const body = {
      merchant_token: sessionStorage.getItem("merchant_token"),
      merchant_secret: sessionStorage.getItem("merchant_secret"),
      transaction_type: "deposit",
    };
    this.http.redirectMerchant(body).subscribe((res: any) => {
      let data = res?.data;
      if (res?.data?.is_CPT_Customer) {
        // there will be no redirection
      } else {
        window.open(
          `${data.redirect_url}?email=${data?.email}&first_name=${data?.first_name}&last_name=${data?.last_name}&merchant_reference_id=${data?.merchant_reference_id}&transaction_id=${data?.transaction_id}&status=success&remarks=success`,
          "_self"
        );
      }
    });
  }
}
