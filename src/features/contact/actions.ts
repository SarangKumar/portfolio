"use server";

import { analyticsEvents } from "@/analytics/schema";
import { ingestFromRequestContext } from "@/analytics/request-context";
import { readContactForm, validateContactInput } from "@/lib/contact";
import type { ContactFormState } from "@/lib/contact-state";
import { serverEnv } from "@/lib/env/server";

async function deliverContactMessage(payload: {
  name: string;
  email: string;
  message: string;
}): Promise<"success" | "error" | "unavailable"> {
  const endpoint = serverEnv.contactWebhookUrl;

  if (!endpoint) {
    return "unavailable";
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });

    return response.ok ? "success" : "error";
  } catch {
    return "error";
  }
}

export async function submitContact(
  _previous: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const input = readContactForm(formData);
  const validation = validateContactInput(input);

  if (validation.ok && validation.ignored) {
    void ingestFromRequestContext({
      name: analyticsEvents.contactSubmit,
      path: "/contact",
      metadata: { result: "ignored" },
    });
    return { status: "success" };
  }

  if (!validation.ok) {
    void ingestFromRequestContext({
      name: analyticsEvents.contactSubmit,
      path: "/contact",
      metadata: { result: "error" },
    });
    return {
      status: "error",
      fieldErrors: validation.fieldErrors,
    };
  }

  const result = await deliverContactMessage(validation.value);
  void ingestFromRequestContext({
    name: analyticsEvents.contactSubmit,
    path: "/contact",
    metadata: { result },
  });

  if (result === "unavailable") {
    return { status: "unavailable" };
  }

  if (result === "error") {
    return { status: "error" };
  }

  return { status: "success" };
}
