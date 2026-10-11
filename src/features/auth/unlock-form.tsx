"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { submitUnlock, type UnlockFormState } from "@/features/auth/actions";

const initialUnlockFormState: UnlockFormState = { status: "idle" };

type UnlockFormCopy = {
  password: string;
  submit: string;
  submitting: string;
  error: string;
  rateLimited: string;
};

type UnlockFormProps = {
  copy: UnlockFormCopy;
  callbackUrl: string;
};

export function UnlockForm({ copy, callbackUrl }: UnlockFormProps) {
  const [state, action, pending] = useActionState(
    submitUnlock,
    initialUnlockFormState,
  );

  return (
    <form action={action} className="stack-default max-w-sm">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      <div className="stack-compact">
        <label
          htmlFor="unlock-password"
          className="type-small font-medium text-foreground"
        >
          {copy.password}
        </label>
        <Input
          id="unlock-password"
          name="password"
          type="password"
          autoComplete="current-password"
          maxLength={256}
          required
          autoFocus
          disabled={pending}
          aria-invalid={state.status === "error"}
          aria-describedby={
            state.status === "error" ? "unlock-error" : undefined
          }
        />
      </div>

      <div>
        <Button type="submit" size="sm" disabled={pending} aria-busy={pending}>
          {pending ? copy.submitting : copy.submit}
        </Button>
      </div>

      {state.status === "rateLimited" ? (
        <p role="alert" className="type-small text-warning">
          {copy.rateLimited}
        </p>
      ) : null}
      {state.status === "error" ? (
        <p
          id="unlock-error"
          role="alert"
          className="type-small text-destructive"
        >
          {copy.error}
        </p>
      ) : null}
    </form>
  );
}
