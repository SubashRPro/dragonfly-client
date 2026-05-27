import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { I18NService } from '@core';
import { environment } from '@env/environment';
import { NzMessageService } from 'ng-zorro-antd/message';
import { GetCodeParams } from 'src/app/models/users';
import { ApiService } from 'src/app/services/api.service';
import { CustomValidators } from '../../../shared/custom-validators';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.less']
})
export class ResetComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    public message: NzMessageService,
    private i18nSev: I18NService
  ) {}
  loading: boolean = false;
  langs = this.i18nSev.i18nUrl();
  loader: boolean = false;
  confirmPasswordVisible = false;
  passwordVisible = false;
  validateForm!: FormGroup;
  tokenGlobal:any
  ngOnInit(): void {
    this.validateForm = this.fb.group({
      password: [null, [ Validators.compose([
        Validators.required,
        // check whether the entered password has a number
        CustomValidators.patternValidator(/\d/, {
          hasNumber: true
        }),
        // check whether the entered password has upper case letter
        CustomValidators.patternValidator(/[A-Z]/, {
          hasCapitalCase: true
        }),
        // check whether the entered password has a lower case letter
        CustomValidators.patternValidator(/[a-z]/, {
          hasSmallCase: true
        }),
        // check whether the entered password has a special character
        CustomValidators.patternValidator(
          /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
          {
            hasSpecialCharacters: true
          }
        ),
        Validators.minLength(8)
      ])]],
      confirmPassword: [null, [Validators.required, this.confirmationValidator]],
    });

    const token = this.gup('tkn',window.location.href)
    this.tokenGlobal = token
    console.log(token)
  }

   confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirmPass: true, error: true };
    }
    return {};
  };

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.validateForm.controls.confirmPassword.updateValueAndValidity());
  }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(i)) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }

    if(this.validateForm.valid) {
      const body = {
        setPasswordToken: this.tokenGlobal,
        new_Password: this.validateForm.value.password
      }
      this.loader = true;
      this.api.resetPassword(body).subscribe(
        (res: any) => {
          this.loader = false;
          this.router.navigateByUrl(`${this.langs}/user/login`);
          this.message.success('Your password has been reset successfully.')
        },
        err => {
          this.loader = false;
          this.message.error(err?.body?.message);
        }
      );
    }
  }

  public gup( name:any, url :any) {
    if (!url) url = location.href;
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( url );
    return results == null ? null : results[1];
}

}
