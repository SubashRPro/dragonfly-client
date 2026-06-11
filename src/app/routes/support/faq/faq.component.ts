import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-faq",
  templateUrl: "./faq.component.html",
  styleUrls: ["./faq.component.scss"],
})
export class FaqComponent implements OnInit {
  FAQs = [
    // {
    //   title: "CFDs",
    //   content: [
    //     {
    //       question: `What is CFD trading?`,
    //       answer: `CFD trading involves speculating on the price movements of various financial instruments, such as cryptos, commodities, forex, stocks, metals, and indices, without owning the underlying assets. CFDs stand for Contracts for Difference and represent an agreement between the trader and the CFD provider to exchange the difference in the price of the instrument between the opening and closing of the contract.`,
    //     },
    //     {
    //       question: "What are the benefits and risks of trading CFDs? ",
    //       answer: `The benefits of trading CFDs include the ability to speculate on price movements without owning the physical asset, leverage to amplify potential profits, and trading on margin, which allows opening positions with a fraction of the total trade value. However, risks include potential losses amplified by leverage, margin calls if positions fall below a certain level, and the difficulty in predicting factors that affect prices, such as economic data and geopolitical events. `,
    //     },
    //     {
    //       question: `What is a CFD broker?`,
    //       answer: `A CFD broker is a company that provides traders with access to a trading platform where they can buy and sell various financial instruments. Brokers act as intermediaries between traders and the global financial markets.`,
    //     },
    //   ],
    // },
    // {
    //   title: "Verification",
    //   content: [
    //     {
    //       question: "What documents are required to verify my account? ",
    //       answer: `We require a copy of your valid Passport, National Identification Card or Driver's Licence and a Proof of address document showing your name and address, issued within the last 3 months. `,
    //     },
    //     {
    //       question: "How can I upload or send my documents to you?",
    //       answer: `You can upload documents via your Client Portal or send by email to <a href='kyc@dragonflyfx.com' target='_blank'>kyc@dragonflyfx.com</a>`,
    //     },
    //     {
    //       question: "How long does it take to verify my documents?",
    //       answer: `Once the required documents are uploaded, it usually takes a few minutes to verify their acceptability. However, if the instant verification fails for any reason, the application will be manually reviewed by the KYC Team, which can take up to 24 hours to complete.`,
    //     },
    //   ],
    // },
    // {
    //   title: "Forex",
    //   content: [
    //     {
    //       question: "What is Forex CFD trading? ",
    //       answer:
    //         "Forex CFD trading is a financial derivative that allows traders to speculate on the price movements of currency pairs without owning the underlying assets. CFDs stands for Contract for Difference, and they represent an agreement between the trader and the CFD provider to exchange the difference in the price of the currency pair between the opening and closing of the contract. ",
    //     },
    //     {
    //       question: "What are the benefits of trading Forex CFDs?",
    //       answer: `One of the main benefits of trading forex CFDs is the ability to speculate on the price movements of currency pairs without owning the underlying assets. CFDs also offer leverage, which allows traders to amplify their potential profits. Additionally, forex CFDs are typically traded on margin, which means that traders can open positions with a fraction of the total trade value. `,
    //     },
    //     {
    //       question: "When is the Forex market open? ",
    //       answer: `The Foreign Exchange market never sleeps! You can trade FX 24 hours a day, 5 days a week. This is one of its most attractive features, as it allows traders from across the globe to participate whenever they want. `,
    //     },
    //   ],
    // },
    // {
    //   title: "Indices",
    //   content: [
    //     {
    //       question: "What are Indices CFDs? ",
    //       answer:
    //         "Indices CFDs are financial derivatives that allow traders to speculate on the price movements of an index without owning the underlying assets. An index is a basket of stocks that are grouped together based on a certain criteria, such as market capitalization or sector.",
    //     },
    //     {
    //       question: "What are the benefits of trading Indices CFDs?",
    //       answer: `One of the main benefits of trading indices CFDs is the ability to speculate on the price movements of an index without owning the underlying assets. CFDs also offer leverage, which allows traders to amplify their potential profits. Additionally, CFDs are typically traded on margin, which means that traders can open positions with a fraction of the total trade value.`,
    //     },
    //     {
    //       question: "Why is it important to understand Indices?",
    //       answer: `Imagine a basket of shares in one Index but not all the shares have the same value. So, you need to know how the overall Index is calculated? Most Indices use market capitalisation weighting and what this means is the more the share value a stock has, the more weight it is given in the calculation of the overall Index.`,
    //     },
    //   ],
    // },
    // {
    //   title: "Metals",
    //   content: [
    //     {
    //       question: "What are Metals CFDs?",
    //       answer:
    //         "Metals CFDs are financial derivatives that allow traders to speculate on the price movements of metals such as gold, silver, platinum, and copper without owning the underlying asset. CFDs stands for Contract for Difference, and they represent an agreement between the trader and the CFD provider to exchange the difference in the price of the metal between the opening and closing of the contract.",
    //     },
    //     {
    //       question: "What are the benefits of trading Metals CFDs?",
    //       answer: `One of the main benefits of trading metals CFDs is the ability to speculate on the price movements of metals without owning the physical asset. CFDs also offer leverage, which allows traders to amplify their potential profits. Additionally, CFDs are typically traded on margin, which means that traders can open positions with a fraction of the total trade value.`,
    //     },
    //     {
    //       question: "Why is gold a popular CFD instrument?",
    //       answer: `Gold is a popular CFD instrument because it has a history of being a safe-haven asset. In times of economic uncertainty or political turmoil, investors often turn to gold as a store of value. As a result, the price of gold can be influenced by global events and economic conditions, making it an interesting and potentially profitable asset to trade.`,
    //     },
    //   ],
    // },
    // {
    //   title: "Commodities",
    //   content: [
    //     {
    //       question: "What are Commodities CFDs?",
    //       answer:
    //         "Commodities CFDs allow traders to speculate on the price movements of raw materials such as oil, natural gas, and agricultural products without physically owning them. These contracts enable traders to benefit from price fluctuations in global commodity markets by taking long or short positions.",
    //     },
    //     {
    //       question: "What are the benefits of trading Commodities CFDs?",
    //       answer: `Trading Commodities CFDs allows investors to speculate on price movements without owning the physical asset. This provides flexibility to trade both rising and falling markets. Additionally, leverage enables traders to open larger positions with a smaller capital outlay, while market volatility can create profit opportunities across energy, metals, and agricultural commodities.`,
    //     },
    //     {
    //       question: "Can I trade CFDs on energies on margin?",
    //       answer: `Yes, you can trade CFDs on energies on margin, which means you only need to deposit a small percentage of the full value of the trade. This allows you to trade with a larger position size than your available capital would otherwise allow.`,
    //     },
    //   ],
    // },
    // {
    //   title: "Stocks",
    //   content: [
    //     {
    //       question: "What are CFD Stocks?",
    //       answer:
    //         "CFD stocks are contracts that allow you to speculate on the price movements of stocks without actually owning the underlying asset. This means you can profit from both rising and falling share prices.",
    //     },
    //     {
    //       question: "What are the benefits of trading CFD Stocks?",
    //       answer: `Some of the benefits of CFD stocks trading include the ability to profit from both rising and falling markets, leverage (which also brings higher risks, and the ability to trade on margin.`,
    //     },
    //     {
    //       question: "Can I sell as well as buy Stocks?",
    //       answer: `All our stocks are CFDs which means you get to buy and sell without having to purchase the underlying share. Remember a CFD is when you are speculating on the price movement. So, you are not limited to only buying a stock, you can open either a buy or sell trade and your profit/loss will be determined by the difference between the open and close price. `,
    //     },
    //   ],
    // },
    // {
    //   title: "Crypto",
    //   content: [
    //     {
    //       question: "What are Crypto CFDs?",
    //       answer:
    //         "Crypto CFDs enable traders to speculate on cryptocurrency price movements without directly owning digital assets like Bitcoin, Ethereum, or Litecoin. Instead, traders enter an agreement with a broker to exchange the price difference from when the position is opened to when it is closed.",
    //     },
    //     {
    //       question: "What are the benefits of trading Crypto CFDs?",
    //       answer: `Crypto CFDs allow traders to speculate on cryptocurrency price movements without owning the digital asset. This enables trading in both rising and falling markets. Leverage provides the ability to control larger positions with less capital. Additionally, CFD trading eliminates the need for a crypto wallet, reducing security risks associated with direct ownership.`,
    //     },
    //     {
    //       question:
    //         "How is CFD trading different from traditional crypto trading?",
    //       answer: `In traditional crypto trading, you buy and own the cryptocurrency, while in CFD trading, you speculate on the price movement without owning the asset.`,
    //     },
    //   ],
    // },
    // {
    //   title: "Standard",
    //   content: [
    //     {
    //       question: "What is the minimum deposit for a Standard Account?",
    //       answer: "The minimum deposit for our Standard Account is 50 USD.",
    //     },
    //     {
    //       question:
    //         "Are there any commissions for trading on the Standard Account Type?",
    //       answer: `There are no commissions for trading on the <strong>Standard, Plus, or Pro</strong> Account Types. For the <strong>VIP</strong> Trading Account, we charge a commission of 6 USD per round turn. A key benefit of the VIP account is the ultra-low spreads starting from just 0.1 pip, offering more cost-effective trading conditions.`,
    //     },
    //     {
    //       question: "How do I open a Live Trading Account?",
    //       answer: `<ul> 
    //                   <li> 1. Log in to your Client Area.</li>
    //                   <li> 2. On the left-hand side, click on "My Accounts" from the menu.</li>
    //                   <li> 3. From the drop-down, select "Live Accounts", then click on "New Trading Account".</li>
    //                   <li> 4. Choose your account type and base currency.</li>
    //                   <li> 5. Once completed, you will receive your Trading Account login details via your registered email. </li>
    //                 </ul>`,
    //     },
    //     {
    //       question:
    //         "How many Live Trading Accounts can I have? Is there a limit?",
    //       answer: `You can have up to three active Live Trading Accounts. If you need an additional Trading Account or wish to change the account type of an existing one, you can submit a request to our Trading Desk Team at <a href='mailto:tradingdesk@trivecom' target='_blank'>tradingdesk@trivecom</a>. All requests are subject to review and approval at the sole discretion of our Trading Desk Team.`,
    //     },
    //     {
    //       question: "What is the maximum leverage that you offer?",
    //       answer: `The maximum dynamic leverage we offer is 1:500. Our leverage is dynamic and therefore subject to adjustment based on your account equity. You can check the specific leverage tiers for your equity <a href='https://www.Trive.com/about/legal-documents/leverage-adjusment-policy' target='_blank'>HERE</a>. Please note that different margin calculation rules apply to certain instruments on our platform, and understanding these rules is important as they affect the margin required for your trades.`,
    //     },
    //     {
    //       question:
    //         "Do you offer Islamic (Swap-Free) trading conditions for account holders who observe Sharia law?",
    //       answer: `Yes, we offer Islamic (Swap-Free) trading conditions for account holders who observe Sharia law. These accounts are free from swaps or interest charges, ensuring compliance with Islamic principles. The company reserves the right to request an additional <strong>Proof of Faith</strong> document from the client. Islamic Account requests can be send directly to our Support Team at <a href='mailto:support@dragonflyfx.com' target='_blank'>support@dragonflyfx.com</a>.`,
    //     },
    //     {
    //       question:
    //         "What are a Margin Call, Stop Out, and when are they triggered?",
    //       answer: `<p>A <strong> Margin Call </strong> is triggered when your Margin Level reaches 100%, indicating that your equity is equal to the margin required to maintain your open positions. You will be notified to add funds or close positions to avoid a Stop Out.</p> <br/>
    //                  <p>A <strong>Stop Out</strong> occurs when your Margin Level reaches 30%, at which point the system will automatically start closing your positions starting from the most unprofitable one, to prevent your account from going negative.</p>  `,
    //     },
    //     {
    //       question: "What is leverage, and how does it work?",
    //       answer: `Leverage allows traders control a large position with a small deposit called the margin. For instance, with margin $100 and 1:500 leverage, you can manage $50,000. While it can boost profits, it also increases the risk of larger losses.`,
    //     },
    //     {
    //       question: "What is margin, and how is it calculated?",
    //       answer: `Margin is the capital required to open a leveraged trade. It’s calculated as: <br/>
    //                 <strong>Margin = (Volume * Contract Size) ÷ Leverage. </strong><br/>
    //                 For example, with 1:500 leverage:<br/><br/>

    //                 1 lot (100,000 units) requires $200 margin (1*100,000) ÷ 500.</br>
    //                 0.1 lot (10,000 units) requires $20 margin (10,000 ÷ 500).</br>
    //                 0.01 lot (1,000 units) requires $2 margin (1,000 ÷ 500).
    //                 `,
    //     },
    //     {
    //       question: "What is Lot Size?",
    //       answer: `A Lot is the unit that measures the size of a trade in Forex. The standard lot sizes are: <br/>
    //                 1 Standard Lot = 100,000 units<br/>
    //                 1 Mini Lot = 10,000 units (0.1 lot)<br/>
    //                 1 Micro Lot = 1,000 units (0.01 lot)
    //                 `,
    //     },
    //   ],
    // },
    // {
    //   title: "Plus",
    //   content: [
    //     {
    //       question: "What is the minimum deposit for a Plus Account?",
    //       answer: "The minimum deposit for our Standard Account is 1,000 USD.",
    //     },
    //     {
    //       question:
    //         "Are there any commissions for trading on the Plus Account Type?",
    //       answer: `There are no commissions for trading on the <strong>Standard, Plus, or Pro</strong> Account Types. For the <strong>VIP</strong> Trading Account, we charge a commission of 6 USD per round turn. A key benefit of the VIP account is the ultra-low spreads starting from just 0.1 pip, offering more cost-effective trading conditions.`,
    //     },
    //     {
    //       question: "How do I open a Live Trading Account?",
    //       answer: `<ul> 
    //           <li> 1. Log in to your Client Area.</li>
    //           <li> 2. On the left-hand side, click on "My Accounts" from the menu.</li>
    //           <li> 3. From the drop-down, select "Live Accounts", then click on "New Trading Account".</li>
    //           <li> 4. Choose your account type and base currency.</li>
    //           <li> 5. Once completed, you will receive your Trading Account login details via your registered email. </li>
    //         </ul>`,
    //     },
    //     {
    //       question:
    //         "How many Live Trading Accounts can I have? Is there a limit?",
    //       answer: `You can have up to three active Live Trading Accounts. If you need an additional Trading Account or wish to change the account type of an existing one, you can submit a request to our Trading Desk Team at <a href='mailto:tradingdesk@trivecom' target='_blank'>tradingdesk@trivecom</a>. All requests are subject to review and approval at the sole discretion of our Trading Desk Team.`,
    //     },
    //     {
    //       question: "What is the maximum leverage that you offer?",
    //       answer: `The maximum dynamic leverage we offer is 1:500. Our leverage is dynamic and therefore subject to adjustment based on your account equity. You can check the specific leverage tiers for your equity <a href='https://www.Trive.com/about/legal-documents/leverage-adjusment-policy' target='_blank'>HERE</a>. Please note that different margin calculation rules apply to certain instruments on our platform, and understanding these rules is important as they affect the margin required for your trades.`,
    //     },
    //     {
    //       question:
    //         "Do you offer Islamic (Swap-Free) trading conditions for account holders who observe Sharia law?",
    //       answer: `Yes, we offer Islamic (Swap-Free) trading conditions for account holders who observe Sharia law. These accounts are free from swaps or interest charges, ensuring compliance with Islamic principles. The company reserves the right to request an additional <strong>Proof of Faith</strong> document from the client. Islamic Account requests can be send directly to our Support Team at <a href='mailto:support@dragonflyfx.com' target='_blank'>support@dragonflyfx.com</a>.`,
    //     },
    //     {
    //       question:
    //         "What are a Margin Call, Stop Out, and when are they triggered?",
    //       answer: `<p>A <strong> Margin Call </strong> is triggered when your Margin Level reaches 100%, indicating that your equity is equal to the margin required to maintain your open positions. You will be notified to add funds or close positions to avoid a Stop Out.</p> <br/>
    //          <p>A <strong>Stop Out</strong> occurs when your Margin Level reaches 30%, at which point the system will automatically start closing your positions starting from the most unprofitable one, to prevent your account from going negative.</p>`,
    //     },
    //     {
    //       question: "What is leverage, and how does it work?",
    //       answer: `Leverage allows traders control a large position with a small deposit called the margin. For instance, with margin $100 and 1:500 leverage, you can manage $50,000. While it can boost profits, it also increases the risk of larger losses.`,
    //     },
    //     {
    //       question: "What is margin, and how is it calculated?",
    //       answer: `Margin is the capital required to open a leveraged trade. It’s calculated as: <br/>
    //          <strong>Margin = (Volume * Contract Size) ÷ Leverage. </strong><br/>
    //          For example, with 1:500 leverage:<br/><br/>
    //          1 lot (100,000 units) requires $200 margin (1*100,000) ÷ 500.</br>
    //          0.1 lot (10,000 units) requires $20 margin (10,000 ÷ 500).</br>
    //          0.01 lot (1,000 units) requires $2 margin (1,000 ÷ 500).`,
    //     },
    //     {
    //       question: "What is Lot Size?",
    //       answer: `A Lot is the unit that measures the size of a trade in Forex. The standard lot sizes are: <br/>
    //          1 Standard Lot = 100,000 units<br/>
    //          1 Mini Lot = 10,000 units (0.1 lot)<br/>
    //          1 Micro Lot = 1,000 units (0.01 lot)`,
    //     },
    //   ],
    // },
    // {
    //   title: "Pro",
    //   content: [
    //     {
    //       question: "What is the minimum deposit for a Pro Account?",
    //       answer: "The minimum deposit for our Pro Account is 5,000 USD.",
    //     },
    //     {
    //       question:
    //         "Are there any commissions for trading on the Pro Account Type?",
    //       answer: `There are no commissions for trading on the <strong>Pro, Plus, or Pro</strong> Account Types. For the <strong>VIP</strong> Trading Account, we charge a commission of 6 USD per round turn. A key benefit of the VIP account is the ultra-low spreads starting from just 0.1 pip, offering more cost-effective trading conditions.`,
    //     },
    //     {
    //       question: "How do I open a Live Trading Account?",
    //       answer: `<ul> 
    //                   <li> 1. Log in to your Client Area.</li>
    //                   <li> 2. On the left-hand side, click on "My Accounts" from the menu.</li>
    //                   <li> 3. From the drop-down, select "Live Accounts", then click on "New Trading Account".</li>
    //                   <li> 4. Choose your account type and base currency.</li>
    //                   <li> 5. Once completed, you will receive your Trading Account login details via your registered email. </li>
    //                 </ul>`,
    //     },
    //     {
    //       question:
    //         "How many Live Trading Accounts can I have? Is there a limit?",
    //       answer: `You can have up to three active Live Trading Accounts. If you need an additional Trading Account or wish to change the account type of an existing one, you can submit a request to our Trading Desk Team at <a href='mailto:tradingdesk@trivecom' target='_blank'>tradingdesk@trivecom</a>. All requests are subject to review and approval at the sole discretion of our Trading Desk Team.`,
    //     },
    //     {
    //       question: "What is the maximum leverage that you offer?",
    //       answer: `The maximum dynamic leverage we offer is 1:500. Our leverage is dynamic and therefore subject to adjustment based on your account equity. You can check the specific leverage tiers for your equity <a href='https://www.Trive.com/about/legal-documents/leverage-adjusment-policy' target='_blank'>HERE</a>. Please note that different margin calculation rules apply to certain instruments on our platform, and understanding these rules is important as they affect the margin required for your trades.`,
    //     },
    //     {
    //       question:
    //         "Do you offer Islamic (Swap-Free) trading conditions for account holders who observe Sharia law?",
    //       answer: `Yes, we offer Islamic (Swap-Free) trading conditions for account holders who observe Sharia law. These accounts are free from swaps or interest charges, ensuring compliance with Islamic principles. The company reserves the right to request an additional <strong>Proof of Faith</strong> document from the client. Islamic Account requests can be send directly to our Support Team at <a href='mailto:support@dragonflyfx.com' target='_blank'>support@dragonflyfx.com</a>.`,
    //     },
    //     {
    //       question:
    //         "What are a Margin Call, Stop Out, and when are they triggered?",
    //       answer: `<p>A <strong> Margin Call </strong> is triggered when your Margin Level reaches 100%, indicating that your equity is equal to the margin required to maintain your open positions. You will be notified to add funds or close positions to avoid a Stop Out.</p> <br/>
    //                  <p>A <strong>Stop Out</strong> occurs when your Margin Level reaches 30%, at which point the system will automatically start closing your positions starting from the most unprofitable one, to prevent your account from going negative.</p>  `,
    //     },
    //     {
    //       question: "What is leverage, and how does it work?",
    //       answer: `Leverage allows traders control a large position with a small deposit called the margin. For instance, with margin $100 and 1:500 leverage, you can manage $50,000. While it can boost profits, it also increases the risk of larger losses.`,
    //     },
    //     {
    //       question: "What is margin, and how is it calculated?",
    //       answer: `Margin is the capital required to open a leveraged trade. It’s calculated as: <br/>
    //                 <strong>Margin = (Volume * Contract Size) ÷ Leverage. </strong><br/>
    //                 For example, with 1:500 leverage:<br/><br/>

    //                 1 lot (100,000 units) requires $200 margin (1*100,000) ÷ 500.</br>
    //                 0.1 lot (10,000 units) requires $20 margin (10,000 ÷ 500).</br>
    //                 0.01 lot (1,000 units) requires $2 margin (1,000 ÷ 500).
    //                 `,
    //     },
    //     {
    //       question: "What is Lot Size?",
    //       answer: `A Lot is the unit that measures the size of a trade in Forex. The standard lot sizes are: <br/>
    //                 1 Standard Lot = 100,000 units<br/>
    //                 1 Mini Lot = 10,000 units (0.1 lot)<br/>
    //                 1 Micro Lot = 1,000 units (0.01 lot)
    //                 `,
    //     },
    //   ],
    // },
    // {
    //   title: "VIP",
    //   content: [
    //     {
    //       question: "What is the minimum deposit for a VIP Account?",
    //       answer: "The minimum deposit for our Pro Account is 10,000 USD.",
    //     },
    //     {
    //       question:
    //         "Are there any commissions for trading on the VIP Account Type?",
    //       answer: `There are no commissions for trading on the <strong>Pro, Plus, or Pro</strong> Account Types. For the <strong>VIP</strong> Trading Account, we charge a commission of 6 USD per round turn. A key benefit of the VIP account is the ultra-low spreads starting from just 0.1 pip, offering more cost-effective trading conditions.`,
    //     },
    //     {
    //       question: "How do I open a Live Trading Account?",
    //       answer: `<ul> 
    //                   <li> 1. Log in to your Client Area.</li>
    //                   <li> 2. On the left-hand side, click on "My Accounts" from the menu.</li>
    //                   <li> 3. From the drop-down, select "Live Accounts", then click on "New Trading Account".</li>
    //                   <li> 4. Choose your account type and base currency.</li>
    //                   <li> 5. Once completed, you will receive your Trading Account login details via your registered email. </li>
    //                 </ul>`,
    //     },
    //     {
    //       question:
    //         "How many Live Trading Accounts can I have? Is there a limit?",
    //       answer: `You can have up to three active Live Trading Accounts. If you need an additional Trading Account or wish to change the account type of an existing one, you can submit a request to our Trading Desk Team at <a href='mailto:tradingdesk@trivecom' target='_blank'>tradingdesk@trivecom</a>. All requests are subject to review and approval at the sole discretion of our Trading Desk Team.`,
    //     },
    //     {
    //       question: "What is the maximum leverage that you offer?",
    //       answer: `The maximum dynamic leverage we offer is 1:500. Our leverage is dynamic and therefore subject to adjustment based on your account equity. You can check the specific leverage tiers for your equity <a href='https://www.Trive.com/about/legal-documents/leverage-adjusment-policy' target='_blank'>HERE</a>. Please note that different margin calculation rules apply to certain instruments on our platform, and understanding these rules is important as they affect the margin required for your trades.`,
    //     },
    //     {
    //       question:
    //         "Do you offer Islamic (Swap-Free) trading conditions for account holders who observe Sharia law?",
    //       answer: `Yes, we offer Islamic (Swap-Free) trading conditions for account holders who observe Sharia law. These accounts are free from swaps or interest charges, ensuring compliance with Islamic principles. The company reserves the right to request an additional <strong>Proof of Faith</strong> document from the client. Islamic Account requests can be send directly to our Support Team at <a href='mailto:support@dragonflyfx.com' target='_blank'>support@dragonflyfx.com</a>.`,
    //     },
    //     {
    //       question:
    //         "What are a Margin Call, Stop Out, and when are they triggered?",
    //       answer: `<p>A <strong> Margin Call </strong> is triggered when your Margin Level reaches 100%, indicating that your equity is equal to the margin required to maintain your open positions. You will be notified to add funds or close positions to avoid a Stop Out.</p> <br/>
    //                  <p>A <strong>Stop Out</strong> occurs when your Margin Level reaches 30%, at which point the system will automatically start closing your positions starting from the most unprofitable one, to prevent your account from going negative.</p>  `,
    //     },
    //     {
    //       question: "What is leverage, and how does it work?",
    //       answer: `Leverage allows traders control a large position with a small deposit called the margin. For instance, with margin $100 and 1:500 leverage, you can manage $50,000. While it can boost profits, it also increases the risk of larger losses.`,
    //     },
    //     {
    //       question: "What is margin, and how is it calculated?",
    //       answer: `Margin is the capital required to open a leveraged trade. It’s calculated as: <br/>
    //                 <strong>Margin = (Volume * Contract Size) ÷ Leverage. </strong><br/>
    //                 For example, with 1:500 leverage:<br/><br/>

    //                 1 lot (100,000 units) requires $200 margin (1*100,000) ÷ 500.</br>
    //                 0.1 lot (10,000 units) requires $20 margin (10,000 ÷ 500).</br>
    //                 0.01 lot (1,000 units) requires $2 margin (1,000 ÷ 500).
    //                 `,
    //     },
    //     {
    //       question: "What is Lot Size?",
    //       answer: `A Lot is the unit that measures the size of a trade in Forex. The standard lot sizes are: <br/>
    //                 1 Standard Lot = 100,000 units<br/>
    //                 1 Mini Lot = 10,000 units (0.1 lot)<br/>
    //                 1 Micro Lot = 1,000 units (0.01 lot)
    //                 `,
    //     },
    //   ],
    // },
    // {
    //   title: "All Accounts",
    //   content: [
    //     {
    //       question: "Are there any trading commissions for all account types?",
    //       answer: `There are no commissions for trading on the <strong>Pro, Plus, or Pro</strong> Account Types. For the <strong>VIP</strong> Trading Account, we charge a commission of 6 USD per round turn. A key benefit of the VIP account is the ultra-low spreads starting from just 0.1 pip, offering more cost-effective trading conditions.`,
    //     },
    //     {
    //       question: "How do I open a Live Trading Account?",
    //       answer: `<ul> 
    //                   <li> 1. Log in to your Client Area.</li>
    //                   <li> 2. On the left-hand side, click on "My Accounts" from the menu.</li>
    //                   <li> 3. From the drop-down, select "Live Accounts", then click on "New Trading Account".</li>
    //                   <li> 4. Choose your account type and base currency.</li>
    //                   <li> 5. Once completed, you will receive your Trading Account login details via your registered email. </li>
    //                 </ul>`,
    //     },
    //     {
    //       question:
    //         "How many Live Trading Accounts can I have? Is there a limit?",
    //       answer: `You can have up to three active Live Trading Accounts. If you need an additional Trading Account or wish to change the account type of an existing one, you can submit a request to our Trading Desk Team at <a href='mailto:tradingdesk@trivecom' target='_blank'>tradingdesk@trivecom</a>. All requests are subject to review and approval at the sole discretion of our Trading Desk Team.`,
    //     },
    //     {
    //       question: "What is the maximum leverage that you offer?",
    //       answer: `The maximum dynamic leverage we offer is 1:500. Our leverage is dynamic and therefore subject to adjustment based on your account equity. You can check the specific leverage tiers for your equity <a href='https://www.Trive.com/about/legal-documents/leverage-adjusment-policy' target='_blank'>HERE</a>. Please note that different margin calculation rules apply to certain instruments on our platform, and understanding these rules is important as they affect the margin required for your trades.`,
    //     },
    //     {
    //       question:
    //         "Do you offer Islamic (Swap-Free) trading conditions for account holders who observe Sharia law?",
    //       answer: `Yes, we offer Islamic (Swap-Free) trading conditions for account holders who observe Sharia law. These accounts are free from swaps or interest charges, ensuring compliance with Islamic principles. The company reserves the right to request an additional <strong>Proof of Faith</strong> document from the client. Islamic Account requests can be send directly to our Support Team at <a href='mailto:support@dragonflyfx.com' target='_blank'>support@dragonflyfx.com</a>.`,
    //     },
    //     {
    //       question:
    //         "What are a Margin Call, Stop Out, and when are they triggered?",
    //       answer: `<p>A <strong> Margin Call </strong> is triggered when your Margin Level reaches 100%, indicating that your equity is equal to the margin required to maintain your open positions. You will be notified to add funds or close positions to avoid a Stop Out.</p> <br/>
    //                  <p>A <strong>Stop Out</strong> occurs when your Margin Level reaches 30%, at which point the system will automatically start closing your positions starting from the most unprofitable one, to prevent your account from going negative.</p>  `,
    //     },
    //     {
    //       question: "What is leverage, and how does it work?",
    //       answer: `Leverage allows traders control a large position with a small deposit called the margin. For instance, with margin $100 and 1:500 leverage, you can manage $50,000. While it can boost profits, it also increases the risk of larger losses.`,
    //     },
    //     {
    //       question: "What is margin, and how is it calculated?",
    //       answer: `Margin is the capital required to open a leveraged trade. It’s calculated as: <br/>
    //                 <strong>Margin = (Volume * Contract Size) ÷ Leverage. </strong><br/>
    //                 For example, with 1:500 leverage:<br/><br/>

    //                 1 lot (100,000 units) requires $200 margin (1*100,000) ÷ 500.</br>
    //                 0.1 lot (10,000 units) requires $20 margin (10,000 ÷ 500).</br>
    //                 0.01 lot (1,000 units) requires $2 margin (1,000 ÷ 500).
    //                 `,
    //     },
    //     {
    //       question: "What is Lot Size?",
    //       answer: `A Lot is the unit that measures the size of a trade in Forex. The standard lot sizes are: <br/>
    //                 1 Standard Lot = 100,000 units<br/>
    //                 1 Mini Lot = 10,000 units (0.1 lot)<br/>
    //                 1 Micro Lot = 1,000 units (0.01 lot)
    //                 `,
    //     },
    //     {
    //       question: "Which trading account type is best for me?",
    //       answer: `The best trading account type depends on your trading style, experience, and objectives. <br/><br/>
    //                   <span class='highlight-bold'> Standard Account - </span> Ideal for beginners, with no commissions and a lower minimum deposit of $250. <br/>
    //                   <span class='highlight-bold'> Plus Account - </span> A balance between Standard and Pro, offering competitive spreads with no commission. <br/>
    //                   <span class='highlight-bold'> Pro Account - </span> Suitable for experienced traders, featuring lower spreads with no commission. <br/>
    //                   <span class='highlight-bold'> VIP Account - </span> Designed for high-volume traders, with $6 per lot commission and low spreads starting from 0.1 pip. <br/>
    //                   <span class='highlight-bold'> Demo Account - </span> Perfect for testing trading strategies and exploring the platform with virtual funds and real market conditions. <br/> <br/>
    //                   Each account type offers unique benefits, and the choice ultimately depends on the client’s trading needs and preferences.
    //                 `,
    //     },
    //   ],
    // },
    {
      title: "Deposit",
      content: [
        {
          question: "What is the minimum deposit amount?",
          answer: "Veries to provider",
        },
        {
          question: "How to fund your account?",
          answer: `<ul> 
                      <li> - Sign in to your client portal.  </li>
                      <li> - Click on 'Finances' and click then 'Deposit'   </li>
                      <li> - Select payment method   </li>
                      <li> - Select the Trading account you wish to fund </li>
                      <li> - Follow steps </li>
                      <li> - Once completed, your deposit will appear in the My Deposits section with real-time status updates. </li>
                    </ul>`,
        },
        {
          question: "What are instant deposits?",
          answer: `The term “instant” indicates that a transaction will be carried out within a few seconds without manual processing by our financial department. Please note that although it is instantly processed on our side, your deposit requests may take some time to be processed on the payment system provider's side. `,
        },
        {
          question: "When can I deposit? ",
          answer: `Deposits can be executed 24/7. If a deposit is not instant, we will process it within 24 hours. Be aware, it may take your bank or payment service a little longer. We cannot be held liable for any deposit processing delays that are caused by payment systems. We reserve the right to change the processing time for deposits and withdrawals without prior notification.`,
        },
        {
          question:
            "How long do deposits take?",
           answer: `Most deposits are instant. Bank transfers may take 1–3 business days depending on your bank.`,
        },
        {
          question: "What payment methods can I use?",
          answer: `  We support deposits via bank transfer, credit/debit cards, and selected e-wallets. Additional local methods may be available depending on your region.`,
        },
        {
          question: "Why has my Credit/Debit card deposit been declined?",
          answer: `There are several reasons why your Credit/Debit card may have been declined. You may have gone over your daily transaction limit or exceeded the card’s available credit/debit amount. Alternatively, you may have entered an incorrect digit for the card number, expiry date or CVV code. For this reason, please verify that these are correct. Also make sure that your card is valid and has not expired. Finally, check with your card issuer to make sure that your card has been authorized for online transactions and that there are no protections in place that are preventing us from charging it.`,
        },
        // {
        //   question: " Is it possible to lose more money than I deposited? ",
        //   answer: `Trive offers Negative Balance Protection (NBP) for all clients, regardless of their categorisation and jurisdiction, thereby ensuring that you cannot lose more than your total deposits. For more details, please refer to our 'Order Execution Policy.' Trive also provides a stop out level, which will cause trades to be closed when a certain margin level % is reached. Click <a href='https://www.Trive.com/about/legal-documents/leverage-adjusment-policy' target='_blank'>HERE</a> to see the Stop Out Levels.`,
        // },
        // {
        //   question: " How do you keep Clients funds safe?",
        //   answer: `Trive takes the safety of client funds very seriously. For this reason, all client funds are fully segregated from the company’s own 	funds and kept in separate bank accounts in major European banks. This ensures that client funds cannot be used for any other purpose.`,
        // },
      ],
    },
        {
      title: "Withdrawal",
      content: [
        {
          question: "What is the minimum withdrawal amount?",
          answer: "The minimum withdrawal amount is 20 USD.",
        },
        {
          question: "When can I withdraw?",
          answer: `You can submit your withdrawal at any time, and our team will process it within 24 hours (Monday to Friday). `,
        },
        {
          question: "How can I withdraw?",
          answer: `<ul> 
                      <li> - Sign in to your client portal.  </li>
                      <li> - Click on 'Finances' and click then 'withdraw'   </li>
                      <li> - Select payment method </li>
                      <li> - Select the Trading account you wish to withdraw from </li>
                      <li> - Follow the steps </li>
                      <li> - Your withdrawal will then be submitted* withdrawals are usually processed within a few hours. If the withdrawal request is received outside working hours, it will be processed the next working day. Once processed by us, the time taken for your withdrawal to reflect will depend on the payment method. </li>
                    </ul>`,
        },
         {
          question: "What withdrawal methods do you offer?",
          answer: `Withdrawals are processed through the same method used for deposit, following international financial regulations.`,
        },
        {
          question: "Are there any fees?",
          answer: `We do not charge internal deposit or withdrawal fees. Your bank or payment provider may apply external charges.`,
        },
        {
          question: "How long do withdrawals take?",
          answer: `<ul> 
                      <li> - E-wallets: typically same day </li>
                      <li> - Card Refunds: 5-7 business days  </li>
                      <li> - Bank transfer: 1-5 business days</li>
                    </ul>`,
        },
        {
          question: "How to cancel a withdrawal request?",
          answer: `<ul> 
                      <li> - Sign in to your client portal </li>
                      <li> - Click on Finances and select Withdraw </li>
                      <li> - Scroll down My Withdrawals  </li>
                      <li> - Click on the Cancel button located in the right-end of the transaction line </li>
                    </ul>
                    <p class='note'>*To be noted that only Pending withdrawals can be cancelled </p>
                    `,
        },
        {
          question:
            "How can I withdraw funds from my account if the amount exceeds the deposited amount? ",
          answer: `If your withdrawal amount exceeds your initial deposit amount, the profits will be credited to you by either bank transfer e-wallet. For more information, please contact us at <a href='mailto:support_int@dragonflyfx.com' target='_blank'>support@dragonflyfx.com</a> `,
        },
        {
          question:
            "How can I withdraw if the card I used to deposit has been cancelled or expired?",
          answer: `<p>After the cancellation of a card, banks are obliged to allow limited transaction types, including refunds, usually for at least 6 months. You should therefore withdraw funds to the card you used to deposit, even if this card has been cancelled. You will receive these funds to your new card which is connected to the same bank account as your previous, cancelled card. </p><br/>
                    <p>If the bank account linked to the card is completely closed, you will need to send proof of account closure to our finance department at <a href='mailto:support_int@dragonflyfx.com' target='_blank'>support@dragonflyfx.com.</a> </p>`,
        },
      ],
    },

    // {
    //   title: "Demo",
    //   content: [
    //     {
    //       question: "Do I need to deposit money for a Demo Account?",
    //       answer: `No, a Demo Account does not require a deposit as it uses virtual funds, allowing you to practice without any financial risk.`,
    //     },
    //     {
    //       question: `What is a Demo Trading Account?`,
    //       answer: `A Demo Trading Account allows you to practice trading using virtual funds instead of real money. It simulates real market conditions without any financial risk.`,
    //     },
    //     {
    //       question: "Are the prices the same on my demo and real account?",
    //       answer: `Our real and demo accounts will display the same prices and instruments. However, during times of high volatility in the market, there may be differences in the execution of demo accounts. `,
    //     },
    //     {
    //       question:
    //         "Can I trade the same assets in a Demo Account as in a live account? ",
    //       answer: `Yes, the Demo Accounts offer access to the same assets and trading tools available in live accounts, allowing you to practice with the same conditions.`,
    //     },
    //     {
    //       question:
    //         "Can I trade with the same leverage in a Demo Account as in a live account?",
    //       answer: `Yes, the leverage available in a Demo Account is the same as in a Live account. Our maximum dynamic leverage is 1:500, and it is subject to adjustment based on your account equity. You can check the specific leverage tiers for your equity <a href='https://www.Trive.com/about/legal-documents/leverage-adjusment-policy' target='_blank'>HERE</a>. Please note that different margin calculation rules apply to certain instruments on our platform, and it's important to understand these rules as they affect the margin required for your trades.`,
    //     },
    //     {
    //       question: "Can I withdraw funds from a Demo Account?",
    //       answer: `No, since a Demo Account uses virtual funds, there is no real money involved, and withdrawals are not possible.`,
    //     },
    //     {
    //       question:
    //         "Do I need to fully verify my Trive profile in order to open a Demo Trading Account?",
    //       answer: `No, you do not need to upload any documents to open a Demo Account. You only need to complete your Trive profile to get started.`,
    //     },
    //     {
    //       question: "Can I switch between a Demo Account and a live account?",
    //       answer: `Demo Accounts cannot be converted to Live Trading Accounts. However, once you're ready to start trading with real funds, you can fully verify your Trive profile (if not already verified) and then open a Live Trading Account.`,
    //     },
    //     {
    //       question:
    //         "Can I use a Demo Account to test different trading strategies?",
    //       answer: `Yes, a Demo Account is an excellent tool for testing various trading strategies and techniques without the risk of losing real money. However, please remember that certain trading practices are prohibited, and these are outlined in our Terms & Conditions. Make sure to review them to avoid any violations.`,
    //     },
    //     {
    //       question: "Do Demo Accounts expire?",
    //       answer: `No, Demo Trading Accounts do not have an expiration date. However, if there is prolonged inactivity, the company may close the account at its discretion.`,
    //     },
    //   ],
    // },
  {
  title: "MetaTrader 5",
  content: [
    {
      question: "What is MetaTrader 5 (MT5)?",
      answer: `MetaTrader 5 (MT5) is an advanced trading platform used to trade financial markets such as Forex, commodities, indices, stocks, and cryptocurrencies. It offers enhanced charting tools, more timeframes, advanced order types, technical indicators, and automated trading through Expert Advisors.`,
    },
    {
      question: "How do I install MetaTrader 5?",
      answer: `To install MetaTrader 5, go to the download section at the top of this page and select the correct version for your device, such as Windows, Mac, iOS, or Android. After downloading, follow the installation steps and log in using your trading account credentials.`,
    },
    {
      question: "Can I use MetaTrader 5 on mobile devices?",
      answer: `Yes, MetaTrader 5 is available for both iOS and Android devices. You can trade, manage positions, monitor charts, and access your account from anywhere using the MT5 mobile app.`,
    },
    {
      question: "How can I reset or change my MT5 Trading Account password?",
      answer: `In order to reset or change your Trading Account password:<br/><br>
        <ul>
          <li>1. Log in to your Client Area.</li>
          <li>2. Go to "My Accounts" and select the Live or Demo section.</li>
          <li>3. Click the "key – change password" icon.</li>
          <li>4. Click on the "Get Code" button and check your registered email address.</li>
          <li>5. Submit the code, enter your new password twice, and click "Submit".</li>
        </ul>`,
    },
    {
      question: "How to log in to my MT5 Trading Account using Mobile?",
      answer: `<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-gray-300 p-4">
          <p><strong>Android:</strong></p><br/>
          <ul>
            <li>1. Open the MetaTrader 5 app.</li>
            <li>2. Tap "Manage Accounts" or the "+" icon.</li>
            <li>3. Search for your broker server.</li>
            <li>4. Enter your MT5 login ID and password.</li>
            <li>5. Tap "Sign In" to access your trading account.</li>
          </ul>
        </div>
        <div class="bg-gray-300 p-4">
          <p><strong>iOS:</strong></p><br/>
          <ul>
            <li>1. Open the MetaTrader 5 app.</li>
            <li>2. Go to Settings and tap "New Account".</li>
            <li>3. Search for your broker server.</li>
            <li>4. Enter your MT5 account number and password.</li>
            <li>5. Tap "Sign In" to start trading.</li>
          </ul>
        </div>
      </div>`,
    },
    {
      question: "What are EAs, and can I use them with MT5?",
      answer: `Expert Advisors (EAs) are automated trading programs that execute trades based on predefined strategies. You can use EAs on MT5 as long as your trading strategy complies with our Terms & Conditions and does not involve abusive trading practices.`,
    },
    {
      question: "How to modify/delete trade on the MT5 Platform?",
      answer: `<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-gray-300 p-4">
          <p><strong>On PC/Laptop:</strong></p><br/>
          <ul>
            <li>1. Open the "Toolbox" window and go to the "Trade" tab.</li>
            <li>2. Right-click on the trade you wish to modify.</li>
            <li>3. Select "Modify or Delete Order".</li>
            <li>4. Update the Stop Loss, Take Profit, or pending order details and confirm.</li>
          </ul>
        </div>
        <div class="bg-gray-300 p-4">
          <p><strong>On Mobile:</strong></p><br/>
          <ul>
            <li>1. Go to the "Trade" tab.</li>
            <li>2. Tap and hold the open position or pending order.</li>
            <li>3. Select "Modify Position" or "Delete Order".</li>
            <li>4. Apply the changes and confirm.</li>
          </ul>
        </div>
      </div>
      <p class='note'>NOTE: Only pending orders that have not been triggered can be deleted. Open positions can be modified or closed, but not deleted.</p>`,
    },
    {
      question: "How to add Indicators on my MT5 chart?",
      answer: `<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-gray-300 p-4">
          <p><strong>On PC/Laptop:</strong></p><br/>
          <ul>
            <li>1. Open MT5 and select the chart you want to use.</li>
            <li>2. Go to Insert > Indicators from the top menu.</li>
            <li>3. Choose the indicator you want to add.</li>
            <li>4. Customize the settings such as inputs, colors, and levels.</li>
            <li>5. Click "OK" to apply the indicator to the chart.</li>
          </ul>
        </div>
        <div class="bg-gray-300 p-4">
          <p><strong>On Mobile:</strong></p><br/>
          <ul>
            <li>1. Open the desired chart.</li>
            <li>2. Tap the "f" icon on the chart screen.</li>
            <li>3. Select the indicator you want to apply.</li>
            <li>4. Adjust the settings as needed.</li>
            <li>5. Tap "Done" to apply the indicator.</li>
          </ul>
        </div>
      </div>`,
    },
    {
      question: "How can I view the pair specification in MT5?",
      answer: `<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-gray-300 p-4">
          <p><strong>On Desktop (Windows/Mac):</strong></p><br/>
          <ul>
            <li>1. Open MT5 and go to the Market Watch window.</li>
            <li>2. Right-click on the trading pair you want to check.</li>
            <li>3. Select "Specification".</li>
            <li>4. A window will display details such as spread, contract size, margin requirements, swap rates, and trading hours.</li>
          </ul>
        </div>
        <div class="bg-gray-300 p-4">
          <p><strong>On Mobile (iOS/Android):</strong></p><br/>
          <ul>
            <li>1. Open the MT5 app and go to the Quotes tab.</li>
            <li>2. Tap the trading pair you want to check.</li>
            <li>3. Select "Properties" or "Symbol Properties".</li>
            <li>4. The screen will show the pair specifications, including spread, contract size, margin, and trading hours.</li>
          </ul>
        </div>
      </div>`,
    },
    {
      question: "How do I install an Expert Advisor (EA) on MT5?",
      answer: `<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-gray-300 p-4">
          <p><strong>On Desktop (Windows/Mac):</strong></p><br/>
          <ul>
            <li>1. Open MT5 and go to File > Open Data Folder.</li>
            <li>2. Navigate to MQL5 > Experts.</li>
            <li>3. Copy your EA file into the Experts folder.</li>
            <li>4. Restart MT5 and open the Navigator panel.</li>
            <li>5. Find your EA under Expert Advisors and drag it onto a chart.</li>
            <li>6. Enable Algo Trading from the toolbar to activate the EA.</li>
          </ul>
        </div>
        <div class="bg-gray-300 p-4">
          <p><strong>On Mobile (iOS/Android):</strong></p><br/>
          <ul>
            <li>Expert Advisors cannot be installed or used on the MT5 mobile app.</li>
          </ul>
        </div>
      </div>`,
    },
  ],
}
    // {
    //   title: "Regulatory Environment",
    //   content: [
    //     {
    //       question: "Is Trive regulated?",
    //       answer:
    //         "Arena Trading Technology Pty Ltd is an AFS Authorised Representative in Australia (ASIC) with registered CAR No.: 001306061",
    //     },
    //     {
    //       question: "In which countries is Trive regulated? ",
    //       answer:
    //         "Trive does not provide services to residents of certain restricted jurisdictions where such offerings would contravene local laws or regulatory requirements. Restricted regions include but are not limited to: The United States of America (USA), The Democratic People’s Republic of Korea (DPRK), Singapore, any other jurisdiction where Trive's services would be deemed unlawful under local regulations.",
    //     },
    //     {
    //       question:
    //         "What is the difference between a regulated broker and an unregulated broker?",
    //       answer: `The main difference between a regulated broker and an unregulated broker lies in the oversight and compliance with legal and financial standards required by governmental or independent authorities.
    //          <br><br>
    //             A regulated broker is licensed to operate within a specific jurisdiction, or from a country with which there is a mutual regulatory agreement, ensuring the broker is adhering to a set of predefined rules, laws, and protection measures for traders and investors. This licensing shows that a recognized regulator is monitoring the broker's activities to make sure the broker follows fair trading practices. `,
    //     },
    //   ],
    // },
  ];
  constructor() {}

  ngOnInit(): void {}
}
