"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Store,
  FileText,
  Package,
  ShoppingCart,
  Users,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { ReactNode } from "react";

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/brands", label: "Brands", icon: Store },
  { href: "/admin/brand-custom-pages", label: "Custom Pages", icon: FileText },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin/risk-review", label: "Risk Review", icon: ShieldCheck },
];

function isActive(pathname: string, href: string) {
  return pathname === href || (href !== "/admin" && pathname.startsWith(href));
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "";
  const current = pathname.split("/").filter(Boolean).slice(1).join(" / ") || "Overview";

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-black">
      <div className="flex min-h-screen">
        <aside className="sticky top-0 hidden h-screen w-[260px] shrink-0 border-r border-white/5 bg-black/40 backdrop-blur-xl lg:flex lg:flex-col">
          <div className="flex items-center gap-3 px-6 py-6">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-fuchsia-500/40 to-cyan-400/40 blur-md" />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-white/10 to-white/5">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Lily&apos;s Admin</p>
              <p className="text-xs text-white/40">Command Center</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto px-3">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 ${
                    active
                      ? "bg-gradient-to-r from-white/10 to-white/5 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.05)]"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {active ? (
                    <div className="absolute left-0 h-6 w-0.5 rounded-r-full bg-gradient-to-b from-fuchsia-400 to-cyan-400" />
                  ) : null}
                  <Icon className={`h-4 w-4 ${active ? "text-white" : "text-white/40 group-hover:text-white/70"}`} />
                  <span className="flex-1">{item.label}</span>
                  {active ? <ChevronRight className="h-3 w-3 text-white/40" /> : null}
                </Link>
              );
            })}
          </nav>

          <div className="px-6 py-4">
            <div className="rounded-xl border border-white/5 bg-gradient-to-br from-white/5 to-transparent p-4">
              <p className="text-xs text-white/60">System Status</p>
              <div className="mt-2 flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
                <p className="text-xs text-white/40">All systems operational</p>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-white/5 bg-black/40 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8 lg:py-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 lg:hidden">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-sm font-semibold text-white">Lily&apos;s Admin</p>
                </div>
                <p className="hidden text-sm text-white/40 lg:block">Admin / {current}</p>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-3 py-1.5">
                <div className="h-2 w-2 rounded-full bg-fuchsia-400" />
                <p className="text-xs text-white/60">Live</p>
              </div>
            </div>

            <nav className="flex gap-1 overflow-x-auto px-3 pb-2 lg:hidden">
              {navItems.map((item) => {
                const active = isActive(pathname, item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs transition ${
                      active ? "bg-white/10 text-white" : "text-white/50 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </header>

          <main className="relative min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
