const faqs = [
  {
    question: "Do you ship internationally?",
    answer:
      "Yes. Orders leave our UAE fulfillment hub daily with same-day dispatch for GCC and 3-5 day delivery worldwide.",
  },
  {
    question: "How do I request concierge styling?",
    answer:
      "Email concierge@lilyatelier.com with your measurements, event date, and inspiration. A stylist will curate a rack within 24 hours.",
  },
  {
    question: "Can I alter an abaya purchase?",
    answer:
      "Complimentary tailoring is available within 30 days. Book an appointment through the support form below.",
  },
];

export const metadata = {
  title: "Support | Lily Atelier",
};

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2">
          <section className="space-y-4">
            <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
              Concierge
            </p>
            <h1 className="text-3xl font-semibold tracking-tight h1-gradient">
              Support & care
            </h1>
            <p className="text-sm text-zinc-600">
              Reach our stylists, check status, or schedule fittings. We respond
              within 2 hours during business days.
            </p>
            <form
              className="mt-6 space-y-4"
              action="/api/support"
              method="POST"
            >
              <input
                name="name"
                type="text"
                placeholder="Full name"
                className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-500"
                required
              />
              <input
                name="email"
                type="email"
                placeholder="Email address"
                className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-500"
                required
              />
              <textarea
                name="message"
                placeholder="How can we assist?"
                rows={4}
                className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-500"
                required
              />
              <button className="w-full rounded-full bg-black px-6 py-3 text-xs font-semibold uppercase tracking-[0.4em] text-white">
                Send request
              </button>
            </form>
          </section>
          <section className="space-y-6 rounded-3xl border border-zinc-100 bg-zinc-50 p-8">
            <h2 className="text-sm uppercase tracking-[0.35em] text-zinc-500">
              FAQ
            </h2>
            {faqs.map((faq) => (
              <div key={faq.question}>
                <p className="text-base font-semibold">{faq.question}</p>
                <p className="mt-2 text-sm text-zinc-600">{faq.answer}</p>
              </div>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}


