"use client";

import { useEffect, useState } from "react";

type User = {
  id: string;
  email: string;
  name: string | null;
  role: "USER" | "ADMIN";
  createdAt: string;
};

export default function AdminUsersPage() {
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/users", {
        headers: {
          "x-admin-email": adminEmail,
          "x-admin-password": adminPassword,
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
    if (!confirm("Remove this user permanently?")) return;

    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-admin-email": adminEmail,
          "x-admin-password": adminPassword,
        },
        body: JSON.stringify({ userId: id }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Unable to delete user.");
        return;
      }

      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (error) {
      alert("Unable to delete user. Please try again.");
    }
  };

  useEffect(() => {
    // Optionally fetch once if creds are already filled (e.g. from browser autofill).
    if (adminEmail && adminPassword) {
      void fetchUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
        Internal tool
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        User administration
      </h1>
      <p className="mt-2 text-sm text-zinc-500">
        Protected by admin credentials. Do not share this page with shoppers.
      </p>

      <form
        className="mt-8 grid gap-4 rounded-3xl border border-zinc-200 bg-white p-6 md:grid-cols-[2fr,2fr,auto]"
        onSubmit={(event) => {
          event.preventDefault();
          void fetchUsers();
        }}
      >
        <input
          type="email"
          placeholder="Admin email"
          className="rounded-2xl border border-zinc-200 px-4 py-2 text-sm"
          value={adminEmail}
          onChange={(event) => setAdminEmail(event.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Admin password"
          className="rounded-2xl border border-zinc-200 px-4 py-2 text-sm"
          value={adminPassword}
          onChange={(event) => setAdminPassword(event.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-black px-6 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white disabled:opacity-60"
        >
          {loading ? "Loading…" : "Authenticate"}
        </button>
      </form>

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


