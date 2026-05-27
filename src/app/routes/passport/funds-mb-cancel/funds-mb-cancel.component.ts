import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-funds-success',
  templateUrl: './funds-mb-cancel.component.html',
  styleUrls: ['./funds-mb-cancel.component.less']
})
export class FundsMbCancelComponent implements OnInit {
  constructor(private route: ActivatedRoute, private common: ApiService, private router: Router) {}
  orderId: any = '';
  timeLeft: number = 10;
  interval:any
  ngOnInit(): void {
    this.interval = setInterval(() => {
      if(this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.timeLeft = 10;
      }
    },1000)
  }


  goWallet(){
   this.router.navigate(['en/funds/wallet'])
  }
}
