"use client";

import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/lib/firebase/client";
import { useT } from "@/components/site/labels-provider";

export function CommentForm() {
  const t = useT();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const store = db();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!store) return;
    setState("sending");
    try {
      await addDoc(collection(store, "comments"), {
        name: name.trim().slice(0, 60),
        message: message.trim().slice(0, 1000),
        createdAt: new Date().toISOString(),
        status: "pending",
      });
      setName("");
      setMessage("");
      setState("sent");
    } catch {
      setState("error");
    }
  }

  return (
    <form
      onSubmit={submit}
      className="border-border space-y-4 rounded-3xl border p-6"
    >
      <p className="font-serif text-2xl">{t("board.formTitle")}</p>
      <label className="block space-y-1 text-sm">
        <span className="text-muted-foreground">{t("board.name")}</span>
        <Input
          required
          maxLength={60}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <label className="block space-y-1 text-sm">
        <span className="text-muted-foreground">{t("board.message")}</span>
        <Textarea
          required
          maxLength={1000}
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </label>
      <div className="flex items-center gap-4">
        <Button type="submit" disabled={!store || state === "sending"}>
          {state === "sending" ? t("board.sending") : t("board.submit")}
        </Button>
        <p className="text-muted-foreground text-sm" role="status">
          {!store
            ? t("board.disabled")
            : state === "sent"
              ? t("board.sent")
              : state === "error"
                ? t("board.error")
                : t("board.note")}
        </p>
      </div>
    </form>
  );
}
