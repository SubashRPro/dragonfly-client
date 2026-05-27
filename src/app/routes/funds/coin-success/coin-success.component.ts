import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-funds-success',
  templateUrl: './coin-success.component.html',
  styleUrls: ['./coin-success.component.less']
})
export class CoinSuccessComponent implements OnInit {
  orderId: any = '';
  info: any = {};
  constructor(private route: ActivatedRoute, private common: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id');
    console.log(this.orderId);
    this.getPraxisStatusByOrderId(this.orderId);
   // this.redirectMerchant();
  }

  getPraxisStatusByOrderId(orderId: string) {
    this.common.getPraxisStatusByOrderId(orderId).subscribe((res: any) => {
      this.info = res.data;
    });
  }


  goWallet(){
    this.router.navigate(['en/funds/wallet'])
   }

   redirectMerchant() {
    const body = {
      merchant_token: sessionStorage.getItem('merchant_token'),
      merchant_secret: sessionStorage.getItem('merchant_secret'),
      transaction_type: 'deposit'
    }
    this.common.redirectMerchant(body).subscribe(
      (res: any) => {
        let data = res?.data
        if(res?.data?.is_CPT_Customer) {
        // there will be no redirection
        } else {
          window.open(`${data.redirect_url}?email=${data?.email}&first_name=${data?.first_name}&last_name=${data?.last_name}&merchant_reference_id=${data?.merchant_reference_id}&transaction_id=${data?.transaction_id}&status=success&remarks=success`, "_self");
        }
      },
    );
  }

}
