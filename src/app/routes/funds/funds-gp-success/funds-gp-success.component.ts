import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-funds-success',
  templateUrl: './funds-gp-success.component.html',
  styleUrls: ['./funds-gp-success.component.less']
})
export class FundsGpSuccessComponent implements OnInit {
  loading:any = true
  info:any = '';
  constructor(private route: ActivatedRoute, private common: ApiService, private router: Router) {}

  ngOnInit(): void {
    // this.orderId = this.route.snapshot.paramMap.get('id');
    // this.common.getSuccessStatus(this.customerParams).subscribe((res: any) => {
    //  console.log(res)
    // });
   // this.redirectMerchant();
  }


  goWallet(){
   this.router.navigate(['en/funds/wallet'])
  }

  redirectMerchant() {
    const body = {
      merchant_token: sessionStorage.getItem('merchant_token'),
      merchant_secret: sessionStorage.getItem('merchant_secret')
    }
    this.common.redirectMerchant(body).subscribe(
      (res: any) => {
        if(res?.data?.is_CPT_Customer) {
        // there will be no redirection
        } else {
          window.open(res.data.redirect_URL, "_self");
        }
      },
    );
  }
}
