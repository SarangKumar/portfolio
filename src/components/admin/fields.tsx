"use client";

import { createContext, useContext, useState } from "react";
import { ImageUp, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MultiInput, type MultiInputOption } from "@/components/ui/multi-input";
import { FileUpload, FileUploadDropzone } from "@/components/ui/file-upload";
import { ProjectIcon } from "@/components/site/project-icon";
import type { SiteConfig } from "@/content/types";
import { PLACEHOLDERS, type Field, type OptionSource } from "./schema";

/** Choices for multi-select / suggestion fields, loaded once by the dashboard. */
export type AdminOptions = Partial<Record<OptionSource, MultiInputOption[]>>;
export const OptionsContext = createContext<AdminOptions>({});

/** Values already saved stay selectable even if their source item is gone. */
function withCurrent(opts: MultiInputOption[], current: string[]) {
  const known = new Set(opts.map((o) => o.value));
  return [
    ...opts,
    ...current.filter((v) => !known.has(v)).map((value) => ({ value })),
  ];
}

const ph = (f: Field) => f.placeholder ?? PLACEHOLDERS[f.key] ?? "";

/** The homepage sections, in the order Home renders them. */
const HOME_SECTIONS: MultiInputOption[] = [
  { value: "featured", label: "Featured projects" },
  { value: "focus", label: "Current focus" },
  { value: "writing", label: "Writing" },
  { value: "skills", label: "Skills" },
  { value: "resume", label: "Resume" },
  { value: "experience", label: "Experience" },
];

type Value = unknown;

export function FieldInput({
  field,
  value,
  onChange,
  onError,
  iconPath,
  iconTitle = "",
}: {
  field: Field;
  value: Value;
  onChange: (v: Value) => void;
  onError: (key: string, err: string | null) => void;
  /** Icon fields: the /public path shown when nothing is uploaded. */
  iconPath?: string;
  iconTitle?: string;
}) {
  const t = field.type;
  const id = `f-${field.key}`;
  const options = useContext(OptionsContext);
  const choices = field.options ? (options[field.options] ?? []) : null;
  let control: React.ReactNode;
  if (t === "career") {
    return (
      <CareerField
        value={value as SiteConfig["career"]}
        onChange={onChange}
        onError={onError}
        roles={options.roles ?? []}
      />
    );
  } else if (t === "icon") {
    return (
      <IconField
        id={id}
        label={field.label}
        value={typeof value === "string" ? value : ""}
        fallback={iconPath}
        title={iconTitle}
        onChange={onChange}
      />
    );
  } else if (t === "sections") {
    // One multi-select over a fixed key set; every key stays on the doc so a
    // section that's switched off is stored as false, not dropped.
    const flags = (value ?? {}) as Record<string, boolean>;
    control = (
      <MultiInput
        id={id}
        value={HOME_SECTIONS.filter((s) => flags[s.value]).map((s) => s.value)}
        onValueChange={(picked) =>
          onChange(
            Object.fromEntries(
              HOME_SECTIONS.map((s) => [s.value, picked.includes(s.value)]),
            ),
          )
        }
        options={HOME_SECTIONS}
        allowCustomValues={false}
        placeholder="Choose the sections to show…"
        emptyMessage="Every section is already shown."
      />
    );
  } else if (t === "list" && choices) {
    const current = ((value as string[]) ?? []).filter(Boolean);
    control = (
      <MultiInput
        id={id}
        value={current}
        onValueChange={(v) => onChange(v)}
        options={withCurrent(choices, current)}
        allowCustomValues={!field.strict}
        placeholder={
          ph(field) ||
          (field.strict ? "Choose…" : "Choose or type, Enter to add")
        }
        emptyMessage={field.strict ? "Nothing else to add." : "Type to add."}
      />
    );
  } else if (typeof t === "object") {
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
        placeholder={ph(field)}
        type="number"
        value={Number(value ?? 0)}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    );
  } else if (t === "list") {
    control = (
      <Input
        id={id}
        placeholder={ph(field)}
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
        placeholder={ph(field)}
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
        placeholder={ph(field)}
        rows={t === "markdown" ? 8 : 3}
        value={String(value ?? "")}
        onChange={(e) => onChange(e.target.value)}
        className={t === "markdown" ? "font-mono text-xs" : ""}
      />
    );
  } else {
    control = (
      <>
        <Input
          id={id}
          placeholder={ph(field)}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          list={choices?.length ? `${id}-list` : undefined}
        />
        {choices?.length ? (
          <datalist id={`${id}-list`}>
            {choices.map((o) => (
              <option key={o.value} value={o.value} />
            ))}
          </datalist>
        ) : null}
      </>
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
    value == null ? "" : JSON.stringify(value, null, 2),
  );
  const [err, setErr] = useState<string | null>(null);
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-muted-foreground text-xs">
        {field.label}
      </label>
      <Textarea
        id={id}
        placeholder={ph(field)}
        rows={6}
        value={text}
        className="font-mono text-xs"
        onChange={(e) => {
          setText(e.target.value);
          try {
            onChange(e.target.value.trim() ? JSON.parse(e.target.value) : null);
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

/** Structured editor for site.career; roles use the multi-select. */
function CareerField({
  value,
  onChange,
  onError,
  roles,
}: {
  value: SiteConfig["career"] | undefined;
  onChange: (v: Value) => void;
  onError: (key: string, err: string | null) => void;
  roles: MultiInputOption[];
}) {
  const c = (value ?? {}) as SiteConfig["career"];
  const set = (patch: Partial<SiteConfig["career"]>) =>
    onChange({ ...c, ...patch });
  const text = (
    key: "label" | "headline" | "locations" | "detail",
    label: string,
  ) => (
    <div className="space-y-1">
      <label
        htmlFor={`career-${key}`}
        className="text-muted-foreground text-xs"
      >
        {label}
      </label>
      <Input
        id={`career-${key}`}
        value={String(c[key] ?? "")}
        placeholder={PLACEHOLDERS[`career.${key}`] ?? ""}
        onChange={(e) => set({ [key]: e.target.value })}
      />
    </div>
  );
  const current = (c.roles ?? []).filter(Boolean);
  return (
    <fieldset className="border-border space-y-3 rounded-xl border p-4">
      <legend className="text-muted-foreground px-1 text-xs">
        Career / open to work
      </legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {text("headline", "Headline")}
        {text("label", "Short status (navbar)")}
        {text("locations", "Preferred locations")}
        {text("detail", "Detail (e.g. Full-time)")}
      </div>
      <div className="space-y-1">
        <label htmlFor="career-roles" className="text-muted-foreground text-xs">
          Roles
        </label>
        <MultiInput
          id="career-roles"
          value={current}
          onValueChange={(v) => set({ roles: v })}
          options={withCurrent(roles, current)}
          placeholder="Choose or type, Enter to add"
          emptyMessage="Type to add."
        />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={Boolean(c.navIndicator)}
          onChange={(e) => set({ navIndicator: e.target.checked })}
        />
        Show the indicator in the navbar
      </label>
      <JsonField
        id="career-ctas"
        field={{
          key: "career.ctas",
          label: 'Links [{label, href}] — href "resume" = the resume PDF',
          type: "json",
        }}
        value={c.ctas ?? []}
        onChange={(v) =>
          set({ ctas: (v as SiteConfig["career"]["ctas"]) ?? [] })
        }
        onError={onError}
      />
    </fieldset>
  );
}

const ICON_PX = 128;
/** Data URLs live on the Firestore doc, so keep them small (1 MiB doc cap). */
const ICON_MAX_CHARS = 60_000;

async function toIconDataUrl(file: File): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((res, rej) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = () => rej(new Error("Couldn't read that image."));
      i.src = url;
    });
    for (const [px, q] of [
      [ICON_PX, 0.86],
      [ICON_PX, 0.7],
      [96, 0.7],
    ] as const) {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = px;
      const ctx = canvas.getContext("2d")!;
      // Cover-crop to a centred square.
      const w = img.naturalWidth || px;
      const h = img.naturalHeight || px;
      const side = Math.min(w, h);
      ctx.drawImage(
        img,
        (w - side) / 2,
        (h - side) / 2,
        side,
        side,
        0,
        0,
        px,
        px,
      );
      let out = canvas.toDataURL("image/webp", q);
      if (!out.startsWith("data:image/webp"))
        out = canvas.toDataURL("image/png");
      if (out.length <= ICON_MAX_CHARS) return out;
    }
    throw new Error("That image is too detailed to store; try a simpler icon.");
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Icon picker: shows the current icon; an upload (resized in the browser) overrides the /public path. */
function IconField({
  id,
  label,
  value,
  fallback,
  title,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  fallback?: string;
  title: string;
  onChange: (v: Value) => void;
}) {
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  return (
    <div className="space-y-1">
      <span id={id} className="text-muted-foreground block text-xs">
        {label}
      </span>
      <div className="flex items-center gap-3">
        <FileUpload
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          maxSize={5 * 1024 * 1024}
          files={[]}
          className="w-auto overflow-visible"
          onFilesChange={async (files) => {
            const f = files[0];
            if (!f) return;
            if (f.error) return setErr(f.error);
            setBusy(true);
            try {
              onChange(await toIconDataUrl(f.file));
              setErr(null);
            } catch (e) {
              setErr(e instanceof Error ? e.message : String(e));
            } finally {
              setBusy(false);
            }
          }}
        >
          <FileUploadDropzone
            aria-labelledby={id}
            aria-describedby={`${id}-hint`}
            title="Upload icon"
            className="group relative size-16 min-h-0 rounded-[24%] p-0"
          >
            {value || fallback ? (
              <ProjectIcon src={value || fallback} title={title} size={64} />
            ) : (
              <ImageUp size={22} strokeWidth={1.75} aria-hidden />
            )}
            <span className="bg-background/80 absolute inset-0 hidden items-center justify-center rounded-[24%] group-hover:flex group-focus-visible:flex">
              <ImageUp size={20} strokeWidth={1.75} aria-hidden />
            </span>
          </FileUploadDropzone>
        </FileUpload>
        <div
          id={`${id}-hint`}
          className="text-muted-foreground min-w-0 text-xs"
        >
          {busy
            ? "Resizing…"
            : value
              ? `Uploaded icon (${Math.round((value.length * 3) / 4 / 1024)} KB) overrides ${fallback || "the default"}.`
              : fallback
                ? `Using ${fallback}. Click or drop an image to upload one.`
                : "Click or drop an image (PNG, JPG, WebP, SVG)."}
          {value ? (
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-foreground hover:text-primary-ink ml-2 inline-flex min-h-8 items-center gap-1 underline-offset-4 hover:underline"
            >
              <X size={14} strokeWidth={1.75} aria-hidden /> Remove upload
            </button>
          ) : null}
          {err ? <p className="text-destructive mt-1">{err}</p> : null}
        </div>
      </div>
    </div>
  );
}
