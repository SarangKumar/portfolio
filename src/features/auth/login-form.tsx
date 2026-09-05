"use client";

import { useActionState, type ReactNode } from "react";
import { initialLoginFormState, type LoginFormState } from "@/auth/login-state";
import { LOGIN_LIMITS } from "@/auth/validation";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Input } from "@/components/ui/input";
import { submitLogin } from "@/features/auth/actions";
import { cn } from "@/lib/cn";

type LoginFormCopy = {
  email: string;
  password: string;
  submit: string;
  submitting: string;
  error: string;
  rateLimited: string;
  required: string;
  invalidEmail: string;
  tooLong: string;
  signup: string;
};

type LoginFormProps = {
  copy: LoginFormCopy;
  callbackUrl: string;
};

function fieldMessage(
  code: string | undefined,
  copy: LoginFormCopy,
): string | undefined {
  if (code === "required") {
    return copy.required;
  }

  if (code === "invalidEmail") {
    return copy.invalidEmail;
  }

  if (code === "tooLong") {
    return copy.tooLong;
  }

  return undefined;
}

export function LoginForm({ copy, callbackUrl }: LoginFormProps) {
  const [state, action, pending] = useActionState(
    submitLogin,
    initialLoginFormState,
  );

  const emailError = fieldMessage(state.fieldErrors?.email, copy);
  const passwordError = fieldMessage(state.fieldErrors?.password, copy);

  return (
    <form action={action} className="stack-default max-w-sm" noValidate>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      <Field
        id="login-email"
        label={copy.email}
        error={emailError}
        className={cn(emailError && "[&_input]:border-destructive")}
      >
        <Input
          id="login-email"
          name="email"
          type="email"
          autoComplete="username"
          maxLength={LOGIN_LIMITS.email}
          required
          disabled={pending}
          aria-invalid={Boolean(emailError)}
          aria-describedby={emailError ? "login-email-error" : undefined}
        />
      </Field>

      <Field
        id="login-password"
        label={copy.password}
        error={passwordError}
        className={cn(passwordError && "[&_input]:border-destructive")}
      >
        <Input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          maxLength={LOGIN_LIMITS.password}
          required
          disabled={pending}
          aria-invalid={Boolean(passwordError)}
          aria-describedby={passwordError ? "login-password-error" : undefined}
        />
      </Field>

      <div className="flex flex-wrap items-center gap-2">
        <Button type="submit" size="sm" disabled={pending} aria-busy={pending}>
          {pending ? copy.submitting : copy.submit}
        </Button>
        <ButtonLink href="/signup" variant="outline" size="sm">
          {copy.signup}
        </ButtonLink>
      </div>

      <LoginStatus state={state} copy={copy} />
    </form>
  );
}

function Field({
  id,
  label,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("stack-compact", className)}>
      <label htmlFor={id} className="type-small font-medium text-foreground">
        {label}
      </label>
      {children}
      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="type-small text-destructive"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

function LoginStatus({
  state,
  copy,
}: {
  state: LoginFormState;
  copy: LoginFormCopy;
}) {
  if (state.status === "rateLimited") {
    return (
      <p role="alert" className="type-small text-warning">
        {copy.rateLimited}
      </p>
    );
  }

  if (state.status === "error" && !state.fieldErrors) {
    return (
      <p role="alert" className="type-small text-destructive">
        {copy.error}
      </p>
    );
  }

  return null;
}
