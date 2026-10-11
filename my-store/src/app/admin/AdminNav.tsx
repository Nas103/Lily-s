"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/risk-review", label: "Risk review" },
];

export function AdminNav() {
  const pathname = usePathname();
  const routeFor = (href: string) => (href === "/admin" ? href : `${href}`);
  const isActive = (href: string) =>
    href === "/admin"
      ? pathname === "/admin"
      : pathname.startsWith(`${href}/`) || pathname === href;

  return (
    <nav className="flex flex-wrap items-center gap-2">
      {links.map((link) => (
        <Link
          key={link.href}
          href={routeFor(link.href)}
          className={
            isActive(link.href)
              ? "rounded-full bg-black px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white"
              : "rounded-full border border-zinc-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-600 transition hover:border-zinc-900 hover:text-zinc-900"
          }
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}