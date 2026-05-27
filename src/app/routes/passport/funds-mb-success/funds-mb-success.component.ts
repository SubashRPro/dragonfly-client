import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

declare var MessageInvoker:any
@Component({
  selector: 'app-mbfunds-success',
  templateUrl: './funds-mb-success.component.html',
  styleUrls: ['./funds-mb-success.component.less']
})
export class FundsMbSuccessComponent implements OnInit {
  loading:any = true
  info:any = '';
  timeLeft: number = 10;
  interval:any
  constructor(private route: ActivatedRoute, private common: ApiService, private router: Router) {}

  ngOnInit(): void {
    // this.orderId = this.route.snapshot.paramMap.get('id');
    // this.common.getSuccessStatus(this.customerParams).subscribe((res: any) => {
    //  console.log(res)
    // });

    this.interval = setInterval(() => {
      if(this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.timeLeft = 10;
      }
    },1000)

  }

  // goWallet(): void{
  //  this.router.navigate(['en/funds/wallet']);
  //   MessageInvoker.postMessage('Trigger from Javascript code');
  // }

}
