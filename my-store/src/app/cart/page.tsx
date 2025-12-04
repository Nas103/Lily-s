import Link from "next/link";
import { CartSummary } from "@/components/CartSummary";

export const metadata = {
  title: "Cart | Lily Atelier",
};

export default function CartPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white">
      <main className="mx-auto max-w-5xl px-6 py-16">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
              Step 0
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight h1-gradient">
              Shopping bag
            </h1>
          </div>
          <Link
            href="/checkout"
            className="rounded-full border border-zinc-900 px-6 py-2 text-xs font-semibold uppercase tracking-[0.35em]"
          >
            Checkout
          </Link>
        </div>
        <div className="mt-10">
          <CartSummary />
        </div>
      </main>
    </div>
  );
}


