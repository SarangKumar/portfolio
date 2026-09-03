import { redirect } from "next/navigation";
import type { AuthUser } from "@/auth/user";

export function requireUserOrRedirect(user: AuthUser | null): AuthUser {
  if (!user) {
    redirect("/login");
  }

  return user;
}
