"use client";

import { useActionState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitContact } from "@/features/contact/actions";
import { cn } from "@/lib/cn";
import { CONTACT_LIMITS } from "@/lib/contact";
import {
  initialContactFormState,
  type ContactFormState,
} from "@/lib/contact-state";

type ContactFormCopy = {
  name: string;
  email: string;
  message: string;
  send: string;
  sending: string;
  success: string;
  error: string;
  unavailable: string;
  required: string;
  invalidEmail: string;
  tooLong: string;
  honeypot: string;
};

type ContactFormProps = {
  copy: ContactFormCopy;
};

function fieldMessage(
  code: string | undefined,
  copy: ContactFormCopy,
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

export function ContactForm({ copy }: ContactFormProps) {
  const [state, action, pending] = useActionState(
    submitContact,
    initialContactFormState,
  );

  const nameError = fieldMessage(state.fieldErrors?.name, copy);
  const emailError = fieldMessage(state.fieldErrors?.email, copy);
  const messageError = fieldMessage(state.fieldErrors?.message, copy);

  return (
    <form
      action={action}
      className="relative stack-default max-w-md"
      noValidate
    >
      <div className="sr-only" aria-hidden="true">
        <label>
          {copy.honeypot}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <Field
        id="contact-name"
        label={copy.name}
        error={nameError}
        className={cn(nameError && "[&_input]:border-destructive")}
      >
        <Input
          id="contact-name"
          name="name"
          autoComplete="name"
          maxLength={CONTACT_LIMITS.name}
          required
          disabled={pending}
          aria-invalid={Boolean(nameError)}
          aria-describedby={nameError ? "contact-name-error" : undefined}
        />
      </Field>

      <Field
        id="contact-email"
        label={copy.email}
        error={emailError}
        className={cn(emailError && "[&_input]:border-destructive")}
      >
        <Input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          maxLength={CONTACT_LIMITS.email}
          required
          disabled={pending}
          aria-invalid={Boolean(emailError)}
          aria-describedby={emailError ? "contact-email-error" : undefined}
        />
      </Field>

      <Field
        id="contact-message"
        label={copy.message}
        error={messageError}
        className={cn(messageError && "[&_textarea]:border-destructive")}
      >
        <Textarea
          id="contact-message"
          name="message"
          maxLength={CONTACT_LIMITS.message}
          required
          disabled={pending}
          aria-invalid={Boolean(messageError)}
          aria-describedby={messageError ? "contact-message-error" : undefined}
        />
      </Field>

      <Button type="submit" size="sm" disabled={pending} aria-busy={pending}>
        {pending ? copy.sending : copy.send}
      </Button>

      <FormStatus state={state} copy={copy} />
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

function FormStatus({
  state,
  copy,
}: {
  state: ContactFormState;
  copy: ContactFormCopy;
}) {
  if (state.status === "success") {
    return (
      <p role="status" className="type-small text-success">
        {copy.success}
      </p>
    );
  }

  if (state.status === "unavailable") {
    return (
      <p role="alert" className="type-small text-warning">
        {copy.unavailable}
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
