import { CartSummary } from "@/components/CartSummary";

export const metadata = {
  title: "Checkout | Lily Atelier",
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
            to PayFast for secure payment.
          </p>
        </header>
        <section className="grid gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <form className="space-y-4 rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
                Contact
              </p>
              <input
                type="text"
                placeholder="Full name"
                className="mt-2 w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-500"
              />
              <input
                type="email"
                placeholder="Email address"
                className="mt-2 w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-500"
              />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
                Shipping address
              </p>
              <input
                type="text"
                placeholder="Street address"
                className="mt-2 w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-500"
              />
              <div className="mt-2 grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="City"
                  className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-500"
                />
                <input
                  type="text"
                  placeholder="State"
                  className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-500"
                />
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Postal code"
                  className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-500"
                />
                <input
                  type="text"
                  placeholder="Country"
                  className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-500"
                />
              </div>
            </div>
          </form>
          <CartSummary />
        </section>
      </main>
    </div>
  );
}

