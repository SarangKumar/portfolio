# Personal portfolio

Production-grade Next.js application foundation for a public portfolio and later private engineering tools.

This repository is currently in **project setup** only. Application features are not implemented yet.

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

Locale-aware routing is ready (`src/app/[locale]`). English is the only locale. Page copy is not translated yet.

## Environment

Copy `.env.example` to `.env.local`.

- `NEXT_PUBLIC_*` — safe for the browser
- All other variables — server-only; import from `src/lib/env/server.ts` (`server-only`)
