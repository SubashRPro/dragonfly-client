import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-funds-success',
  templateUrl: './funds-gp-cancel.component.html',
  styleUrls: ['./funds-gp-cancel.component.less']
})
export class FundsGpCancelComponent implements OnInit {
  constructor(private route: ActivatedRoute, private common: ApiService, private router: Router) {}
  orderId: any = '';
  
  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id');
    this.getgpCancelStatusByOrderId(this.orderId);
  //  this.redirectMerchant();
  }

  getgpCancelStatusByOrderId(orderId: string) {
    this.common.getgpCancelStatus(orderId).subscribe((res: any) => {
      console.log(res)
    });
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
          window.open(`${data.redirect_url}?email=${data?.email}&first_name=${data?.first_name}&last_name=${data?.last_name}&merchant_reference_id=${data?.merchant_reference_id}&transaction_id=${data?.transaction_id}&status=rejected&remarks=rejected`, "_self");
        }
      },
    );
  }

  goWallet(){
   this.router.navigate(['en/funds/wallet'])
  }
}
