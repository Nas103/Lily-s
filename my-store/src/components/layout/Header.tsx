"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, ShoppingBag, User, Menu, X } from "lucide-react";
import { useAuth } from "@/stores/authStore";

const navLinks = [
  { href: "/men", label: "Men" },
  { href: "/women", label: "Women" },
  { href: "/perfumes", label: "Perfumes" },
  { href: "/abaya", label: "Abaya" },
  { href: "/track-order", label: "Track" },
  { href: "/support", label: "Support" },
];

export function Header() {
  const router = useRouter();
  const user = useAuth((state) => state.user);
  const logout = useAuth((state) => state.logout);
  const isAdmin = useAuth((state) => state.isAdmin);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-sm font-semibold uppercase tracking-[0.5em] logo-gradient">
          Lily Atelier
        </Link>
        
        {/* Desktop Navigation */}
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
          {isAdmin() && (
            <Link
              href="/admin/users"
              className="transition hover:text-black"
            >
              Admin
            </Link>
          )}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 text-sm md:flex">
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
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-600">{user.email}</span>
              {isAdmin() && (
                <Link
                  href="/admin/users"
                  className="rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] hover:border-zinc-900"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-zinc-600 hover:border-zinc-900 hover:text-zinc-900"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full border border-transparent px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] hover:border-zinc-200"
            >
              <User size={16} className="text-zinc-800" />
              <span className="logo-gradient">Sign in</span>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-zinc-900 md:hidden"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={16} className="text-zinc-900" /> : <Menu size={16} className="text-zinc-900" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-zinc-100 bg-white md:hidden">
          <nav className="mx-auto max-w-6xl px-6 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-medium text-zinc-600 transition hover:text-black"
              >
                {link.label}
              </Link>
            ))}
            {isAdmin() && (
              <Link
                href="/admin/users"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-medium text-zinc-600 transition hover:text-black"
              >
                Admin
              </Link>
            )}
            <div className="pt-3 border-t border-zinc-100 space-y-4">
              <Link
                href="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center gap-3 text-sm font-medium text-zinc-600 transition hover:text-black"
              >
                <Heart size={16} />
                <span>Wishlist</span>
              </Link>
              <Link
                href="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center gap-3 text-sm font-medium text-zinc-600 transition hover:text-black"
              >
                <ShoppingBag size={16} />
                <span>Cart</span>
              </Link>
              {user ? (
                <div className="space-y-3 pt-1">
                  <p className="text-xs text-zinc-500">{user.email}</p>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="inline-flex items-center gap-3 text-sm font-medium text-zinc-600 transition hover:text-black"
                  >
                    <User size={16} />
                    <span>Sign out</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center gap-3 text-sm font-medium text-zinc-600 transition hover:text-black"
                >
                  <User size={16} />
                  <span>Sign in</span>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}


