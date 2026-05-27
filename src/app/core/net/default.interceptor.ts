import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpResponseBase
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { ALAIN_I18N_TOKEN, _HttpClient } from '@delon/theme';
import { environment } from '@env/environment';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, filter, mergeMap, switchMap, take } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { I18NService } from "@core";
import { str } from 'ajv';
const CODEMESSAGE: { [key: number]: string } = {
  200: 'The server successfully returned the requested data.',
  201: 'Data is created or modified successfully. Procedure',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: 'Delete data successfully.',
  400: 'The server did not create or modify data.',
  401: 'User does not have permission (wrong token, username, password).',
  403: 'The user is authorized, but access is prohibited.',
  404: 'The request was made for a nonexistent record, and the server did not act on it.',
  406: 'The requested format is not available.',
  410: 'The requested resource is permanently deleted and will no longer be available.',
  422: '当创建一个对象时，发生一个验证错误',
  500: 'An error occurred on the server. Check the server.',
  502: 'Gateway error.',
  503: 'The service is unavailable, the server is temporarily overloaded or maintained.',
  504: 'Gateway timed out.'
};

/**
 * 默认HTTP拦截器，其注册细节见 `app.module.ts`
 */
@Injectable()
export class DefaultInterceptor implements HttpInterceptor {
  langs:any = this.i18nSev.i18nUrl();
  langugae:string = this.langs?.substring(1)
  private refreshTokenEnabled = environment.api.refreshTokenEnabled;
  private refreshTokenType: 're-request' | 'auth-refresh' = environment.api.refreshTokenType;
  private refreshToking = false;
  private refreshToken$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private injector: Injector, private api: ApiService, private router: Router,  private i18nSev: I18NService,) {
    
    if (this.refreshTokenType === 'auth-refresh') {
      this.buildAuthRefresh();
    }
  }

  private get notification(): NzNotificationService {
    return this.injector.get(NzNotificationService);
  }

  private get tokenSrv(): ITokenService {
    return this.injector.get(DA_SERVICE_TOKEN);
  }

  private get http(): _HttpClient {
    return this.injector.get(_HttpClient);
  }

  private goTo(url: string): void {
    setTimeout(() => this.injector.get(Router).navigateByUrl(url));
  }

  private checkStatus(ev: HttpResponseBase | any): any {
    if ((ev.status >= 200 && ev.status < 300) || ev.status === 401 || ev.status === 100) {
      return;
    }

    const errortext = CODEMESSAGE[ev.status] || ev.statusText || ev['error']?.errors[0].Customer_Mobile[0];
    console.log(ev.error?.errors[0]);
   // this.notification.error(``, ev.statusText || errortext);
  }

  /**
   * 刷新 Token 请求
   */
  private refreshTokenRequest(): Observable<any> {
    const model = this.tokenSrv.get();
    return this.http.post(`/api/auth/refresh`, null, null, { headers: { refresh_token: model?.refresh_token || '' } });
  }

  // #region 刷新Token方式一：使用 401 重新刷新 Token

  private tryRefreshToken(ev: HttpResponseBase, req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    // 1、若请求为刷新Token请求，表示来自刷新Token可以直接跳转登录页
    if ([`/api/auth/refresh`].some(url => req.url.includes(url))) {
    // this.toLogin();
      return throwError(ev);
    }
    // 2、如果 `refreshToking` 为 `true` 表示已经在请求刷新 Token 中，后续所有请求转入等待状态，直至结果返回后再重新发起请求
    if (this.refreshToking) {
      return this.refreshToken$.pipe(
        filter(v => !!v),
        take(1),
        switchMap(() => next.handle(this.reAttachToken(req)))
      );
    }
    // 3、尝试调用刷新 Token
    this.refreshToking = true;
    this.refreshToken$.next(null);

    return this.refreshTokenRequest().pipe(
      switchMap(res => {
        // 通知后续请求继续执行
        this.refreshToking = false;
        this.refreshToken$.next(res);
        // 重新保存新 token
        this.tokenSrv.set(res);
        // 重新发起请求
        return next.handle(this.reAttachToken(req));
      }),
      catchError(err => {
        this.refreshToking = false;
       // this.toLogin();
        return throwError(err);
      })
    );
  }

  /**
   * 重新附加新 Token 信息
   *
   * > 由于已经发起的请求，不会再走一遍 `@delon/auth` 因此需要结合业务情况重新附加新的 Token
   */
  private reAttachToken(req: HttpRequest<any>): HttpRequest<any> {
    // 以下示例是以 NG-ALAIN 默认使用 `SimpleInterceptor`
    const token = this.tokenSrv.get()?.token;
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        lang: this.langs
      }
    });
  }

  // #endregion

  // #region 刷新Token方式二：使用 `@delon/auth` 的 `refresh` 接口

  private buildAuthRefresh(): void {
    if (!this.refreshTokenEnabled) {
      return;
    }
    this.tokenSrv.refresh
      .pipe(
        filter(() => !this.refreshToking),
        switchMap(res => {
          console.log(res);
          this.refreshToking = true;
          return this.refreshTokenRequest();
        })
      )
      .subscribe(
        res => {
          // TODO: Mock expired value
          res.expired = +new Date() + 1000 * 60 * 5;
          this.refreshToking = false;
          this.tokenSrv.set(res);
        },
        () => this.toLogin()
      );
  }

  // #endregion

  private toLogin(): void {
    this.notification.error(`Not logged in or login has expired, please log in again`, ``);
    this.goTo('/login');
  }

  private handleData(ev: HttpResponseBase, req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    this.checkStatus(ev);
    // 业务处理：一些通用操作
    switch (ev.status) {
      case 200:
        // 业务层级错误处理，以下是假定restful有一套统一输出格式（指不管成功与否都有相应的数据格式）情况下进行处理
        // 例如响应内容：
        //  错误内容：{ status: 1, msg: '非法参数' }
        //  正确内容：{ status: 0, response: {  } }
        // 则以下代码片断可直接适用

        if (ev instanceof HttpResponse) {
          const body = ev.body;
          // 如果不是请求API 直接返回
          if (body && !body.statusCode) {
            return of(ev);
          }

          if (body.statusCode === 103) {
            this.router.navigate(['en/user/login'])
          }
          

          // if (body.statusCode === 401) {
          //   this.refreshToken()
          // }

          if (body && body.statusCode !== 100 && body.statusCode !== 101 && body.statusCode !== 200) {
            // this.injector.get(NzMessageService).error(body.msg);
            // 注意：这里如果继续抛出错误会被行254的 catchError 二次拦截，导致外部实现的 Pipe、subscribe 操作被中断，例如：this.http.get('/').subscribe() 不会触发
            // 如果你希望外部实现，需要手动移除行254

            // return throwError({});
            if (body.statusCode === 104) {
              return throwError(ev);
            }
            
            return throwError({ status: body.statusCode, statusText: body.message });
          } else {
            // 忽略 Blob 文件体
            if (ev.body instanceof Blob) {
              return of(ev);
            }

            // 重新修改 `body` 内容为 `response` 内容，对于绝大多数场景已经无须再关心业务状态码
            return of(new HttpResponse(Object.assign(ev, { ...body })));
            // 或者依然保持完整的格式
            // return of({ data: ev.body });
          }
        }
        break;
      case 401:
        // if (this.refreshTokenEnabled && this.refreshTokenType === 're-request') {
        //   return this.tryRefreshToken(ev, req, next);
        // }
        // this.toLogin();
        break;
        case 100:
          //this.goTo('/login');
          break;
      case 403:
      case 404:
      case 500:
        this.goTo(`/exception/${ev.status}`);
        break;
      default:
        if (ev instanceof HttpErrorResponse) {
          console.warn(
            '未可知错误，大部分是由于后端不支持跨域CORS或无效配置引起，请参考 https://ng-alain.com/docs/server 解决跨域问题',
            ev
          );
        }
        break;
    }
    if (ev instanceof HttpErrorResponse) {
      return throwError(ev);
    } else {
      return of(ev);
    }
  }

  private getAdditionalHeaders(headers?: HttpHeaders): { [name: string]: string } {
    const res: { [name: string]: string } = {};
    const lang = this.injector.get(ALAIN_I18N_TOKEN).currentLang;
    if (!headers?.has('Accept-Language') && lang) {
      res['lang'] = this.langugae;
    }
    const token = this.tokenSrv.get()?.token;
    res['Authorization'] = `Bearer ${token}`;
    return res;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // 统一加上服务端前缀
    let url = req.url;
    if (!url.startsWith('https://') && !url.startsWith('http://') && !url.startsWith('assets/')) {
      if (url.startsWith('/api/User/')) {
        url = environment.api.userUrl + url;
      } else if (url.startsWith('/api/Email/GetCode')) {
        url = environment.api.codeUrl + url;
      } else if (url.startsWith('/Panel/')) {
        url = environment.api.calculatorUrl + url;
      } else {
        url = environment.api.baseUrl + url;
      }
    }
    const newReq = req.clone({ url, setHeaders: this.getAdditionalHeaders(req.headers) });
    return next.handle(newReq).pipe(
      mergeMap(ev => {
        // 允许统一对请求错误处理
        if (ev instanceof HttpResponseBase) {
          return this.handleData(ev, newReq, next);
        }
        // 若一切都正常，则后续操作
        return of(ev);
      }),
      catchError((err: HttpErrorResponse) => this.handleData(err, newReq, next))
    );
  }
  refreshToken(){
    let body = {
        access_Token: localStorage.getItem('tokenGet'),
        refresh_Token: localStorage.getItem('refresrtokenGet')
    }
    this.api.refreshToken(body).subscribe((res)=> {
      this.router.navigate(['en/user/login'])
    })
  }
}
