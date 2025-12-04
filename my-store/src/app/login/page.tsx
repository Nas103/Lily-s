import { LoginForm } from "./LoginForm";

export const metadata = {
  title: "Login | Lily Atelier",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white">
      <main className="mx-auto max-w-md px-6 py-16">
        <div className="space-y-3 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
            Lily members
          </p>
          <h1 className="text-3xl font-semibold tracking-tight h1-gradient">
            Sign in
          </h1>
          <p className="text-sm text-zinc-600">
            Access saved measurements, concierge chat, and early drops.
          </p>
        </div>
        <LoginForm />
      </main>
    </div>
  );
}


