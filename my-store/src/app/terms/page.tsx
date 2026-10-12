import type { Metadata } from "next";
import { BRAND } from "@/lib/brand";
import { COMPANY, LAST_UPDATED } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: `The terms governing your use of ${BRAND.name} and any purchase you make from us.`,
};

type Clause = {
  heading: string;
  body: string[];
};

const clauses: Clause[] = [
  {
    heading: "1. About these Terms",
    body: [
      `These Terms & Conditions ("Terms") govern your access to and use of the ${BRAND.name} website, mobile application and services (together, the "Services"), and any order you place through them. The Services are operated by ${COMPANY.legalName} (registration number ${COMPANY.registration}) ("${BRAND.name}", "we", "us", "our").`,
      `By accessing the Services, creating an account, or placing an order, you confirm that you have read, understood and agree to be bound by these Terms. If you do not agree, you must not use the Services.`,
      `These Terms must be read together with our Privacy Policy, Cookies Policy and Refund & Returns Policy (once published), each of which forms part of these Terms. Where there is a conflict, these Terms prevail to the extent of the conflict.`,
    ],
  },
  {
    heading: "2. Definitions",
    body: [
      `"Customer", "you" or "your" means the person accessing the Services or placing an order. "Products" means the goods (and, where applicable, digital content) offered for sale. "Order" means a request by you to purchase Products. "Business Day" means any day other than a Saturday, Sunday or public holiday in the Republic of South Africa.`,
    ],
  },
  {
    heading: "3. Eligibility and capacity",
    body: [
      `You must be at least 18 years old and have the legal capacity to enter into a binding agreement to place an order. By transacting, you represent that you meet these requirements and that all information you provide is accurate, current and complete.`,
      `Where you use the Services on behalf of a business, you represent that you are authorised to bind that business, and "you" includes that business.`,
    ],
  },
  {
    heading: "4. Your account",
    body: [
      `You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. You agree to notify us immediately of any unauthorised use or suspected security breach.`,
      `We may refuse, suspend or terminate any account, in whole or in part, where we reasonably believe these Terms have been or may be breached, or where required to protect the Services, our customers or our partners.`,
    ],
  },
  {
    heading: "5. Products, availability and pricing",
    body: [
      `We take reasonable care to describe and depict Products accurately. Product images are for illustration; actual colours, finishes and packaging may vary slightly. All Products are subject to availability, and we may limit quantities or withdraw any Product at any time.`,
      `Prices are displayed in United States Dollars (USD) as the base currency and may be shown to you converted into your local currency for convenience. Currency conversions are indicative estimates based on prevailing exchange rates and may vary between the time you view a Product and the time an Order is processed. The amount charged and payable is the amount confirmed at checkout.`,
      `Prices may change without notice. Promotional or discounted pricing is available only for the stated period and may be withdrawn at any time, save where a price has already been confirmed for an accepted Order.`,
    ],
  },
  {
    heading: "6. Orders and acceptance",
    body: [
      `Your submission of an Order constitutes an offer to purchase the Products on these Terms. No binding contract of sale is formed until we accept your Order, which occurs when we confirm dispatch or, for digital content, when we grant access.`,
      `We may decline or cancel an Order (in whole or in part) where the Product is unavailable, where a pricing, typographical or system error occurred, where we suspect fraud or unauthorised activity, or where required by law. If we cancel and you have already paid, we will refund the affected amount.`,
      `Once an Order has been accepted and dispatched, changes or cancellations are governed by our Refund & Returns Policy.`,
    ],
  },
  {
    heading: "7. Payment",
    body: [
      `Payment is processed by third-party payment service providers (including PayFast and such other gateways as we may support). We do not receive or store your full card details; those are handled by the relevant payment provider under its own terms and security standards.`,
      `You warrant that any payment method you use is yours (or that you are validly authorised to use it) and that sufficient funds or credit are available. You remain liable for any amounts correctly charged to your chosen payment method.`,
      `Where a payment is declined, reversed, or subject to a chargeback that is not upheld in your favour, we may suspend or cancel the affected Order and recover the resulting amounts and reasonable costs, to the extent permitted by law.`,
    ],
  },
  {
    heading: "8. Delivery, title and risk",
    body: [
      `We arrange delivery to the address you provide. Delivery timelines are estimates only and are not guaranteed. Risk in the Products passes to you on delivery to the address you supplied, or on collection where applicable. Title passes on full payment.`,
      `You are responsible for providing complete and accurate delivery details and for ensuring someone is available to receive delivery. We are not liable for loss, delay or failure arising from incorrect or incomplete details, failed delivery attempts, or receipt by any person at the address you supplied.`,
      `Where delivery is delayed or prevented by events outside our reasonable control (including courier failures or disruptions, customs, strikes, or force majeure), we will use reasonable efforts to notify you and to complete delivery, but you agree that such delays are not a breach by us and do not, by themselves, entitle you to cancel an accepted Order.`,
    ],
  },
  {
    heading: "9. Returns, refunds and cancellations",
    body: [
      `Our Refund & Returns Policy sets out when Products may be returned, the condition requirements, and how refunds are processed. Nothing in these Terms is intended to limit any right you may have under the Consumer Protection Act 68 of 2008 (the "CPA") that cannot lawfully be limited.`,
      `To the extent permitted by law, Products that are personalised, made to order, sealed for hygiene reasons and opened, or otherwise unsuitable for return may not be returned.`,
    ],
  },
  {
    heading: "10. Digital content and licences",
    body: [
      `Where we make digital content available, we grant you a limited, non-exclusive, non-transferable, revocable licence to use that content for your personal, non-commercial use only, subject to any additional terms presented at purchase.`,
      `Digital content is delivered "as is" where permitted by law, and access may be revoked if these Terms are breached or a payment is reversed.`,
    ],
  },
  {
    heading: "11. Promotions, vouchers and discounts",
    body: [
      `Promotional codes, discounts and vouchers are offered at our discretion, are non-transferable, may be subject to additional conditions, and may not be combined unless stated. We may withdraw or amend any promotion at any time.`,
    ],
  },
  {
    heading: "12. Intellectual property",
    body: [
      `All content on the Services — including text, graphics, logos, images, video, software, and the ${BRAND.name} name and marks — is owned by or licensed to us and is protected by intellectual property laws. You may not copy, reproduce, distribute, modify, scrape, frame, or create derivative works from any part of the Services without our prior written consent.`,
      `Any goodwill arising from your use of our marks accrues to us.`,
    ],
  },
  {
    heading: "13. Acceptable use (good conduct)",
    body: [
      `You agree to use the Services lawfully, honestly and in good faith, and not to: (a) breach any law or the rights of any person; (b) post or transmit unlawful, defamatory, obscene, discriminatory, misleading or harmful content; (c) commit or facilitate fraud, abuse, or misuse of promotions, returns or chargebacks; (d) interfere with, disrupt, or attempt to gain unauthorised access to the Services or another user's account; or (e) use the Services to infringe intellectual property or privacy rights.`,
      `You will not use automated means to access, extract or republish content, or to place Orders, without our written permission.`,
    ],
  },
  {
    heading: "14. Reviews and user content",
    body: [
      `If you submit reviews, comments, images or other content, you grant us a worldwide, royalty-free, transferable licence to use, reproduce, adapt and display that content in connection with the Services. You warrant that you own or have the necessary rights to the content and that it does not infringe any third party's rights or violate the law.`,
      `We may remove any content that we reasonably consider breaches these Terms or is otherwise unsuitable, and moderate reviews to keep them honest and relevant.`,
    ],
  },
  {
    heading: "15. Breach, suspension and termination",
    body: [
      `We may, without prejudice to our other rights, immediately suspend or terminate your access to the Services, cancel any outstanding Orders, and/or withhold fulfilment where you breach these Terms (including non-payment, fraud, abuse, or unlawful conduct).`,
      `On termination, all amounts then payable to us remain payable, and any licence granted to you (including for digital content) ends.`,
      `Where you breach these Terms, you will be liable for the losses, damages, and reasonable costs (including legal costs on an attorney-and-own-client scale where lawfully recoverable and reasonable collection or enforcement costs) that we suffer as a direct result of that breach, to the extent permitted by law. Nothing in this clause imposes a penalty or amount that is not a genuine estimate of our loss; any provision that would be an unenforceable penalty or unfair term does not apply.`,
    ],
  },
  {
    heading: "16. Indemnity",
    body: [
      `You indemnify and hold us, our directors, employees, and partners harmless from any claims, losses, liabilities, damages, and reasonable costs arising from: (a) your breach of these Terms or applicable law; (b) your infringement of any third-party right; (c) your misuse of the Services or any Products; or (d) content you submit. This indemnity does not apply to the extent the loss is caused by our own fault.`,
    ],
  },
  {
    heading: "17. Disclaimers",
    body: [
      `The Services are provided on an "as available" basis. To the maximum extent permitted by law, we disclaim all implied warranties and conditions, including merchantability, fitness for a particular purpose, and non-infringement, except where such warranties cannot lawfully be excluded.`,
      `We do not warrant that the Services will be uninterrupted, error-free, or free of harmful components, or that any content is accurate or complete.`,
    ],
  },
  {
    heading: "18. Limitation of liability",
    body: [
      `To the maximum extent permitted by law, and subject to the provisions below, our total aggregate liability to you under or in connection with these Terms — whether in contract, delict (including negligence), or otherwise — is limited to the greater of (i) the total amount actually paid by you for the Order giving rise to the claim, or (ii) the minimum amount required by applicable law.`,
      `We are not liable for indirect, incidental, special, punitive or consequential losses, or for loss of profit, revenue, data, goodwill, or anticipated savings, whether or not foreseeable.`,
      `We are not liable for any loss, damage or delay caused by events or circumstances beyond our reasonable control, or by the acts or omissions of third parties (including payment providers, couriers, customs authorities, hosting or network providers), or by your own act, omission, or failure to follow instructions.`,
      `Nothing in these Terms excludes or limits any liability that cannot lawfully be excluded or limited, including statutory rights under the CPA and liability arising from our gross negligence, wilful misconduct, or fraud.`,
    ],
  },
  {
    heading: "19. Force majeure",
    body: [
      `We will not be liable for any failure or delay in performing our obligations where the failure or delay results from an event beyond our reasonable control, including natural events, epidemics, war, civil unrest, labour action, government action, utility, network or payment-systems failures, or supplier failures.`,
    ],
  },
  {
    heading: "20. Notices and electronic communications",
    body: [
      `You consent to receive communications and notices from us electronically, including by email and in-app notification. Electronic communications satisfy any legal requirement that such communication be in writing, as permitted by the Electronic Communications and Transactions Act 25 of 2002.`,
      `Notices to you will be sent to the contact details on your account; notices to us must be sent to ${COMPANY.email}.`,
    ],
  },
  {
    heading: "21. Governing law and dispute resolution",
    body: [
      `These Terms are governed by the laws of the Republic of South Africa, without regard to conflict-of-law rules. Subject to any mandatory consumer dispute procedures, the parties consent to the jurisdiction of the courts of South Africa.`,
      `Before commencing formal proceedings, the parties agree to first attempt in good faith to resolve any dispute informally by written notice and discussion for a reasonable period.`,
    ],
  },
  {
    heading: "22. Changes to these Terms",
    body: [
      `We may update these Terms from time to time to reflect changes in our Services, the law, or our practices. The updated Terms take effect when posted on the Services with a revised "Last updated" date. Your continued use of the Services after that date constitutes acceptance of the updated Terms, save that the Terms in force at the time of an accepted Order govern that Order.`,
    ],
  },
  {
    heading: "23. General",
    body: [
      `Entire agreement: These Terms, together with the policies referred to in section 1, constitute the entire agreement between us regarding the Services and supersede any prior understandings.`,
      `Severability: If any provision is found to be unlawful or unenforceable, it is severed to the minimum extent necessary and the remaining provisions continue in full force.`,
      `No waiver: Our failure or delay in enforcing any right is not a waiver of that right.`,
      `Assignment: We may assign or subcontract our rights and obligations; you may not assign yours without our written consent.`,
      `Contact: For questions about these Terms, contact us at ${COMPANY.email}. Registered address: ${COMPANY.address}.`,
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-3xl px-6 py-16 text-zinc-900">
        <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
          Legal
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight h1-gradient">
          Terms &amp; Conditions
        </h1>
        <p className="mt-3 text-sm text-zinc-500">
          Last updated: {LAST_UPDATED}
        </p>
        <p className="mt-6 text-sm leading-relaxed text-zinc-600">
          Please read these Terms carefully before using {BRAND.name} or placing
          an order. They set out the basis on which we offer our products and
          services, and the rights and responsibilities of both you and us.
        </p>

        <div className="mt-10 space-y-10">
          {clauses.map((clause) => (
            <section key={clause.heading} className="space-y-3">
              <h2 className="text-lg font-semibold tracking-tight text-zinc-900">
                {clause.heading}
              </h2>
              {clause.body.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-sm leading-relaxed text-zinc-700"
                >
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>

        <p className="mt-12 border-t border-zinc-100 pt-6 text-xs text-zinc-500">
          © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
        </p>
      </main>
    </div>
  );
}
