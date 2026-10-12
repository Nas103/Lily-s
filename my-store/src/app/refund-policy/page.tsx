import type { Metadata } from "next";
import { BRAND } from "@/lib/brand";
import { COMPANY, LAST_UPDATED } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Refund & Returns Policy",
  description: `How to return items and request refunds from ${BRAND.name}.`,
};

type Clause = {
  heading: string;
  body: string[];
};

const clauses: Clause[] = [
  {
    heading: "1. Overview",
    body: [
      `We want you to be satisfied with your purchase. This Refund & Returns Policy explains how returns, refunds, exchanges and cancellations work at ${BRAND.name}. It forms part of, and should be read with, our Terms & Conditions.`,
    ],
  },
  {
    heading: "2. Your statutory rights",
    body: [
      `Nothing in this Policy limits any right you have under the Consumer Protection Act 68 of 2008 ("CPA"), the Electronic Communications and Transactions Act 25 of 2002 ("ECTA") or any other law that cannot lawfully be limited.`,
      `These rights include, among others: the right to return goods and to cancel certain advance orders and reservations under section 20 of the CPA; the implied warranty of quality under section 56 of the CPA, which entitles you to a repair, replacement or refund (at your choice, subject to the law) where goods fail to meet the required standard within 6 months of delivery; and, for transactions concluded electronically, the right to cancel within 7 days of receipt under section 44 of ECTA, unless an exception applies.`,
    ],
  },
  {
    heading: "3. Cooling-off (change of mind)",
    body: [
      `In addition to your statutory rights, we offer a discretionary returns window: you may return eligible, unused items in their original condition and packaging within 14 days of delivery for a refund or exchange.`,
      `Where a statutory cooling-off right applies (for example, 7 days under ECTA for certain electronic transactions), a full refund including the standard delivery cost will be given, subject to the exceptions in the law.`,
    ],
  },
  {
    heading: "4. Condition of returned items",
    body: [
      `To be eligible for a discretionary return, items must be unused, unworn, unwashed, with all tags, seals and hygiene stickers intact, and returned in their original packaging with any accessories, manuals and free gifts. You must provide proof of purchase (such as your order number).`,
      `We may reduce or decline a refund where the value of the goods has been diminished by your handling beyond what is necessary to inspect them, or where the goods are not in a resaleable condition.`,
    ],
  },
  {
    heading: "5. Non-returnable items",
    body: [
      `To the extent permitted by law, the following are not eligible for discretionary returns: personalised, custom-made or made-to-order items; items sealed for health or hygiene reasons once opened (such as certain beauty, fragrance and personal-care products); perishable goods; gift cards and digital content or licences once accessed or downloaded; and items marked as final sale or clearance.`,
      `This does not affect your statutory rights in respect of defective goods.`,
    ],
  },
  {
    heading: "6. Faulty, damaged or incorrect items",
    body: [
      `If you receive an item that is defective, damaged in transit, or not the item you ordered, please contact us within a reasonable time (and, for the CPA implied warranty, within 6 months of delivery). Where the fault is ours or the goods do not meet the required standard, we will arrange a repair, replacement or refund in accordance with the law, and we will cover the reasonable cost of returning the item.`,
    ],
  },
  {
    heading: "7. How to start a return",
    body: [
      `To start a return, email ${COMPANY.email} with your order number, the item(s) concerned, and the reason for the return. We will confirm whether the return is approved and provide return instructions. Do not send items back before receiving our instructions, as unauthorised returns may not be accepted.`,
    ],
  },
  {
    heading: "8. Return shipping costs",
    body: [
      `For discretionary (change-of-mind) returns, you are responsible for the cost of returning the item unless we agree otherwise, and the original delivery cost is not refunded.`,
      `For faulty, damaged, incorrect, or short-delivered items, and where a statutory cooling-off right applies, we bear the reasonable cost of the return.`,
    ],
  },
  {
    heading: "9. Refunds",
    body: [
      `Once we receive and inspect a returned item, we will notify you of the outcome. Approved refunds are made to your original payment method within 10 business days of approval. Depending on your payment provider and bank, it may take additional time for the refund to reflect.`,
      `Refunds are processed in the currency in which payment was taken. Any currency-conversion differences, bank charges or payment-provider fees are not refundable, and the amount refunded is the amount we actually received for the item.`,
    ],
  },
  {
    heading: "10. Exchanges",
    body: [
      `Where available, we will exchange an eligible item for another size, colour or product of equal value, subject to stock availability. Any price difference is payable by you or refunded to you as applicable.`,
    ],
  },
  {
    heading: "11. Cancellations",
    body: [
      `You may cancel an order before it is dispatched by contacting us. If the order has already been dispatched, the return process above applies. Where we cancel an order (for example, due to unavailability or a pricing error), we will refund any amount you have paid for the affected items.`,
    ],
  },
  {
    heading: "12. Digital content",
    body: [
      `Digital content and licences are generally non-refundable once access has been granted or the content has been downloaded, except where the content is faulty or where a refund is required by law.`,
    ],
  },
  {
    heading: "13. Contact us",
    body: [
      `For any questions about returns or refunds, contact us at ${COMPANY.email}. We are happy to help.`,
    ],
  },
];

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-3xl px-6 py-16 text-zinc-900">
        <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
          Legal
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight h1-gradient">
          Refund &amp; Returns Policy
        </h1>
        <p className="mt-3 text-sm text-zinc-500">
          Last updated: {LAST_UPDATED}
        </p>
        <p className="mt-6 text-sm leading-relaxed text-zinc-600">
          How to return an item, request a refund or exchange, and what you can
          expect from us.
        </p>

        <div className="mt-10 space-y-10">
          {clauses.map((clause) => (
            <section key={clause.heading} className="space-y-3">
              <h2 className="text-lg font-semibold tracking-tight text-zinc-900">
                {clause.heading}
              </h2>
              {clause.body.map((paragraph, index) => (
                <p key={index} className="text-sm leading-relaxed text-zinc-700">
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
