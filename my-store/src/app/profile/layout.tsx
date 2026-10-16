import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE_NAME, verifyToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ProfileLayout({
  children,
}: {
  children: ReactNode;
}) {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  const session = token ? await verifyToken(token) : null;

  if (!session) {
    redirect("/login?next=%2Fprofile");
  }

  return <>{children}</>;
}
