import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { I18NService } from "@core";
import { DA_SERVICE_TOKEN, ITokenService } from "@delon/auth";
import { SettingsService, _HttpClient } from "@delon/theme";
import { environment } from "@env/environment";
import { NzMessageService } from "ng-zorro-antd/message";
import { NzModalService } from "ng-zorro-antd/modal";
import { CountdownConfig, CountdownEvent } from "ngx-countdown";
import { GetCodeParams } from "src/app/models/users";
import { ApiService } from "src/app/services/api.service";
import { CustomValidators } from "../../../shared/custom-validators";
import { SearchCountryField, CountryISO } from "ngx-intl-tel-input";

import { prefixDefault } from "../../profile/phone";
declare var snsWebSdk:any
@Component({
  selector: "passport-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.less"],
})
export class UserRegisterComponent implements OnInit {
  @ViewChild('signaturePad', { static: false }) signaturePad;

  width: number = 600;
  height: number = 150;
  optionsPad = {
    minWidth: 1,
    maxWidth: 2,
    penColor: "rgb(0, 0, 0)",
    backgroundColor: "rgb(255, 255, 255)"
  };
  public submitted: boolean = false;
  preferredCountries: CountryISO[] = [
    CountryISO.UnitedArabEmirates,
    CountryISO.India,
    CountryISO.Jordan,
    CountryISO.Egypt,
  ];
  CountryISO: any = CountryISO;
  SearchCountryField = SearchCountryField;
  selectedCountryISO: any;
  selectCountry!: string;
  type: boolean = true;
 restrictCountries = [
  'US', // United States
  'KP', // North Korea
  'AX', // Åland Islands
  'AD', // Andorra
  'AT', // Austria
  'BG', // Bulgaria
  'HR', // Croatia
  'CY', // Cyprus
  'CZ', // Czechia
  'DK', // Denmark
  'EE', // Estonia
  'FO', // Faroe Islands
  'FI', // Finland
  'FR', // France
  'GF', // French Guiana
  'PF', // French Polynesia
  'DE', // Germany
  'GR', // Greece
  'GL', // Greenland
  'GP', // Guadeloupe
  'HU', // Hungary
  'IS', // Iceland
  'IE', // Ireland
  'IT', // Italy
  'LV', // Latvia
  'LI', // Liechtenstein
  'LT', // Lithuania
  'LU', // Luxembourg
  'MT', // Malta
  'MQ', // Martinique
  'YT', // Mayotte
  'MC', // Monaco
  'MS', // Montserrat
  'NL', // Netherlands
  'NO', // Norway
  'PL', // Poland
  'PT', // Portugal
  'RE', // Réunion
  'RO', // Romania
  'MF', // Saint Martin (French part)
  'PM', // Saint Pierre and Miquelon
  'SM', // San Marino
  'SK', // Slovakia
  'SI', // Slovenia
  'ES', // Spain
  'SE', // Sweden
  'CH', // Switzerland
  'WF'  // Wallis and Futuna
];
  changePreferredCountries() {
    this.preferredCountries = [CountryISO.India, CountryISO.Canada];
  }
  onlyCountries: CountryISO[] = Object.keys(this.CountryISO)
    .filter(
      (x) =>
        ![
     this.CountryISO.UnitedStates,
this.CountryISO.NorthKorea,

// Previously provided EU / territories
this.CountryISO.AlandIslands,
this.CountryISO.Andorra,
this.CountryISO.Austria,
this.CountryISO.Bulgaria,
this.CountryISO.Croatia,
this.CountryISO.Cyprus,
this.CountryISO.CzechRepublic,   // Czechia
this.CountryISO.Denmark,
this.CountryISO.Estonia,
this.CountryISO.FaroeIslands,
this.CountryISO.Finland,
this.CountryISO.France,
this.CountryISO.FrenchGuiana,
this.CountryISO.FrenchPolynesia,
this.CountryISO.Germany,
this.CountryISO.Greece,
this.CountryISO.Greenland,
this.CountryISO.Guadeloupe,
this.CountryISO.Hungary,
this.CountryISO.Iceland,
this.CountryISO.Ireland,
this.CountryISO.Italy,
this.CountryISO.Latvia,
this.CountryISO.Liechtenstein,
this.CountryISO.Lithuania,
this.CountryISO.Luxembourg,
this.CountryISO.Malta,
this.CountryISO.Martinique,
this.CountryISO.Mayotte,
this.CountryISO.Monaco,
this.CountryISO.Montserrat,
this.CountryISO.Netherlands,
this.CountryISO.Norway,
this.CountryISO.Poland,
this.CountryISO.Portugal,
this.CountryISO.Reunion,
this.CountryISO.Romania,
this.CountryISO.SaintMartin,
this.CountryISO.SaintPierreAndMiquelon,
this.CountryISO.SanMarino,
this.CountryISO.Slovakia,
this.CountryISO.Slovenia,
this.CountryISO.Spain,
this.CountryISO.Sweden,
this.CountryISO.Switzerland,
this.CountryISO.WallisAndFutuna,

// ➜ Newly added countries from your earlier removal list
// this.CountryISO.Afghanistan,
// this.CountryISO.Albania,
// this.CountryISO.Belarus,
// this.CountryISO.Burundi,
// this.CountryISO.CentralAfricanRepublic,
// this.CountryISO.CongoBrazzaville,  
// this.CountryISO.CoteDIvoire,
// this.CountryISO.Eritrea,
// this.CountryISO.Eswatini,
// this.CountryISO.Guinea,
// this.CountryISO.GuineaBissau,
// this.CountryISO.Haiti,
// this.CountryISO.Liberia,
// this.CountryISO.Libya,
// this.CountryISO.Mali,
// this.CountryISO.NewZealand,
// this.CountryISO.Nicaragua,
// this.CountryISO.NorthMacedonia,
// this.CountryISO.SierraLeone,
// this.CountryISO.Somalia,
// this.CountryISO.Sudan,
// this.CountryISO.Ukraine,

// // Territories / special regions you listed
// this.CountryISO.BouvetIsland,
// this.CountryISO.Cambodia,
// this.CountryISO.IvoryCoast,
// this.CountryISO.EastTimor,
// this.CountryISO.FrenchSouthernTerritories,
// this.CountryISO.Gibraltar,
// this.CountryISO.HeardIslandAndMcDonaldIslands,
// this.CountryISO.HolySee,
// this.CountryISO.Indonesia,
// this.CountryISO.MacedoniaFormerYugoslavRepublic,
// this.CountryISO.Mauritius,
// this.CountryISO.Myanmar,
// this.CountryISO.NetherlandsAntilles,
// this.CountryISO.PalestinianTerritory,
// this.CountryISO.SouthGeorgiaAndSouthSandwichIslands,
// this.CountryISO.Swaziland,
// this.CountryISO.Turkey,
// this.CountryISO.UnitedStatesMinorOutlyingIslands
        ].some(
          (y) => y == this.CountryISO[x]
        )
    )
    .map((x) => this.CountryISO[x]);

  config: CountdownConfig = {
    format: `s`,
    leftTime: 30,
  };
  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private modal: NzModalService,
    public message: NzMessageService,
    private route: ActivatedRoute,
    private i18nSev: I18NService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService
  ) {
    this.api.getAllCountries().subscribe((res: any) => {
      this.nationality = res.data.map((item: any) => ({
        ...item,
        img: `${environment.api.baseUrl}/app_contents/country_flag/${item.code}.svg`,
      }));
    });
    // get user location here ip stack api
    this.api.getUserIp().subscribe((res: any) => {
      this.type = false;
      // console.log(res.country_code?.toLowerCase())
      if(this.restrictCountries.includes(res?.data?.country_code)) {
        this.selectedCountryISO = 'AE';
      } else {
        this.selectedCountryISO = res?.data?.country_code;
      }
      //  this.phoneForm.get('phone').setValue('20229289');
    });
  }
  registertextChange?: boolean;
  registerCondition?: boolean;
  langs = this.i18nSev.i18nUrl();
  nationality: any = [];
  referrence_Code: string = "";
  registerForm!: FormGroup;
  loader: boolean = false;
  loading: boolean = false;
  smsloading: boolean = false;
  isReferer = false;
  isError = true;
  countDown = false;
  countSmsDown = false;
  countDownTime = 59; // 这里设置倒计时为60S
  countSmsDownTime = 59; // 这里设置倒计时为60S
  public showButtonText = "Get Code";
  public showSmsButtonText = "Get Code";
  passwordPattern =
    "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#!@$%^&*]).{8,}$";
  passwordVisible = false;
  confirmPasswordVisible = false;
  account: any = [];
  phones: any = prefixDefault;
  content = "Register Successfully Please Complete your profile";
  options = {
    nzDuration: 5000,
  };
  data: any = {
    otherdata: 1,
    time: new Date(),
  };
  isRead: any = [];
  linkSource: string = "";
  proceedStepNo: any = 0;
  currentStep: any = 1;
  topStep1: boolean = true;
  topStep2: boolean = false;
  topStep3: boolean = false;
  topStep4: boolean = false;
  emailOtp: any = null;
  showOtpError: boolean = false;
  emailValidationStatus: any = null;
  phoneValidationStatus: any = null;
  emailValidationMsg: any = "Please enter valid email id";
  phoneValidationMsg: any = "";
  leadCat: any;
  ngOnInit(): void {
    this.leadCat = this.router.url;
    this.registerForm = this.fb.group({
      customer_FirstName: [
        null,
        [
          Validators.required,
          Validators.pattern("^[\u4E00-\u9FA5a-zA-Z_ ]{1,60}$"),
        ],
      ],
      customer_LastName: [
        null,
        [
          Validators.required,
          Validators.pattern("^[\u4E00-\u9FA5a-zA-Z_ ]{1,60}$"),
        ],
      ],
      password: [
        null,
        [
          Validators.compose([
            Validators.required,
            // check whether the entered password has a number
            CustomValidators.patternValidator(/\d/, {
              hasNumber: true,
            }),
            // check whether the entered password has upper case letter
            CustomValidators.patternValidator(/[A-Z]/, {
              hasCapitalCase: true,
            }),
            // check whether the entered password has a lower case letter
            CustomValidators.patternValidator(/[a-z]/, {
              hasSmallCase: true,
            }),
            // check whether the entered password has a special character
            CustomValidators.patternValidator(
              /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
              {
                hasSpecialCharacters: true,
              }
            ),
            Validators.minLength(8),
          ]),
        ],
      ],
      confirmPassword: [null],
      email: [null, [Validators.required, Validators.email]],
      phone: [null, [Validators.required]],
      phoneNumberPrefix: ["+971"],
      verificationCode: [null],
      verificationPhoneCode: [null],
      usCitizen: [null],
      tpi: [null],
      agree: [false, [Validators.required]],
    });
    this.route.queryParams.subscribe((queryParams) => {
      this.referrence_Code = queryParams?.referrence_Code;
      console.log(queryParams)
      this.isReferer =
        this.referrence_Code !== undefined && this.referrence_Code !== ""
          ? true
          : false;
      if (this.isReferer) {
        this.registerForm.addControl(`refChecked`, new FormControl(true));
        this.registerForm.addControl(
          `referCode`,
          new FormControl(this.referrence_Code)
        );
      } else {
        this.registerForm.addControl(`refChecked`, new FormControl(false));
        this.registerForm.addControl(`referCode`, new FormControl(null));
      }
      this.linkSource = queryParams?.src;
    });
    this.getLinks();
  }

  phoneNumberValidator = (control: FormControl): { [s: string]: boolean } => {
    var re =
      /^((?:\+|00)[17](?: |\-)?|(?:\+|00)[1-9]\d{0,2}(?: |\-)?|(?:\+|00)1\-\d{3}(?: |\-)?)?(0\d|\([0-9]{3}\)|[1-9]{0,3})(?:((?: |\-)[0-9]{2}){4}|((?:[0-9]{2}){4})|((?: |\-)[0-9]{3}(?: |\-)[0-9]{4})|([0-9]{7}))$/;
    if (!control.value) {
      return { required: true };
    } else if (
      control.value.toString().length > 11 ||
      control.value.toString().length < 7
    ) {
      return { pattern: true, error: true };
    }
    return {};
  };

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() =>
      this.registerForm.controls.confirmPassword.updateValueAndValidity()
    );
  }

  loginId: any;
  customerId: any;
  submitForm(): void {
    if (this.proceedStepNo == 1) {
      this.submitted = true;
      this.isError = this.registerForm.valid;
      for (const i in this.registerForm.controls) {
        if (this.registerForm.controls.hasOwnProperty(i)) {
          this.registerForm.controls[i].markAsDirty();
          this.registerForm.controls[i].updateValueAndValidity();
        }
      }
      if (this.registerForm.valid) {
        if (!this.registerForm.value.agree) {
          this.message.error(this.i18nSev.i18n("agree_tc"));
          return;
        }
        const formValue = this.registerForm.value.phone;
        console.log(formValue);
        this.loader = true;
        let formData = {
          customer_FirstName: this.registerForm.value.customer_FirstName,
          customer_LastName: this.registerForm.value.customer_LastName,
          login_Password: this.registerForm.value.password,
          email: this.registerForm.value.email,
          verification_Code: "",
          referrer_ID: this.referrence_Code,
          customer_Nationality: formValue.countryCode,
          phoneNumber: `${formValue.dialCode} ${formValue.number}`,
          tax_PayerIdentification: `${this.registerForm.value.tpi}`,
          Customer_Type: "CTINDV_0001_0422",
          user_Type: "Customer",
          Trading_Platform: this.registerForm.value.Trading_Platform,
          source: this.linkSource ? this.linkSource : "",
          reg_link: environment.api.clientUrl + this.leadCat,
        };
        // here we need to check if user is coming from Reverse Solicitation country
        this.api.IsRSLRequired(formValue.countryCode).subscribe((res:any)=> {
            if(res.data) {
              this.loader = false;
              this.isVisibleSol = true
            } else {
                this.api.register(formData).subscribe(
                  (res: any) => {
                    this.currentStep = 2;
                    this.loginId = res?.data?.login_ID;
                    this.customerId = res?.data?.customer_ID;
                    this.loader = false;
                  },
                  (err) => {
                    this.loader = false;
                    this.message.error(err.body.message);
                  }
                );
            }
        })
   
      }
    }

    if (this.proceedStepNo == 2) {
      if (this.emailOtp == null) {
        this.showOtpError = true;
      } else {
        this.showOtpError = false;
      }
      if (!this.showOtpError) {
        this.verifyOtp();
      }
    }
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.registerForm.controls.password.value) {
      return { confirmPass: true, error: true };
    }
    return {};
  };

  isUsCitizen: boolean = false;
  usCitizenToggle(event: any) {
    if (Number(event)) {
      this.isUsCitizen = true;
    } else {
      this.isUsCitizen = false;
    }
  }

  usCitizenCheck(usCitizen: boolean): void {
    if (usCitizen) {
      this.isUsCitizen = true;
      //  this.registerForm.get('tpi')!.setValidators(Validators.required);
      //  this.registerForm.get('tpi')!.markAsDirty();
    } else {
      this.isUsCitizen = false;
      this.registerForm.get("tpi")!.clearValidators();
      this.registerForm.get("tpi")!.markAsPristine();
    }
    this.registerForm.get("tpi")!.updateValueAndValidity();
  }

  links: any = [];
  getLinks() {
    this.api.getTnCLinks().subscribe((res: any) => {
      this.links = res.data;
    });
  }

  nextStep(val: any) {
    this.proceedStepNo = val;
    if (val == 4) {
      this.router.navigateByUrl(`${this.langs}/profile`);
    }
  }

  prevStep(val: any) {
    if (val == 1) {
      this.currentStep = 1;
      //  this.topStep2 = false;
    }
    // if(val == 2) {
    //   this.emailOtp = null;
    //   this.currentStep = 2;
    //   this.topStep3 = false;
    // }
  }

  onOtpChange(otp: any) {
    if (otp.length == 6) {
      this.emailOtp = otp;
      this.showOtpError = false;
    }
  }

  resendOtp() {
    this.api.ResendEmailVerificationOTP(this.loginId).subscribe(
      (res: any) => {
        this.message.success(this.i18nSev.i18n("OTP sent!"));
      },
      (error) => {
        this.message.error(error?.body?.message);
      }
    );
  }
  getEmailOtp(showMsg: boolean) {
    this.loader = true;
    const formValue = this.registerForm.value;
    if (formValue.email !== null && formValue.email !== "") {
      this.showButtonText = "...";
      this.api
        .loginGetCode({
          email: formValue.email,
          userName: `${formValue.customer_FirstName}`,
          wL_Number: environment.wL_Number,
          Email_Type: "RegistrationSendOTP",
        } as GetCodeParams)
        .subscribe(
          (res: any) => {
            if (res.data) {
              if (showMsg) {
                this.message.success(this.i18nSev.i18n("OTP sent!"));
              }
              this.currentStep = 2;
              this.topStep2 = true;
              this.loader = false;
            }
          },
          (error) => {
            this.loader = false;
            this.message.error(error?.body?.message);
          }
        );
    }
  }

  verifyOtp() {
    this.loader = true;
    const formValue = this.registerForm.value;
    if (formValue.email !== null && formValue.email !== "") {
      let formData = {
        login_ID: this.loginId,
        customer_ID: this.customerId,
        otp: this.emailOtp,
      };
      this.api.VerifyRegisteredCustomerOTP(formData).subscribe(
        (res: any) => {
          if (res.data) {
            this.message.success(
              this.i18nSev.i18n("You have registered successfully")
            );
            this.router.navigateByUrl(`${this.langs}/profile`);
            this.loader = false;
            this.tokenService.clear();
            this.tokenService.set({
              token: res.data.token,
              refresToken: res.data.refresh_Token,
              // email: this.loginForm.value.email,
              login_id: res.data.login_ID,
              customer_id: res.data.customer_ID,
            });
            localStorage.setItem("tokenGet", res.data.token);
            localStorage.setItem("refresrtokenGet", res.data.refresh_Token);
            const params = {
              token: res.data.token,
              login_id: res.data.login_ID,
              customer_id: res.data.customer_ID,
              ...res.data,
            };
            localStorage.setItem("loginInfo", JSON.stringify(params));
          }
        },
        (error) => {
          this.loader = false;
          this.message.error(error?.body?.message);
        }
      );
    }
  }

  validateEmail() {
    let regEx =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let emailAddress = this.registerForm.value.email;
    if (regEx.test(emailAddress)) {
      let formData = {
        email: emailAddress,
      };
      this.api.ValidateUserEmail(formData).subscribe(
        (res: any) => {
          this.emailValidationStatus = "success";
        },
        (error) => {
          this.emailValidationStatus = "error";
          this.emailValidationMsg = "This email already exists";
        }
      );
    } else {
      this.emailValidationStatus = "error";
      this.emailValidationMsg = "Please enter valid email id";
    }
  }

  phoneCheck: boolean = false;
  phone = "";
  // verify number
  verifyNumber(number: any, countryCode: any) {
    this.api.validateNumber(number, countryCode).subscribe((res: any) => {
      if (res.statusCode === 100) {
        this.phoneCheck = true;
      } else {
        this.phoneCheck = false;
      }
    });
  }

  onChange(e: any) {
    if (this.registerForm.get("phone")?.valid) {
      this.verifyNumber(e?.number, e?.countryCode);
    }
  }

  // getSumSubToken() {
  //   this.api.getSumSubAccessToken().subscribe((res:any)=> {
  //     localStorage.setItem('sumSubToken', res?.accessToken)
  //   })
  // }
// visible sol documents

  isVisibleSol:boolean = false
  handleCancelSol(): void {
    this.isVisibleSol = false;
  }

  // document signature 
  signPad:boolean = false
  checked = false
  pdfDocument:boolean = false
  pdfSrc = ` ${environment.api.baseUrl}/app_contents/agreement_doc/rsl-agreement.pdf`;
  showPad(e:any) {
    if(e) {
      this.signPad = true
    } else {
      this.signPad = false
    }
  }

  openPdf() {
    this.pdfDocument = true
  }

  cancelDoc():void {
    this.pdfDocument = false
  }

  // signature pad
 
  isEmpty() {
    console.log('is empty', this.signaturePad.isEmpty());
  }

  savePng() {
    const data = this.signaturePad.toDataURL();
    console.log(data);
  }

  saveJpg() {
    const data = this.signaturePad.toDataURL("image/jpeg");
    console.log(data);
  }

  saveSvg() {
    const data = this.signaturePad.toDataURL("image/svg+xml");
    console.log(data);
  }

  saveArray() {
    const data = this.signaturePad.toData();
    console.log(data);
    console.log(JSON.stringify(data));
  }

  clear() {
    this.signaturePad.clear();
  }

  revert() {
    this.signaturePad.revert()
  }

  signLoader:boolean = false;
  agreeSubmit() {
    if(this.signaturePad.isEmpty()) {
      this.message.error(this.i18nSev.i18n("Please add Signature to Submit"))
    } else {
      this.signLoader = true
      const data = this.signaturePad.toDataURL();
      console.log(data)
      const formValue = this.registerForm.value.phone;
      let formData = {
        customer_FirstName: this.registerForm.value.customer_FirstName,
        customer_LastName: this.registerForm.value.customer_LastName,
        login_Password: this.registerForm.value.password,
        email: this.registerForm.value.email,
        verification_Code: "",
        referrer_ID: this.referrence_Code,
        customer_Nationality: formValue.countryCode,
        phoneNumber: `${formValue.dialCode} ${formValue.number}`,
        tax_PayerIdentification: `${this.registerForm.value.tpi}`,
        Customer_Type: "CTINDV_0001_0422",
        user_Type: "Customer",
        Trading_Platform: this.registerForm.value.Trading_Platform,
        source: this.linkSource ? this.linkSource : "",
        reg_link: environment.api.baseUrl + this.leadCat,
        rsL_Detail:{
          is_AgreedOn_TC: this.checked,
          signature: data
        }
      };
      this.api.register(formData).subscribe(
        (res: any) => {
          //  this.message.success(this.i18nSev.i18n('You have registered successfully'));
          this.isVisibleSol = false
          this.currentStep = 2;
          this.loginId = res?.data?.login_ID;
          this.customerId = res?.data?.customer_ID;
          this.signLoader = false
          this.signaturePad.clear();
        },
        (err) => {
          this.signLoader = false
          this.message.error(err.body.message);
        }
      );
    }
}

}
