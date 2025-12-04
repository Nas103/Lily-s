import Link from "next/link";
import { Heart, ShoppingBag, User } from "lucide-react";

const navLinks = [
  { href: "/men", label: "Men" },
  { href: "/women", label: "Women" },
  { href: "/perfumes", label: "Perfumes" },
  { href: "/abaya", label: "Abaya" },
  { href: "/track-order", label: "Track" },
  { href: "/support", label: "Support" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-sm font-semibold uppercase tracking-[0.5em] logo-gradient">
          Lily Atelier
        </Link>
        <nav className="hidden gap-6 text-sm font-medium text-zinc-600 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-black"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3 text-sm">
          <Link
            href="/wishlist"
            className="inline-flex items-center gap-1 rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] hover:border-zinc-900"
          >
            <Heart size={14} className="text-zinc-700" />
            <span className="logo-gradient">Save</span>
          </Link>
          <Link
            href="/cart"
            className="inline-flex items-center gap-1 rounded-full border border-zinc-900 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.3em]"
          >
            <ShoppingBag size={14} className="text-zinc-800" />
            <span className="logo-gradient">Cart</span>
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-full border border-transparent px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] hover:border-zinc-200"
          >
            <User size={16} className="text-zinc-800" />
            <span className="logo-gradient">Sign in</span>
          </Link>
        </div>
      </div>
    </header>
  );
}


