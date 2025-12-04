"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/stores/authStore";

type User = {
  id: string;
  email: string;
  name: string | null;
  role: "USER" | "ADMIN";
  createdAt: string;
};

export default function AdminUsersPage() {
  const router = useRouter();
  const user = useAuth((state) => state.user);
  const isAdmin = useAuth((state) => state.isAdmin);
  const logout = useAuth((state) => state.logout);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not admin
  useEffect(() => {
    if (user && !isAdmin()) {
      router.push("/");
    } else if (!user) {
      router.push("/login");
    }
  }, [user, isAdmin, router]);

  const fetchUsers = async () => {
    if (!user || !isAdmin()) return;
    
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/users", {
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
          "x-user-email": user.email,
        },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Unable to load users.");
        setUsers([]);
        return;
      }
      const data = (await res.json()) as User[];
      setUsers(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load users right now."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!user || !isAdmin()) return;
    if (!confirm("Remove this user permanently?")) return;

    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
          "x-user-email": user.email,
        },
        body: JSON.stringify({ userId: id }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Unable to delete user.");
        return;
      }

      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (error) {
      alert("Unable to delete user. Please try again.");
    }
  };

  useEffect(() => {
    if (user && isAdmin()) {
      void fetchUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
        Internal tool
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        User administration
      </h1>
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-zinc-500">
          Admin dashboard. Logged in as <span className="font-medium text-zinc-900">{user?.email}</span>
        </p>
        <button
          type="button"
          onClick={() => {
            logout();
            router.push("/");
          }}
          className="rounded-full border border-zinc-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-zinc-600 hover:border-zinc-900 hover:text-zinc-900"
        >
          Logout
        </button>
      </div>

      {error ? (
        <p className="mt-4 text-xs text-red-500" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mt-8 space-y-3">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm"
          >
            <div>
              <p className="font-medium">
                {user.email}{" "}
                <span className="ml-2 rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-zinc-600">
                  {user.role}
                </span>
              </p>
              <p className="text-xs text-zinc-500">
                Joined{" "}
                {new Date(user.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
            <button
              type="button"
              onClick={() => void handleDelete(user.id)}
              className="text-xs font-semibold uppercase tracking-[0.25em] text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        ))}

        {users.length === 0 && !loading ? (
          <p className="text-xs text-zinc-500">
            No users loaded yet. Authenticate above to view accounts.
          </p>
        ) : null}
      </div>
    </div>
  );
}


