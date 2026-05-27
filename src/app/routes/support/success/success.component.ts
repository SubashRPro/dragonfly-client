import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { I18NService } from "@core";

@Component({
  selector: "app-success",
  templateUrl: "./success.component.html",
  styleUrls: ["./success.component.less"],
})
export class SuccessComponent implements OnInit {
  langs = this.i18nSev.i18nUrl();
  constructor(private router: Router, private i18nSev: I18NService) {}

  ngOnInit(): void {}

  goTo(href: string) {
    this.router.navigateByUrl(`${this.langs}${href}`);
  }
}
