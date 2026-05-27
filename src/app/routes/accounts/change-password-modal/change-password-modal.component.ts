import { Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiService } from 'src/app/services/api.service';
@Component({
  selector: 'app-change-password-modal',
  templateUrl: './change-password-modal.component.html',
  styleUrls: ["./change-password-modal.component.less"],
})
export class ChangePasswordModalComponent implements OnInit {
  user?:string
  loader?:boolean
  loading:boolean = false
  isVisible = false;
  changePassword!: FormGroup;
  userId: any;
  passwordVisible1 = false;
  passwordVisible2 = false;
  passwordVisible3 = false;
  password1?: string;
  password2?: string;
  password3?: string;
  passwordPattern = '^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{6,}$';
  passwordPatternMT5 = '^(?=.*?[a-zA-Z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$';
  tradingPlatform:any
  constructor(private injector: Injector, private fb: FormBuilder, private http: ApiService, private message: NzMessageService) {}

  ngOnInit(): void {
    this.changePassword = this.fb.group({
      otp:[null, [Validators.required]],
      password: [null],
      newPassword: [null, [Validators.required, this.confirmationValidator]]
    });
    this.http.getUserInfo(this.tokenSrv.get()?.customer_id).subscribe((res: any) => {
      this.user = res.data.user_Email;
    });
  }
  submitForm(): void {
    if (this.changePassword.valid) {
      const params = {
        email: this.user,
        verification_Code: this.changePassword.value.otp,
        newPassword: this.changePassword.value.newPassword
      };
      this.loading = true
      this.http.changeAccountPassword(this.userId, params).subscribe(
        (res: any) => {
          this.message.success('You have changed the Password successfully');
          this.isVisible = false;
          this.loading = false
          this.clearForm()
          this.changePassword.reset()
        },
        err => {
          this.message.error(err.body.message);
          this.loading = false
        }
      );
    } else {
      Object.values(this.changePassword.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      this.loading = false
    }
  }

  showModal(data: any): void {
    this.tradingPlatform = data.trading_Platform
     if(data?.trading_Platform === 'MT5') {
       this.changePassword.controls['password']?.setValidators([Validators.required, Validators.pattern(this.passwordPatternMT5)]);
     } else {
       this.changePassword.controls['password']?.setValidators([Validators.required, Validators.pattern(this.passwordPattern)]);
     }
    this.userId = data.account_ID;
    this.isVisible = true;
  }

  private get tokenSrv(): ITokenService {
    return this.injector.get(DA_SERVICE_TOKEN);
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
   this.clearForm()
  }

  clearForm() {
    this.changePassword?.get('otp')?.reset();
    this.changePassword?.get('password')?.reset();
    this.changePassword?.get('newPassword')?.reset();
  }


  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.changePassword.controls.newPassword.updateValueAndValidity());
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.changePassword.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  // get code

  onGetCode() {
    this.loader = true
    const formValue = this.changePassword.value;
    if (this.user) {
      let body = {
        email: this.user,
        userName: this.user,
        wL_Number: "CPT",
        Email_Type: "PasswordReset"
      }
      this.http.getChangeCode(body).subscribe((res:any)=> {
        this.message.success('OTP code sent successfully');
        this.loader = false
      },
      error => {
        this.loader = false;
      }
      )
    } 
    else  {
      this.loader = false
      this.changePassword.get('email')?.markAsDirty();
      this.changePassword.get('email')?.updateValueAndValidity({ onlySelf: true });
    }
  }
}
