import { CartSummary } from "@/components/CartSummary";
import { CheckoutForm } from "@/components/CheckoutForm";

export const metadata = {
  title: "Checkout",
};

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zinc-50">
      <main className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-16">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            Step 1 · Details · Step 2 · Review · Step 3 · Pay
          </p>
          <h1 className="text-3xl font-semibold tracking-tight h1-gradient">
            Checkout
          </h1>
          <p className="text-sm text-zinc-600">
            Tell us where this order is going, review your items, then continue
            to Stripe for secure payment.
          </p>
        </header>
        <section className="grid gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <CheckoutForm />
          <CartSummary />
        </section>
      </main>
    </div>
  );
}

