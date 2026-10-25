import { ReactNode } from "react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <nav className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-3 flex flex-wrap items-center gap-4 text-sm">
          <Link href="/admin" className="font-medium">Admin</Link>
          <Link href="/admin/brands">Brands</Link>
          <Link href="/admin/brand-custom-pages">Custom Pages</Link>
          <Link href="/admin/products">Products</Link>
          <Link href="/admin/orders">Orders</Link>
          <Link href="/admin/users">Users</Link>
        </div>
      </nav>
      {children}
    </div>
  );
}
