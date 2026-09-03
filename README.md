# Personal portfolio

Production-grade Next.js application foundation for a public portfolio and later private engineering tools.

This repository currently has project setup, the design system, UI primitives, the global shell, public content pages with lorem ipsum sample catalogs, and a Phase 1 CMD ribbon. Certifications and badges appear on About and Resume. Replace the sample records before publishing a real identity.

## Scripts

| Script                                          | Purpose                                               |
| ----------------------------------------------- | ----------------------------------------------------- |
| `npm run dev`                                   | Build translations, then start the development server |
| `npm run build`                                 | Production build                                      |
| `npm run start`                                 | Start production server                               |
| `npm run i18n:build`                            | Merge message namespaces into compiled catalogs       |
| `npm run i18n:check`                            | Verify namespaces and that compiled output is current |
| `npm run lint` / `lint:fix`                     | ESLint                                                |
| `npm run format` / `format:check`               | Prettier                                              |
| `npm run typecheck`                             | Strict TypeScript                                     |
| `npm run test` / `test:watch` / `test:coverage` | Jest                                                  |
| `npm run prisma:generate`                       | Generate Prisma Client from `prisma/schema.prisma`    |
| `npm run prisma:push`                           | Push the Prisma schema to MongoDB (no SQL migrations) |
| `npm run check`                                 | i18n:check + typecheck + lint + format:check + test   |
| `npm run prepare`                               | Husky git hooks                                       |

## Architecture

| Area               | Location                         |
| ------------------ | -------------------------------- |
| Routes / pages     | `src/app`                        |
| Reusable UI        | `src/components/ui`              |
| Feature components | `src/features`                   |
| Utilities          | `src/lib`                        |
| Configuration      | `src/config`, root config files  |
| Data               | `src/data`                       |
| Database (Prisma)  | `src/db`, `prisma/schema.prisma` |
| Types              | `src/types`                      |
| Translations       | `messages`, `src/i18n`           |
| Analytics          | `src/analytics`                  |
| SEO helpers        | `src/lib/seo.ts`                 |
| Terminal commands  | `src/terminal`                   |
| Tests              | `tests`                          |
| Public assets      | `public`                         |
| Design tokens      | `src/app/globals.css`            |
| Motion conventions | `src/lib/motion.ts`              |

The global shell (`src/components/layout`) provides header, footer, skip link, page container, and the CMD ribbon above the footer. CMD architecture is documented in `src/terminal/README.md`. Pages render inside `SiteShell` and should not duplicate that chrome. Public pages live in `src/features` and read structured data from `src/data`. Catalogs currently contain lorem ipsum sample records for layout and integration; replace them before publishing a real identity. Public experience is separate from any future private career system. Skills are modeled as relationships to roles and projects (evidence counts), not proficiency bars. Projects use public slugs in `/projects/[slug]`; internal IDs stay out of URLs. Blog posts use `/blog/[slug]` with Markdown rendered by `react-markdown`. Resume supports multiple versions, preview, download, and typed `resume_*` events. Contact accepts a validated form; delivery uses optional `CONTACT_WEBHOOK_URL`. Analytics is a typed, fail-open pipeline (`src/analytics`) that validates events server-side, stores them through a replaceable sink, and ranks featured projects from `project_view` counts with catalog fallback. Reusable Recharts visualizations live in `src/components/charts` and consume `--chart-*` tokens. Charts render only when they have useful published data. The public terminal UI (`src/features/terminal`) talks to a command registry (`src/terminal`) so new commands can be registered without changing the panel. SEO helpers live in `src/lib/seo.ts` (`sitemap.ts`, `robots.ts`, page metadata, and JSON-LD). There is no admin dashboard in this phase. Events do not store raw IP addresses or form PII.

Locale-aware routing uses `src/app/[locale]` and `next-intl`. English is the only locale. Edit copy in `messages/{locale}/*.json`, then run `npm run i18n:build` to write `messages/compiled/{locale}.json`. Runtime loads the compiled catalogs. UI copy should use `useTranslations` / `getTranslations` from next-intl — do not wrap those APIs. Page-level `generateMetadata` should pass `{ locale, namespace }` into `getTranslations` so metadata can be localized later.

## Design system

Colors, type, spacing, radius, and motion live in CSS variables and Tailwind tokens (`src/app/globals.css`). Use utilities such as `bg-background`, `text-primary`, `type-heading`, `app-container`, and `surface-card`. Do not introduce a JavaScript palette or hardcode the same colors in components.

Orange (`primary` / `accent`) is the visual accent — use it selectively. Motion helpers in `src/lib/motion.ts` cover hover, focus, press, entrance, and expansion, and must go through `withReducedMotion` / `useMotionTransition`.

## UI primitives

Reusable primitives live in `src/components/ui` and consume design tokens via `cn()`. They are variant-driven (for example `Button` `primary` | `secondary` | `outline` | `ghost` | `destructive`). Do not add shadcn or a second styling system. Use `Link` from `@/components/ui` for styled links; use `@/i18n/navigation` only for routing helpers.

## Environment

Copy `.env.example` to `.env.local`.

- `NEXT_PUBLIC_*` — safe for the browser
- All other variables — server-only; import from `src/lib/env/server.ts` (`server-only`)
- `CONTACT_WEBHOOK_URL` — optional server endpoint for contact form delivery. When unset, the form still validates and reports that delivery is not configured.
- `ANALYTICS_HASH_SALT` — optional salt for hashing IPs used only as an in-memory rate-limit fallback. Event records never include IP addresses.
- `ANALYTICS_VAULT_PASSWORD` — server-only password for the hidden CMD folder `analytics/`. When unset, unlock always fails.
- `DATABASE_URL` — server-only MongoDB connection string for Prisma. Never use `NEXT_PUBLIC_*`. Production fails clearly if this is missing or not a MongoDB URL with a database name when the database client is created. Sync schema with `npm run prisma:push` (MongoDB does not use SQL migrations). Generate the client with `npm run prisma:generate`.

Server-only database helpers live in `src/db`. Import `getPrismaClient` only from Server Components, Route Handlers, and server actions. Wrap queries with `executeDatabaseOperation` so driver errors are not returned to visitors. This app uses Prisma ORM 6.19 because that release supports MongoDB with `prisma/schema.prisma`.
