import {
  Component,
  Inject,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { I18NService } from '@core';
import { ApiService } from 'src/app/services/api.service';
import gsap from 'gsap';

@Component({
  selector: 'layout-passport',
  templateUrl: './passport.component.html',
  styleUrls: ['./passport.component.less']
})
export class LayoutPassportComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('carousel', { static: false }) carousel!: ElementRef;

  slides = [
    { text: 'CFDs with leverage or real stocks without commission', image: 'assets/images/auth/auth-trade.png' },
    { text: 'Trade via App, Web or Desktop', image: 'assets/images/auth/web-trade.png' },
    { text: 'Regulated by MFSA', image: 'assets/images/auth/regulated.png' },
    { text: 'Access to Education incl. Webinars', image: 'assets/images/auth/webinar.png' }
  ];

  currentIndex = 0;
  slideInterval!: any;
  isLogin = true;
  isDiwali: boolean | undefined;
  logo = '';
  bg = '';
  width = '363px';

  links = [
    { title: '帮助', href: '' },
    { title: '隐私', href: '' },
    { title: '条款', href: '' }
  ];

  langs = this.i18nSev.i18nUrl();

  showHead: boolean | undefined;
  showRegList: boolean | undefined;
  showDemo: boolean | undefined;
  isDiwaliText: boolean | undefined;
  showInstitute: boolean | undefined;

  private gsapContext!: gsap.Context;

  constructor(
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private router: Router,
    private common: ApiService,
    private i18nSev: I18NService,
    private route: ActivatedRoute
  ) {
    const url = window.location.href;

    if (url.includes('?')) {
      this.route.queryParamMap.subscribe((res: any) => {
        if (res?.params?.utm_campaign === 'diwali') {
          this.isDiwali = true;
          this.showInstitute = false;
        }
      });
    }

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        if (
          this.router.url.search('login') > -1 ||
          this.router.url.search('uniauth') > -1 ||
          this.router.url.search('forgot-password') > -1 ||
          this.router.url.search('verify-email') > -1
        ) {
          this.isLogin = true;
          this.showHead = true;
          this.showRegList = false;
          this.showDemo = false;
          this.showInstitute = false;
          this.isDiwali = false;
        } else if (this.router.url.search('register-list') > -1) {
          this.isLogin = false;
          this.showHead = false;
          this.showRegList = true;
          this.showDemo = false;
          this.showInstitute = false;
        } else if (this.router.url.includes('register?bt')) {
          this.isLogin = false;
          this.showHead = false;
          this.showRegList = true;
          this.showDemo = false;
          this.showInstitute = false;
        } else if (this.router.url.search('demo') > -1) {
          this.isLogin = false;
          this.showHead = true;
          this.showRegList = false;
          this.showDemo = true;
          this.showInstitute = false;
          this.isDiwali = false;
        } else if (this.router.url.search('corporate') > -1) {
          this.isLogin = false;
          this.showHead = true;
          this.showRegList = false;
          this.showDemo = false;
          this.showInstitute = true;
        } else if (
          this.router.url.search('success') > -1 ||
          this.router.url.search('cancel') > -1 ||
          this.router.url.search('error') > -1 ||
          this.router.url.search('result') > -1
        ) {
          this.isLogin = false;
          this.showHead = false;
          this.showRegList = false;
          this.showDemo = false;
          this.showInstitute = false;
          this.isDiwali = false;
        } else {
          this.isLogin = false;
          this.showHead = true;
          this.showRegList = false;
          this.showDemo = false;
        }
      });
  }

  ngOnInit(): void {
    this.tokenService.clear();

    this.width = location.hash.indexOf('/user/register') !== -1 ? '82%' : '363px';

    (this.router.events.pipe(filter(event => event instanceof NavigationEnd)) as Observable<NavigationEnd>)
      .subscribe(router => {
        this.width = router.url === '/user/register' ? '72%' : '363px';
      });
  }

  ngAfterViewInit(): void {
    if (this.carousel?.nativeElement) {
      this.startAutoSlide();
    }

    setTimeout(() => {
      this.initForexAnimation();
    }, 300);
  }

  initForexAnimation(): void {
    this.gsapContext = gsap.context(() => {
      gsap.to('.orb-one', {
        x: -40,
        y: -30,
        scale: 1.08,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      gsap.to('.orb-two', {
        x: 35,
        y: -25,
        scale: 1.06,
        duration: 7,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      gsap.to('.orb-three', {
        x: -25,
        y: 20,
        scale: 1.08,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      gsap.to('.wave-line', {
        x: -60,
        opacity: 0.75,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.45
      });

      gsap.to('.pulse-ring', {
        scale: 1.25,
        opacity: 0.22,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.5
      });

      gsap.to('.market-bars span', {
        scaleY: () => gsap.utils.random(0.65, 1.35),
        transformOrigin: 'bottom center',
        duration: 1.35,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.15
      });

      gsap.to('.glass-card', {
        y: -14,
        duration: 3.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.45
      });

      gsap.to('.trade-dot', {
        scale: 1.8,
        opacity: 0.35,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.3
      });
    });
  }

  startAutoSlide(): void {
    const carouselEl = this.carousel?.nativeElement;

    this.slideInterval = setInterval(() => {
      if (!carouselEl) return;

      this.currentIndex = (this.currentIndex + 1) % this.slides.length;
      const scrollAmount = carouselEl.clientWidth * this.currentIndex;

      carouselEl.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }, 4000);
  }

  ngOnDestroy(): void {
    clearInterval(this.slideInterval);
    this.gsapContext?.revert();
  }

  public getReport(): void {
    this.common.getImgBg().subscribe((res: any) => {
      const content = res.data;
      this.logo = environment.api.crmUrl + content.loginBackground_LogoPath;
      this.bg = environment.api.crmUrl + content.loginBackground_ImagePath;
    });
  }
}