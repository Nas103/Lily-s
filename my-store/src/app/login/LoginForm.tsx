"use client";

import { FormEvent, useState } from "react";

export function LoginForm() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    setLoading(true);
    setError(null);

    try {
      const endpoint =
        mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Something went wrong.");
        return;
      }

      // For now we just show success; you can add redirects or session handling later.
      form.reset();
      setError(null);
      alert(
        mode === "login"
          ? "Signed in successfully."
          : "Account created successfully."
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to submit. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-10 space-y-4 rounded-3xl border border-zinc-100 bg-white p-8 shadow-sm"
    >
      <input
        name="email"
        type="email"
        placeholder="Email address"
        className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-500"
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-500"
        required
      />
      {error ? (
        <p className="text-xs text-red-500" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-black px-6 py-3 text-xs font-semibold uppercase tracking-[0.4em] text-white disabled:opacity-60"
      >
        {loading
          ? "Please wait…"
          : mode === "login"
          ? "Sign in"
          : "Create account"}
      </button>
      <button
        type="button"
        className="w-full rounded-full border border-zinc-200 px-6 py-3 text-xs font-semibold uppercase tracking-[0.4em] logo-gradient"
        onClick={() => setMode(mode === "login" ? "register" : "login")}
      >
        {mode === "login" ? "Need an account?" : "Already have an account?"}
      </button>
    </form>
  );
}


