import type { Metadata } from "next";
import { BRAND } from "@/lib/brand";
import { COMPANY, LAST_UPDATED } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Cookies Policy",
  description: `How ${BRAND.name} uses cookies and similar technologies.`,
};

type Clause = {
  heading: string;
  body: string[];
};

const clauses: Clause[] = [
  {
    heading: "1. About this Policy",
    body: [
      `This Cookies Policy explains how ${COMPANY.legalName} ("${BRAND.name}", "we", "us", "our") uses cookies and similar technologies on our website and mobile application (the "Services"). It should be read together with our Privacy Policy and Terms & Conditions.`,
    ],
  },
  {
    heading: "2. What are cookies",
    body: [
      `Cookies are small text files placed on your device that allow a website to recognise your device, remember your preferences, and understand how you use the site. We also use similar technologies such as local storage and pixels.`,
    ],
  },
  {
    heading: "3. Types of cookies we use",
    body: [
      `Strictly necessary: required for the Services to function, such as keeping you signed in, maintaining your cart and session security. These cannot be switched off through our cookie controls.`,
      `Functional: remember choices you make (such as language, region or currency) to provide a more personalised experience.`,
      `Analytics and performance: help us understand how visitors use the Services so we can measure and improve performance (for example, aggregate usage statistics).`,
      `Marketing: where permitted and with consent where required, used to deliver relevant advertising and measure its effectiveness.`,
    ],
  },
  {
    heading: "4. Third-party cookies",
    body: [
      `Some cookies are placed by third parties that provide services to us, such as analytics providers, payment providers and advertising partners. These third parties may collect information about your activity across websites, subject to their own privacy and cookie policies.`,
    ],
  },
  {
    heading: "5. Consent and managing cookies",
    body: [
      `Where required by law, we ask for your consent before setting non-essential cookies. You can accept or decline non-essential cookies through our cookie banner (where available).`,
      `You can also control or delete cookies through your browser settings. Blocking strictly necessary cookies may affect how the Services work, and some features may not function properly.`,
    ],
  },
  {
    heading: "6. Changes to this Policy",
    body: [
      `We may update this Policy from time to time to reflect changes in the technologies we use or applicable law. The updated version takes effect when posted with a revised "Last updated" date.`,
    ],
  },
  {
    heading: "7. Contact us",
    body: [
      `If you have questions about our use of cookies, contact us at ${COMPANY.email}.`,
    ],
  },
];

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-3xl px-6 py-16 text-zinc-900">
        <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
          Legal
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight h1-gradient">
          Cookies Policy
        </h1>
        <p className="mt-3 text-sm text-zinc-500">
          Last updated: {LAST_UPDATED}
        </p>
        <p className="mt-6 text-sm leading-relaxed text-zinc-600">
          This Policy explains the cookies and similar technologies we use, why
          we use them, and how you can manage them.
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
