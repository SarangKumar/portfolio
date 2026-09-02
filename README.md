# Personal portfolio

Production-grade Next.js application foundation for a public portfolio and later private engineering tools.

This repository currently has project setup, the design system, UI primitives, the global shell, public Home, About, Experience, Skills, Projects, Resume, Blog, and Contact pages, and a Phase 1 public terminal. Certifications and badges appear on About and Resume when published. Other application pages are not implemented yet.

## Scripts

| Script                                          | Purpose                                |
| ----------------------------------------------- | -------------------------------------- |
| `npm run dev`                                   | Development server                     |
| `npm run build`                                 | Production build                       |
| `npm run start`                                 | Start production server                |
| `npm run lint` / `lint:fix`                     | ESLint                                 |
| `npm run format` / `format:check`               | Prettier                               |
| `npm run typecheck`                             | Strict TypeScript                      |
| `npm run test` / `test:watch` / `test:coverage` | Jest                                   |
| `npm run check`                                 | typecheck + lint + format:check + test |
| `npm run prepare`                               | Husky git hooks                        |

## Architecture

| Area               | Location                        |
| ------------------ | ------------------------------- |
| Routes / pages     | `src/app`                       |
| Reusable UI        | `src/components/ui`             |
| Feature components | `src/features`                  |
| Utilities          | `src/lib`                       |
| Configuration      | `src/config`, root config files |
| Data               | `src/data`                      |
| Types              | `src/types`                     |
| Translations       | `messages`, `src/i18n`          |
| Analytics          | `src/analytics`                 |
| Terminal commands  | `src/terminal`                  |
| Tests              | `tests`                         |
| Public assets      | `public`                        |
| Design tokens      | `src/app/globals.css`           |
| Motion conventions | `src/lib/motion.ts`             |

The global shell (`src/components/layout`) provides header, footer, skip link, page container, and the public terminal launcher. Pages render inside `SiteShell` and should not duplicate that chrome. Public pages live in `src/features` and read structured data from `src/data` — unpublished fields render as placeholders instead of invented content. Public experience is separate from any future private career system. Skills are modeled as relationships to roles and projects (evidence counts), not proficiency bars. Projects use public slugs in `/projects/[slug]`; internal IDs stay out of URLs. Blog posts use `/blog/[slug]` with Markdown rendered by `react-markdown`. Resume supports multiple versions, preview, download, and typed `resume_*` events. Contact accepts a validated form; delivery uses optional `CONTACT_WEBHOOK_URL`. Analytics is a typed, fail-open pipeline (`src/analytics`) that validates events server-side, stores them through a replaceable sink, and ranks featured projects from `project_view` counts with catalog fallback. Reusable Recharts visualizations live in `src/components/charts` and consume `--chart-*` tokens. Charts render only when they have useful published data. The public terminal UI (`src/features/terminal`) talks to a command registry (`src/terminal`) so new commands can be registered without changing the panel. There is no admin dashboard in this phase. Events do not store raw IP addresses or form PII.

Locale-aware routing uses `src/app/[locale]` and `next-intl`. English is the only locale. Message namespaces live in `messages/{locale}/`. UI copy should use `useTranslations` / `getTranslations` from next-intl — do not wrap those APIs. Page-level `generateMetadata` should pass `{ locale, namespace }` into `getTranslations` so metadata can be localized later.

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
