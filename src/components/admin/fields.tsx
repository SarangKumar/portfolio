"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Field } from "./schema";

type Value = unknown;

export function FieldInput({
  field,
  value,
  onChange,
  onError,
}: {
  field: Field;
  value: Value;
  onChange: (v: Value) => void;
  onError: (key: string, err: string | null) => void;
}) {
  const t = field.type;
  const id = `f-${field.key}`;
  let control: React.ReactNode;
  if (typeof t === "object") {
    control = (
      <select
        id={id}
        value={String(value ?? t.options[0])}
        onChange={(e) => onChange(e.target.value)}
        className="border-border bg-background h-9 w-full rounded-md border px-2 text-sm"
      >
        {t.options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    );
  } else if (t === "bool") {
    control = (
      <input
        id={id}
        type="checkbox"
        checked={Boolean(value)}
        onChange={(e) => onChange(e.target.checked)}
      />
    );
  } else if (t === "number") {
    control = (
      <Input
        id={id}
        type="number"
        value={Number(value ?? 0)}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    );
  } else if (t === "list") {
    control = (
      <Input
        id={id}
        value={((value as string[]) ?? []).join(", ")}
        onChange={(e) =>
          onChange(
            e.target.value
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
          )
        }
      />
    );
  } else if (t === "lines") {
    control = (
      <Textarea
        id={id}
        rows={4}
        value={((value as string[]) ?? []).join("\n")}
        onChange={(e) =>
          onChange(e.target.value.split("\n").filter((s) => s.trim()))
        }
      />
    );
  } else if (t === "json") {
    return (
      <JsonField
        id={id}
        field={field}
        value={value}
        onChange={onChange}
        onError={onError}
      />
    );
  } else if (t === "textarea" || t === "markdown") {
    control = (
      <Textarea
        id={id}
        rows={t === "markdown" ? 8 : 3}
        value={String(value ?? "")}
        onChange={(e) => onChange(e.target.value)}
        className={t === "markdown" ? "font-mono text-xs" : ""}
      />
    );
  } else {
    control = (
      <Input
        id={id}
        value={String(value ?? "")}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-muted-foreground text-xs">
        {field.label}
      </label>
      {control}
    </div>
  );
}

function JsonField({
  id,
  field,
  value,
  onChange,
  onError,
}: {
  id: string;
  field: Field;
  value: Value;
  onChange: (v: Value) => void;
  onError: (key: string, err: string | null) => void;
}) {
  const [text, setText] = useState(() =>
    JSON.stringify(value ?? null, null, 2),
  );
  const [err, setErr] = useState<string | null>(null);
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-muted-foreground text-xs">
        {field.label}
      </label>
      <Textarea
        id={id}
        rows={6}
        value={text}
        className="font-mono text-xs"
        onChange={(e) => {
          setText(e.target.value);
          try {
            onChange(JSON.parse(e.target.value));
            setErr(null);
            onError(field.key, null);
          } catch {
            setErr("Invalid JSON");
            onError(field.key, "Invalid JSON");
          }
        }}
      />
      {err ? <p className="text-destructive text-xs">{err}</p> : null}
    </div>
  );
}
