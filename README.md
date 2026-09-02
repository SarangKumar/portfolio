# Personal portfolio

Production-grade Next.js application foundation for a public portfolio and later private engineering tools.

This repository currently has project setup, the design system, and reusable UI primitives. Application pages are not implemented yet.

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
| Tests              | `tests`                         |
| Public assets      | `public`                        |
| Design tokens      | `src/app/globals.css`           |
| Motion conventions | `src/lib/motion.ts`             |

Locale-aware routing is ready (`src/app/[locale]`). English is the only locale. Page copy is not translated yet.

## Design system

Colors, type, spacing, radius, and motion live in CSS variables and Tailwind tokens (`src/app/globals.css`). Use utilities such as `bg-background`, `text-primary`, `type-heading`, `app-container`, and `surface-card`. Do not introduce a JavaScript palette or hardcode the same colors in components.

Orange (`primary` / `accent`) is the visual accent — use it selectively. Motion helpers in `src/lib/motion.ts` cover hover, focus, press, entrance, and expansion, and must go through `withReducedMotion` / `useMotionTransition`.

## UI primitives

Reusable primitives live in `src/components/ui` and consume design tokens via `cn()`. They are variant-driven (for example `Button` `primary` | `secondary` | `outline` | `ghost` | `destructive`). Do not add shadcn or a second styling system. Use `Link` from `@/components/ui` for styled links; use `@/i18n/navigation` only for routing helpers.

## Environment

Copy `.env.example` to `.env.local`.

- `NEXT_PUBLIC_*` — safe for the browser
- All other variables — server-only; import from `src/lib/env/server.ts` (`server-only`)
