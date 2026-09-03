"use server";

import { AuthError } from "next-auth";
import { redirect, unstable_rethrow } from "next/navigation";
import { signIn, signOut } from "@/auth";
import { attemptLogin } from "@/auth/login";
import type { LoginFormState } from "@/auth/login-state";
import { getLoginRateLimitKey, loginRateLimiter } from "@/auth/rate-limit";
import { postLogoutPath } from "@/auth/redirect";

async function authenticateCredentials(
  email: string,
  password: string,
): Promise<boolean> {
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return true;
  } catch (error) {
    unstable_rethrow(error);

    if (error instanceof AuthError) {
      return false;
    }

    throw error;
  }
}

export async function submitLogin(
  _previous: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const result = await attemptLogin(formData, {
    consume: (key) => loginRateLimiter.consume(key),
    rateLimitKey: await getLoginRateLimitKey(),
    authenticate: authenticateCredentials,
  });

  if (result.status === "authenticated") {
    redirect(result.redirectTo);
  }

  return result;
}

export async function signOutAction() {
  await signOut({ redirectTo: postLogoutPath });
}
