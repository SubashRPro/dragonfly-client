import { ChangeDetectionStrategy, Component, Inject, Injector, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { I18NService } from '@core';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ClipboardService } from 'ngx-clipboard';
import { ApiService } from 'src/app/services/api.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent1 implements OnChanges, OnInit {
  array = [1, 2, 3, 4];
  effect = 'scrollx';
  validateForm!: FormGroup;
  options: any;
  echarts: any;
  symbol: any;
  margins: any;
  currency: any = ['USD', 'EUR', 'GBP'];
  leverage: any = ['1:100', '1:200', '1:400', '1:500'];
  MT4lot: number = 0;
  symbolOption: string = '';
  customer_id = this.tokenSrv.get()?.customer_id;
  calculator: any = { longSwap: 0.0, marginValue: 0.0, pipValue: 0.0, shortSwap: 0.0, profitValue: 0.0 };
  isMargin: boolean = false;
  balanceLoader: boolean = true;
  colorPalette = ['#16678D', '#00b6f2'];
  isVisible = false;
  current = 0;
  user:any;
  totals:any;
  langs = this.i18nSev.i18nUrl();
  constructor(
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private message: NzMessageService,
    private injector: Injector,
    private fb: FormBuilder,
    private common: ApiService,
    private clipboardService: ClipboardService,
    private router: Router,
    private i18nSev: I18NService,
  ) {
    
  }

  ngOnInit(): void {
    this.getSymbolList();
    this.validateForm = this.fb.group({
      symbol: [null, [Validators.required]],
      positionSize: [null, [Validators.required]],
      lots: [null, [Validators.required]],
      leverage: [null, [Validators.required]],
      currency: [null, [Validators.required]],
      close_price: null,
      open_price: null
    });
    // this.getBalanceChart();
    this.validateForm.get('currency')!.setValue('USD');
    // this.getChartData();
    this.common.getBalanceData().subscribe((res: any) => {
      this.getBalanceChart(res.data);
      this.balanceLoader = false;
      // console.log(res.data);
    });
    setTimeout(()=> {
      this.user = this.tokenSrv.get()?.customer_FirstName;
      if(this.tokenService.get()?.afterLogin_Popup === 101) {
        this.isVisible = true
      }
      
    },500)
   
  }

  private get tokenSrv(): ITokenService {
    return this.injector.get(DA_SERVICE_TOKEN);
  }



  // getChartData() {
  //   this.common.getChartData(this.customer_id).subscribe(
  //     (res: any): void => {
  //       console.log(res.data);
  //       const content = res.data;
  //       console.log(content);
  //       const dat1 = content.map((c: { code: any }) => {
  //         return c.code;
  //       });
  //       const dat2 = content.map((c: { amount: any }) => {
  //         return c.amount;
  //       });
  //       this.pieChartData = dat1;
  //       this.pieChartLabels = dat2;
  //     },
  //     error => {
  //       this.message.error(error.body.message);
  //     }
  //   );
  // }

  //get balance chart
  getBalanceChart(chartData: any) {
    // this.options = {
    //   title: {
    //     left: 'center'
    //   },
    //   tooltip: {
    //     trigger: 'item',
    //     formatter: '{a} <br/>{b} : {c} ({d}%)'
    //   },
    //   legend: {
    //     left: 'center',
    //     top: 'bottom'
    //   },
    //   toolbox: {
    //     show: true,
    //     feature: {
    //       mark: { show: true },
    //       dataView: { show: true, readOnly: false },
    //       magicType: {
    //         show: true
    //       },
    //       restore: { show: true },
    //       saveAsImage: { show: true }
    //     }
    //   },
    //   series: [
    //     {
    //       name: 'Balance',
    //       type: 'pie',
    //       radius: [65, 120],
    //       center: ['50%', '50%'],
    //       roseType: 'area',
    //       data: chartData.map((m: { type: any; balance: any }) => ({
    //         name: m.type,
    //         value: m.balance
    //       }))
    //     }
    //   ],
    //   color: this.colorPalette
    // };

    this.options = {
      title: {
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c}USD'
      },
      legend: {
        bottom: '1%',
        left: 'center',
        show: true,
        textStyle: {
          color: '#a4a1a1'
        }
      },
      series: [
        {
          type: 'pie',
          radius: [60, 100],
          label: {
            formatter: '{c}USD'
          },
          // itemStyle: {
          //   borderRadius: 10,
          //   borderColor: '#fff',
          //   borderWidth: 2
          // },
          data: chartData.map((m: { type: any; balance: any }) => ({
            name: `${m.type}`,
            value: m.balance
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 0,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0)'
            }
          }
        }
      ],
      color: this.colorPalette
    };
  }
  getSymbolList() {
    this.common.getSymbol().subscribe((res: any) => {
      this.symbol = res.data;
      this.validateForm.get('symbol')!.setValue(res.data ? res.data[0].SYMBOL : '');
    });
  }

  positionSizeChange() {
    const MT4lot = Number((this.validateForm.value.positionSize * 0.00001).toFixed(6));
    this.validateForm.get('lots')!.setValue(MT4lot);
  }

  onCalculate(type: string = 'Margin') {
    if (this.validateForm.valid) {
      if (type == 'Margin') {
        this.common.getMarginList({ ...this.validateForm.value }).subscribe((res: any) => {
          this.calculator = { ...res.data };
        });
      } else {
        this.common.getProfitList({ ...this.validateForm.value, type: 'buy' }).subscribe((res: any) => {
          this.calculator = { ...res.data };
        });
      }
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
  }
  ngModelChange() {
    this.calculator = { longSwap: 0.0, marginValue: 0.0, pipValue: 0.0, shortSwap: 0.0, profitValue: 0.0 };
  }
  onCype() {
    this.clipboardService.copyFromContent('www.cpt.com');
    this.message.success('copied');
  }
  
  goVerify() {
    this.current = 1
  }

  goProfile() {
  this.router.navigate([`${this.langs}/profile`])
}

}