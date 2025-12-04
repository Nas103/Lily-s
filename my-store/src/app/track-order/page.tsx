export const metadata = {
  title: "Track Order | Lily Atelier",
};

export default function TrackOrderPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zinc-50">
      <main className="mx-auto max-w-3xl px-6 py-16">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
            After purchase
          </p>
          <h1 className="text-3xl font-semibold tracking-tight h1-gradient">
            Track your order
          </h1>
          <p className="text-sm text-zinc-600">
            Enter your order number and the email you used during checkout. We
            will return the latest scan events instantly.
          </p>
        </div>
        <form className="mt-10 space-y-6 rounded-3xl border border-zinc-100 bg-white p-8 shadow-sm">
          <label className="block text-sm font-medium text-zinc-700">
            Order Number
            <input
              type="text"
              placeholder="LY-2024-00098"
              className="mt-2 w-full rounded-2xl border border-zinc-200 px-4 py-3 text-base text-zinc-900 placeholder:text-zinc-500"
            />
          </label>
          <label className="block text-sm font-medium text-zinc-700">
            Email address
            <input
              type="email"
              placeholder="you@example.com"
              className="mt-2 w-full rounded-2xl border border-zinc-200 px-4 py-3 text-base text-zinc-900 placeholder:text-zinc-500"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-full bg-black px-6 py-3 text-xs font-semibold uppercase tracking-[0.4em] text-white"
          >
            Track order
          </button>
        </form>
      </main>
    </div>
  );
}


