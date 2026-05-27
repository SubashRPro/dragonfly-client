import { Component, OnInit, Injector, Inject, ChangeDetectorRef } from "@angular/core";
import { ApiService } from "../../services/api.service";
import { NzMessageService } from "ng-zorro-antd/message";
interface Feature {
  icon: string;
  title: string;
  description: string;
}
@Component({
  selector: "app-campaigns",
  templateUrl: "./campaigns.component.html",
  styleUrls: ["./campaigns.component.less"],
})
export class CampaignsComponent implements OnInit {
followersFeatures: Feature[] = [
  {
    icon: 'rocket',
    title: 'Effortless Trading Setup',
    description: 'Start copying trades in minutes with a smooth and intuitive setup designed for all experience levels.'
  },
  {
    icon: 'sliders',
    title: 'Flexible Copying Options',
    description: 'Customize your copy-trading strategy by choosing from top-performing providers that match your risk appetite and financial goals.'
  },
  {
    icon: 'user-add',
    title: 'Perfect for New Traders',
    description: 'Begin your trading journey confidently with straightforward tools and guidance—no prior Forex expertise needed.'
  }
];

providersFeatures: Feature[] = [
  {
    icon: 'dollar',
    title: 'Boost Your Earnings',
    description: 'Increase your profit potential by earning performance fees from followers who copy your successful trading strategies.'
  },
  {
    icon: 'laptop',
    title: 'Simple Provider Setup',
    description: 'Launch your provider profile effortlessly and trade directly from MT4—no extra installations or complicated settings required.'
  },
  {
    icon: 'bar-chart',
    title: 'Transparent Performance Insights',
    description: 'Monitor your trading results, earnings, and follower activity with real-time analytics that help you improve and manage risks effectively.'
  }
];

  constructor(
    private api: ApiService,
    public message: NzMessageService,
  ) { }

  ngOnInit(): void {
   
  }

}
