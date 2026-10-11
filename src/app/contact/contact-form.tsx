"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type ContactFormProps = {
  email: string;
};

/**
 * Opens the visitor's mail app with the message filled in. Stored messages
 * come with the contact step; until then this needs no server.
 */
export function ContactForm({ email }: ContactFormProps) {
  const [sending, setSending] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "");
    const from = String(form.get("email") ?? "");
    const message = String(form.get("message") ?? "");
    const subject = encodeURIComponent(`Portfolio message from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${from})`);

    setSending(true);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    setTimeout(() => setSending(false), 1200);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="fade-up flex flex-col gap-5"
      style={{ "--delay": "120ms" } as React.CSSProperties}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            required
            maxLength={80}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          required
          maxLength={4000}
          rows={6}
        />
      </div>
      <div>
        <Button type="submit" size="lg" disabled={sending} aria-busy={sending}>
          {sending ? "Opening mail…" : "Send message"}
        </Button>
      </div>
    </form>
  );
}
