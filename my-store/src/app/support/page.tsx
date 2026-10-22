"use client";

import { useState } from "react";
import { BRAND } from "@/lib/brand";

const faqs = [
  {
    question: "Do you ship internationally?",
    answer:
      "Yes. Orders leave our UAE fulfillment hub daily with same-day dispatch for GCC and 3-5 day delivery worldwide.",
  },
  {
    question: "How do I request concierge styling?",
    answer: `Email ${BRAND.conciergeEmail} with your measurements, event date, and inspiration. A stylist will curate a rack within 24 hours.`,
  },
  {
    question: "Can I alter an abaya purchase?",
    answer:
      "Complimentary tailoring is available within 2-5 days. Book an appointment through the support form below.",
  },
];

export default function SupportPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Unable to send your message. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setError("Unable to reach the server. Please try again.");
      setStatus("error");
    }
  };

  const sending = status === "sending";

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

            {status === "sent" ? (
              <div className="mt-6 rounded-3xl border border-emerald-100 bg-emerald-50 p-6">
                <p className="text-sm font-semibold text-emerald-800">
                  Message sent.
                </p>
                <p className="mt-1 text-sm text-emerald-700">
                  Thanks — our team will get back to you within 2 hours during
                  business days.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="mt-4 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-800 underline"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form className="mt-6 space-y-4" onSubmit={submit}>
                {error ? (
                  <p className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </p>
                ) : null}
                <input
                  name="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  maxLength={120}
                  className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-500"
                  required
                />
                <input
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  maxLength={255}
                  className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-500"
                  required
                />
                <textarea
                  name="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we assist?"
                  rows={4}
                  maxLength={5000}
                  className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-500"
                  required
                />
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full rounded-full bg-black px-6 py-3 text-xs font-semibold uppercase tracking-[0.4em] text-white disabled:opacity-60"
                >
                  {sending ? "Sending…" : "Send request"}
                </button>
              </form>
            )}
          </section>
          <section className="space-y-6 rounded-3xl border border-zinc-100 bg-zinc-50 p-8">
            <h2 className="text-sm uppercase tracking-[0.35em] text-zinc-500">
              FAQ
            </h2>
            {faqs.map((faq) => (
              <div key={faq.question}>
                <p className="text-base font-semibold h1-gradient">{faq.question}</p>
                <p className="mt-2 text-sm text-zinc-600">{faq.answer}</p>
              </div>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}
