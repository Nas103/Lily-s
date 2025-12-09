"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/stores/authStore";

export function LoginForm() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const setUser = useAuth((state) => state.setUser);

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
        let errorMessage = "Something went wrong. Please try again.";
        try {
          const data = await res.json();
          errorMessage = data.error || errorMessage;
        } catch {
          // If response is not JSON, use status-based message
          if (res.status === 503) {
            errorMessage = "Service temporarily unavailable. Please try again later.";
          } else if (res.status === 429) {
            errorMessage = "Too many attempts. Please wait a moment and try again.";
          } else if (res.status === 401) {
            errorMessage = mode === "login" 
              ? "Invalid email or password." 
              : "Unable to create account. Please check your information.";
          } else if (res.status === 409) {
            errorMessage = "This email is already registered. Please sign in instead.";
          }
        }
        setError(errorMessage);
        return;
      }

      const user = await res.json();
      
      // Store user in auth store
      setUser({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
      });

      // Redirect based on role
      if (user.role === "ADMIN") {
        router.push("/admin/users");
      } else {
        router.push("/");
      }
    } catch (err) {
      // Network errors or other client-side errors
      console.error("[LoginForm] Error:", err);
      setError("Unable to connect to the server. Please check your internet connection and try again.");
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


