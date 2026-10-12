"use client";

import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { DiagramViewer } from "@/components/lab/diagram-viewer";
import { BeanMark } from "@/components/site/bean";
import { Markdown } from "@/components/site/markdown";
import { Button } from "@/components/ui/button";
import { seed } from "@/content/seed";
import {
  COLLECTIONS,
  type CollectionName,
  type Comment,
  type Diagram,
} from "@/content/types";
import { auth, db } from "@/lib/firebase/client";
import { adminEmail, isFirebaseConfigured } from "@/lib/firebase/config";
import { cn } from "@/lib/utils";
import { FieldInput } from "./fields";
import { SCHEMAS, SITE_FIELDS } from "./schema";

type Doc = Record<string, unknown> & { id: string };
type View = "site" | "comments" | CollectionName;

export function AdminApp() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  useEffect(() => {
    const a = auth();
    if (!a) return;
    return onAuthStateChanged(a, setUser);
  }, []);

  if (!isFirebaseConfigured) {
    return (
      <Shell>
        <h1 className="display text-5xl">Admin</h1>
        <p className="text-muted-foreground mt-4 max-w-xl">
          Firebase isn&apos;t configured, so the site is serving the bundled
          seed content from <code>src/content/seed.ts</code>. Add the{" "}
          <code>NEXT_PUBLIC_FIREBASE_*</code> and{" "}
          <code>NEXT_PUBLIC_ADMIN_EMAIL</code> variables (see{" "}
          <code>.env.example</code> and the README) to enable sign-in and
          editing.
        </p>
      </Shell>
    );
  }
  if (user === undefined)
    return (
      <Shell>
        <p className="text-muted-foreground">Loading…</p>
      </Shell>
    );
  if (!user || (user.email ?? "").toLowerCase() !== adminEmail) {
    return (
      <Shell>
        <h1 className="display text-5xl">Admin</h1>
        {user ? (
          <p className="text-destructive mt-4">
            {user.email} is not the administrator.
          </p>
        ) : null}
        <div className="mt-8 flex gap-3">
          <Button
            onClick={() => signInWithPopup(auth()!, new GoogleAuthProvider())}
          >
            Sign in with Google
          </Button>
          {user ? (
            <Button variant="outline" onClick={() => signOut(auth()!)}>
              Sign out
            </Button>
          ) : null}
        </div>
      </Shell>
    );
  }
  return <Dashboard user={user} />;
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-x py-24">
      <Link href="/" className="mb-10 flex items-center gap-2">
        <BeanMark /> <span className="tag">Back to site</span>
      </Link>
      {children}
    </div>
  );
}

function Dashboard({ user }: { user: User }) {
  const [view, setView] = useState<View>("site");
  const [msg, setMsg] = useState<string | null>(null);
  const store = db()!;

  async function importSeed() {
    if (
      !confirm(
        "Write all seed content to Firestore? Existing docs with the same ids are overwritten.",
      )
    )
      return;
    const batch = writeBatch(store);
    batch.set(doc(store, "config", "site"), seed.site);
    for (const name of COLLECTIONS)
      for (const item of seed[name]) batch.set(doc(store, name, item.id), item);
    await batch.commit();
    setMsg("Seed imported.");
  }

  const nav: { id: View; label: string }[] = [
    { id: "site", label: "Site & homepage" },
    ...COLLECTIONS.map((c) => ({ id: c as View, label: SCHEMAS[c].label })),
    { id: "comments", label: "Board moderation" },
  ];

  return (
    <div className="container-x grid gap-10 py-10 md:grid-cols-[14rem_1fr]">
      <aside className="space-y-6 md:sticky md:top-10 md:self-start">
        <Link href="/" className="flex items-center gap-2">
          <BeanMark />
          <span className="font-serif text-xl">Admin</span>
        </Link>
        <nav className="flex flex-col gap-1" aria-label="Admin">
          {nav.map((n) => (
            <button
              key={n.id}
              onClick={() => setView(n.id)}
              aria-current={view === n.id ? "page" : undefined}
              className={cn(
                "rounded-lg px-3 py-1.5 text-left text-sm",
                view === n.id
                  ? "bg-primary/12"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {n.label}
            </button>
          ))}
        </nav>
        <div className="space-y-2 text-xs">
          <Button size="xs" variant="outline" onClick={importSeed}>
            Import seed content
          </Button>
          <p className="text-muted-foreground truncate">{user.email}</p>
          <Button size="xs" variant="ghost" onClick={() => signOut(auth()!)}>
            Sign out
          </Button>
          {msg ? <p role="status">{msg}</p> : null}
        </div>
        <p className="text-muted-foreground text-xs">
          Published changes appear on the site within ~60s.
        </p>
      </aside>
      <section key={view}>
        {view === "site" ? (
          <SiteEditor />
        ) : view === "comments" ? (
          <Moderation />
        ) : (
          <CollectionEditor name={view} />
        )}
      </section>
    </div>
  );
}

function SiteEditor() {
  const store = db()!;
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    getDoc(doc(store, "config", "site")).then((s) =>
      setData(() => {
        const r = (s.data() ?? {}) as Partial<typeof seed.site>;
        return {
          ...seed.site,
          ...r,
          seo: { ...seed.site.seo, ...r.seo },
          pages: { ...seed.site.pages, ...r.pages },
          labels: { ...seed.site.labels, ...r.labels },
        };
      }),
    );
  }, [store]);
  if (!data) return <p className="text-muted-foreground">Loading…</p>;
  const invalid = Object.values(errors).some(Boolean);
  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="display text-4xl">Site & homepage</h1>
      {SITE_FIELDS.map((f) => (
        <FieldInput
          key={f.key}
          field={f}
          value={data[f.key]}
          onChange={(v) => (setData({ ...data, [f.key]: v }), setSaved(false))}
          onError={(k, e) => setErrors((x) => ({ ...x, [k]: e }))}
        />
      ))}
      <Button
        disabled={invalid}
        onClick={async () => (
          await setDoc(doc(store, "config", "site"), data),
          setSaved(true)
        )}
      >
        Save
      </Button>
      {saved ? (
        <span className="text-muted-foreground ml-3 text-sm">Saved.</span>
      ) : null}
    </div>
  );
}

function blank(name: CollectionName): Doc {
  const base = seed[name][0] as unknown as Doc;
  const empty: Doc = { id: "" };
  for (const [k, v] of Object.entries(base))
    empty[k] = Array.isArray(v)
      ? []
      : typeof v === "number"
        ? 0
        : typeof v === "boolean"
          ? false
          : "";
  empty.status = "draft";
  return empty;
}

function CollectionEditor({ name }: { name: CollectionName }) {
  const store = db()!;
  const schema = SCHEMAS[name];
  const [items, setItems] = useState<Doc[] | null>(null);
  const [edit, setEdit] = useState<Doc | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [preview, setPreview] = useState(false);

  const load = useCallback(async () => {
    const snap = await getDocs(collection(store, name));
    setItems(snap.docs.map((d) => ({ ...d.data(), id: d.id })));
  }, [store, name]);
  useEffect(() => {
    let live = true;
    Promise.resolve().then(() => {
      if (live) load();
    });
    return () => {
      live = false;
    };
  }, [load]);

  async function save(next: Doc) {
    const id =
      next.id ||
      String(next.slug || next[schema.titleKey] || Date.now())
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-");
    await setDoc(doc(store, name, id), { ...next, id });
    setEdit(null);
    setIsNew(false);
    load();
  }

  if (edit) {
    const invalid = Object.values(errors).some(Boolean);
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h1 className="display text-4xl">
            {isNew
              ? `New ${schema.label.toLowerCase()}`
              : String(edit[schema.titleKey] || "Untitled")}
          </h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreview((p) => !p)}
              aria-pressed={preview}
            >
              Preview
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setEdit(null)}>
              Cancel
            </Button>
          </div>
        </div>
        <div className={cn("grid gap-8", preview && "xl:grid-cols-2")}>
          <div className="max-w-2xl space-y-4">
            {schema.fields.map((f) => (
              <FieldInput
                key={f.key}
                field={f}
                value={edit[f.key]}
                onChange={(v) => setEdit({ ...edit, [f.key]: v })}
                onError={(k, e) => setErrors((x) => ({ ...x, [k]: e }))}
              />
            ))}
            <div className="flex gap-2">
              <Button disabled={invalid} onClick={() => save(edit)}>
                Save
              </Button>
              <Button
                disabled={invalid}
                variant="outline"
                onClick={() => save({ ...edit, status: "published" })}
              >
                Save & publish
              </Button>
            </div>
          </div>
          {preview ? <Preview name={name} item={edit} /> : null}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="display text-4xl">{schema.label}</h1>
        <Button
          size="sm"
          onClick={() => (setEdit(blank(name)), setIsNew(true), setErrors({}))}
        >
          New
        </Button>
      </div>
      {!items ? <p className="text-muted-foreground mt-6">Loading…</p> : null}
      {items?.length === 0 ? (
        <p className="text-muted-foreground mt-6">
          Nothing yet. Create one or import the seed content.
        </p>
      ) : null}
      <ul className="divide-border mt-6 divide-y">
        {items?.map((it) => (
          <li
            key={it.id}
            className="flex items-center justify-between gap-4 py-3"
          >
            <button
              className="min-w-0 text-left"
              onClick={() => (setEdit(it), setIsNew(false), setErrors({}))}
            >
              <span className="block truncate">
                {String(it[schema.titleKey] || it.id)}
              </span>
              <span className="tag">{String(it.status)}</span>
            </button>
            <span className="flex shrink-0 gap-1">
              <Button
                size="xs"
                variant="outline"
                onClick={async () => (
                  await updateDoc(doc(store, name, it.id), {
                    status: it.status === "published" ? "draft" : "published",
                  }),
                  load()
                )}
              >
                {it.status === "published" ? "Unpublish" : "Publish"}
              </Button>
              <Button
                size="xs"
                variant="destructive"
                onClick={async () => {
                  if (confirm("Delete permanently?")) {
                    await deleteDoc(doc(store, name, it.id));
                    load();
                  }
                }}
              >
                Delete
              </Button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Preview({ name, item }: { name: CollectionName; item: Doc }) {
  return (
    <div className="border-border rounded-2xl border p-6">
      <p className="eyebrow mb-4">Draft preview</p>
      {name === "diagrams" ? (
        <DiagramViewer diagram={item as unknown as Diagram} />
      ) : (
        <>
          <h2 className="display text-4xl">
            {String(item.title ?? item.name ?? "")}
          </h2>
          <p className="text-muted-foreground mt-3">
            {String(item.excerpt ?? item.summary ?? item.description ?? "")}
          </p>
          <div className="mt-6">
            <Markdown
              source={[
                item.body,
                item.architecture,
                item.implementation,
                item.testing,
                item.tradeoffs,
                item.notes,
              ]
                .filter(Boolean)
                .join("\n\n")}
            />
          </div>
        </>
      )}
    </div>
  );
}

function Moderation() {
  const store = db()!;
  const [items, setItems] = useState<Comment[] | null>(null);
  const [filter, setFilter] = useState<Comment["status"]>("pending");
  const load = useCallback(async () => {
    const snap = await getDocs(collection(store, "comments"));
    setItems(
      snap.docs
        .map((d) => ({ ...(d.data() as Omit<Comment, "id">), id: d.id }))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    );
  }, [store]);
  useEffect(() => {
    let live = true;
    Promise.resolve().then(() => {
      if (live) load();
    });
    return () => {
      live = false;
    };
  }, [load]);
  const set = async (id: string, status: Comment["status"]) => (
    await updateDoc(doc(store, "comments", id), { status }),
    load()
  );
  const shown = items?.filter((c) => c.status === filter) ?? [];
  return (
    <div>
      <h1 className="display text-4xl">Board moderation</h1>
      <div className="mt-4 flex gap-2" role="group">
        {(["pending", "approved", "rejected"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            aria-pressed={filter === s}
            className={cn(
              "chip",
              filter === s && "border-primary text-foreground",
            )}
          >
            {s} ({items?.filter((c) => c.status === s).length ?? 0})
          </button>
        ))}
      </div>
      <ul className="divide-border mt-6 divide-y">
        {shown.length === 0 ? (
          <li className="text-muted-foreground py-4">Nothing here.</li>
        ) : null}
        {shown.map((c) => (
          <li
            key={c.id}
            className="flex flex-col gap-3 py-4 sm:flex-row sm:items-start sm:justify-between"
          >
            <div>
              <p>{c.message}</p>
              <p className="tag mt-1">
                {c.name} · {c.createdAt.slice(0, 16).replace("T", " ")}
              </p>
            </div>
            <span className="flex shrink-0 gap-1">
              {c.status !== "approved" ? (
                <Button size="xs" onClick={() => set(c.id, "approved")}>
                  Approve
                </Button>
              ) : null}
              {c.status !== "rejected" ? (
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => set(c.id, "rejected")}
                >
                  Reject
                </Button>
              ) : null}
              <Button
                size="xs"
                variant="destructive"
                onClick={async () => {
                  if (confirm("Delete?")) {
                    await deleteDoc(doc(store, "comments", c.id));
                    load();
                  }
                }}
              >
                Delete
              </Button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
