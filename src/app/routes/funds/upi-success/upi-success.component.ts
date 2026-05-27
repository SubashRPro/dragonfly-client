import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-upi-success',
  templateUrl: './upi-success.component.html',
  styleUrls: ['./upi-success.component.less']
})
export class UpiSuccessComponent implements OnInit {
  orderId: any = '';
  info: any = {};
  constructor(private route: ActivatedRoute, private common: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id');
    console.log(this.orderId);
  //  this.getPraxisStatusByOrderId(this.orderId);
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