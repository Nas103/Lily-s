import { WishlistGrid } from "@/components/WishlistGrid";

export const metadata = {
  title: "Wishlist | Lily Atelier",
};

export default function WishlistPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-6xl px-6 py-16">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
            Saved items
          </p>
          <h1 className="text-3xl font-semibold tracking-tight h1-gradient">
            Wishlist
          </h1>
          <p className="text-sm text-zinc-600">
            Curate ideas, compare finishes, and move them to cart when ready.
          </p>
        </div>
        <div className="mt-10">
          <WishlistGrid />
        </div>
      </main>
    </div>
  );
}


