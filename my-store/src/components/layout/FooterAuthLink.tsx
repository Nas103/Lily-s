"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";
import { useAuth } from "@/stores/authStore";

const emptySubscribe = () => () => {};

function useHasMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export function FooterAuthLink() {
  const router = useRouter();
  const user = useAuth((state) => state.user);
  const logout = useAuth((state) => state.logout);
  const hasMounted = useHasMounted();

  if (!hasMounted || !user) {
    return (
      <li>
        <Link href="/login" className="transition hover:text-black">
          Sign in
        </Link>
      </li>
    );
  }

  return (
    <li>
      <button
        type="button"
        onClick={() => {
          logout();
          router.push("/");
        }}
        className="transition hover:text-black"
      >
        Sign out
      </button>
    </li>
  );
}
