import type { Metadata } from "next";
import { BRAND } from "@/lib/brand";
import { COMPANY, LAST_UPDATED } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${BRAND.name} collects, uses and protects your personal information.`,
};

type Clause = {
  heading: string;
  body: string[];
};

const clauses: Clause[] = [
  {
    heading: "1. About this Policy",
    body: [
      `This Privacy Policy explains how ${COMPANY.legalName} (registration number ${COMPANY.registration}) ("${BRAND.name}", "we", "us", "our") collects, uses, shares and protects your personal information when you use our website, mobile application and services (the "Services").`,
      `We process personal information in accordance with the Protection of Personal Information Act 4 of 2013 ("POPIA") and other applicable laws. By using the Services, you acknowledge this Policy. It should be read together with our Terms & Conditions and Cookies Policy.`,
    ],
  },
  {
    heading: "2. Information we collect",
    body: [
      `Information you provide: your name, email address, phone number, delivery and billing addresses, account credentials, order details, reviews and any information you submit through support, concierge or chat features.`,
      `Payment information: payments are processed by third-party providers (such as PayFast). We receive limited information such as payment status, a transaction reference, and the last digits of a card where provided by the processor. We do not store your full card details.`,
      `Information collected automatically: device and browser type, IP address, approximate location derived from IP, pages viewed, referring URLs, and cookie or similar identifiers.`,
      `Information from third parties: for example, delivery partners, fraud-prevention and payment providers, and analytics providers.`,
    ],
  },
  {
    heading: "3. How we use your information",
    body: [
      `We process your personal information to: create and manage your account; process, fulfil and deliver orders; take payments and prevent fraud; provide customer support and concierge services; personalise and improve the Services; send transactional messages and, where permitted, marketing; comply with legal and tax obligations; and enforce our Terms and protect our rights.`,
      `Our lawful bases include performing our contract with you, your consent (where required), our legitimate business interests, and compliance with legal obligations.`,
    ],
  },
  {
    heading: "4. Cookies and similar technologies",
    body: [
      `We use cookies and similar technologies to operate the Services, remember your preferences, measure performance and (with consent where required) support marketing. See our Cookies Policy for details and how to manage them.`,
    ],
  },
  {
    heading: "5. Sharing your information",
    body: [
      `We share personal information with service providers who help us operate the Services (operators), including payment processors, delivery and logistics partners, cloud hosting, email and notification providers, analytics providers, and professional advisers. These operators are required to protect your information and to use it only for the purposes we specify.`,
      `We may also disclose information where required by law, to enforce our Terms, to protect the rights, property or safety of ${BRAND.name}, our customers or others, or in connection with a merger, acquisition or sale of assets. We do not sell your personal information.`,
    ],
  },
  {
    heading: "6. Cross-border transfers",
    body: [
      `Some of our service providers may process information outside South Africa. Where we transfer personal information across borders, we take reasonable steps to ensure it receives an adequate level of protection, as required by POPIA, including through contractual safeguards.`,
    ],
  },
  {
    heading: "7. Retention",
    body: [
      `We retain personal information only for as long as necessary to fulfil the purposes set out in this Policy, to comply with legal, tax and accounting requirements, to resolve disputes, and to enforce our agreements. When no longer needed, we delete or de-identify it.`,
    ],
  },
  {
    heading: "8. Security",
    body: [
      `We implement reasonable technical and organisational measures to protect personal information against loss, misuse and unauthorised access. No method of transmission or storage is completely secure, so we cannot guarantee absolute security. If a breach affecting your personal information occurs, we will notify you and the Information Regulator as required by law.`,
    ],
  },
  {
    heading: "9. Your rights",
    body: [
      `Subject to POPIA, you have the right to: be notified when your information is collected; request access to the personal information we hold about you; request correction or deletion of information that is inaccurate, irrelevant, excessive or unlawfully processed; object to processing; withdraw consent (without affecting prior lawful processing); and lodge a complaint with the Information Regulator.`,
      `To exercise these rights, contact our Information Officer using the details below. We may need to verify your identity before acting on a request.`,
    ],
  },
  {
    heading: "10. Children",
    body: [
      `The Services are intended for persons aged 18 and over. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us so that we can delete it.`,
    ],
  },
  {
    heading: "11. Direct marketing",
    body: [
      `We may send you marketing communications where you have opted in or where we are otherwise permitted to do so. You can opt out at any time using the unsubscribe link in our messages, in your account preferences, or by contacting us.`,
    ],
  },
  {
    heading: "12. Changes to this Policy",
    body: [
      `We may update this Policy from time to time. The updated version takes effect when posted with a revised "Last updated" date. We encourage you to review it periodically.`,
    ],
  },
  {
    heading: "13. Contact us",
    body: [
      `For questions about this Policy or to exercise your rights, contact our Information Officer, ${COMPANY.informationOfficer}, at ${COMPANY.informationOfficerEmail}, or write to us at ${COMPANY.address}.`,
      `You also have the right to complain to the Information Regulator of South Africa (inforeg.org.za).`,
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-3xl px-6 py-16 text-zinc-900">
        <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
          Legal
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight h1-gradient">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-zinc-500">
          Last updated: {LAST_UPDATED}
        </p>
        <p className="mt-6 text-sm leading-relaxed text-zinc-600">
          Your privacy matters to us. This Policy describes what personal
          information we collect, why we collect it, and the choices and rights
          you have.
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
