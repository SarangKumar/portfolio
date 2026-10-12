# Sarang Kumar — portfolio (v3)

Clean, editorial portfolio built with **Next.js (App Router) + TypeScript**, **Tailwind CSS v4** and **[Vinyaas](https://vinyaas.vercel.app)** components, with **Firebase Auth + Cloud Firestore** behind a private admin panel. Designed for **Vercel Hobby + Firebase Spark (free)** — no servers, target ₹0–₹150/month.

## Pages

| Route                     | What's there                                                                                                                                    |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                       | Hero, career status, about, featured projects, current focus, recent writing                                                                    |
| `/projects`               | Project list with hover/focus popovers, future ideas, Skills derived from project technologies                                                  |
| `/projects/[slug]`        | Case studies (architecture, implementation, testing, trade-offs) — Vinyaas, Aavedak, .dotfiles, …                                               |
| `/blogs`, `/blogs/[slug]` | Articles + notes; searchable archive with category & tag filters                                                                                |
| `/library`                | Books with reading notes, bookmarks/resources, idea & engineering notebook                                                                      |
| `/lab`, `/lab/[slug]`     | Architecture Lab: config-driven SVG diagrams, playable request flows, component details, decisions, trade-offs, bottlenecks, failure simulation |
| `/board`                  | Public Board — visitors submit notes; only admin-approved ones are shown                                                                        |
| `/admin`                  | Private admin (Google sign-in, single admin email)                                                                                              |

Shared UI: dark/light toggle, responsive navbar (exactly six destinations), bean identity + app-icon style project icons, **⌘K** palette, a terminal (press <kbd>`</kbd> or the terminal button; try `help`, `ls projects`, `open aavedak`, `search firebase`), reduced-motion aware animations. The palette and terminal are generated from the same published content as the pages (`src/lib/derive.ts`).

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm run lint
```

With no Firebase env vars the site runs entirely on **`src/content/seed.ts`** — edit that file to change content. The board form and admin panel show a "configure Firebase" note.

## Firebase setup (free Spark plan)

1. Create a project at <https://console.firebase.google.com>.
2. **Authentication → Sign-in method →** enable **Google**. Under _Settings → Authorized domains_ add `localhost` and your Vercel domain.
3. **Firestore Database →** create (production mode, any region near you, e.g. `asia-south1`).
4. **Project settings → Your apps → Web app →** copy the config into `.env.local` (copy from `.env.example`).
5. Set `NEXT_PUBLIC_ADMIN_EMAIL` to your Google email **and** put the same email in `firestore.rules` (`isAdmin()`). The rules are the real security boundary; the env var only controls the UI.
6. Deploy rules: `npx firebase-tools login && npx firebase-tools deploy --only firestore:rules --project <project-id>` (or paste `firestore.rules` into the console's Rules tab).
7. `npm run dev`, open `/admin`, sign in, click **Import seed content** to copy the seed into Firestore. From then on the site reads Firestore (published docs only) and falls back to seed if Firestore is unreachable.

### Content model

`config/site` (site config, homepage sections, nav links, career status, featured slugs) and collections `projects`, `posts`, `books`, `bookmarks`, `notes`, `skills`, `diagrams`, `comments`. Every content doc has `status: "draft" | "published"`. Types live in `src/content/types.ts`. Diagrams are plain JSON (nodes with x/y, edges, flows, decisions, trade-offs, bottlenecks, failures) edited in the admin with a live preview.

## Deploy to Vercel (Hobby)

1. Push the branch and import the repo in Vercel (framework: Next.js, defaults are fine).
2. Add the same `NEXT_PUBLIC_*` env vars in _Project → Settings → Environment Variables_.
3. Add the Vercel domain to Firebase Auth's authorized domains.

Pages are statically generated and revalidated every 60s (ISR), so Firestore reads stay tiny and edits appear within about a minute. New slugs created after a deploy render on demand.

## Cost notes

Vercel Hobby and Firebase Spark are free. No Cloud Functions, VMs or always-on services are used. To curb board spam, consider enabling Firebase App Check.
