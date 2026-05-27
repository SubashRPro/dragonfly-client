import { Component, Inject, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { I18NService, StartupService } from '@core';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-email-validation',
  templateUrl: './email-validation.component.html',
  styleUrls: ['./email-validation.component.less']
})
export class EmailValidationComponent implements OnInit {
  constructor(
    private injector: Injector,
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private startupSrv: StartupService,
    public message: NzMessageService,
    private i18nSev: I18NService
  ) {}
  langs = this.i18nSev.i18nUrl();
  loginForm!: FormGroup;
  loader: boolean = false;
  user: any;
  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('loginInfo')!);

    this.loginForm = this.fb.group({});

    if (this.user?.is_MultiFactorAuthentication) {
      this.loginForm.addControl(`email`, new FormControl(null, Validators.required));
    }
    if (this.user?.is_GoogleAuthentication) {
      this.loginForm.addControl(`googleAuthCode`, new FormControl(null, Validators.required));
    }
  }
  private get tokenSrv(): ITokenService {
    return this.injector.get(DA_SERVICE_TOKEN);
  }
  submitForm(): void {
    for (const i in this.loginForm.controls) {
      if (this.loginForm.controls.hasOwnProperty(i)) {
        this.loginForm.controls[i].markAsDirty();
        this.loginForm.controls[i].updateValueAndValidity();
      }
    }
    if (this.loginForm.valid) {
      this.loader = true;
      if (this.user?.is_MultiFactorAuthentication) {
        this.api
          .verifyTwoWayAuthOPT({
            customer_ID: this.tokenSrv.get()?.customer_id,
            verification_Code: this.loginForm.value.email
          })
          .subscribe(
            (res: any) => {
              if (this.user?.is_GoogleAuthentication) {
                this.api
                  .verifyGoogleAuth({
                    customer_ID: this.user?.customer_ID,
                    googleAuthCode: this.loginForm.value.googleAuthCode
                  })
                  .subscribe(
                    (res: any) => {
                      this.loader = false;
                      this.tokenService.set({ ...this.user, token: res.data.token });
                      this.message.success('success！');
                      this.startupSrv.load().subscribe(() => {
                        this.router.navigateByUrl(`${this.langs}/dashboard`);
                      });
                    },
                    error => {
                      this.loader = false;
                      this.message.error(error.body.message);
                    }
                  );
              } else {
                this.tokenService.set({ ...this.user, token: res.data.token });
                this.startupSrv.load().subscribe(() => {
                  this.message.success('success！');
                  this.router.navigateByUrl(`${this.langs}/dashboard`);
                });
              }
            },
            error => {
              this.loader = false;
              this.message.error(`Invalid request or user not found`);
            }
          );
      } else {
        if (this.user?.is_GoogleAuthentication) {
          this.loader = true;

          this.api.verifyGoogleAuth({ customer_ID: this.user.customer_ID, googleAuthCode: this.loginForm.value.googleAuthCode }).subscribe(
            (res: any) => {
              this.loader = false;
              this.tokenService.set({ ...this.user, token: res.data.token });
              this.startupSrv.load().subscribe(() => {
                this.message.success('success！');
                this.router.navigateByUrl(`${this.langs}/dashboard`);
              });
            },
            error => {
              this.loader = false;
              this.message.error(error.body.message);
            }
          );
        }
      }
    }
  }
}
