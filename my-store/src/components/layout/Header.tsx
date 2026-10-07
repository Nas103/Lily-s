"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Heart, ShoppingBag, User, Menu, X, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/stores/authStore";
import { getProfileImageUrl } from "@/lib/getProfileImage";
import { BRAND } from "@/lib/brand";

const shopLinks = [
  { href: "/men", label: "Men" },
  { href: "/women", label: "Women" },
  { href: "/abaya", label: "Abaya" },
  { href: "/perfumes", label: "Perfumes" },
  { href: "/lifestyle", label: "Lifestyle" },
  { href: "/running", label: "Running" },
  { href: "/boxraw", label: "BoxRaw" },
  { href: "/electronics", label: "Electronics" },
];

const accountLinks = [
  { href: "/orders", label: "Orders" },
  { href: "/preferences", label: "Preferences" },
  { href: "/wishlist", label: "Wishlist" },
];

const serviceLinks = [
  { href: "/assistant", label: "Stylist" },
  { href: "/track-order", label: "Track order" },
  { href: "/support", label: "Support" },
];

const moreLinks = [...accountLinks, ...serviceLinks];

export function Header() {
  const router = useRouter();
  const user = useAuth((state) => state.user);
  const logout = useAuth((state) => state.logout);
  const refresh = useAuth((state) => state.refresh);
  const isAdmin = useAuth((state) => state.isAdmin);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (!user) return;

    const fetchProfileImage = async () => {
      try {
        const res = await fetch("/api/profile", {
          headers: {
            "x-user-id": user.id,
            "x-user-email": user.email,
          },
          credentials: "same-origin",
        });

        if (res.ok) {
          const data = await res.json();
          setProfileImageUrl(data.profileImageUrl || null);
        }
      } catch {
        // Silently fail - will use Gravatar fallback
      }
    };

    fetchProfileImage();
  }, [user]);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="whitespace-nowrap text-sm font-semibold uppercase tracking-[0.5em] logo-gradient"
          >
            {BRAND.name}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 text-sm font-medium text-zinc-600 lg:flex">
            <Dropdown label="Shop" items={shopLinks} />
            <Dropdown label="More" items={moreLinks} align="right" />
            {isAdmin() && (
              <Link
                href="/admin/users"
                className="rounded-full px-3 py-2 transition hover:bg-zinc-100 hover:text-black"
              >
                Admin
              </Link>
            )}
          </nav>
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 text-sm lg:flex">
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
              <Link
                href="/profile"
                className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] hover:border-zinc-900"
              >
                <span className="relative h-5 w-5 overflow-hidden rounded-full bg-zinc-100">
                  <Image
                    src={getProfileImageUrl(user.email, profileImageUrl, 40)}
                    alt={user.name || user.email}
                    width={20}
                    height={20}
                    unoptimized
                    className="h-full w-full object-cover"
                  />
                </span>
                <span className="logo-gradient">{user.name?.split(" ")[0] || "Profile"}</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1 rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] hover:border-zinc-900"
              >
                <LogOut size={14} className="text-zinc-700" />
                <span>Exit</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-1 rounded-full border border-zinc-900 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.3em]"
            >
              <User size={14} className="text-zinc-800" />
              <span className="logo-gradient">Sign in</span>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((open) => !open)}
          className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] lg:hidden"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="max-h-[80vh] overflow-y-auto border-t border-zinc-100 bg-white lg:hidden">
          <nav className="mx-auto max-w-6xl space-y-6 px-6 py-6">
            <MenuGroup title="Shop" items={shopLinks} onNavigate={() => setMobileMenuOpen(false)} />
            <MenuGroup title="Account" items={accountLinks} onNavigate={() => setMobileMenuOpen(false)} />
            <MenuGroup title="Services" items={serviceLinks} onNavigate={() => setMobileMenuOpen(false)} />
            {isAdmin() && (
              <MenuGroup
                title="Admin"
                items={[{ href: "/admin/users", label: "Users" }, { href: "/admin/risk-review", label: "Risk review" }]}
                onNavigate={() => setMobileMenuOpen(false)}
              />
            )}
            <div className="flex items-center gap-3 border-t border-zinc-100 pt-4">
              {user ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em]"
                  >
                    <User size={14} />
                    Profile
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em]"
                  >
                    <LogOut size={14} />
                    Sign out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center gap-2 rounded-full border border-zinc-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em]"
                >
                  <User size={14} />
                  Sign in
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function Dropdown({
  label,
  items,
  align = "left",
}: {
  label: string;
  items: { href: string; label: string }[];
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-2 transition hover:bg-zinc-100 hover:text-black"
      >
        {label}
        <ChevronDown size={14} className={open ? "rotate-180 transition" : "transition"} />
      </button>
      {open && (
        <div
          className={`absolute top-full z-40 pt-2 ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          <div className="grid w-64 grid-cols-2 gap-1 rounded-2xl border border-zinc-100 bg-white p-2 shadow-xl">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="truncate rounded-xl px-3 py-2 text-sm text-zinc-600 transition hover:bg-zinc-50 hover:text-black"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MenuGroup({
  title,
  items,
  onNavigate,
}: {
  title: string;
  items: { href: string; label: string }[];
  onNavigate: () => void;
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-zinc-400">
        {title}
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className="truncate rounded-xl border border-zinc-100 px-3 py-2 text-sm text-zinc-700"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}