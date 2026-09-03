import type { LoginFormState } from "@/auth/login-state";
import { safeInternalPath } from "@/auth/redirect";
import { readLoginForm, validateLoginInput } from "@/auth/validation";

export type LoginAttemptResult =
  LoginFormState | { status: "authenticated"; redirectTo: string };

export type LoginAttemptDependencies = {
  consume: (key: string) => { allowed: boolean };
  rateLimitKey: string;
  authenticate: (email: string, password: string) => Promise<boolean>;
};

export async function attemptLogin(
  formData: FormData,
  deps: LoginAttemptDependencies,
): Promise<LoginAttemptResult> {
  const input = readLoginForm(formData);
  const validation = validateLoginInput(input);

  if (!validation.ok) {
    return {
      status: "error",
      fieldErrors: validation.fieldErrors,
    };
  }

  if (!deps.consume(deps.rateLimitKey).allowed) {
    return { status: "rateLimited" };
  }

  const accepted = await deps.authenticate(
    validation.value.email,
    validation.value.password,
  );

  if (!accepted) {
    return { status: "error" };
  }

  return {
    status: "authenticated",
    redirectTo: safeInternalPath(input.callbackUrl),
  };
}
