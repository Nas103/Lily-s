"use client";

import { useState } from "react";

export function LoginForm() {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <form className="mt-10 space-y-4 rounded-3xl border border-zinc-100 bg-white p-8 shadow-sm">
      <input
        type="email"
        placeholder="Email address"
        className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-500"
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-500"
      />
      <button
        type="submit"
        className="w-full rounded-full bg-black px-6 py-3 text-xs font-semibold uppercase tracking-[0.4em] text-white"
      >
        {mode === "login" ? "Sign in" : "Create account"}
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


