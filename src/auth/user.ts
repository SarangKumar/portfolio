import type { Session } from "next-auth";

export type AuthUser = {
  id: string;
  email: string;
};

export function toAuthUser(session: Session | null): AuthUser | null {
  const id = session?.user?.id;
  const email = session?.user?.email;

  if (!id || !email) {
    return null;
  }

  return { id, email };
}
