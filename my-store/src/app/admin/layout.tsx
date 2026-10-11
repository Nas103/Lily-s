import Link from "next/link";
import { AdminNav } from "./AdminNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 pt-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-900">
              NaSO
            </span>
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-zinc-600">
              Admin panel
            </span>
          </div>
          <Link
            href="/"
            className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500 transition hover:text-zinc-900"
          >
            View store →
          </Link>
        </div>
        <div className="mx-auto max-w-6xl px-6 py-4">
          <AdminNav />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}