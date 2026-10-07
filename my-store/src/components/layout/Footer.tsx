import Link from "next/link";
import { BRAND } from "@/lib/brand";

const columns: { title: string; items: { label: string; href: string }[] }[] = [
  {
    title: "Shop",
    items: [
      { label: "Men", href: "/men" },
      { label: "Women", href: "/women" },
      { label: "Abaya", href: "/abaya" },
      { label: "Perfumes", href: "/perfumes" },
    ],
  },
  {
    title: "Collections",
    items: [
      { label: "Lifestyle", href: "/lifestyle" },
      { label: "Running", href: "/running" },
      { label: "BoxRaw", href: "/boxraw" },
      { label: "Electronics", href: "/electronics" },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Orders", href: "/orders" },
      { label: "Wishlist", href: "/wishlist" },
      { label: "Preferences", href: "/preferences" },
      { label: "Profile", href: "/profile" },
    ],
  },
  {
    title: "Service",
    items: [
      { label: "Stylist", href: "/assistant" },
      { label: "Track order", href: "/track-order" },
      { label: "Support", href: "/support" },
      { label: "Sign in", href: "/login" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-zinc-100 bg-zinc-50">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {columns.map((column) => (
            <div key={column.title}>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-500">
                {column.title}
              </p>
              <ul className="mt-4 space-y-2 text-sm text-zinc-600">
                {column.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="transition hover:text-black">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-2 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
          <div className="flex gap-4">
            <span>Privacy</span>
            <span>Cookies</span>
            <span>Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}