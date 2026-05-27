import { Component, Inject, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { I18NService } from '@core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'layout-passport',
  templateUrl: './passport.component.html',
  styleUrls: ['./passport.component.less']
})
export class LayoutPassportComponent implements OnInit {
    @ViewChild('carousel', { static: false }) carousel!: ElementRef;
  slides = [
    { text: 'CFDs with leverage or real stocks without commission', image: 'assets/images/auth/auth-trade.png' },
    { text: 'Trade via App, Web or Desktop', image: 'assets/images/auth/web-trade.png' },
    { text: 'Regulated by MFSA', image: 'assets/images/auth/regulated.png' },
    { text: 'Access to Education incl. Webinars', image: 'assets/images/auth/webinar.png' }
  ];
  currentIndex = 0;
  slideInterval!: any;
  isLogin: boolean = true
  isDiwali:boolean | undefined
  logo = '';
  bg = '';
  links = [
    {
      title: '帮助',
      href: ''
    },
    {
      title: '隐私',
      href: ''
    },
    {
      title: '条款',
      href: ''
    }
  ];
  width: string = '363px';
  langs = this.i18nSev.i18nUrl();
  showHead: boolean | undefined;
  showRegList: boolean | undefined;
  showDemo: boolean | undefined;
  isDiwaliText: boolean | undefined;
  showInstitute: boolean | undefined;
  constructor(@Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService, private router: Router, private common: ApiService,  private i18nSev: I18NService,  private route: ActivatedRoute,) {
    console.log(this.langs)
    // query parameter
    const url = window.location.href;
    if (url.includes('?')) {
      this.route.queryParamMap.subscribe((res:any)=> {
        console.log(res?.params?.utm_campaign)
        if(res?.params?.utm_campaign === 'diwali') {
          this.isDiwali = true
          this.showInstitute = false;
        } else {

        }
      })
    
    }
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((res:any) => {
      console.log(res)
      if (this.router.url.search('login') > -1 || this.router.url.search('uniauth') > -1  || this.router.url.search('forgot-password') > -1 || this.router.url.search('verify-email') > -1) {
        this.isLogin = true
        this.showHead = true;
        this.showRegList = false;
        this.showDemo = false;
        this.showInstitute = false;
        this.isDiwali = false
      } else if(this.router.url.search('register-list') > -1) {
        this.isLogin = false
        this.showHead = false;
        this.showRegList = true;
        this.showDemo = false;
        this.showInstitute = false;
      } 

      else if(this.router.url.includes('register?bt')) {
        this.isLogin = false
        this.showHead = false;
        this.showRegList = true;
        this.showDemo = false;
        this.showInstitute = false;
      } 

      else if(this.router.url.search('demo') > -1) {
        this.isLogin = false
        this.showHead = true;
        this.showRegList = false;
        this.showDemo = true;
        this.showInstitute = false;
        this.isDiwali = false
      } 
      else if(this.router.url.search('corporate') > -1) {
        this.isLogin = false
        this.showHead = true;
        this.showRegList = false;
        this.showDemo = false;
        this.showInstitute = true;
      }

       else if(this.router.url.search('corporate') > -1) {
        this.isLogin = false
        this.showHead = true;
        this.showRegList = false;
        this.showDemo = false;
        this.showInstitute = true;
      }

      else if(this.router.url.search('success') > -1 || this.router.url.search('cancel') > -1 || this.router.url.search('error') > -1 || this.router.url.search('result') > -1) {
        this.isLogin = false
        this.showHead = false;
        this.showRegList = false;
        this.showDemo = false;
        this.showInstitute = false;
        this.isDiwali = false
      }
      else {
        this.isLogin = false
        this.showHead = true;
        this.showRegList = false;
        this.showDemo = false;
      }
    });
  }

  ngAfterViewInit() {
    // Make sure the carousel element exists
    if (this.carousel && this.carousel.nativeElement) {
      this.startAutoSlide();
    }
  }

  startAutoSlide() {
    const carouselEl = this.carousel.nativeElement;
    this.slideInterval = setInterval(() => {
      if (!carouselEl) return;
      this.currentIndex = (this.currentIndex + 1) % this.slides.length;
      const scrollAmount = carouselEl.clientWidth * this.currentIndex;
      carouselEl.scrollTo({ left: scrollAmount, behavior: 'smooth' });
    }, 4000); // 3 seconds per slide
  }

  ngOnDestroy() {
    clearInterval(this.slideInterval);
  }


  ngOnInit(): void {
    this.startAutoSlide();
   // this.getReport();
    this.tokenService.clear();
    if (location.hash.indexOf('/user/register') !== -1) {
      this.width = '82%';
    } else {
      this.width = '363px';
    }

    (this.router.events.pipe(filter(event => event instanceof NavigationEnd)) as Observable<NavigationEnd>).subscribe(router => {
      const arr = router.url;
      if (arr === '/user/register') {
        this.width = '72%';
      } else {
        this.width = '363px';
      }
    });


  }

  public getReport() {
    this.common.getImgBg().subscribe((res: any) => {
      let content = res.data;
      this.logo = environment.api.crmUrl + content.loginBackground_LogoPath;
      this.bg = environment.api.crmUrl + content.loginBackground_ImagePath;
    });
  }
}
